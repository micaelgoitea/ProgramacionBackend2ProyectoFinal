import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import { isValidPassword } from "../utils/util.js";
import bcrypt from "bcrypt";
import passport from "passport";

const router = Router();

router.post("/register", async (req, res) => {
    const { firstName, lastName, email, age, username, password } = req.body;

    try {
        const userExistente = await UserModel.findOne({ username });
        if (userExistente) {
            return res.status(400).send("Ese usuario ya está registrado");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            firstName, // Se usa firstName directamente
            lastName,  // Se usa lastName directamente
            email,
            age,
            username,
            password: hashedPassword,
        });

        await newUser.save();
        console.log("Usuario registrado:", newUser);

        const token = jwt.sign(
            { 
                username: newUser.username, 
                firstName: newUser.firstName, // Se usa firstName directamente
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
        res.status(500).send("Error interno del Servidor");
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario por nombre de usuario
        const usuarioEncontrado = await UserModel.findOne({ username });

        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no registrado, por favor regístrate");
        }

        // Verificar la contraseña
        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        // Incluir el firstName y role en el token JWT
        const token = jwt.sign(
            { 
                username: usuarioEncontrado.username, 
                first_name: usuarioEncontrado.first_name, // Asegúrate de usar este campo
                role: usuarioEncontrado.role 
            },
            "coderhouse",
            { expiresIn: "1h" }
        );

        console.log("Nombre del usuario:", usuarioEncontrado.first_name); // Verifica el valor aquí
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, // 1 hora
            httpOnly: true
        });

        // Redirigir a la ruta /current
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
    console.log(req.user); // Asegúrate de que aquí muestre el objeto del usuario
    res.render("home", { userName: req.user.firstName }); // Asegúrate de que se pase como userName
});



export default router;