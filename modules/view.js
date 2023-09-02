const sqlFunction = require('./database').sqlFunction;
const { printTable } = require('console-table-printer');

// View specified table and if there is an ID the specific entry.
const getTable = (table, column, id) => {
    let where = '';
    if (column) {
        let equal = '= ?';
        if (id === null) {
            equal = 'IS NULL'
        }
        where = `WHERE \`${column}\` ${equal}`
    }
    let sql = `SELECT * FROM \`${table}\` ${where}`;
    return sqlFunction(
        sql,
        id,
        `Successfully queried ${table}`,
        `Unable to pull '${table}' records.`
    );
}
const departmentMap = (department) => {
    return {
        'ID': department.id,
        'Name': department.name,
    };
}
const viewDepartments = async () => {
    let departments = await getTable('department');
    let departmentsTable = departments.map(departmentMap);
    if (!departmentsTable.length) {
        departmentsTable = [{ 'No Department': 'Add some first' }];
    }
    return printTable(departmentsTable);
}
const roleMap = (role, roleDepartments) => {
    let currentDepartment = roleDepartments.find(department => department.id === role.department_id)
    return {
        'ID': role.id,
        'Title': role.title,
        'Salary': role.salary,
        'Department': currentDepartment.name
    };
}
const viewRoles = async () => {
    let roles = await getTable('role');
    let roleDepartments = await getTable('department');
    let rolesTable = roles.map(role => roleMap(role, roleDepartments));
    if (!rolesTable.length) {
        rolesTable = [{ 'No Roles': 'Add some first' }];
    }
    return printTable(rolesTable);
}
const employeeMap = (employee, employeesList, employeeRoles) => {
    let roleTitle = employeeRoles.find(role => role.id === employee.role_id).title;
    let currentManager = employeesList.find((manager) => {
        if (employee.manager_id === manager.id) { return manager }
        if (employee.manager_id === null) { return null }
    });
    let managerName = currentManager ? currentManager.first_name + ' ' + currentManager.last_name : 'none';
    return {
        'ID': employee.id,
        'First Name': employee.first_name,
        'Last Name': employee.last_name,
        'Department Role': roleTitle,
        'Manager': managerName
    };
}
const viewEmployees = async () => {
    let employeesList = await getTable('employee');
    let employeeRoles = await getTable('role');
    let employeesTable = employeesList.map((employee) => employeeMap(employee, employeesList, employeeRoles));
    if (!employeesTable.length) {
        employeesTable = [{ 'No Employees': 'Add some first' }];
    }
    return printTable(employeesTable)
}
const viewEmployeeByManager = async (manager_id) => {
    let employeesList = await getTable('employee', 'manager_id', manager_id).catch();
    let employeeRoles = await getTable('role');
    if (!employeesList || !employeesList.length) {
        return printTable([{ 'No Employees': 'Employee has no subordinates' }]);
    }
    let employeesTable = employeesList.map(employee => employeeMap(employee, employeesList, employeeRoles));
    if (!employeesTable.length) {
        employeesTable = [{ 'No Employees': 'Add some first' }];
    }
    return printTable(employeesTable);
}
const filterByDepartment = async (department_id) => {
    let employeesList = await getTable('employee',);
    let departmentRoles = await getTable('role', 'department_id', department_id);
    let roleIDs = departmentRoles.map(department => department.id);
    let departmentEmployees = employeesList.filter(employee => {
        if (roleIDs.indexOf(employee.role_id) > -1) {
            return employee;
        }
    });
    return departmentEmployees;
}
const viewEmployeeByDepartment = async (department_id) => {
    let departmentRoles = await getTable('role', 'department_id', department_id);
    let departmentEmployees = await filterByDepartment(department_id);
    let employeesTable = departmentEmployees.map(employee => employeeMap(employee, departmentEmployees, departmentRoles));
    if (!employeesTable.length) {
        employeesTable = [{ 'No Departments': 'Add some first' }];
    }
    return printTable(employeesTable);
}

const viewDepartmentBudget = async (department_id) => {
    let departmentRoles = await getTable('role', 'department_id', department_id);
    let employeesList = await filterByDepartment(department_id);
    let total = 0;
    departmentRoles.forEach(role => {
        employeesList.forEach(employee => {
            if (role.id === employee.role_id) {
                total += parseFloat(role.salary);
            }
        })
    })

    if (!employeesList.length) {
        return printTable([{ 'No Employees': 'Add some to department roles first' }]);
    }

    let totalDepartmentSalary = total.toLocaleString(undefined, { style: "currency", currency: "USD" });

    return printTable([{ 'The Total Utilized Yearly Budget For Department Is': totalDepartmentSalary }]);
}

const view = async (questions, answers) => {
    // Actions Switch
    switch (answers.action) {
        case 'departments':
            return await viewDepartments();
        case 'roles':
            return await viewRoles();
        case 'employees':
            return await viewEmployees();
        case 'employeeManager':
            return await questions.inquirer
                .prompt(questions.viewEmployeeManager)
                .then(async (answer) => {
                    return await viewEmployeeByManager(answer.manager_id);
                });
        case 'employeeDepartment':
            return await questions.inquirer
                .prompt(questions.viewEmployeeDepartment)
                .then(async (answer) => {
                    return await viewEmployeeByDepartment(answer.department_id);
                });
        case 'budget':
            return await questions.inquirer
                .prompt(questions.viewBudget)
                .then(async (answer) => {
                    return await viewDepartmentBudget(answer.department_id);
                });
        case 'goBack':
            return console.log('Going Back');
        default:
            throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`)
    }
}

module.exports = { view, getTable }