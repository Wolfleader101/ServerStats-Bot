const mysql = require("mysql");

const pool = mysql.createPool({
  user: "root",
  password: "bOpQ%g8642Vd",
  host: "localhost",
  database: "discordbot",
  charset : 'utf8mb4'
});

exports.getConnection = function (callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    callback(err, conn);
  });
};

exports.closeConnection = function (callback) {
  pool.end(function (err) {
    if (err) {
      return callback(err)
    }
  })
}