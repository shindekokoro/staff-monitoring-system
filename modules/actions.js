const database = require('./database');

// Pull department records, will pull all if not id supplied
const viewDepartment = (id = '*') => {
    let sql = 'SELECT * FROM `department` WHERE `id` = ?';
    database.sqlFunction(sql, id, '', 'Unable to pull department records')
        .then(data => {
            console.log(data);
            return `formatted table showing department names and department ids`
        })

}

// Pull role records, will pull all if not id supplied
const viewRole = (id = '*') => {
    let sql = 'SELECT * FROM `roles` WHERE `id` = ?';
    database.sqlFunction(sql, id, '', 'Unable to pull role records')
    return `formatted table showing department names and department ids`
}

// Pull employee records, will pull all if not id supplied
const viewEmployee = (id = '*') => {
    let sql = 'SELECT * FROM `employee` WHERE `id` = ?';
    return `formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to`
}

const addDepartment = () => {

}

const addRole = () => {

}

const addEmployee = () => {

}

const updateRole = () => {

}

module.exports = { viewDepartment, viewRole, viewEmployee, addDepartment, addRole, addEmployee, updateRole }