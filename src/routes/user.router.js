import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
            firstName,
            lastName,
            email,
            age,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ username: newUser.username }, "coderhouse", { expiresIn: "1h" });

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        });

        res.redirect("/home");

    } catch (error) {
        res.status(500).send("Error interno del Servidor");
    }
});

export default router;