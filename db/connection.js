require('dotenv').config();
const mysql = require('mysql2');

const connectDB = mysql.createConnection({
    host: process.env.LOCAL_HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    insecureAuth : true
}) ;

connectDB.connect((err)=>{
    if (err) throw err;
    console.log("Connected!");
  });

module.exports = connectDB;