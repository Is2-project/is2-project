const request = require("supertest");
const app = require("./app");
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const User = require('./models/user');
const Book = require('./models/book');

describe("Test books managment", () => {

  let token = undefined;

  beforeAll(async () => {
    const mongourl = process.env.MONGOTESTURL || require('./../secrets.json').mongodb_test_url;

    await mongoose.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await User.findOneAndDelete({ email: "prova_books@test.it" });
    
    await request(app)
      .post("/api/users")
      .send({
        email: "prova_books@test.it",
        password: "12345678",
        name: "name",
        surname: "surname",
        phone: "phone"
      });

    const response = await request(app)
      .post('/api/login')
      .send({
        email: "prova_books@test.it",
        password: "12345678"
      });

    token = "Bearer " + response.body.token;

  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: "prova_books@test.it" });
    await Book.findOneAndDelete({ isbn: 'test-isbn-test' });
    await mongoose.disconnect();
  })

  describe("Create book", () => {

    test("Create book as a non authenticated user", () => {
      return request(app)
        .post("/api/books")
        .send({
          isbn: 'isbn',
          title: "something",
          author: "author",
          genre: "genre",
          year:  0
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(401);
        });
    });

    test("Create book with an invalid year", () => {
      return request(app)
        .post("/api/books")
        .set('Authorization', token)
        .send({
          isbn: 'isbn',
          title: "something",
          author: "author",
          genre: "azione",
          year:  'Thi is invalid'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(400);
        });
    });

    test("Create book with an invalid genre", () => {
      return request(app)
        .post("/api/books")
        .set('Authorization', token)
        .send({
          isbn: 'isbn',
          title: "something",
          author: "author",
          genre: "invalid",
          year:  2020
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(400);
        });
    });

    test("Create book", () => {
      return request(app)
        .post("/api/books")
        .set('Authorization', token)
        .send({
          isbn: 'test-isbn-test',
          title: "something",
          author: "author",
          genre: "azione",
          year:  2020
        })
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.statusCode).toBe(201);
          expect(response.headers.location).toBe('/api/books/test-isbn-test');
        });
    });

    test("Create book that already exists", () => {
      return request(app)
        .post("/api/books")
        .set('Authorization', token)
        .send({
          isbn: 'test-isbn-test',
          title: "something",
          author: "author",
          genre: "azione",
          year:  2020
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(400);
        });
    });

  });

  describe("Get book info", () => {

    test("get a single book", () => {
      return request(app)
        .get("/api/books/test-isbn-test")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("get a book that does not exist", () => {
      return request(app)
        .get("/api/books/this-does-not-exists")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(404);
        });
    });

    test("Get all the books", () => {
      return request(app)
        .get("/api/books")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books", () => {
      return request(app)
        .get("/api/books")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books with filters", () => {
      return request(app)
        .get("/api/books")
        .query({
          title: 'someth',
          author: 'thor',
          genre: 'zion',
          from_year: 1999,
          to_year: 2050,
          from_rating: 0
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books with all filters except rating", () => {
      return request(app)
        .get("/api/books")
        .query({
          title: 'someth',
          author: 'thor',
          genre: 'zion',
          from_year: 1999,
          to_year: 2050,
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books with all filters except to_year", () => {
      return request(app)
        .get("/api/books")
        .query({
          title: 'someth',
          author: 'thor',
          genre: 'zion',
          from_year: 1999,
          rating: 0
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books with all filters except from_year", () => {
      return request(app)
        .get("/api/books")
        .query({
          title: 'someth',
          author: 'thor',
          genre: 'zion',
          to_year: 2050,
          rating: 0
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books with all filters except genre", () => {
      return request(app)
        .get("/api/books")
        .query({
          title: 'someth',
          author: 'thor',
          from_year: 1999,
          to_year: 2050,
          rating: 0
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books with all filters except author", () => {
      return request(app)
        .get("/api/books")
        .query({
          title: 'someth',
          genre: 'zion',
          from_year: 1999,
          to_year: 2050,
          rating: 0
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

    test("Get all the books with all filters except title", () => {
      return request(app)
        .get("/api/books")
        .query({
          author: 'thor',
          genre: 'zion',
          from_year: 1999,
          to_year: 2050,
          rating: 0
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });

  })

});