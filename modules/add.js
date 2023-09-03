const { printTable } = require('console-table-printer');
const sqlFunction = require('./database').sqlFunction;
const actions = require('./view')

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
                    return addDepartment(department.departmentName);
                });
        case 'role':
            return await questions.inquirer
                .prompt(questions.addRole)
                .then((role) => {
                    let salary = parseFloat(role.salary).toFixed(2);
                    let department_id = parseInt(role.department_id);
                    // If salary less than $1000 assume that number entered is hourly rate and convert to a yearly salary
                    if (salary < 1000) {
                        let weeklyHours = 40;
                        let totalWeeks = 52;
                        salary = salary * weeklyHours * totalWeeks;
                    }
                    return addRole(role.roleName, salary, department_id);
                });
        case 'employee':
            return await questions.inquirer
                .prompt(questions.addEmployee)
                .then((employee) => {
                    return addEmployee(employee.first_name, employee.last_name, employee.role_id, employee.manager_id);
                });
        case 'goBack':
            return console.log('Going Back');
        default:
            throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`);
    }
}

// Add values to specified table
// success and error logging.
const addToTable = async (table, values) => {
    let sql, logSuccess, logError;

    switch (table) {
        case 'department':
            sql = 'INSERT INTO `department` (name) VALUES (?);';
            logSuccess = [{ 'Department': values[0] }]
            // logSuccess = `New department added to table.`;
            logError = `Unable to add new department to table.`;
            break;
        case 'role':
            sql = 'INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?);';
            let department = await actions.getTable('department', 'id', values[2]);
            logSuccess = [{ 'Role Title': values[0], 'Salary': values[1], 'Department': department[0].name }]
            // logSuccess = `New role added to table.`;
            logError = `Unable to add new role to table.`;
            break;
        case 'employee':
            sql = 'INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';
            let role = await actions.getTable('role', 'id', values[2]);
            let manager = values[3] ? await actions.getTable('employee', 'id', values[3]) : [{ first_name: null }];
            logSuccess = [{ 'First Name': values[0], 'Last Name': values[1], 'Title': role[0].title, 'Manager': `${manager[0].first_name} ${manager[0].last_name}` }];
            // logSuccess = `Person added to employee table.`;
            logError = `Unable to add new employee.`;
            break;
        default:
            return `Invalid table: ${table}`
    }

    return await sqlFunction(sql, values, logSuccess, logError)
        .then(() => {
            return printTable(logSuccess);
        })
        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY') {
                return `Entry is already in ${table}. Try a again.`;
            } else {
                return logError + error;
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