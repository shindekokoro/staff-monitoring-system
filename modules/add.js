const sqlFunction = require('./database').sqlFunction;

// Format a string so the first letter of each word is capitalized.
const formatName = (input) => {
    let newString = input.split(' ');
    for (let i = 0; i < newString.length; i++) {
        newString[i] = newString[i].charAt(0).toUpperCase() + newString[i].slice(1).toLowerCase();
    }
    return newString.join(' ');
}

const add = async (questions, answers) => {
    // Actions Switch
    switch (answers.action) {
        case 'department':
            return await questions.inquirer
                .prompt(questions.addDepartment)
                .then((department) => {
                    addDepartment(department.departmentName);
                });
        case 'role':
            return await questions.inquirer
                .prompt(questions.addRole)
                .then((role) => {
                    let salary = parseFloat(role.salary).toFixed(2);
                    let department_id = parseInt(role.department_id);
                    addRole(role.roleName, salary, department_id);
                });
        case 'employee':
            return await questions.inquirer
                .prompt(questions.addEmployee)
                .then((employee) => {
                    addEmployee(employee.first_name, employee.last_name, employee.role_id, employee.manager_id);
                });
        case 'goBack':
            return config.logging.enabled ? console.log('Going Back') : '';
        default:
            throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`)
    }
}

// Add values to specified table
// success and error logging.
const addToTable = async (table, values) => {
    let sql, logSuccess, logError;

    switch (table) {
        case 'department':
            sql = 'INSERT INTO `department` (name) VALUES (?);';
            logSuccess = `New added to department table.`;
            logError = `Unable to add new department to table.`;
            break;
        case 'role':
            sql = 'INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?);';
            logSuccess = `New role added to table.`;
            logError = `Unable to add new role to table.`;
            break;
        case 'employee':
            sql = 'INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ? ,?);';
            logSuccess = `Person added to employee table.`;
            logError = `Unable to add new employee.`;
            break;
        default:
            return `Invalid table: ${table}`
    }

    sqlFunction(sql, values, logSuccess, logError)
        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY') {
                return `Entry is already in ${table}. Try a again.`;
            } else {
                return eMessage + error;
            }
        });
}
const addDepartment = (name) => {
    if (!name) { return 'No department name passed.'; }
    let values = [formatName(name)]
    return addToTable('department', values)
}
const addRole = (title, salary, department_id) => {
    if (!title) { return 'No role title passed.'; }
    let values = [formatName(title), salary, department_id];
    return addToTable('role', values);
}
const addEmployee = (first_name, last_name, role_id, manager) => {
    let manager_id = manager === '' ? null : manager;
    let values = [formatName(first_name), formatName(last_name), role_id, manager_id]
    return addToTable('employee', values);
}

module.exports = { add, addDepartment, addRole, addEmployee }