const { Product_option } = require("../models/index.js");

class ProductOptionController {
    static async create(req, res, next) {
        let { productID, size, color, stock, photo_link } = req.body;

        try {
            let newProductOption = await Product_option.create({
                ProductId: productID,
                size,
                color,
                stock,
                photo_link,
            });

            res.status(201).json({
                id: newProductOption.id,
                size: newProductOption.size,
                color: newProductOption.color,
                stock: newProductOption.stock,
                photo_link: newProductOption.photo_link,
                productID: newProductOption.ProductId,
            });
        } catch (err) {
            next(err);
        }
    }

    static async readByProductId(req, res, next) {
        let productID = Number(req.params.id);

        try {
            let allProductOption = await Product_option.findAll({
                where: {
                    ProductId: productID,
                },
            });

            if (allProductOption.length > 0) {
                res.status(200).json({ productOptions: allProductOption });
            } else {
                throw {name: "Not Found"}
            }
        } catch (err) {
            next(err);
        }
    }

    static async readById(req, res, next) {
        let productOptionId = Number(req.params.id);

        try {
            let currentProductOption = await Product_option.findOne({
                where: {
                    id: productOptionId,
                },
            });

            if (currentProductOption) {
                res.status(200).json(currentProductOption);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        let { productID, size, color, stock, photo_link } = req.body;
        let productOptionID = Number(req.params.id);

        try {
            let currentProductOption = await Product_option.findOne({
                where: {
                    id: productOptionID,
                },
            });

            if (currentProductOption) {
                let updatedProductOption = await Product_option.update(
                    {
                        ProductId: productID,
                        size,
                        color,
                        stock,
                        photo_link,
                    },
                    {
                        where: {
                            id: productOptionID,
                        },
                        returning: true,
                    }
                );

                res.status(200).json(updatedProductOption[1][0]);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        let productOptionID = Number(req.params.id);

        try {
            let currentProductOption = await Product_option.destroy({
                where: {
                    id: productOptionID,
                },
            });

            if (currentProductOption) {
                res.status(200).json({ message: "Product option deleted" });
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProductOptionController;
