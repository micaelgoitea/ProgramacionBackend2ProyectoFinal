import productDao from "../dao/product.dao.js"

class ProductRepository {

    async createProduct(productData) {
        return await productDao.createProduct(productData);
    }

    async getProductById(id) {
        return await productDao.getProductById(id);
    }

    async getProductByCode(code) {
        return await productDao.getProductByCode(code);
    }

    async getAllProducts(filter = {}, options = {}) {
        return await productDao.getAllProducts(filter, options);
    }

    async getProductByQuery(query) {
        return await productDao.getProductByQuery(query);
    }

    async updateProduct(id, productData) {
        return await productDao.updateProduct(id, productData);
    }

    async updateProductStock(id, quantity) {
        return await productDao.updateProductStock(id, quantity);
    }

    async deleteProduct(id) {
        return await productDao.deleteProduct(id);
    }
}

export default new ProductRepository();