const config = require('../config/config.json')
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

const seedSql = fs.readFileSync(path.join(__dirname, '../static/database.sql')).toString();

const smsDB = mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true
});

function startDB() {
    sqlFunction(seedSql, null, 'Database tables loaded/created successfully', 'Unable to load database tables.');
}

const sqlFunction = (sql, data, logSuccess, logError) => {
    return new Promise((resolve, reject) => {
        smsDB.query(sql, data, function (error, result, fields) {
            if (error) {
                console.error(logError);
                reject(error)
            }
            console.log(logSuccess);
            resolve(result);
        });
    });
}

startDB()

module.exports = { sqlFunction };