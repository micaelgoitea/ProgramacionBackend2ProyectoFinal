import { createHash, isValidPassword } from "../utils/util.js";
import userRepository from "../repositories/user.repository.js"
import cartService from "./cart.service.js";
import UserDTO from "../dto/user.dto.js";

class UserService {
    async registerUser(userData) {
        const existingUser = await userRepository.getUserByUsername(userData.username);
        if (existingUser) throw new Error("El usuario ya se encuentra registrado con ese nombre de usuario");

        userData.password = createHash(userData.password);
        const newCart = await cartService.createCart();
        userData.cart = newCart._id;

        const newUser = await userRepository.createUser(userData);
        return new UserDTO(newUser);
    }

    async loginUser(username, password) {
        const user = await userRepository.getUserByUsername(username);
        if (!user || !isValidPassword(password, user)) throw new Error("Datos Inválidos");
        return user;
    }

    async getUserByEmail(email) {
        try {
            const user = await userRepository.getUserByEmail(email);
            return user ? new UserDTO(user) : null;
        } catch (error) {
            throw new Error(`Error al obtener usuario por email: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await userRepository.getUserById(id);
            if (!user) throw new Error("Usuario no encontrado");
            return new UserDTO(user);
        } catch (error) {
            throw new Error(`Error al obtener usuario por ID: ${error.message}`);
        }
    }
}

export default new UserService();