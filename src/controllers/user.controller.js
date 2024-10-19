import userService from "../services/user.service.js";
import UserDTO from "../dto/user.dto.js";
import jwt from "jsonwebtoken";

class UserController {
    async register(req, res) {
        const { firstName, lastName, email, username, age, password } = req.body;
    
        try {
            const newUser = await userService.registerUser({ firstName, lastName, email, username, age, password });
    
            const token = jwt.sign(
                {
                    userId: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    age: newUser.age,
                    role: newUser.role,
                    cart: newUser.cart
                },
                process.env.JWT_SECRET || "coderhouse",
                { expiresIn: "1h" }
            );
            console.log("Token generado:", token);
    
            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            res.redirect("/login");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }    

    async login(req, res) {
        const {username, password} = req.body; 

        try {
            const user = await userService.loginUser(username, password);
            const token = jwt.sign({
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            }, "coderhouse", { expiresIn: "1h" });            
    
            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});
            res.redirect("/api/sessions/current");
        } catch (error) {
            res.status(500).send("Usuario no registrado o credenciales incorrectas");
        }

    }

    async current(req, res) {
        if (req.user) {
            const userDTO = new UserDTO(req.user);
            res.render("home", { user: userDTO, cartId: userDTO.cartId });
        } else {
            res.status(401).send("No autorizado");
        }
    }    

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }
}

export default UserController;