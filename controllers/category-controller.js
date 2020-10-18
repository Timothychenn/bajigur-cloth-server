const { Category } = require("../models/index.js");

class CategoryController {
    static async create(req, res, next) {
        let { name } = req.body;

        try {
            let newCategory = await Category.create({
                name,
            });

            res.status(201).json({
                id: newCategory.id,
                name: newCategory.name,
            });
        } catch (err) {
            next(err);
        }
    }

    static async read(req, res, next) {
        try {
            let allCategory = await Category.findAll();

            res.status(200).json({ categories: allCategory });
        } catch (err) {
            next(err);
        }
    }

    static async readById(req, res, next) {
        let categoryID = Number(req.params.id);

        try {
            let currentCategory = await Category.findOne({
                where: {
                    id: categoryID,
                },
            });

            if (currentCategory) {
                res.status(200).json(currentCategory);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        let { name } = req.body;
        let categoryID = Number(req.params.id);

        try {
            let currentCategory = await Category.findOne({
                where: {
                    id: categoryID,
                },
            });

            if (currentCategory) {
                let updatedCategory = await Category.update(
                    {
                        name,
                    },
                    {
                        where: {
                            id: categoryID,
                        },
                        returning: true,
                    }
                );

                res.status(200).json(updatedCategory[1][0]);
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        let categoryID = Number(req.params.id);

        try {
            let currentCategory = await Category.destroy({
                where: {
                    id: categoryID,
                },
            });

            if (currentCategory) {
                res.status(200).json({ message: "Category deleted" });
            } else {
                throw { name: "Not Found" };
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CategoryController;
