import productDao from "../dao/product.dao.js";

class ProductRepository {
    async createProduct(productData) {
        return await productDao.createProduct(productData);
    }

    async getProductById(id) {
        return await productDao.findById(id);
    }

    async getProductsByQuery(query) {
        return await productDao.findByQuery(query);
    }

    async getProductByCode(code) {
        return await productDao.getProductByCode(code);
    }

    async updateProduct(id, productData) {
        return await productDao.updateProduct(id, productData);
    }

    async deleteProduct(id) {
        return await productDao.deleteProduct(id);
    }


    async updateStock(id, quantity) {
        return await productDao.updateStock(id, quantity);
    }
}

export default new ProductRepository();