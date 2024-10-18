import ProductModel from "../models/product.model.js";

class ProductManager {
    async addProduct({ title, description, code, price, img, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos obligatorios deben ser proporcionados.");
            }

            const productoBuscado = await ProductModel.findOne({ code: code });
            if (productoBuscado) {
                throw new Error("Ya existe un producto con el código ingresado.");
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails
            });
            await newProduct.save();

            return newProduct;

        } catch (error) {
            console.error("Error al agregar un producto", error);
            throw error;
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const productoBuscado = await ProductModel.findById(id);
            if (!productoBuscado) {
                throw new Error(`El producto con el ID ${id} no existe.`);
            }
            return productoBuscado;
        } catch (error) {
            console.error("Error al buscar por ID", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const productoAActualizar = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            if (!productoAActualizar) {
                throw new Error("No existe el producto que queres actualizar.");
            }
            return productoAActualizar;
        } catch (error) {
            console.error("Error al actualizar productos", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error("No existe el producto que querés eliminar.");
            }
            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    }

    async getProductByCode(code) {
        try {
            const productoBuscado = await ProductModel.findOne({ code });
            if (!productoBuscado) {
                throw new Error(`No existe un producto con el código ${code}.`);
            }
            return productoBuscado;
        } catch (error) {
            console.error("Error al buscar producto por código", error);
            throw error;
        }
    }

    async updateStock(id, stock) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, { stock }, { new: true });
            if (!updatedProduct) {
                throw new Error("No existe el producto que querés actualizar el stock.");
            }
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar el stock", error);
            throw error;
        }
    }
}

export default ProductManager;