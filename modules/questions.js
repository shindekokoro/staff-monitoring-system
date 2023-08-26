const MySQL = require('mysql2')

// TODO: MySQL get employees
const employees = [
    { name: 'Bill Gates', id: 1 },
    { name: 'Steve Jobs', id: 2 }
]
const employeeNames = employees.map((employee) => {
    return { name: employee.name, value: employee.id }
})

module.exports = {
    actions: [
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'View All Departments', value: 'viewDepartments' },
                { name: 'View All Roles', value: 'viewRoles' },
                { name: 'View All Employees', value: 'viewEmployees' },
                { name: 'Add a Department', value: 'addDepartment' },
                { name: 'Add a Role', value: 'addRole' },
                { name: 'Add an Employee', value: 'addEmployee' },
                { name: 'Update an Employee Role', value: 'updateRole' }
            ],

        },
        // Add Department
        {
            when: (answer) => answer.action === 'addDepartment',
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?'
        },
        // Add Role
        {
            when: (answer) => answer.action === 'addRole',
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?'
        },
        {
            when: (answer) => answer.action === 'addRole',
            type: 'input',
            name: 'salary',
            message: 'What is the role\'s salary?'
        },
        {
            when: (answer) => answer.action === 'addRole',
            type: 'input',
            name: 'department',
            message: (answer) => `What department is ${answer.roleName} in?`
        },
        // Add Employee
        {
            when: (answer) => answer.action === 'addEmployee',
            type: 'input',
            name: 'firstName',
            message: `What is the employee's first name?`
        },
        {
            when: (answer) => answer.action === 'addEmployee',
            type: 'input',
            name: 'lastName',
            message: (answer) => `What is ${answer.firstName}'s surname?`
        },
        {
            when: (answer) => answer.action === 'addEmployee',
            type: 'input',
            name: 'role',
            message: (answer) => `What is ${answer.firstName} ${answer.lastName}'s role?`
        },
        {
            when: (answer) => answer.action === 'addEmployee',
            type: 'input',
            name: 'manager',
            message: `What is their manager's name?`
        },
        // Update Role
        {
            when: (answer) => answer.action === 'updateRole',
            type: 'list',
            name: 'employeeID',
            message: 'Choose from the list to select an employee to update their role:',
            choices: employeeNames
        }
    ]
}