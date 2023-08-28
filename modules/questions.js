const actions = require('./actions');

// Validate Entry, ensure that text has been entered as to not have a null entry.
const validateEntry = (input) => {
    var isName = input.trim() !== ''
    return isName || 'Make sure to put in a valid name.'
}
// Department Validation, ensure that input is present and not already a department.
const validateDepartment = async (input) => {
    let validInput = validateEntry(input)
    if (validInput !== true) {
        return validInput;
    }
    let departmentList = await actions.getDepartmentsList();
    let notInList = departmentList.filter(department => department.name.toLowerCase() === input.toLowerCase());

    if (notInList.length) {
        return `${input} appears to already be in your department list. Try a new name.`;
    } else {
        return true;
    }
}
// Salary Validation, ensure that value is a number.
const validateSalary = (input) => {
    let salary = parseFloat(input).toFixed(2)
    let isValid = salary !== 'NaN'
    return isValid || 'Make sure to enter in a number.'
}
// Questions for Inquirer
const questions = [
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
            { name: 'Update an Employee Role', value: 'updateRole' },
            { name: 'Update an Employee Manager', value: 'updateManager' },
            { name: 'Quit', value: 'quit' }
        ],

    },
    // Add Department
    {
        when: (answer) => answer.action === 'addDepartment',
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
        validate: validateDepartment
    },
    // Add Role
    {
        when: (answer) => answer.action === 'addRole',
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
        validate: validateEntry
    },
    {
        when: (answer) => answer.action === 'addRole',
        type: 'input',
        name: 'salary',
        message: 'What is the role\'s salary?',
        validate: validateSalary
    },
    {
        when: (answer) => answer.action === 'addRole',
        type: 'list',
        name: 'department_id',
        message: (answer) => `What department is ${answer.roleName} in?`,
        choices: actions.getDepartmentsList
    },
    // Add Employee
    {
        when: (answer) => answer.action === 'addEmployee',
        type: 'input',
        name: 'first_name',
        message: `What is the employee's first name?`,
        validate: validateEntry
    },
    {
        when: (answer) => answer.action === 'addEmployee',
        type: 'input',
        name: 'last_name',
        message: (answer) => `What is ${answer.first_name}'s surname?`,
        validate: validateEntry
    },
    {
        when: (answer) => answer.action === 'addEmployee',
        type: 'list',
        name: 'role_id',
        message: (answer) => `What is ${answer.first_name} ${answer.last_name}'s role?`,
        choices: actions.getRolesList
    },
    {
        when: (answer) => answer.action === 'addEmployee',
        type: 'list',
        name: 'manager_id',
        message: `What is their manager's name?`,
        choices: actions.getManagerList
    },
    // Update Role
    {
        when: (answer) => answer.action === 'updateRole',
        type: 'list',
        name: 'employee_id',
        message: 'Choose from the list to select an employee to update their role:',
        choices: actions.getEmployeesList
    },
    {
        when: (answer) => answer.action === 'updateRole',
        type: 'list',
        name: 'role_id',
        message: 'Choose from the list to select an updated role:',
        choices: actions.getRolesList
    },
    // Update Manager
    {
        when: (answer) => answer.action === 'updateManager',
        type: 'list',
        name: 'employee_id',
        message: 'Choose from the list to select an employee to update their role:',
        choices: actions.getEmployeesList
    },
    {
        when: (answer) => answer.action === 'updateManager',
        type: 'list',
        name: 'manager_id',
        message: 'Choose from the list to select an updated role:',
        choices: actions.getManagerList
    }
]

module.exports = { questions }