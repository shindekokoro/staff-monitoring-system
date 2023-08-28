const database = require('./database');

// Format a string so the first letter of each word is capitalized.
const formatName = (input) => {
    let newString = input.split(' ');
    for (let i = 0; i < newString.length; i++) {
        newString[i] = newString[i].charAt(0).toUpperCase() + newString[i].slice(1).toLowerCase();
    }
    return newString.join(' ');
}
// View specified table and if there is an ID the specific entry.
const view = (table, id) => {
    let sql = `SELECT * FROM \`${table}\`${id ? 'WHERE `id` = ?' : ''}`;
    return database.sqlFunction(
        sql,
        id,
        `Successfully queried ${table}`,
        `Unable to pull '${table}' records.`
    );
}
// Return list of all Departments and their IDs
const getDepartmentsList = async () => {
    const departments = await view('department');
    const departmentList = departments.map(department => {
        return { name: department.name, value: department.id }
    })
    return departmentList;
}
// Return list of all Roles and their IDs
const getRolesList = async () => {
    const roles = await view('role');
    const roleList = roles.map(role => {
        return { name: role.title, value: role.id }
    })
    return roleList;
}
// Return list of Employees and their IDs
const getEmployeesList = async () => {
    const employees = await view('employee');
    if (!employees.length) {
        return [{ name: 'No Employees found, add some', value: -1 }];
    }
    const employeeList = employees.map(employee => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
    })
    return employeeList;
}
const getManagerList = async () => {
    let managerList = await getEmployeesList();
    managerList.push({ name: 'No Manager', value: null })
    return managerList;
}
// Add NEW department to department table
const addDepartment = (name) => {
    if (!name) { return 'No department name passed.'; }
    let sql = 'INSERT INTO `department` (name) VALUES (?);'
    database.sqlFunction(
        sql,
        formatName(name),
        `${name} added to department table.`,
        `Unable to add ${name} department to table.`
    );
}
// Add NEW role to role table, will catch error if title and department_id already exist
const addRole = (title, salary, department_id) => {
    if (!title) { return 'No role title passed.'; }
    let sql = 'INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?);';
    database.sqlFunction(
        sql,
        [formatName(title), salary, department_id],
        `${title} added to role table.`,
        `Unable to add '${title}' department to table.`
    )
        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY') {
                console.warn(`${title} is already a role in your selected department. Try a again, or try a new role.`);
            }
            else {
                console.error(`${error}`);
            }
        });
}
// Add employee to employee table
const addEmployee = (first_name, last_name, role_id, manager) => {
    let manager_id = manager === '' ? null : manager;
    let sql = 'INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ? ,?);';
    database.sqlFunction(
        sql,
        [formatName(first_name), formatName(last_name), role_id, manager_id],
        `${first_name} ${last_name} added to employee table.`,
        `Unable to update employee.`
    );
}
// Update role of employee.
const updateEmployeeRole = (employee_id, role_id) => {
    if (!employee_id || !role_id) { return 'Needed IDs not provided, please try again'; }
    let sql = 'UPDATE `employee` SET `role_id` = ? WHERE `id` = ?';
    database.sqlFunction(
        sql,
        [role_id, employee_id],
        `Successfully updated employee's role.`,
        `Unable to update employee`
    );
}

module.exports = { view, getDepartmentsList, getRolesList, getEmployeesList, getManagerList, addDepartment, addRole, addEmployee, updateEmployeeRole }