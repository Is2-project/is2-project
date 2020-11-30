const request = require("supertest");
const app = require("./app");

describe("Test user managment", () => {

  test("Create user with empty or invalid email", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "this.is.wrong",
        password: "something",
        name: "something",
        surname: "something",
        phone: "something"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("Create user with empty password", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "prova@test.it",
        password: "",
        name: "something",
        surname: "something",
        phone: "something"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("Create user with empty name", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "prova@test.it",
        password: "password",
        name: "",
        surname: "something",
        phone: "something"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("Create user with empty surname", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "prova@test.it",
        password: "password",
        name: "name",
        surname: "",
        phone: "something"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  let userLocation = undefined;

  test("Create user with empty phone number", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "prova@test.it",
        password: "password",
        name: "name",
        surname: "surname",
        phone: ""
      })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(201);
      });
  });

  test("Create user with an already used email address", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "prova@test.it",
        password: "password",
        name: "name",
        surname: "surname",
        phone: "phone"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("Create user with an already used email address", () => {
    return request(app)
      .post("/api/users")
      .send({
        email: "prova@test.it",
        password: "password",
        name: "name",
        surname: "surname",
        phone: "phone"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("Get info about existent user", () => {
    return request(app)
      .get('/api/users/0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test("Get info about non existent user", () => {
    return request(app)
      .get('/api/users/-1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

});