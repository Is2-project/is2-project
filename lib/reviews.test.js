const request = require("supertest");
const app = require("./app");
const mongoose = require('mongoose');

const Review = require('./models/review');
const User = require('./models/user');
const Book = require('./models/book');

describe("Test reviews managment", () => {

  let token;
  let user;

  beforeAll(async () => {
    const mongourl = process.env.MONGOTESTURL || require('./../secrets.json').mongodb_test_url;

    await mongoose.connect(mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await User.findOneAndDelete({ email: "prova_reviews@test.it" });
    
    response = await request(app)
      .post("/api/users")
      .send({
        email: "prova_reviews@test.it",
        password: "12345678",
        name: "name",
        surname: "surname",
        phone: "phone"
      });

    user = response.headers.location.split('/')[3]

    response = await request(app)
      .post('/api/login')
      .send({
        email: "prova_reviews@test.it",
        password: "12345678"
      });

    token = "Bearer " + response.body.token;

    await request(app)
    .post('/api/books')
    .set('Authorization', token)
    .send({
        isbn: 'reviews-test-book',
        title: "something",
        author: "author",
        genre: "azione",
        year:  2020
    })

  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: "prova_reviews@test.it" });
    await Book.findOneAndDelete({ isbn: 'reviews-test-book' });
    await mongoose.disconnect();
  })

  let review_location;

  describe("Create a review", () => {

    test("Create a review as a non authenticated user", () => {
      return request(app)
        .post("/api/books/reviews-test-book/reviews")
        .send({
          description: "review description",
          rating: 5
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.statusCode).toBe(401);
        });
    });

    test("Create a review as a authenticated user", () => {
        return request(app)
          .post("/api/books/reviews-test-book/reviews")
          .set('Authorization', token)
          .send({
            description: "review description",
            rating: 5
          })
          .set('Accept', 'application/json')
          .then(response => {
            expect(response.statusCode).toBe(201);
            review_location = response.headers.location;
          });
    });

    test("Create a duplicated review", () => {
        return request(app)
        .post("/api/books/reviews-test-book/reviews")
        .set('Authorization', token)
        .send({
            description: "review description",
            rating: 5
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
        expect(response.statusCode).toBe(400);
        });
    });

    test("Create a review on a book that does not exists", () => {
        return request(app)
        .post("/api/books/does-not-exists/reviews")
        .set('Authorization', token)
        .send({
            description: "review description",
            rating: 5
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
        expect(response.statusCode).toBe(404);
        });
    });

  });

  describe("Get info about reviews", () => {

    test("Get a review that does not exists", () => {
        return request(app)
        .get("/api/reviews/5fc64be7ed5c73f1e0f1af01")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(404);
        });
    });

    test("Get a review that does exists", () => {
        return request(app)
        .get(review_location)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(200);
        });
    });

    test("Get reviews of a user", () => {
        return request(app)
        .get('/api/users/' + user + '/reviews')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(200);
        });
    });

    test("Get reviews of a non existent user", () => {
        return request(app)
        .get('/api/users/5fc65219ccf2aafea2e42fc1/reviews')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(404);
        });
    });

    test("Get reviews of a book", () => {
        return request(app)
        .get('/api/books/reviews-test-book/reviews')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(200);
        });
    });

    test("Get reviews of a non existent book", () => {
        return request(app)
        .get('/api/books/does-not-exist/reviews')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(404);
        });
    });

  });

  describe("Update reviews", () => {
    
    test("Update a review as a non authenticated user", () => {
        return request(app)
        .put(review_location)
        .send({
            rating: 3
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(401);
        });
    });

    test("Update a review as a authenticated user", () => {
        return request(app)
        .put(review_location)
        .set('Authorization', token)
        .send({
            rating: 3
        })
        .set('Accept', 'application/json')
        .then(response => {
            expect(response.statusCode).toBe(200);
        });
    });

    test("Update a non existent review", () => {
        return request(app)
        .put('/api/reviews/5fc64be7ed5c73f1e0f1af01')
        .set('Authorization', token)
        .send({
            rating: 3
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(404);
        });
    });

  });

  describe("Delete reviews", () => {

    test("Delete a non existent review", () => {
        return request(app)
        .delete('/api/reviews/5fc64be7ed5c73f1e0f1af01')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(404);
        });
    });

    test("Delete a review as a non authenticated user", () => {
        return request(app)
        .delete(review_location)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.statusCode).toBe(401);
        });
    });

    test("Delete an other user's review", async () => {

        //create a user
        response = await request(app)
        .post("/api/users")
        .send({
          email: "prova_reviews_2@test.it",
          password: "12345678",
          name: "name",
          surname: "surname",
          phone: "phone"
        });
    
        response = await request(app)
        .post('/api/login')
        .send({
            email: "prova_reviews_2@test.it",
            password: "12345678"
        });
    
        const tmp_token = "Bearer " + response.body.token;

        await request(app)
        .delete(review_location)
        .set('Authorization', tmp_token)
        .set('Accept', 'application/json')
        .then(response => {
            expect(response.statusCode).toBe(401);
        });

        //delete the user
        await User.findOneAndDelete({email: 'prova_reviews_2@test.it'}).exec();

    });

    test("Delete a review as a authenticated user", () => {
        return request(app)
        .delete(review_location)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .then(response => {
            expect(response.statusCode).toBe(200);
        });
    });

  })

});