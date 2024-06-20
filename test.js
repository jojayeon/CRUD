const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`);
});

function createUser(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
}

function getAllUsers() {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(`${row.id}: ${row.name} - ${row.email}`);
    });
  });
}

function updateUser(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
}

function deleteUser(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted: ${this.changes}`);
  });
}

// 예시 호출
createUser('John Doe', 'john.doe@example.com');
createUser('John Doe', 'john.doe@example.com');
createUser('John Doe', 'john.doe@example.com');
getAllUsers();
updateUser(1, 'Jane Doe', 'jane.doe@example.com');
deleteUser(1);

// 데이터베이스 연결 닫기
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
