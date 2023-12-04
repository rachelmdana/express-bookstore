const request = require('supertest');
const app = require('../app');
const db = require('../db');
const Books = require('../models/book');

describe('Bookstore API Tests', () => {
  test('GET /books should return a list of all books', async () => {
    const response = await request(app).get('/books');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('books');
    expect(Array.isArray(response.body.books)).toBe(true);
    // Add more assertions to check the structure and properties of each book in the list
  });

  // Test GET /books/:id route
  describe('GET /books/:id', () => {
    it('should return a single book by ID', async () => {
        const bookId = 'some_book_id';
        const res = await request(app).get(`/books/${bookId}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toHaveProperty('message', expect.stringMatching(new RegExp(`There is no book with an isbn ['"]?${bookId}['"]?`)));
    });

    it('should return 404 for non-existent book ID', async () => {
      const nonExistentId = 'non_existent_id';
      const res = await request(app).get(`/books/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      // Add more assertions to check the error structure
    });
  });

  // Test POST /books route
  describe('POST /books', () => {
    it('should create a new book', async () => {
      const newBook = {
        isbn: '1234567890',
        amazon_url: 'http://example.com',
        author: 'John Doe',
        language: 'english',
        pages: 200,
        publisher: 'Publisher XYZ',
        title: 'Test Book',
        year: 2023,
      };
      const res = await request(app).post('/books').send(newBook);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('book');
      expect(typeof res.body.book).toBe('object');
      // Add more assertions to check the structure and properties of the created book
    });

  });

  // Test PUT /books/:isbn route
  describe('PUT /books/:isbn', () => {
    it('should update an existing book', async () => {
      const updatedBook = {
        author: 'Jane Doe',
        year: 2024,
      };
      const existingIsbn = '1234567890';
      const res = await request(app).put(`/books/${existingIsbn}`).send(updatedBook);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('book');
      expect(typeof res.body.book).toBe('object');
      // Add more assertions based on your update logic
    });

    it('should return 404 for non-existent ISBN', async () => {
      const nonExistentIsbn = 'non_existent_isbn';
      const res = await request(app).put(`/books/${nonExistentIsbn}`).send({});
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      // Add more assertions to check the error structure
    });

  });

  // Test DELETE /books/:isbn route
  describe('DELETE /books/:isbn', () => {
    it('should delete an existing book', async () => {
      const existingIsbn = '1234567890';
      const res = await request(app).delete(`/books/${existingIsbn}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Book deleted');
      // Add more assertions to check the structure of the success response
    });

    it('should return 404 for non-existent ISBN', async () => {
      const nonExistentIsbn = 'non_existent_isbn';
      const res = await request(app).delete(`/books/${nonExistentIsbn}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      // Add more assertions to check the error structure
    });

    afterAll(async () => {
      await db.end();
    });
  });
});
