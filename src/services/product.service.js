import productRepository from "../repositories/product.repository.js";

class ProductService {
    async createProduct(productData) {
        return await productRepository.createProduct(productData);
    }

    async getProductById(id) {
        return await productRepository.getProductById(id);
    }

    async getProductsByQuery(query) {
        return await productRepository.getProductsByQuery(query);
    }

    async updateProduct(id, productData) {
        return await productRepository.updateProduct(id, productData);
    }

    async deleteProduct(id) {
        return await productRepository.deleteProduct(id);
    }

    async getProductByCode(code) {
        return await productRepository.getProductByCode(code);
    }

    async updateStock(id, quantity) {
        return await productRepository.updateStock(id, quantity);
    }
}

export default new ProductService();