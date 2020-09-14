const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host : 'localhost',
  user : 'root',
  password : 'qEAfs7WD40',
  database : 'workouts'
});

const dbname = 'workouts';

const selectQuery = "SELECT * FROM workouts;";
const selectOneQuery = "SELECT * FROM workouts WHERE id=?"
const insertQuery = "INSERT INTO workouts (`name`, `reps`, `weight`,`date`,`lbs`) VALUES (?,?,?,?,?);";
const deleteQuery = "DELETE FROM workouts WHERE id = (?);";
const dropQuery   = "DROP TABLE IF EXISTS workouts;";
const updateQuery = "UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?";
const createQuery = "CREATE TABLE workouts("+
"id INT PRIMARY KEY AUTO_INCREMENT,"+
"name VARCHAR(255) NOT NULL,"+
"reps INT,"+
"weight INT,"+
"date DATE,"+
"lbs BOOLEAN);";


module.exports.pool = pool;

module.exports.SELECT = selectQuery;
module.exports.SELONE = selectOneQuery;
module.exports.INSERT = insertQuery;
module.exports.DELETE = deleteQuery;
module.exports.DROP = dropQuery;
module.exports.UPDATE = updateQuery;
module.exports.CREATE = createQuery;
