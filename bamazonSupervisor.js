const ask    = require('inquirer');
const mysql  = require('mysql');
const cTable = require('console.table');

const conCon = {
    host: `127.0.0.1`,
    port: `3306`,
    user: `root`,
    password: ``,
    database: `bamazon`,
    multipleStatements: true
};

const con = mysql.createConnection(conCon);

con.query("SELECT department_name, SUM(product_sales) AS sum FROM products AS db1 GROUP BY department_name",(err,res)=>{
    console.log(res);
    con.end();

}); 