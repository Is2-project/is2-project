const request = require("supertest");
const app = require("./app");
const mongoose = require('mongoose');

const User = require('./models/user');

describe("Test user managment", () => {

  beforeAll(async () => {
    const mongourl = process.env.MONGOTESTURL || require('./../secrets.json').mongodb_test_url;

    await mongoose.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await User.findOneAndDelete({ email: "prova_users@test.it" });

  });

  afterAll(async () => {

    await User.findOneAndDelete({ email: "prova_users@test.it" });

    await mongoose.disconnect();
  })

  let user_location = undefined;

  describe("Create user", () => {

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
          email: "prova_users@test.it",
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
          email: "prova_users@test.it",
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
          email: "prova_users@test.it",
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
  
    test("Create user with valid parameters", () => {
      return request(app)
        .post("/api/users")
        .send({
          email: "prova_users@test.it",
          password: "password",
          name: "name",
          surname: "surname",
          phone: "phone"
        })
        .set('Accept', 'application/json')
        .then(response => {
          user_location = response.headers.location;
          expect(response.statusCode).toBe(201);
        });
    });
  
    test("Create user with an already used email address", () => {
      return request(app)
        .post("/api/users")
        .send({
          email: "prova_users@test.it",
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

  });

  describe("Info about users", () => {

    test("Get info about existent user", () => {
      return request(app)
        .get(user_location)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });
  
    test("Get info about non existent user", () => {
      return request(app)
        .get('/api/users/5fc618bdc2a46667fbaebaf9')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(404);
        });
    });

    test("Get info about user with invalid id", () => {
      return request(app)
        .get('/api/users/-2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(500);
        });
    });

  });

  describe("Update user info", () => {

    test("Update user info as a non authenticated user", () => {
      return request(app)
        .put(user_location)
        .send({
          phone: "12345678"
        })
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.statusCode).toBe(401);
        });
    });

    test("Update user info as a authenticated user", async () => {

      response = await request(app)
        .post('/api/login')
        .send({
          email: "prova_users@test.it",
          password: "password"
        });

      const token = "Bearer " + response.body.token;

      response = await request(app)
      .put(user_location)
      .set('Authorization', token)
      .send({
        phone: "12345678"
      })
      .set('Accept', 'application/json')

      expect(response.statusCode).toBe(200);

    });

    test("Update another user's info", async () => {

      //login
      response = await request(app)
        .post('/api/login')
        .send({
          email: "prova_users@test.it",
          password: "password"
        });

      const token = "Bearer " + response.body.token;

      //create a new user
      response = await request(app)
      .post("/api/users")
      .send({
        email: "prova_users_2@test.it",
        password: "password",
        name: "name",
        surname: "surname",
        phone: "phone"
      });

      const other_user_location = response.headers.location;

      response = await request(app)
      .put(other_user_location)
      .set('Authorization', token)
      .send({
        phone: "12345678"
      })
      .set('Accept', 'application/json')

      expect(response.statusCode).toBe(401);

      //DELETE TMP USER
      await User.findOneAndDelete({email: "prova_users_2@test.it"}).exec();
      
    });
  
  });

});