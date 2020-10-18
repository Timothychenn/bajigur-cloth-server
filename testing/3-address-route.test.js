const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models/index.js");
const {signToken} = require('../helpers/token');

const userToken = signToken({email: "test1@mail.com"});
const invalidUserToken = signToken({email: "test2@mail.com"});

const addressData = {
    name: "testuser",
    address_name: "home",
    address: "street 1",
    postcode: 12345,
    city: "ABC",
    phone: "08131234123",
};

const emptyAddressData = {
    name: "",
    address_name: "",
    address: "",
    city: "",
    phone: "",
    postcode: ""
};

const addressRouteTest = () => test("Address Route", (done) => {});

describe("POST /address", () => {
    beforeAll(async done => {
        const userTest1 = await User.create({ email: "test1@mail.com", password: "passwordtest1", name: "test1", type: "user" })
        const userTest2 = await User.create({ email: "test2@mail.com", password: "passwordtest2", name: "test2", type: "user" })

        done()
    })

    test("201 Success Create - Should return name, address, address name, postcode, city, phone, UserId ", (done) => {
        request(app)
            .post("/address")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send(addressData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(201);
                expect(body).toHaveProperty("name", addressData.name);
                expect(body).toHaveProperty("address_name", addressData.address_name);
                expect(body).toHaveProperty("address", addressData.address);
                expect(body).toHaveProperty("postcode", addressData.postcode);
                expect(body).toHaveProperty("city", addressData.city);
                expect(body).toHaveProperty("phone", addressData.phone);

                done();
            });
    });

    test("400 Bad Request - empty name, address, address name, postcode, city, phone -  Should return error message", (done) => {
        request(app)
            .post("/address")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send(emptyAddressData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Name is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Address name is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Address is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["City is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Postcode is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Phone is required!"])
                );

                done();
            });
    });

    test("400 Bad Request - invalid postcode input - Should return error message", (done) => {
        request(app)
            .post("/address")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send({
                name: addressData.name,
                address_name: addressData.address_name,
                address: addressData.address,
                postcode: "invalid postcode",
                city: addressData.city,
                phone: addressData.phone,
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid postcode!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid postcode with 5 number!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .post("/address")
            .set("Accept", "application/json")
            .send(addressData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code","401")
                expect(body).toHaveProperty("message","User need to login")

                done();
            });
    });
});

describe("GET /address", () => {
    test("200 Success Read - Should return address list", (done) => {
        request(app)
            .get("/address")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body.addresses[0]).toHaveProperty("id", expect.any(Number));
                expect(body.addresses[0]).toHaveProperty("UserId", expect.any(Number));
                expect(body.addresses[0]).toHaveProperty("name", expect.any(String));
                expect(body.addresses[0]).toHaveProperty("address_name", expect.any(String));
                expect(body.addresses[0]).toHaveProperty("address", expect.any(String));
                expect(body.addresses[0]).toHaveProperty("city", expect.any(String));
                expect(body.addresses[0]).toHaveProperty("postcode", expect.any(Number));
                expect(body.addresses[0]).toHaveProperty("phone", expect.any(String));
                expect(body.addresses[0]).toHaveProperty("createdAt", expect.anything());
                expect(body.addresses[0]).toHaveProperty("updatedAt", expect.anything());

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
        .get("/address")
        .set("Accept", "application/json")
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(401);
            expect(body).toHaveProperty("code","401")
            expect(body).toHaveProperty("message","User need to login")

            done();
        }); 
    });
});

describe("GET /address/:id", () => {
    test("200 Success read - Should return address data", (done) => {
        request(app)
            .get("/address/1")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("UserId", expect.any(Number));
                expect(body).toHaveProperty("name", expect.any(String));
                expect(body).toHaveProperty("address_name", expect.any(String));
                expect(body).toHaveProperty("address", expect.any(String));
                expect(body).toHaveProperty("city", expect.any(String));
                expect(body).toHaveProperty("postcode", expect.any(Number));
                expect(body).toHaveProperty("phone", expect.any(String));
                expect(body).toHaveProperty("createdAt", expect.anything());
                expect(body).toHaveProperty("updatedAt", expect.anything());

                done();
            });
    });

    test("401 Unauthorized User - user didn't login - Should return error message", (done) => {
        request(app)
        .get("/address/1")
        .set("Accept", "application/json")
        .end((err, res) => {
            if (err) throw err;
            const { body, status } = res;

            expect(status).toBe(401);
            expect(body).toHaveProperty("code","401")
            expect(body).toHaveProperty("message","User need to login")

            done();
        }); 
    });

    test("403 Forbidden - user unauthorized to read/modify data - Should return error message", (done) => {
        request(app)
        .get("/address/1")
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
    });

    test("404 Not found - invalid address id - Should return error message", (done) => {
        request(app)
        .get("/address/9999")
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
    });
});

describe("PUT /address/:id", () => {
    const updatedAddressData = {
        name: "newuser",
        address_name: "home 2",
        address: "street 100",
        postcode: 99999,
        city: "DEF",
        phone: "02188987070",
    };

    test("200 Success update - Should return updated address data", (done) => {
        request(app)
            .put("/address/1")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send(updatedAddressData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("name", updatedAddressData.name);
                expect(body).toHaveProperty("address_name", updatedAddressData.address_name);
                expect(body).toHaveProperty("address", updatedAddressData.address);
                expect(body).toHaveProperty("postcode", updatedAddressData.postcode);
                expect(body).toHaveProperty("city", updatedAddressData.city);
                expect(body).toHaveProperty("phone", updatedAddressData.phone);
                expect(body).toHaveProperty("createdAt", expect.anything());
                expect(body).toHaveProperty("updatedAt", expect.anything());

                done();
            });
    });

    test("400 Bad Request - empty name, address, address name, postcode, city, phone - Should return error message", (done) => {
        request(app)
            .put("/address/1")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send(emptyAddressData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Name is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Address name is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Address is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["City is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Postcode is required!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Phone is required!"])
                );

                done();
            });
    })

    test("400 Bad Request - invalid postcode input - Should return error message", (done) => {
        request(app)
            .put("/address/1")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send({
                name: updatedAddressData.name,
                address_name: updatedAddressData.address_name,
                address: updatedAddressData.address,
                postcode: "invalid postcode",
                city: updatedAddressData.city,
                phone: updatedAddressData.phone,
            })
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid postcode!"])
                );
                expect(body.message).toEqual(
                    expect.arrayContaining(["Please input a valid postcode with 5 number!"])
                );

                done();
            });
    })

    test("401 Unauthorized User - user didn't login - Should return error message", (done) => {
        request(app)
            .put("/address/1")
            .set("Accept", "application/json")
            .send(updatedAddressData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(401);
                expect(body).toHaveProperty("code","401")
                expect(body).toHaveProperty("message","User need to login")

                done();
            });
    });

    test("403 Forbidden - user unauthorized to read/modify data - Should return error message", (done) => {
        request(app)
            .put("/address/1")
            .set("Accept", "application/json")
            .set({"access_token": invalidUserToken})
            .send(updatedAddressData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(403);
                expect(body).toHaveProperty("code","403")
                expect(body).toHaveProperty("message","User unauthorized to access or modify this data")

                done();
            });
    });

    test("404 Not found - invalid address id - Should return error message", (done) => {
        request(app)
            .put("/address/9999")
            .set("Accept", "application/json")
            .set({"access_token": userToken})
            .send(updatedAddressData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(404);
                expect(body).toHaveProperty("code","404")
                expect(body).toHaveProperty("message","Data not found")

                done();
            });
    });
});

describe("DELETE /address/:id", () => {
    test("401 Unauthorized User - user didn't login - Should return error message", (done) => {
        request(app)
        .delete("/address/1")
        .set("Accept", "application/json")
        .end((err, res) => {
            if (err) throw err;

            const { body, status } = res;

            expect(status).toBe(401);
            expect(body).toHaveProperty("code","401")
            expect(body).toHaveProperty("message","User need to login")

            done();
        });
    });

    test("403 Forbidden - user unauthorized to read/modify data - Should return error message", (done) => {
        request(app)
            .delete("/address/1")
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
    });

    test("404 Not found - invalid address id - Should return error message", (done) => {
        request(app)
            .delete("/address/9999")
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
    });

    test("200 Success delete - Should return message", (done) => {
        request(app)
        .delete("/address/1")
        .set("Accept", "application/json")
        .set({"access_token": userToken})
        .end((err, res) => {
            if (err) throw err;

            const { body, status } = res;

            expect(status).toBe(200);
            expect(body).toHaveProperty("message","Address deleted")

            done();
        });
    })
})

module.exports = addressRouteTest