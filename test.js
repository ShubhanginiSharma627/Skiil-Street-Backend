import request from 'supertest';
import app from './index.js'; // Ensure this is the correct path to your Express app
import mongoose from 'mongoose';

describe('API Tests', function () {
  let testNoteId;  // This will hold the id of the note created for testing purposes

  // Close the DB connection after the tests are done
  after(async () => {
    await mongoose.connection.close();
  });

  describe('Authentication', () => {
    it('should require basic authentication', done => {
      request(app)
        .get('/notes')
        .expect(401, done);
    });

    // Add more tests for authentication if necessary
  });

  describe('GET /notes', () => {
    it('should return all notes', done => {
      request(app)
        .get('/notes')
        .auth('admin', 'password') // Use your basic auth credentials
        .expect(200)
        .expect(response => {
          // Add more detailed tests on response if necessary
          console.log(response.body); // Log the response for debugging
        })
        .end(done);
    });
  });

  describe('POST /notes', () => {
    it('should create a new note', done => {
      request(app)
        .post('/notes')
        .auth('admin', 'password')
        .send({
          title: 'Test Note',
          content: 'This is a test note',
        })
        .expect(201, done);
    });

    it('should not create a note with invalid data', done => {
      request(app)
        .post('/notes')
        .auth('admin', 'password')
        .send({
          // Send invalid data
        })
        .expect(400, done);
    });
  });

  // Before any tests run, create a note to test GET, PUT, DELETE
  before(done => {
    request(app)
      .post('/notes')
      .auth('admin', 'password') // Use your basic auth credentials
      .send({
        title: 'Test Note for Specific Operations',
        content: 'This note is specifically created for testing individual note operations.',
      })
      .end((err, response) => {
        testNoteId = response.body._id; // Adjust depending on the structure of your response
        done();
      });
  });

  // GET /notes/:id - Retrieve a specific note
  describe('GET /notes/:id', () => {
    it('should retrieve the specific note with given id', done => {
      request(app)
        .get(`/notes/${testNoteId}`)
        .auth('admin', 'password')
        .expect(200)
        .expect(response => {
          // Add assertions to ensure the response has the correct note data
        })
        .end(done);
    });

    it('should return 404 for a non-existent note id', done => {
      request(app)
        .get('/notes/nonExistentId')
        .auth('admin', 'password')
        .expect(404, done);
    });
  });

  // PUT /notes/:id - Update a specific note
  describe('PUT /notes/:id', () => {
    it('should update the specific note with given id', done => {
      request(app)
        .put(`/notes/${testNoteId}`)
        .auth('admin', 'password')
        .send({
          title: 'Updated Test Note',
          content: 'This note has been updated during testing.',
        })
        .expect(200)
        .expect(response => {
          // Add assertions to ensure the note was updated
        })
        .end(done);
    });

    it('should return 400 for a non-existent note id', done => {
      request(app)
        .put('/notes/nonExistentId')
        .auth('admin', 'password')
        .send({
          title: 'Updated Test Note',
          content: 'This note has been updated during testing.',
        })
        .expect(400, done);
    });
  });

  // DELETE /notes/:id - Delete a specific note
  describe('DELETE /notes/:id', () => {
    it('should delete the specific note with given id', done => {
      request(app)
        .delete(`/notes/${testNoteId}`)
        .auth('admin', 'password')
        .expect(200)
        .end(done);
    });

    it('should return 500 for a non-existent note id', done => {
      request(app)
        .delete('/notes/nonExistentId')
        .auth('admin', 'password')
        .expect(500, done);
    });
  });



});

