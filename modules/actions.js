const database = require('./database');

const formatName = (input) => {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

const view = (table, id) => {
    let sql = `SELECT * FROM \`${table}\`${id ? 'WHERE `id` = ?' : ''}`;
    return database.sqlFunction(
        sql,
        id,
        `Successfully queried ${table}`,
        `Unable to pull '${table}' records.`
    );
}

const getDepartmentsList = async () => {
    const departments = await view('department');
    const departmentList = departments.map(department => {
        return { name: department.name, value: department.id }
    })
    return departmentList;
}
const getRolesList = async () => {
    const roles = await view('role');
    const roleList = roles.map(role => {
        return { name: role.title, value: role.id }
    })
    return roleList;
}

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

const addEmployee = (first_name, last_name, role_id, manager_id) => {
    let sql = 'INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ? ,?);';
    database.sqlFunction(
        sql,
        [formatName(first_name), formatName(last_name), role_id, manager_id],
        `${first_name} ${last_name} added to employee table.`,
        `Unable to update employee.`
    );
}

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

module.exports = { view, getDepartmentsList, getRolesList, getEmployeesList, addDepartment, addRole, addEmployee, updateEmployeeRole }