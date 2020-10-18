const request = require("supertest");
const app = require("../app");
const { sequelize } = require('../models/index.js')
const { queryInterface } = sequelize

const testUser = {
  name: "test",
  email: "test@mail.com",
  password: "testpassword"
};

const emptyUser = {
  name: "",
  email: "",
  password: ""
};

const userRouteTest = () => test("User Route", (done) => {});

describe("POST /user/register", () => {

  test("201 Success Create - Should return id and email", (done) => {
    request(app)
      .post("/user/register")
      .send(testUser)
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;

        const { body, status } = res;

        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("email", testUser.email);

        done();
      });
  });

  test("400 Bad Request - empty name, email, password -  Should return error message", (done) => {
    request(app)
      .post("/user/register")
      .send(emptyUser)
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        const { body, status } = res;

        expect(status).toBe(400);
        expect(body.message).toEqual(
          expect.arrayContaining(["Name is required!"])
        );
        expect(body.message).toEqual(
          expect.arrayContaining(["Email is required!"])
        );
        expect(body.message).toEqual(
          expect.arrayContaining(["Password is required!"])
        );

        done();
      });
  });

  test("400 Bad Request - invalid email - Should return error message", (done) => {
    request(app)
      .post("/user/register")
      .send({
        name: testUser.name,
        email: "invalidemailinput",
        password: testUser.password,
      })
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        const { body, status } = res;

        expect(status).toBe(400);
        expect(body.message).toEqual(
          expect.arrayContaining(["Please input a valid email!"])
        );

        done();
      });
  });
});


describe("POST /user/login", () => {
    test("200 Success Login - Should return access token", (done) => {
      request(app)
      .post("/user/login")
      .send(testUser)
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err;
        const { body, status } = res;

        expect(status).toBe(200)
        expect(body).toHaveProperty("access_token", expect.any(String))

        done()
      })
    })

    test("401 Failed Login - Should return error message", (done) => {
      request(app)
      .post("/user/login")
      .send(emptyUser)
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) throw err
        const { body, status } = res

        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Invalid email or password")

        done()
      })
    })
})

module.exports = userRouteTest