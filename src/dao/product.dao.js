import ProductModel from "./models/product.model.js";

class ProductDao {
    
    async createProduct(productData) {
        try {
            const newProduct = new ProductModel(productData);
            return await newProduct.save();
        } catch (error) {
            console.error("Error al crear el producto", error);
            throw error;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            return await ProductModel.paginate(filter, options);
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.error("Error al encontrar el producto por ID", error);
            throw error;
        }
    }

    async findByQuery(query) {
        try {
            return await ProductModel.find(query);
        } catch (error) {
            console.error("Error al encontrar productos por consulta", error);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            throw error;
        }
    }

    async getProductByCode(code) {
        try {
            return await ProductModel.findOne({ code });
        } catch (error) {
            console.error("Error al encontrar el producto por código", error);
            throw error;
        }
    }

    async updateStock(id, quantity) {
        try {
            return await ProductModel.findByIdAndUpdate(
                id,
                { $inc: { stock: quantity } },
                { new: true }
            );
        } catch (error) {
            console.error("Error al actualizar el stock del producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default new ProductDao();