import productService from "../services/product.service.js";

class ProductController {
    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).send("Error al crear un Producto");
        }
    }

    async getProducts(req, res) {
        const { limit = 10, page = 1, sort, query } = req.query;
        try {
            const filter = query ? JSON.parse(query) : {};
            const products = await productService.getProductsByQuery({ limit, page, sort, filter });
            res.json(products);
        } catch (error) {
            res.status(500).send("Error al obtener los Productos");
        }
    }

    async getProductById(req, res) {
        const { id } = req.params;
        try {
            const product = await productService.getProductById(id);
            if (!product) return res.status(404).send("Producto no encontrado con el ID proporcionado");
            res.json(product);
        } catch (error) {
            res.status(500).send("Error del servidor al obtener un producto");
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        try {
            const updatedProduct = await productService.updateProduct(id, req.body);
            if (!updatedProduct) return res.status(404).send("Producto no encontrado");
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto solicitado");
        }
    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            const deletedProduct = await productService.deleteProduct(id);
            if (!deletedProduct) return res.status(404).send("Producto que desea eliminar no encontrado");
            res.json({ message: "Producto eliminado." });
        } catch (error) {
            res.status(500).send("Error al eliminar el producto solicitado");
        }
    }

    async getProductByCode(req, res) {
        const { code } = req.params;
        try {
            const product = await productService.getProductByCode(code);
            if (!product) return res.status(404).send("Producto no encontrado con el código proporcionado");
            res.json(product);
        } catch (error) {
            res.status(500).send("Error al obtener el producto por código");
        }
    }

    async updateStock(req, res) {
        const { id } = req.params;
        const { quantity } = req.body;
        try {
            const updatedProduct = await productService.updateStock(id, quantity);
            if (!updatedProduct) return res.status(404).send("Producto no encontrado");
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).send("Error al actualizar el stock del producto");
        }
    }
}

export default new ProductController();