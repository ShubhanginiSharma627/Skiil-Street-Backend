import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from './index.js';  // Ensure this path matches the location of your server file

chai.use(chaiHttp);
const { expect } = chai;

describe('POST /notes', () => {
  it('should create a new note', (done) => {
    chai.request(app)
      .post('/notes')
      .send({ title: 'Test Note', content: 'This is a test note' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.title).to.equal('Test Note');
        done();
      });
  });
});
