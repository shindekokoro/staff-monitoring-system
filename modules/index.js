const inquirer = require('inquirer');
const { printTable } = require('console-table-printer')
const colors = require('colors')

const config = require('../config/config.json')
const questions = require('./questions');
const actions = require('./actions');

colors.enable()

// Display Name of App/LOGO
function displayLogo() {
    const appLogo = "              _____ _         __  __               \r\n             \/ ____| |       \/ _|\/ _|              \r\n            | (___ | |_ __ _| |_| |_               \r\n             \\___ \\| __\/ _` |  _|  _|              \r\n             ____) | || (_| | | | |                \r\n  __  __    |_____\/ \\__\\__,_|_| |_|  _             \r\n |  \\\/  |           (_) |           (_)            \r\n | \\  \/ | ___  _ __  _| |_ ___  _ __ _ _ __   __ _ \r\n | |\\\/| |\/ _ \\| \'_ \\| | __\/ _ \\| \'__| | \'_ \\ \/ _` |\r\n | |  | | (_) | | | | | || (_) | |  | | | | | (_| |\r\n |_|  |_|\\___\/|_| |_|_|\\__\\___\/|_|  |_|_| |_|\\__, |\r\n        \/ ____|         | |                   __\/ |\r\n       | (___  _   _ ___| |_ ___ _ __ ___    |___\/ \r\n        \\___ \\| | | \/ __| __\/ _ \\ \'_ ` _ \\         \r\n        ____) | |_| \\__ \\ ||  __\/ | | | | |        \r\n       |_____\/ \\__, |___\/\\__\\___|_| |_| |_|        \r\n                __\/ |                              \r\n               |___\/\n";
    console.log(appLogo);
}

// Init function, starts inquirer question prompt.
async function init() {
    return await inquirer
        .prompt(questions.menu)
        .then(async (answers) => {
            config.logging.enabled ? console.log(answers) : '';
            if (answers.options === 'Quit') {
                console.log('User has requested to quit application.'.blue);
                return process.exit()
            }
            // Actions Switch
            switch (answers.action) {
                case 'viewDepartments':
                    let viewDepartments = await actions.viewTable('department');
                    let departmentsTable = viewDepartments.map((department) => {
                        return {
                            'ID': department.id,
                            'Name': department.name,
                        }
                    })
                    printTable(departmentsTable)
                    break;
                case 'viewRoles':
                    let viewRoles = await actions.viewTable('role');
                    let roleDepartments = await actions.viewTable('department');
                    let rolesTable = viewRoles.map((role) => {
                        let currentDepartment = roleDepartments.find(department => department.id === role.department_id)
                        return {
                            'ID': role.id,
                            'Title': role.title,
                            'Salary': role.salary,
                            'Department': currentDepartment.name
                        }
                    })
                    printTable(rolesTable)
                    break;
                case 'viewEmployees':
                    let viewEmployees = await actions.viewTable('employee');
                    let employeeRoles = await actions.viewTable('role');
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
                    printTable(employeesTable)
                    break;
                case 'addDepartment':
                    await inquirer
                        .prompt(questions.addDepartment)
                        .then((department) => {
                            actions.addDepartment(department.departmentName);
                        });
                    break;
                case 'addRole':
                    await inquirer
                        .prompt(questions.addRole)
                        .then((role) => {
                            let salary = parseFloat(role.salary).toFixed(2);
                            let department_id = parseInt(role.department_id);
                            actions.addRole(role.roleName, salary, department_id);
                        });
                    break;
                case 'addEmployee':
                    await inquirer
                        .prompt(questions.addEmployee)
                        .then((employee) => {
                            actions.addEmployee(employee.first_name, employee.last_name, employee.role_id, employee.manager_id);
                        });
                    break;
                case 'updateRole':
                    await inquirer
                        .prompt(questions.updateRole)
                        .then((role) => {
                            actions.updateEmployeeRole(role.employee_id, role.role_id);
                        });
                    break;
                case 'updateManager':
                    await inquirer
                        .prompt(questions.updateManager)
                        .then((employee) => {
                            actions.updateEmployeeManager(employee.employee_id, employee.manager_id);
                        });
                    break;
                case 'goBack':
                    config.logging.enabled ? console.log('Going Back') : '';
                    break;
                default:
                    throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`)
            }
            return await init();
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.error('Prompt cannot be rendered in the current environment.'.red);
            } else {
                console.error('Something went wrong %s'.red, error);
            }
        });
}
displayLogo();
init();