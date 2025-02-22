const mysql = require("mysql2");

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'fluencytcc'
});

db.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      process.exit(1);
    }
    console.log('Conectado ao banco de dados.');
  });
  
  module.exports = db;