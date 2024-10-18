import userDao from "../dao/user.dao.js";

class UserRepository {
    async createUser(userData) {
        return await userDao.createUser(userData);
    }

    async getUserById(id) {
        return await userDao.getUserById(id);
    }

    async getUserByEmail(email) {
        return await userDao.getUserByEmail(email);
    }

    async getUserByUsername(username) {
        return await userDao.getUserByUsername(username);
    }

    async updateUser(id, userData) {
        return await userDao.updateUser(id, userData);
    }

    async deleteUser(id) {
        return await userDao.deleteUser(id);
    }

    async getAllUsers() {
        return await userDao.getAllUsers();
    }
}

export default new UserRepository();