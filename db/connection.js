const mysql = require("mysql2");

// Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password 
    password: 'Iguess10!',
    database: 'employeetracker_db'
  });

  module.exports = connection;
