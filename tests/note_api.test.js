const { test, after, beforeEach } = require('node:test');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const assert = require('node:assert');
const db = require('../controllers/db');

const api = supertest(app);

beforeEach(async () => {
  let conn;
  try {
    conn = db.pool;
    await conn.query('TRUNCATE notes');
    await add_notes(conn, helper.initialNotes);
  } catch (err) {
    console.log(err);
  } finally {
    // if (conn) conn.close();
  }
});

const add_notes = async (conn, data) => {
  return conn.batch('INSERT INTO notes(content, important) VALUES(?,?)', data);
};

test.only('notes are reutrned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test.only('there are two notes', async () => {
  const response = await api.get('/api/notes');

  assert.strictEqual(response.body.length, 2);
});

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map((e) => e.content);
  assert.strictEqual(contents[0].includes('HTML is easy'), true);
});
// after(async () => {
//   await
// })
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await api.get('/api/notes');
  assert.strictEqual(notesAtEnd.body.length, helper.initialNotes.length + 1);

  const contents = notesAtEnd.body.map((r) => r.content);
  assert(contents.includes('async/await simplifies making async calls'));
});

test('note without content is not added', async () => {
  const newNote = {
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const response = await api.get('/api/notes');
  console.log(response.body);
  assert.strictEqual(response.body.length, helper.initialNotes.length);
});

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.deepStrictEqual(resultNote.body, noteToView);
});

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();

  const contents = notesAtEnd.map((r) => r.content);
  assert(!contents.includes(noteToDelete.content));

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
});
