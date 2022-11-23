"use strict";

const { env_var } = require("../env_var");

const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);



const dbOption = {
    host: env_var.DB_HOST,
    port: env_var.DB_PORT,
    database: env_var.DATABASE,
    user: env_var.DB_USER,
    password: env_var.DB_PW,
    
    multipleStatements: true    // 다중쿼리문 허용
}

console.log(dbOption)

const db = mysql.createConnection(dbOption);

let sessionStore = new MySQLStore(dbOption);

db.connect();

console.log("db 접속")

let db_keep = function(){
    db.query('SELECT 1', function(err){
        if(err) {
            console.log(err)
        }
    })
}
setInterval(db_keep, 10*1000)

module.exports = {
    db,
    sessionStore,
}