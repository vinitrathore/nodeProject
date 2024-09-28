import mysql from "mysql";

const con = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.MY_DB
})
const q_db= `CREATE DATABASE IF NOT EXISTS ${process.env.MY_DB}`;
con.query(q_db,(err,result)=>{
    if(err) throw err;
    console.log(` ${process.env.MY_DB} database create successfully..`)
})

const q_table = `CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
  )`;
  
  con.query(q_table, (err, result) => {
    if (err) throw err;
    console.log('USER Table created successfully..');
  });
  

export default con;