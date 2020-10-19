const request = require("supertest");
const app = require("../app");
const { sequelize, Order, Product_option } = require("../models/index.js");
const { signToken } = require("../helpers/token");

const userToken = signToken({ email: "test1@mail.com" });
const orderItemData = {
    orderID: 2,
    productOptionID: 2,
    quantity: 1,
};

const emptyOrderItemData = {
    orderID: "",
    productOptionID: "",
    quantity: "",
};

const orderItemRouteTest = () => test("Order Item Route", (done) => {});

describe("POST /order-item", () => {
    beforeAll(async (done) => {
        const order2 = await Order.create({
            addressID: 2,
            status: "",
        });
        const productOption2 = await Product_option.create({
            productID: 2,
            size: "S",
            color: "black",
            stock: 0,
            photo_link: "www.image.com/1",
        });

        done();
    });
    
    test("201 Success Create - Should return id, order id, product option id, quantity", (done) => {
        request(app)
            .post("/order-item")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(orderItemData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(201);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("OrderId", orderItemData.orderID);
                expect(body).toHaveProperty(
                    "ProductOptionId",
                    orderItemData.productOptionID
                );
                expect(body).toHaveProperty("quantity", orderItemData.quantity);

                done();
            });
    });

    test("400 Bad Request - empty order id, product option id, quantity - Should return error message", (done) => {
        request(app)
            .post("/order-item")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(emptyOrderItemData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Order id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Product option id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Quantity is required!"])
                );

                done();
            });
    });

    test("400 Bad Request - invalid quantity input - Should return error message", (done) => {
        request(app)
            .post("/order-item")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send({
                orderID: 2,
                productOptionID: 2,
                quantity: -100,
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
            .post("/order-item")
            .set("Accept", "application/json")
            .send(orderItemData)
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

describe("GET /order-item/order/:id", () => {
    test("200 Success Read - Should return order item list of orders", (done) => {
        request(app)
            .get("/order-item/order/2")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body.orderItems[0]).toHaveProperty(
                    "id",
                    expect.any(Number)
                );
                expect(body.orderItems[0]).toHaveProperty(
                    "OrderId",
                    expect.any(Number)
                );
                expect(body.orderItems[0]).toHaveProperty(
                    "ProductOptionId",
                    expect.any(Number)
                );
                expect(body.orderItems[0]).toHaveProperty(
                    "quantity",
                    expect.any(Number)
                );
                expect(body.orderItems[0]).toHaveProperty(
                    "createdAt",
                    expect.any(String)
                );
                expect(body.orderItems[0]).toHaveProperty(
                    "updatedAt",
                    expect.any(String)
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .get("/order-item/order/2")
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

    test("404 Not found - invalid order id - Should return error message", (done) => {
        request(app)
            .get("/order-item/order/9999")
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

describe("GET /order-item/:id", () => {
    test("200 Success Read - Should return id, order id, product option id, quantity, createdAt, updatedAt", (done) => {
        request(app)
            .get("/order-item/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("OrderId", expect.any(Number));
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
            .get("/order-item/order/1")
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

    test("404 Not found - invalid order item id - Should return error message", (done) => {
        request(app)
            .get("/order-item/9999")
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

const updatedOrderItemData = {
    orderID: 2,
    productOptionID: 2,
    quantity: 10,
};

describe("PUT /order-item/:id", () => {
    test("200 Success Update - Should return id, order id, product option id, quantity, createdAt, updatedAt", (done) => {
        request(app)
            .put("/order-item/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(updatedOrderItemData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("OrderId", expect.any(Number));
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

    test("400 Bad Request - empty order id, product option id, quantity - Should return error message", (done) => {
        request(app)
            .put("/order-item/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(emptyOrderItemData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Order id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Product option id is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Quantity is required!"])
                );

                done();
            });
    });

    test("400 Bad Request - invalid quantity input - Should return error message", (done) => {
        request(app)
            .put("/order-item/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send({
                orderID: 2,
                productOptionID: 2,
                quantity: -100,
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
            .put("/order-item/1")
            .set("Accept", "application/json")
            .send(updatedOrderItemData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code", "401");
                expect(body).toHaveProperty("message", "User need to login");

                done();
            });
    });

    test("404 Not found - invalid order item id - Should return error message", (done) => {
        request(app)
        .put("/order-item/9999")
        .set("Accept", "application/json")
        .set({ access_token: userToken })
        .send(updatedOrderItemData)
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

describe("DELETE /order-item/:id", () => {
    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
        .delete("/order-item/1")
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

    test("404 Not found - invalid order id - Should return error message", (done) => {
        request(app)
        .delete("/order-item/9999")
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
            .delete("/order-item/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("message", "Order item deleted");
                
                done();
            });
    });
});

module.exports = orderItemRouteTest
