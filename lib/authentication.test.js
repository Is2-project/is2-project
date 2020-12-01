const request = require("supertest");
const app = require("./app");
const mongoose = require('mongoose');

const jwt = require("jsonwebtoken");
const pubkey = process.env.jwt_key_public || require('../secrets.json').jwt_key_public;

const User = require('./models/user');

describe("Test authentication", () => {

  beforeAll(async () => {
    const mongourl = process.env.MONGOTESTURL || require('./../secrets.json').mongodb_test_url;

    await mongoose.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await User.findOneAndDelete({ email: "prova_auth@test.it" });

    await request(app)
      .post("/api/users")
      .send({
        email: "prova_auth@test.it",
        password: "12345678",
        name: "name",
        surname: "surname",
        phone: "phone"
      });

  });

  afterAll(async () => {

    await User.findOneAndDelete({ email: "prova_auth@test.it" });

    await mongoose.disconnect();
  });

  test("Login with invalid email", () => {
    return request(app)
      .post("/api/login")
      .send({
        email: "this.is.wrong",
        password: "something",
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("Login with invalid password", () => {
    return request(app)
      .post("/api/login")
      .send({
        email: "prova_auth@test.it",
        password: "wrong",
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("Login with valid data", async () => {
    return request(app)
      .post("/api/login")
      .send({
        email: "prova_auth@test.it",
        password: "12345678",
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(200);
        jwt.verify(response.body.token, pubkey, (err, decoded) => {
          expect(err).toBeNull();
        });
      });
  });

});