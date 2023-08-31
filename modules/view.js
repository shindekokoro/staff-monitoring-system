const sqlFunction = require('./database').sqlFunction;
const { printTable } = require('console-table-printer');

// View specified table and if there is an ID the specific entry.
const getTable = (table, id) => {
    let sql = `SELECT * FROM \`${table}\`${id ? 'WHERE `id` = ?' : ''}`;
    return sqlFunction(
        sql,
        id,
        `Successfully queried ${table}`,
        `Unable to pull '${table}' records.`
    );
}

const view = async (questions, answers) => {
    // Actions Switch
    switch (answers.action) {
        case 'departments':
            let viewDepartments = await getTable('department');
            let departmentsTable = viewDepartments.map((department) => {
                return {
                    'ID': department.id,
                    'Name': department.name,
                }
            })

            return printTable(departmentsTable)
        case 'roles':
            let viewRoles = await getTable('role');
            let roleDepartments = await getTable('department');
            let rolesTable = viewRoles.map((role) => {
                let currentDepartment = roleDepartments.find(department => department.id === role.department_id)
                return {
                    'ID': role.id,
                    'Title': role.title,
                    'Salary': role.salary,
                    'Department': currentDepartment.name
                }
            })
            return printTable(rolesTable)
        case 'employees':
            let viewEmployees = await getTable('employee');
            let employeeRoles = await getTable('role');
            let employeesTable = viewEmployees.map((employee) => {
                let currentRole = employeeRoles.find(role => role.id === employee.role_id);
                let currentManager = viewEmployees.find((manager) => {
                    if (employee.manager_id === manager.id) { return manager }
                    if (employee.manager_id === null) { return null }
                });
                let managerName = currentManager ? currentManager.first_name + ' ' + currentManager.last_name : 'none';
                return {
                    'ID': employee.id,
                    'First Name': employee.first_name,
                    'Last Name': employee.last_name,
                    'Department Role': currentRole.title,
                    'Manager': managerName
                }
            })
            return printTable(employeesTable)
        case 'employeeManager':
            console.log('Add Stuff Here');
            break;
        case 'goBack':
            return console.log('Going Back');
        default:
            throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`)
    }
}

module.exports = { view, getTable }