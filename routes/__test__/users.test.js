const app = require('../../server');

const request = require('supertest')(app);
const jwt = require('jsonwebtoken');

const { User } = require('../../models/models');

describe('User register tests', () => {
  beforeAll(() => {
    User.sync();
  });

  afterEach(() => {
    User.drop();
  });

  it('should create a new user with valid data', done => {
    request
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
    request
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
  beforeEach(() => {
    User.sync();

    // Create fake user accounts
    User.create({
      username: 'kicia',
      password: 'miaumiau'
    });

    User.create({
      username: 'mia',
      password: 'hauhau'
    });
  });

  afterEach(() => {
    User.drop();
  });

  it('should list all users', done => {
    request
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
    request
      .get('/users/list')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body[0]).toEqual(
          expect.not.objectContaining({ password: expect.any(String) })
        );
        done();
      })
  });

  it('should get info about one user', done => {
    request
      .get('/users/retrieve/1')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.name).toBeFalsy();
        expect(res.body.id).toBe(1);
        expect(res.body.username).toBe('kicia');
        expect(res.body.username).not.toBe('mia');
        done();
      })
  });
});

describe('User update tests', () => {
  let kiciaJwt, miaJwt;

  beforeAll(() => {
    // Sign a JWT
    kiciaJwt = jwt.sign({ username: 'kicia' }, process.env.SECRET_KEY).trim();
    miaJwt = jwt.sign({ username: 'mia' }, process.env.SECRET_KEY).trim();
  });

  beforeEach(() => {
    User.sync();

    // Create fake user accounts
    User.create({
      username: 'kicia',
      password: 'miaumiau'
    });

    User.create({
      username: 'mia',
      password: 'hauhau',
      isAdmin: true
    });
  });

  afterEach(() => {
    User.drop();
  });

  it('should update user data', done => {
    request
      .put('/users/update/1')
      .send({ username: 'stefan', password: 'miaumiau' })
      .set('Authorization', 'Bearer ' + kiciaJwt)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.updated).toBeTruthy();
        done();
      });
  });

  it('should not allow editing other users\' data', done => {
    request
      .put('/users/update/2')
      .send({ username: 'mia', password: 'hauhau' })
      .set('Authorization', 'Bearer ' + kiciaJwt)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.updated).toBeFalsy();
        done();
      });
  });

  it('should allow admins to edit any account', done => {
    request
      .put('/users/update/1')
      .send({ username: 'stefan', password: '12345' })
      .set('Authorization', 'Bearer ' + miaJwt)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.updated).toBeTruthy();
        done();
      });
  });

  it('should allow admins to edit their own accounts', done => {
    request
      .put('/users/update/2')
      .send({ username: 'stefan', password: '12345' })
      .set('Authorization', 'Bearer ' + miaJwt)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.updated).toBeTruthy();
        done();
      });
  })
});

// TODO:
// DELETE
// Obtaining a JWT