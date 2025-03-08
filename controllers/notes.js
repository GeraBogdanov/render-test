// const mariadb = require('mariadb');
const express = require('express');
const notesRouter = express.Router();

const db = require('./db');

notesRouter.post('/', async (req, res, next) => {
  let conn;
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
  }

  try {
    // conn = await pool.getConnection();
    // await conn.query('USE test');

    const sqlQuery = 'INSERT INTO notes (content, important) VALUES (?, ?)';
    const result = await db.pool.query(sqlQuery, [note.content, note.important]);
    const sqlQuery2 = 'SELECT * FROM notes WHERE id=?';
    const result2 = await db.pool.query(sqlQuery2, result.insertId);
    result2[0].important = Boolean(result2[0].important);
    res.status(201).json(result2);
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

notesRouter.get('/', async (req, res, next) => {
  let conn;
  try {
    const sqlQuery = 'SELECT * FROM notes';
    let result = await db.pool.query(sqlQuery);
    result = result.map((note) => {
      return { ...note, important: !!note.important };
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    // if (db.pool) db.pool.release();
  }
});

notesRouter.get('/:id', async (req, res, next) => {
  let conn;
  try {
    const sqlQuery = 'SELECT * FROM notes WHERE id=?';
    let result = await db.pool.query(sqlQuery, req.params.id);
    if (result.length > 0) result[0].important = !!result[0].important;
    res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    // if (db.pool) db.pool.release();
  }
});

notesRouter.delete('/:id', async (req, res, next) => {
  let conn;
  try {
    conn = await db.pool.getConnection();
    await conn.query('USE test');

    const sqlQuery = 'DELETE FROM notes WHERE id=?';
    let result = await conn.query(sqlQuery, req.params.id);
    if (result.affectedRows === 0) {
      res.status(200).send('note already deleted from the server');
    } else {
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

notesRouter.put('/:id', async (req, res, next) => {
  let conn;
  try {
    // conn = await pool.getConnection();
    // await conn.query('USE test');

    const sqlQuery = 'UPDATE notes SET important = !important WHERE id=?';
    let result = await db.pool.query(sqlQuery, req.params.id);
    console.log(result);
    if (result.affectedRows === 0) {
      res.status(200).send('note already deleted from the server');
    } else {
      const sqlQuery = 'SELECT * FROM notes WHERE id=?';
      let result = await db.pool.query(sqlQuery, req.params.id);
      if (result.length > 0) result[0].important = !!result[0].important;
      console.log(result);
      res.status(200).json(result[0]);
    }
  } catch (error) {
    next(error);
  } finally {
    // if (conn) conn.release();
  }
});

// find().then(() => {
//   pool.end();
// });

module.exports = notesRouter;
