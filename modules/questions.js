const inquirer = require('inquirer');
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

// Questions for inquirer
const menu = [
    {
        type: 'list',
        name: 'option',
        message: 'What would you like do to?',
        choices: ['View', 'Add', 'Update', 'Delete', 'Quit']
    },
    {
        when: (answer) => answer.option === 'View',
        type: 'list',
        name: 'action',
        message: 'What would you like to view?',
        choices: [
            { name: 'View All Departments', value: 'departments' },
            { name: 'View All Roles', value: 'roles' },
            { name: 'View All Employees', value: 'employees' },
            { name: 'View Employees by Manager', value: 'employeeManager' },
            { name: 'View Employees by Department', value: 'employeeDepartment' },
            { name: 'View Department Budget', value: 'budget' },
            { name: 'Go Back', value: 'goBack' }
        ]
    },
    {
        when: (answer) => answer.option === 'Add',
        type: 'list',
        name: 'action',
        message: 'What would you like to add?',
        choices: [
            { name: 'Add a Department', value: 'department' },
            { name: 'Add a Role', value: 'role' },
            { name: 'Add an Employee', value: 'employee' },
            { name: 'Go Back', value: 'goBack' }
        ]
    },
    {
        when: (answer) => answer.option === 'Update',
        type: 'list',
        name: 'action',
        message: 'What would you like to update?',
        choices: [
            { name: 'Update an Employee Role', value: 'role' },
            { name: 'Update an Employee Manager', value: 'manager' },
            { name: 'Go Back', value: 'goBack' }
        ]
    },
    {
        when: (answer) => answer.option === 'Delete',
        type: 'list',
        name: 'action',
        message: 'What would you like to delete?',
        choices: [
            { name: 'Delete a Department', value: 'department' },
            { name: 'Delete a Role', value: 'role' },
            { name: 'Delete an Employee', value: 'employee' },
            { name: 'Go Back', value: 'goBack' }
        ]
    }
]
const addDepartment = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
        validate: validateDepartment
    }
]
const addRole = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
        validate: validateEntry
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the role\'s salary?',
        validate: validateSalary
    },
    {
        type: 'list',
        name: 'department_id',
        message: (answer) => `What department is ${answer.roleName} in?`,
        choices: actions.getDepartmentsList
    }
]
const addEmployee = [
    {
        type: 'input',
        name: 'first_name',
        message: `What is the employee's first name?`,
        validate: validateEntry
    },
    {
        type: 'input',
        name: 'last_name',
        message: (answer) => `What is ${answer.first_name}'s surname?`,
        validate: validateEntry
    },
    {
        type: 'list',
        name: 'role_id',
        message: (answer) => `What is ${answer.first_name} ${answer.last_name}'s role?`,
        choices: actions.getRolesList
    },
    {
        type: 'list',
        name: 'manager_id',
        message: `What is their manager's name?`,
        choices: actions.getManagerList
    }
]
const updateRole = [
    {
        type: 'list',
        name: 'employee_id',
        message: 'Choose from the list to select an employee to update their role:',
        choices: actions.getEmployeesList
    },
    {
        type: 'list',
        name: 'role_id',
        message: 'Choose from the list to select an updated role:',
        choices: actions.getRolesList
    }
]
const updateManager = [
    {
        type: 'list',
        name: 'employee_id',
        message: 'Choose from the list to select an employee to update their role:',
        choices: actions.getEmployeesList
    },
    {
        type: 'list',
        name: 'manager_id',
        message: 'Choose from the list to select an updated role:',
        choices: actions.getManagerList
    }
]
const viewEmployeeManager = [
    {

    }
]
const viewEmployeeDepartment = [
    {

    }
]
// Delete Departments/Roles/Employees
const deleteEntry = [
    {

    }
]
// View Budget (total salaries)
const viewBudget = [
    {

    }
]

module.exports = {
    inquirer, menu,
    // viewDepartment, viewRole, viewEmployee, // (There are no needed sub questions, nothing to export)
    addDepartment, addRole, addEmployee,
    updateRole, updateManager,
    viewEmployeeManager, viewEmployeeDepartment,
    deleteEntry, viewBudget
}