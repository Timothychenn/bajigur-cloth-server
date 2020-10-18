const { Product } = require("../models/index.js");

class ProductController {
    static async create(req, res, next) {
        let { categoryID, name, price, description } = req.body;

        try {
            let newProduct = await Product.create({
                name,
                CategoryId: categoryID,
                price,
                description,
            });

            res.status(201).json({
                id: newProduct.id,
                name: newProduct.name,
                categoryID: newProduct.CategoryId,
                price: newProduct.price,
                description: newProduct.description,
            });
        } catch (err) {
            next(err);
        }
    }

    static async read(req, res, next) {
        try {
            let allProduct = await Product.findAll();

            res.status(200).json({ products: allProduct });
        } catch (err) {
            next(err);
        }
    }

    static async readById(req, res, next) {
        let productID = Number(req.params.id);

        try {
            let currentProduct = await Product.findOne({
                where: {
                    id: productID,
                },
            });

            if (currentProduct) {
                res.status(200).json(currentProduct);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        let { categoryID, name, price, description } = req.body;
        let productID = Number(req.params.id);

        try {
            let currentProduct = await Product.findOne({
                where: {
                    id: productID,
                },
            });

            if (currentProduct) {
                let updatedProduct = await Product.update(
                    {
                        name,
                        CategoryId: categoryID,
                        price,
                        description,
                    },
                    {
                        where: {
                            id: productID,
                        },
                        returning: true,
                    }
                );

                res.status(200).json(updatedProduct[1][0]);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        let productID = Number(req.params.id);

        try {
            let currentProduct = await Product.destroy({
                where: {
                    id: productID,
                },
            });

            if (currentProduct) {
                res.status(200).json({ message: "Product deleted" });
            } else {
                throw {name: "Not Found"}
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProductController;
