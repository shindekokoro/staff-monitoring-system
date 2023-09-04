/* eslint-disable no-unused-vars */
const config = require('../config/config.json');
const mysql = require('mysql2');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

colors.enable();

// Create connection to SQL DB
const smsDB = mysql.createConnection({
	host: config.db.host,
	port: config.db.port,
	user: config.db.username,
	password: config.db.password,
	database: config.db.database,
	multipleStatements: true
});
// Declare SeedSQL data in case database is empty.
const seedSql = fs.readFileSync(path.join(__dirname, '../static/database.sql')).toString();
const startDB = () =>  {
	sqlFunction(seedSql, null, 'Database tables loaded/created successfully', 'Unable to load database tables.');
};
// Custom SQL Function, takes SQL, it's values along with logging for success and errors
const sqlFunction = async (sql, values, logSuccess, logError) => {
	return new Promise((resolve, reject) => {
		config.logging.enabled ? console.log('The query is: ' + sql) : '';
		config.logging.enabled ? console.log('The values are: ' + values) : '';
		smsDB.query(sql, values, function (error, result, fields) {
			if (error) {
				if (error.code === 'ER_NO_SUCH_TABLE') {
					startDB();
					return reject('Selected table doesn\'t exist. (re)Creating tables if they don\'t exist.'.yellow);
				}
				console.error(`\n${logError}`.red);
				return reject(error);
			}
			config.logging.enabled ? console.log(logSuccess) : '';
			return resolve(result);
		});
	});
};

startDB();

module.exports = { sqlFunction };