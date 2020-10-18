const request = require("supertest");
const app = require("../app");
const { sequelize, Product } = require("../models/index.js");
const { signToken } = require("../helpers/token");

const userToken = signToken({ email: "test1@mail.com" });
const adminToken = signToken({ email: "admin@mail.com" });
const productOptionData = {
    productID: 2,
    size: "S",
    color: "black",
    stock: 0,
    photo_link: "www.image.com/1",
};

const emptyProductOptionData = {
    productID: "",
    size: "",
    color: "",
    stock: "",
    photo_link: "",
};

const productOptionRouteTest = () => test("Product Option Route", (done) => {});

describe("POST /product-option", () => {
    beforeAll(async (done) => {
        const product2 = await Product.create({
            name: "test-product",
            price: 1000,
            description: "abc",
            categoryID: 2,
        });

        done();
    });

    test("201 Success Create - Should return id, product id, size, color, stock, photo link", (done) => {
        request(app)
            .post("/product-option")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(productOptionData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(201);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty(
                    "productID",
                    productOptionData.productID
                );
                expect(body).toHaveProperty("size", productOptionData.size);
                expect(body).toHaveProperty("color", productOptionData.color);
                expect(body).toHaveProperty("stock", productOptionData.stock);
                expect(body).toHaveProperty(
                    "photo_link",
                    productOptionData.photo_link
                );

                done();
            });
    });
    test("400 Bad Request - empty product id, size, color, stock, photo link - Should return error message", (done) => {
        request(app)
            .post("/product-option")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(emptyProductOptionData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Product id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Size is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Color is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Stock is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Photo's link is required!"])
                );

                done();
            });
    });

    test("400 Bad Request - invalid stock & photo link input - Should return error message", (done) => {
        request(app)
            .post("/product-option")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send({
                productID: productOptionData.productID,
                size: productOptionData.size,
                color: productOptionData.color,
                stock: -1,
                photo_link: "invalidlink",
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Stock minimum value is 0!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid photo link!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .post("/product-option")
            .set("Accept", "application/json")
            .send(productOptionData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code", "401");
                expect(body).toHaveProperty("message", "User need to login");

                done();
            });
    });

    test("403 Forbidden - user unauthorized to read/modify data - Should return error message", (done) => {
        request(app)
            .post("/product-option")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(productOptionData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(403);
                expect(body).toHaveProperty("code", "403");
                expect(body).toHaveProperty(
                    "message",
                    "User unauthorized to access or modify this data"
                );

                done();
            });
    });
});

describe("GET /product-option/product/:id", () => {
    test("200 Success Read - Should return product option list of a product", (done) => {
        request(app)
            .get("/product-option/product/2")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body.productOptions[0]).toHaveProperty(
                    "id",
                    expect.any(Number)
                );
                expect(body.productOptions[0]).toHaveProperty(
                    "ProductId",
                    expect.any(Number)
                );
                expect(body.productOptions[0]).toHaveProperty(
                    "size",
                    expect.any(String)
                );
                expect(body.productOptions[0]).toHaveProperty(
                    "color",
                    expect.any(String)
                );
                expect(body.productOptions[0]).toHaveProperty(
                    "stock",
                    expect.any(Number)
                );
                expect(body.productOptions[0]).toHaveProperty(
                    "photo_link",
                    expect.any(String)
                );
                expect(body.productOptions[0]).toHaveProperty(
                    "createdAt",
                    expect.any(String)
                );
                expect(body.productOptions[0]).toHaveProperty(
                    "updatedAt",
                    expect.any(String)
                );

                done();
            });
    });

    test("404 Not Found - invalid product id - Should return error message", (done) => {
        request(app)
            .get("/product-option/product/9999")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(404);
                expect(body).toHaveProperty("code", "404");
                expect(body).toHaveProperty("message", "Data not found");

                done();
            });
    });
});

describe("GET /product-option/:id", () => {
    test("200 Success Read - Should return id, product id, size, color, stock, photo link, createdAt, updatedAt", (done) => {
        request(app)
            .get("/product-option/1")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("ProductId", expect.any(Number));
                expect(body).toHaveProperty("size", expect.any(String));
                expect(body).toHaveProperty("color", expect.any(String));
                expect(body).toHaveProperty("stock", expect.any(Number));
                expect(body).toHaveProperty("photo_link", expect.any(String));
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("404 Not found - invalid product option id - Should return error message", (done) => {
        request(app)
            .get("/product-option/9999")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(404);
                expect(body).toHaveProperty("code", "404");
                expect(body).toHaveProperty("message", "Data not found");

                done();
            });
    });
});

const updatedProductOptionData = {
    productID: 2,
    size: "M",
    color: "white",
    stock: 10,
    photo_link: "www.image.com/1",
};

describe("PUT /product-option/:id", () => {
    test("200 Success Update - Should return id, product id, size, color, stock, photo link, createdAt, updatedAt", (done) => {
        request(app)
            .put("/product-option/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(updatedProductOptionData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty(
                    "ProductId",
                    updatedProductOptionData.productID
                );
                expect(body).toHaveProperty(
                    "size",
                    updatedProductOptionData.size
                );
                expect(body).toHaveProperty(
                    "color",
                    updatedProductOptionData.color
                );
                expect(body).toHaveProperty(
                    "stock",
                    updatedProductOptionData.stock
                );
                expect(body).toHaveProperty(
                    "photo_link",
                    updatedProductOptionData.photo_link
                );
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("400 Bad Request - empty product id, size, color, stock, photo link - Should return error message", (done) => {
        request(app)
            .put("/product-option/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(emptyProductOptionData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Product id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Size is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Color is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Stock is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Photo's link is required!"])
                );

                done();
            });
    });

    test("400 Bad Request - invalid stock & photo link input - Should return error message", (done) => {
        request(app)
            .put("/product-option/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send({
                productID: updatedProductOptionData.productID,
                size: updatedProductOptionData.size,
                color: updatedProductOptionData.color,
                stock: -1,
                photo_link: "invalidlink",
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Stock minimum value is 0!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid photo link!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .put("/product-option/1")
            .set("Accept", "application/json")
            .send(updatedProductOptionData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code", "401");
                expect(body).toHaveProperty("message", "User need to login");

                done();
            });
    });

    test("403 Forbidden - user unauthorized to read/modify data - Should return error message", (done) => {
        request(app)
            .put("/product-option/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(updatedProductOptionData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(403);
                expect(body).toHaveProperty("code", "403");
                expect(body).toHaveProperty(
                    "message",
                    "User unauthorized to access or modify this data"
                );

                done();
            });
    });

    test("404 Not found - invalid product option id - Should return error message", (done) => {
        request(app)
            .put("/product-option/9999")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })    
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(404);
                expect(body).toHaveProperty("code", "404");
                expect(body).toHaveProperty("message", "Data not found");

                done();
            });
    });
});

describe("DELETE /product-option/:id", () => {
    test("200 Success Delete - Should return success message", (done) => {
        request(app)
            .delete("/product-option/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("message", "Product option deleted");

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .delete("/product-option/1")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code", "401");
                expect(body).toHaveProperty("message", "User need to login");

                done();
            });
    });

    test("403 Forbidden - user unauthorized to delete data - Should return error message", (done) => {
        request(app)
        .delete("/product-option/1")
        .set("Accept", "application/json")
        .set({ access_token: userToken })
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(403);
            expect(body).toHaveProperty("code", "403");
            expect(body).toHaveProperty(
                "message",
                "User unauthorized to access or modify this data"
            );

            done();
        });
    });

    test("404 Not found - invalid product option id - Should return error message", (done) => {
        request(app)
        .delete("/product-option/9999")
        .set("Accept", "application/json")
        .set({ access_token: adminToken })
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(404);
            expect(body).toHaveProperty("code", "404");
            expect(body).toHaveProperty("message", "Data not found");

            done();
        });
    });
});

module.exports = productOptionRouteTest
