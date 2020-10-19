const request = require("supertest");
const app = require("../app");
const { sequelize, Address } = require("../models/index.js");
const {signToken} = require('../helpers/token');

const userToken = signToken({email: "test1@mail.com"});
const invalidUserToken = signToken({email: "test2@mail.com"});
const adminToken = signToken({email: "admin@mail.com"});
const orderData = {
    addressID: 2,
    status: ""
};

const emptyOrderData = {
    addressID: "",
    status: ""
};

const orderRouteTest = () => test("Order Route", (done) => {});

describe("POST /order", () => {
    beforeAll(async done => {
        const address2 = await Address.create({
            name: "user",
            address_name: "home 1",
            address: "street 3",
            postcode: 12345,
            city: "ABC",
            phone: "02170708080",
            UserId: 1,
        })

        done()
    })

    test("201 Success Create - Should return status, address id, user id", (done) => {
        request(app)
            .post("/order")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send(orderData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(201);
                expect(body).toHaveProperty("status", "pending");
                expect(body).toHaveProperty("addressID", expect.any(Number));
                expect(body).toHaveProperty("userID", expect.any(Number));

                done();
            });
    });

    test("400 Bad Request - empty address id - Should return error message", (done) => {
        request(app)
            .post("/order")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send(emptyOrderData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Address id is required!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .post("/order")
            .set("Accept", "application/json")
            .send(orderData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code","401")
                expect(body).toHaveProperty("message","User need to login")

                done();
            });
    });
})

describe("GET /order", () => {
    test("200 Success Read - Should return list of orders", (done) => {
        request(app)
        .get("/order")
        .set("Accept", "application/json")
        .set({"access_token": userToken})
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(200);
            expect(body.orders[0]).toHaveProperty("id",expect.any(Number))
            expect(body.orders[0]).toHaveProperty("UserId",expect.any(Number))
            expect(body.orders[0]).toHaveProperty("AddressId",expect.any(Number))
            expect(body.orders[0]).toHaveProperty("status",expect.any(String))
            expect(body.orders[0]).toHaveProperty("createdAt",expect.any(String))
            expect(body.orders[0]).toHaveProperty("updatedAt",expect.any(String))

            done();
        });  
    })

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .get("/order")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code","401")
                expect(body).toHaveProperty("message","User need to login")

                done();
            });
    })
})

describe("GET /order/:id", () => {
    test("200 Success Read - Should return status, address id, user id", (done) => {
        request(app)
        .get("/order/1")
        .set("Accept", "application/json")
        .set({"access_token": userToken})
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(200);
            expect(body).toHaveProperty("id",expect.any(Number))
            expect(body).toHaveProperty("UserId",expect.any(Number))
            expect(body).toHaveProperty("AddressId",expect.any(Number))
            expect(body).toHaveProperty("status",expect.any(String))
            expect(body).toHaveProperty("createdAt",expect.any(String))
            expect(body).toHaveProperty("updatedAt",expect.any(String))

            done();
        }); 
    })

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .get("/order/1")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code","401")
                expect(body).toHaveProperty("message","User need to login")

                done();
            });
    })

    test("403 Forbidden - user unauthorized to read/modify data - Should return error message", (done) => {
        request(app)
            .get("/order/1")
            .set("Accept", "application/json")
            .set({"access_token": invalidUserToken})
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(403);
                expect(body).toHaveProperty("code","403")
                expect(body).toHaveProperty("message","User unauthorized to access or modify this data")

                done();
            });
    })
    
    test("404 Not found - invalid order id - Should return error message", (done) => {
        request(app)
        .get("/order/9999")
        .set("Accept", "application/json")
        .set({"access_token": userToken})
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(404);
            expect(body).toHaveProperty("code","404")
            expect(body).toHaveProperty("message","Data not found")

            done();
        });
    })
})

const updatedOrderData = {
    status: "completed"
};

describe("PUT /order/:id", () => {
    test("200 Success Update - Should return status, address id, user id", (done) => {
        request(app)
        .put("/order/1")
        .set("Accept", "application/json")
        .set({"access_token": adminToken})
        .send(updatedOrderData)
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(200);
            expect(body).toHaveProperty("id",expect.any(Number))
            expect(body).toHaveProperty("UserId",expect.any(Number))
            expect(body).toHaveProperty("AddressId",expect.any(Number))
            expect(body).toHaveProperty("status",expect.any(String))
            expect(body).toHaveProperty("createdAt",expect.any(String))
            expect(body).toHaveProperty("updatedAt",expect.any(String))

            done();
        }); 
    })

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .put("/order/1")
            .set("Accept", "application/json")
            .send(updatedOrderData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code","401")
                expect(body).toHaveProperty("message","User need to login")

                done();
            });
    })

    test("403 Forbidden - user unauthorized to read/modify data - Should return error message", (done) => {
        request(app)
            .put("/order/1")
            .set("Accept", "application/json")
            .set({"access_token": invalidUserToken})
            .send(updatedOrderData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(403);
                expect(body).toHaveProperty("code","403")
                expect(body).toHaveProperty("message","User unauthorized to access or modify this data")

                done();
            });
    })

    test("404 Not found - invalid order id - Should return error message", (done) => {
        request(app)
        .put("/order/9999")
        .set("Accept", "application/json")
        .set({"access_token": adminToken})
        .send(updatedOrderData)
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(404);
            expect(body).toHaveProperty("code","404")
            expect(body).toHaveProperty("message","Data not found")

            done();
        });
    })
})

describe("DELETE /order/:id", () => {
    test("200 Success Delete - Should return success message", (done) => {
        request(app)
        .delete("/order/1")
        .set("Accept", "application/json")
        .set({"access_token": adminToken})
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(200);
            expect(body).toHaveProperty("message", "Order deleted")

            done();
        });   
    })

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .delete("/order/1")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code","401")
                expect(body).toHaveProperty("message","User need to login")

                done();
            });
    })

    test("403 Forbidden - user unauthorized to delete data - Should return error message", (done) => {
        request(app)
        .delete("/order/1")
        .set("Accept", "application/json")
        .set({"access_token": userToken})
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(403);
            expect(body).toHaveProperty("code","403")
            expect(body).toHaveProperty("message","User unauthorized to access or modify this data")

            done();
        });
    })

    test("404 Not found - invalid order id - Should return error message", (done) => {
        request(app)
        .delete("/order/9999")
        .set("Accept", "application/json")
        .set({"access_token": adminToken})
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(404);
            expect(body).toHaveProperty("code","404")
            expect(body).toHaveProperty("message","Data not found")

            done();
        });
    })
})

module.exports = orderRouteTest
