const request = require("supertest");
const app = require("../app");
const { signToken } = require("../helpers/token");

const userToken = signToken({ email: "test1@mail.com" });
const invalidUserToken = signToken({ email: "test2@mail.com" });
const shoppingCartData = {
    productOptionID: 2,
    quantity: 10,
};

const emptyShoppingCartData = {
    productOptionID: "",
    quantity: "",
};

const shoppingCartRouteTest = () => test("Shopping Cart Route", (done) => {});

describe("POST /cart", () => {

    test("200 Success Create - Should return id, user id, product option id, quantity", (done) => {
        request(app)
            .post("/cart")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(shoppingCartData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(201);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("UserId", expect.any(Number));
                expect(body).toHaveProperty(
                    "ProductOptionId",
                    shoppingCartData.productOptionID
                );
                expect(body).toHaveProperty(
                    "quantity",
                    shoppingCartData.quantity
                );

                done();
            });
    });

    test("400 Bad Request - empty product option id, quantity - Should return error message", (done) => {
        request(app)
            .post("/cart")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(emptyShoppingCartData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Product option id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Quantity is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid quantity!"])
                );
                done();
            });
    });

    test("400 Bad Request - invalid quantity input - Should return error message", (done) => {
        request(app)
            .post("/cart")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send({
                productOptionID: shoppingCartData.productOptionID,
                quantity: -10,
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Quantity minimum value is 0!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .post("/cart")
            .set("Accept", "application/json")
            .send(shoppingCartData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code", "401");
                expect(body).toHaveProperty("message", "User need to login");

                done();
            });
    });
});

describe("GET /cart/user/:id", () => {
    test("200 Success Read - Should return list shopping cart item", (done) => {
        request(app)
            .get("/cart/user/3")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body.shoppingCart[0]).toHaveProperty(
                    "id",
                    expect.any(Number)
                );
                expect(body.shoppingCart[0]).toHaveProperty(
                    "UserId",
                    expect.any(Number)
                );
                expect(body.shoppingCart[0]).toHaveProperty(
                    "ProductOptionId",
                    expect.any(Number)
                );
                expect(body.shoppingCart[0]).toHaveProperty(
                    "quantity",
                    expect.any(Number)
                );
                expect(body.shoppingCart[0]).toHaveProperty(
                    "createdAt",
                    expect.any(String)
                );
                expect(body.shoppingCart[0]).toHaveProperty(
                    "updatedAt",
                    expect.any(String)
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .get("/cart/user/3")
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

    test("404 Not found - invalid user id - Should return error message", (done) => {
        request(app)
            .get("/cart/user/9999")
            .set("Accept", "application/json")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
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

describe("GET /cart/:id", () => {
    test("200 Success Read - Should return id, user id, product option id, quantity, createdAt, updatedAt", (done) => {
        request(app)
            .get("/cart/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("UserId", expect.any(Number));
                expect(body).toHaveProperty(
                    "ProductOptionId",
                    expect.any(Number)
                );
                expect(body).toHaveProperty("quantity", expect.any(Number));
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .get("/cart/1")
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

    test("404 Not found - invalid shopping cart id - Should return error message", (done) => {
        request(app)
            .get("/cart/9999")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
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

const updatedShoppingCartData = {
    productOptionID: 2,
    quantity: 11,
};

describe("PUT /cart/:id", () => {
    test("200 Success Update - Should return id, user id, product option id, quantity, createdAt, updatedAt", (done) => {
        request(app)
            .put("/cart/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(updatedShoppingCartData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("UserId", expect.any(Number));
                expect(body).toHaveProperty(
                    "ProductOptionId",
                    updatedShoppingCartData.productOptionID
                );
                expect(body).toHaveProperty(
                    "quantity",
                    updatedShoppingCartData.quantity
                );
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .put("/cart/1")
            .set("Accept", "application/json")
            .send(updatedShoppingCartData)
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
            .put("/cart/1")
            .set("Accept", "application/json")
            .set({ access_token: invalidUserToken })
            .send(updatedShoppingCartData)
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

    test("404 Not found - invalid shopping cart id - Should return error message", (done) => {
        request(app)
            .put("/cart/9999")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(updatedShoppingCartData)
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

describe("DELETE /cart/:id", () => {
    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
        .delete("/cart/1")
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
        .delete("/cart/1")
        .set("Accept", "application/json")
        .set({ access_token: invalidUserToken })
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

    test("404 Not found - invalid shopping cart id - Should return error message", (done) => {
        request(app)
        .delete("/cart/9999")
        .set("Accept", "application/json")
        .set({ access_token: userToken })
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(404);
            expect(body).toHaveProperty("code", "404");
            expect(body).toHaveProperty("message", "Data not found");

            done();
        });
    });

    test("200 Success Delete - Should return success message", (done) => {
        request(app)
            .delete("/cart/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("message", "Shopping cart item deleted");

                done();
            });
    });
});

module.exports = shoppingCartRouteTest
