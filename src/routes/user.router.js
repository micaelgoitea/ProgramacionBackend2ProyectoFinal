import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import { authorization, isValidPassword, passportCall } from "../utils/util.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", (req, res) => {
    const { firstName, lastName, email, username, age, password } = req.body;

    UserModel.findOne({ username })
        .then(userExistente => {
            if (userExistente) {
                return res.status(400).send("Ese usuario ya está registrado");
            }

            return UserModel.findOne({ email });
        })
        .then(emailExistente => {
            if (emailExistente) {
                return res.status(400).send("Ese correo ya está registrado");
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = new UserModel({
                firstName,
                lastName,
                email,
                username,
                age,
                password: hashedPassword,
            });

            return newUser.save();
        })
        .then(newUser => {
            console.log("Usuario registrado:", newUser);

            const token = jwt.sign(
                {
                    username: newUser.username,
                    firstName: newUser.firstName,
                    role: newUser.role
                },
                "coderhouse",
                { expiresIn: "1h" }
            );

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/sessions/current");
        })
        .catch(error => {
            res.status(500).send("Error interno del servidor");
        });
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const usuarioEncontrado = await UserModel.findOne({ username });

        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no registrado, por favor regístrate");
        }

        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        const token = jwt.sign(
            {
                username: usuarioEncontrado.username,
                firstName: usuarioEncontrado.firstName,
                role: usuarioEncontrado.role
            },
            "coderhouse",
            { expiresIn: "1h" }
        );

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        });

        res.redirect("/api/sessions/current");

    } catch (error) {
        console.error("Error en el servidor: ", error);
        res.status(500).send("Error interno del servidor");
    }
});


router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
})

router.get("/current", passportCall("current", { session: false }), (req, res) => {
    res.render("home", { userName: req.user.firstName });
});

export default router;