import productRepository from "../repositories/product.repository.js"

class ProductService {

    async createProduct(productData) {
        return await productRepository.createProduct(productData);
    }

    async getProductById(id) {
        return await productRepository.getProductById(id);
    }

    async getProductByCode(code) {
        return await productRepository.getProductByCode(code);
    }

    async getAllProducts(filter = {}, options = {}) {
        return await productRepository.getAllProducts(filter, options);
    }

    async getProductByQuery(query) {
        return await productRepository.getProductByQuery(query);
    }

    async updateProduct(id, productData) {
        return await productRepository.updateProduct(id, productData);
    }

    async updateProductStock(id, quantity) {
        return await productRepository.updateProductStock(id, quantity);
    }

    async deleteProduct(id) {
        return await productRepository.deleteProduct(id);
    }
}

export default new ProductService();