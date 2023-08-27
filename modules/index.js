const appLogo = "              _____ _         __  __               \r\n             \/ ____| |       \/ _|\/ _|              \r\n            | (___ | |_ __ _| |_| |_               \r\n             \\___ \\| __\/ _` |  _|  _|              \r\n             ____) | || (_| | | | |                \r\n  __  __    |_____\/ \\__\\__,_|_| |_|  _             \r\n |  \\\/  |           (_) |           (_)            \r\n | \\  \/ | ___  _ __  _| |_ ___  _ __ _ _ __   __ _ \r\n | |\\\/| |\/ _ \\| \'_ \\| | __\/ _ \\| \'__| | \'_ \\ \/ _` |\r\n | |  | | (_) | | | | | || (_) | |  | | | | | (_| |\r\n |_|  |_|\\___\/|_| |_|_|\\__\\___\/|_|  |_|_| |_|\\__, |\r\n        \/ ____|         | |                   __\/ |\r\n       | (___  _   _ ___| |_ ___ _ __ ___    |___\/ \r\n        \\___ \\| | | \/ __| __\/ _ \\ \'_ ` _ \\         \r\n        ____) | |_| \\__ \\ ||  __\/ | | | | |        \r\n       |_____\/ \\__, |___\/\\__\\___|_| |_| |_|        \r\n                __\/ |                              \r\n               |___\/\n";
const inquirer = require('inquirer');
const config = require('../config/config.json');

const questions = require('./questions');
const actions = require('./actions');

async function init() {
    console.log(appLogo);
    return await inquirer
        .prompt(questions.actions)
        .then(async (answers) => {
            console.log(answers);
            // Actions Switch
            switch (answers.action) {
                case 'viewDepartments':
                    actions.viewDepartment();
                    break;
                case 'viewRoles':
                    actions.viewRole();
                    break;
                case 'viewEmployees':
                    actions.viewEmployee();
                    break;
                case 'addDepartment':
                    actions.addDepartment(answers.departmentName);
                    break;
                case 'addRole':
                    actions.addRole(answers.roleName);
                    break;
                case 'addEmployee':
                    actions.addEmployee(answers.employeeName)
                    break;
                case 'updateRole':
                    break;
                case 'quit':
                    console.log('User has requested to quit application.');
                    return process.exit()
                default:
                    throw new Error(`${answers.action} has not been accounted for, submit and issue on GitHub`)
            }
            return await init();
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.error('Prompt cannot be rendered in the current environment.');
            } else {
                console.error('Something went wrong %s', error);
            }
        });
}

init()