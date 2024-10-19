import productService from "../services/product.service.js";

class ProductController {

    async createProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await productService.createProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: "Error al crear el producto", error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el producto", error: error.message });
        }
    }

    async getProductByCode(req, res) {
        try {
            const { code } = req.params;
            const product = await productService.getProductByCode(code);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el producto", error: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const filter = req.query || {};
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
            };
            const products = await productService.getAllProducts(filter, options);
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los productos", error: error.message });
        }
    }

    async getProductByQuery(req, res) {
        try {
            const query = req.query;
            const products = await productService.getProductByQuery(query);
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los productos por consulta", error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            const updatedProduct = await productService.updateProduct(id, productData);
            if (!updatedProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
        }
    }

    async updateProductStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const updatedProduct = await productService.updateProductStock(id, quantity);
            if (!updatedProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el stock del producto", error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const deletedProduct = await productService.deleteProduct(id);
            if (!deletedProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json({ message: "Producto eliminado con éxito" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
        }
    }
}

export default new ProductController();