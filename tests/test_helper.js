const db = require('../controllers/db');

const initialNotes = [
  ['HTML is easy', false],
  ['Browser can execute only JavaScript', true],
];

// const nonExistingId = async () => {
//   const note = new Note({ content: 'willremovethissoon' })
//   await note.save()
//   await note.deleteOne()

//   return note._id.toString()
// }

const notesInDb = async () => {
  const sqlQuery = 'SELECT * FROM notes';
  let result = await db.pool.query(sqlQuery);
  result = result.map((note) => {
    return { ...note, important: !!note.important };
  });
  return result;
};

module.exports = {
  initialNotes,
  notesInDb,
};
