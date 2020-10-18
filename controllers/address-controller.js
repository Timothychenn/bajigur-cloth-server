const { Address } = require("../models/index.js");

class AddressController {
    static async create(req, res, next) {
        let { name, address_name, address, postcode, city, phone } = req.body;
        let currentUser = req.currentUser;
        
        try {
            let newAddress = await Address.create({
                name,
                address_name,
                address,
                postcode,
                city,
                phone,
                UserId: currentUser.id,
            });
            res.status(201).json({
                name: newAddress.name,
                address_name: newAddress.address_name,
                address: newAddress.address,
                postcode: newAddress.postcode,
                city: newAddress.city,
                phone: newAddress.phone,
                userID: newAddress.UserId,
            });
        } catch (err) {
            next(err);
        }
    }

    static async read(req, res, next) {
        let currentUser = req.currentUser;

        try {
            let allAddress = await Address.findAll({
                where: {
                    UserId: currentUser.id,
                },
            });

            res.status(200).json({ addresses: allAddress });
        } catch (err) {
            next(err);
        }
    }

    static async readById(req, res, next) {
        let addressID = Number(req.params.id);

        try {
            let currentAddress = await Address.findOne({
                where: {
                    id: addressID,
                },
            });

            res.status(200).json(currentAddress);
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        let { name, address_name, address, postcode, city, phone } = req.body;
        let addressID = Number(req.params.id);

        try {
            let updatedAddress = await Address.update(
                {
                    name,
                    address_name,
                    address,
                    postcode,
                    city,
                    phone,
                },
                {
                    where: {
                        id: addressID,
                    },
                    returning: true,
                }
            );

            res.status(200).json(updatedAddress[1][0]);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        let addressID = Number(req.params.id);

        try {
            let currentAddress = await Address.destroy({
                where: {
                    id: addressID,
                },
            });

            res.status(200).json({ message: "Address deleted" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AddressController;
