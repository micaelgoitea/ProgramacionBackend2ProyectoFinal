import UserModel from "./models/user.model.js";

class UserDao {
    
    async createUser(userData) {
        try {
            const newUser = new UserModel(userData);
            return await newUser.save();
        } catch (error) {
            console.error("Error al crear el usuario", error);
            throw error;
        }
    }

    async getUserByUsername(username) {
        return await UserModel.findOne({ username }).lean();
    }

    async findById(id) {
        return await UserModel.findById(id).populate('cart');
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async updateUser(id, userData) {
        return await UserModel.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(id) {
        return await UserModel.findByIdAndDelete(id);
    }

    async getAllUsers() {
        return await UserModel.find();
    }
}

export default new UserDao();