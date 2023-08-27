const database = require('./database');

const view = (table, id) => {
    let sql = `SELECT * FROM \`${table}\`${id ? 'WHERE `id` = ?' : ''}`;
    database.sqlFunction(sql, id, `Successfully queried ${table}`, `Unable to pull ${table} records.`)
        .then(data => {
            console.table(data, ['id', 'name']);
        });
}

// // Pull department records, will pull all if not id supplied
// const viewDepartment = (id) => {
//     let sql = `SELECT * FROM \`department\`${id ? 'WHERE `id` = ?' : ''}`;
//     database.sqlFunction(sql, id, '', 'Unable to pull department records.')
//         .then(data => {
//             console.table(data, ['id', 'name']);
//             return `formatted table showing department names and department ids`
//         });
// }
// // Pull role records, will pull all if not id supplied
// const viewRole = (id) => {
//     let sql = 'SELECT * FROM `roles` WHERE `id` = ?;';
//     database.sqlFunction(sql, id, '', 'Unable to pull role records.');
//     return `formatted table showing department names and department ids`
// }
// // Pull employee records, will pull all if not id supplied
// const viewEmployee = (id) => {
//     let sql = 'SELECT * FROM `employee` WHERE `id` = ?;';
//     database.sqlFunction(sql, id, '', 'Unable to pull employee records.');
//     return `formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to`
// }

const addDepartment = (name) => {
    if (!name) { return 'No department name passed.'; }
    let sql = 'INSERT INTO `department` (name) VALUES (?);'
    database.sqlFunction(sql, name, '', `Unable to add ${name} department to table`)
        .then(data => {
            return `${name} added to department table.`
        })
        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(`${name} is already a department, try a new name.`);
            }
            else {
                console.error(error);
            }
        });
}

const addRole = () => {

}

const addEmployee = () => {

}

const updateRole = () => {

}

module.exports = { view, addDepartment, addRole, addEmployee, updateRole }