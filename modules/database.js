const config = require('../config/config.json')
const mysql = require('mysql2');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

colors.enable();

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

const sqlFunction = async (sql, values, logSuccess, logError) => {
    return new Promise((resolve, reject) => {
        config.logging.enabled ? console.log('The query is: ' + sql) : '';
        config.logging.enabled ? console.log('The values are: ' + values) : '';
        smsDB.query(sql, values, function (error, result, fields) {
            if (error) {
                console.error(`\n${logError}`.red);
                reject(error)
            }
            // console.log(logSuccess);
            return resolve(result)
        });
    });
}

startDB()

module.exports = { sqlFunction };