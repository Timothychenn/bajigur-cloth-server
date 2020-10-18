const request = require("supertest");
const app = require("../app");
const { sequelize, Category } = require("../models/index.js");
const { signToken } = require("../helpers/token");

const userToken = signToken({ email: "test1@mail.com" });
const adminToken = signToken({ email: "admin@mail.com" });
const productData = {
    name: "test-product",
    price: 1000,
    description: "abc",
    categoryID: 2,
};

const emptyProductData = {
    name: "",
    price: "",
    description: "",
    categoryID: "",
};

const productRouteTest = () => test("Product Route", (done) => {});

describe("POST /product", () => {
    beforeAll(async (done) => {
        const category2 = await Category.create({
            name: "test-category",
        });

        done();
    });

    test("201 Success Create - Should return id, name, price, description, category id", (done) => {
        request(app)
            .post("/product")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(productData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(201);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("name", productData.name);
                expect(body).toHaveProperty(
                    "categoryID",
                    productData.categoryID
                );
                expect(body).toHaveProperty("price", productData.price);
                expect(body).toHaveProperty(
                    "description",
                    productData.description
                );

                done();
            });
    });

    test("400 Bad Request - empty name, price, description, category id - Should return error message", (done) => {
        request(app)
            .post("/product")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(emptyProductData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Name is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Category id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Price is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Description is required!"])
                );

                done();
            });
    });

    test("400 Bad Request - invalid price type input - Should return error message", (done) => {
        request(app)
            .post("/product")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send({
                name: productData.name,
                price: "asd",
                description: productData.description,
                categoryID: productData.categoryID,
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid price!"])
                );
                done();
            });
    });

    test("400 Bad Request - invalid price input - Should return error message", (done) => {
        request(app)
            .post("/product")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send({
                name: productData.name,
                price: 0,
                description: productData.description,
                categoryID: productData.categoryID,
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Price minimum value is 1!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .post("/product")
            .set("Accept", "application/json")
            .send(productData)
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
            .post("/product")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(productData)
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

describe("GET /product", () => {
    test("200 Success Read - Should return list of products", (done) => {
        request(app)
            .get("/product")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body.products[0]).toHaveProperty(
                    "id",
                    expect.any(Number)
                );
                expect(body.products[0]).toHaveProperty(
                    "name",
                    expect.any(String)
                );
                expect(body.products[0]).toHaveProperty(
                    "CategoryId",
                    expect.any(Number)
                );
                expect(body.products[0]).toHaveProperty(
                    "price",
                    expect.any(Number)
                );
                expect(body.products[0]).toHaveProperty(
                    "description",
                    expect.any(String)
                );
                expect(body.products[0]).toHaveProperty(
                    "createdAt",
                    expect.any(String)
                );
                expect(body.products[0]).toHaveProperty(
                    "updatedAt",
                    expect.any(String)
                );

                done();
            });
    });
});

describe("GET /product/:id", () => {
    test("200 Success Read - Should return id, name, price, description, category id, createdAt, updatedAt", (done) => {
        request(app)
            .get("/product/1")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("name", expect.any(String));
                expect(body).toHaveProperty("CategoryId", expect.any(Number));
                expect(body).toHaveProperty("price", expect.any(Number));
                expect(body).toHaveProperty("description", expect.any(String));
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("404 Not found - invalid product id - Should return error message", (done) => {
        request(app)
            .get("/product/9999")
            .set("Accept", "application/json")
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

const updatedProductData = {
    name: "updated-test-product",
    price: "10000",
    description: "abcd",
    categoryID: 2,
};

describe("PUT /product/:id", () => {
    test("200 Success Update - Should return updated id, name, price, description, category id, createdAt, updatedAt", (done) => {
        request(app)
            .put("/product/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(updatedProductData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("name", expect.any(String));
                expect(body).toHaveProperty("CategoryId", expect.any(Number));
                expect(body).toHaveProperty("price", expect.any(Number));
                expect(body).toHaveProperty("description", expect.any(String));
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("400 Bad Request - empty name, price, description, category id - Should return error message", (done) => {
        request(app)
            .put("/product/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(emptyProductData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Name is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Category id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Price is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Description is required!"])
                );

                done();
            });
    });

    test("400 Bad Request - invalid price input - Should return error message", (done) => {
        request(app)
            .put("/product/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send({
                name: productData.name,
                price: 0,
                description: productData.description,
                categoryID: productData.categoryID,
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Price minimum value is 1!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .put("/product/1")
            .set("Accept", "application/json")
            .send(productData)
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
            .put("/product/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(productData)
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

    test("404 Not found - invalid product id - Should return error message", (done) => {
        request(app)
            .put("/product/9999")
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

describe("DELETE /product/:id", () => {
    test("200 Success Delete - Should return success message", (done) => {
        request(app)
            .delete("/product/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("message", "Product deleted");

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
        .delete("/product/1")
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
        .delete("/product/1")
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

    test("404 Not found - invalid product id - Should return error message", (done) => {
        request(app)
        .delete("/product/9999")
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

module.exports = productRouteTest
