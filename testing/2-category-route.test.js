const request = require("supertest");
const app = require("../app");
const { User } = require("../models/index.js");
const { signToken } = require("../helpers/token");

const userToken = signToken({ email: "test@mail.com" });
const adminToken = signToken({ email: "admin@mail.com" });
const categoryData = {
    name: "test-category",
};

const emptyCategoryData = {
    name: "",
};

const categoryRouteTest = () => test("Category Route", (done) => {});

describe("POST /category", () => {
    beforeAll(async (done) => {
        const admin1 = await User.create({
            email: "admin@mail.com",
            password: "admin",
            name: "admin",
            type: "admin",
        });

        done();
    });

    test("201 Success Create - Should return id, name", (done) => {
        request(app)
            .post("/category")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(categoryData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(201);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("name", categoryData.name);

                done();
            });
    });

    test("400 Bad Request - empty name - Should return error message", (done) => {
        request(app)
            .post("/category")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(emptyCategoryData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Name is required!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .post("/category")
            .set("Accept", "application/json")
            .send(categoryData)
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
            .post("/category")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(categoryData)
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

describe("GET /category", () => {
    test("200 Success Read - Should return list of categories", (done) => {
        request(app)
            .get("/category")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body.categories[0]).toHaveProperty(
                    "id",
                    expect.any(Number)
                );
                expect(body.categories[0]).toHaveProperty(
                    "name",
                    expect.any(String)
                );
                expect(body.categories[0]).toHaveProperty(
                    "createdAt",
                    expect.any(String)
                );
                expect(body.categories[0]).toHaveProperty(
                    "updatedAt",
                    expect.any(String)
                );

                done();
            });
    });
});

describe("GET /category/:id", () => {
    test("200 Success Read - Should return id, name, createdAt, updatedAt", (done) => {
        request(app)
            .get("/category/1")
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("name", expect.any(String));
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("404 Not found - invalid category id - Should return error message", (done) => {
        request(app)
            .get("/category/9999")
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

const updatedCategoryData = {
    name: "updated-test-category",
};

describe("PUT /category/:id", () => {
    test("200 Success Update - Should return id, name, createdAt, updatedAt", (done) => {
        request(app)
            .put("/category/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(updatedCategoryData)
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body).toHaveProperty("name", updatedCategoryData.name);
                expect(body).toHaveProperty("createdAt", expect.any(String));
                expect(body).toHaveProperty("updatedAt", expect.any(String));

                done();
            });
    });

    test("400 Bad Request - empty name - Should return error message", (done) => {
        request(app)
            .put("/category/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .send(emptyCategoryData)
            .end((err, res) => {
                if (err) throw err;
                const { body, status } = res;

                expect(status).toBe(400);
                expect(body).toHaveProperty("code", "400");
                expect(body.message).toEqual(
                    expect.arrayContaining(["Name is required!"])
                );

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .put("/category/1")
            .set("Accept", "application/json")
            .send(updatedCategoryData)
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
            .put("/category/1")
            .set("Accept", "application/json")
            .set({ access_token: userToken })
            .send(updatedCategoryData)
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

    test("404 Not found - invalid category id - Should return error message", (done) => {
        request(app)
            .put("/category/9999")
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

describe("DELETE /category/:id", () => {
    test("200 Success Delete - Should return success message", (done) => {
        request(app)
            .delete("/category/1")
            .set("Accept", "application/json")
            .set({ access_token: adminToken })
            .end((err, res) => {
                if (err) throw err;

                const { body, status } = res;

                expect(status).toBe(200);
                expect(body).toHaveProperty("message", "Category deleted");

                done();
            });
    });

    test("401 Unauthorized user - user didn't login - Should return error message", (done) => {
        request(app)
            .delete("/category/1")
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
            .delete("/category/1")
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

    test("404 Not found - invalid category id - Should return error message", (done) => {
        request(app)
            .delete("/category/9999")
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

module.exports = categoryRouteTest