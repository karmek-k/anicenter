const path = require('path');
const fs = require('fs');

const app = require('../../server');
const { File, User } = require('../../models/models');

const request = require('supertest')(app);
const jwt = require('jsonwebtoken');

describe('File upload tests', () => {
  const filePath = path.join(__dirname, './test_image.png');
  const kiciaJwt = jwt.sign({ username: 'kicia' }, process.env.SECRET_KEY);

  beforeEach(() => {
    File.sync();
    User.sync();

    User.create({
      username: 'kicia',
      password: 'miaumiau'
    });
  });

  afterEach(() => {
    File.drop();
    User.drop();

    // Delete the test file if it exists
    // Assumes that only the id 1 user uploads files
    const testFile = path.join(process.env.UPLOADS_PATH, '1', 'test_image.png');
    try {
      fs.statSync(testFile);
      fs.unlinkSync(testFile);
    }
    catch (e) {}
  });

  it('should receive a file and store it in the db', done => {
    request
      .post('/files/upload')
      .set('Authorization', 'Bearer ' + kiciaJwt)
      .field({ title: 'foo', description: 'baz' })
      .attach('upload', filePath)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.filename).toBe('test_image.png');
        done();
      });
  });

  it('should return 422 when no file is uploaded', done => {
    request
      .post('/files/upload')
      .set('Authorization', 'Bearer ' + kiciaJwt)
      .field({ title: 'foo', description: 'baz' })
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.files).toBeFalsy();
        done();
      });
  });
});