import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import { isValidPassword } from "../utils/util.js";
import bcrypt from "bcrypt";
import passport from "passport";

const router = Router();

router.post("/register", async (req, res) => {
    const { firstName, lastName, email, username, age, password } = req.body;

    try {
        const userExistente = await UserModel.findOne({ username });
        if (userExistente) {
            return res.status(400).send("Ese usuario ya está registrado");
        }

        const emailExistente = await UserModel.findOne({ email });
        if (emailExistente) {
            return res.status(400).send("Ese correo ya está registrado");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            username,
            age,
            password: hashedPassword,
        });

        await newUser.save();
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

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
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

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    console.log(req.user);
    res.render("home", { userName: req.user.firstName });
});



export default router;