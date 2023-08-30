const sqlFunction = require('./database').sqlFunction;

// Format a string so the first letter of each word is capitalized.
const formatName = (input) => {
    let newString = input.split(' ');
    for (let i = 0; i < newString.length; i++) {
        newString[i] = newString[i].charAt(0).toUpperCase() + newString[i].slice(1).toLowerCase();
    }
    return newString.join(' ');
}
// View specified table and if there is an ID the specific entry.
const viewTable = (table, id) => {
    let sql = `SELECT * FROM \`${table}\`${id ? 'WHERE `id` = ?' : ''}`;
    return sqlFunction(
        sql,
        id,
        `Successfully queried ${table}`,
        `Unable to pull '${table}' records.`
    );
}
// Return a list of items and their IDs based on the specified table and table map.
const getListWithIDs = async (table, tableMap, nullMessage) => {
    const staff = await viewTable(table);
    if (!staff.length) {
        return [{ name: nullMessage, value: -1 }];
    }
    return staff.map(tableMap);
};
const getDepartmentsList = () => {
    const tableMap = department => ({ name: department.name, value: department.id });
    return getListWithIDs('department', tableMap, 'No departments, add one first.');
};
const getRolesList = () => {
    const tableMap = role => ({ name: role.title, value: role.id });
    return getListWithIDs('role', tableMap, 'No department roles, add some.');
};
const getEmployeesList = () => {
    const tableMap = employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id });
    return getListWithIDs('employee', tableMap, 'No employees found, add some');
};
const getManagerList = async () => {
    const managerList = await getEmployeesList();
    managerList.push({ name: 'No Manager', value: null });
    return managerList;
};

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
// Update role of employee.
const updateEmployeeRole = (employee_id, role_id) => {
    if (!employee_id || !role_id) { return 'Needed IDs not provided, please try again'; }
    let sql = 'UPDATE `employee` SET `role_id` = ? WHERE `id` = ?';
    sqlFunction(
        sql,
        [role_id, employee_id],
        `Successfully updated employee's role.`,
        `Unable to update employee`
    );
}
// Update manager of employee.
const updateEmployeeManager = (employee_id, manager_id) => {
    if (!employee_id) { return 'Needed IDs not provided, please try again'; }
    console.log(employee_id + manager_id);
    let sql = 'UPDATE `employee` SET `manager_id` = ? WHERE `id` = ?';
    sqlFunction(
        sql,
        [manager_id, employee_id],
        `Successfully updated employee's role.`,
        `Unable to update employee`
    );
}

module.exports = {
    viewTable,
    getDepartmentsList, getRolesList, getEmployeesList, getManagerList,
    addDepartment, addRole, addEmployee,
    updateEmployeeRole, updateEmployeeManager
}