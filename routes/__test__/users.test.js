const request = require('supertest');

const app = require('../../server');

describe('User register tests', () => {
  it('should create a new user with valid data', done => {
    request(app)
      .post('/users/register')
      .send({ username: 'kicia', password: 'miaumiau' })
      //.set('Accept', 'application/json')
      //.expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.username).toBe('kicia');
        done();
      });
  });

  it('should fail when creating a user with invalid data', done => {
    request(app)
      .post('/users/register')
      .send({ username: 'd', password: '' })
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toEqual({
          errors: expect.any(Array)
        });
        done();
      })
  });
});

describe('User fetch tests', () => {
  it('should list all users', done => {
    request(app)
      .get('/users/list')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body[0]).toEqual({
          id: expect.any(Number),
          username: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
        done();
      });
  });

  it('should not list users\' passwords', done => {
    request(app)
      .get('/users/list')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body[0]).toEqual(expect.not.objectContaining({ password: expect.any(String) }));
        done();
      })
  });
});