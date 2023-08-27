const MySQL = require('mysql2');
const Inquirer = require('inquirer')
const config = require('../config/config.json');

const questions = require('./questions');
const actions = require('./actions');

async function init() {
    return await Inquirer
        .prompt(questions.actions)
        .then(async (answers) => {
            console.log(answers);
            // Actions Switch
            switch (answers.action) {
                case 'viewDepartments':
                    //formatted table showing department names and department ids
                    break;
                case 'viewRoles':
                    //job title, role id, the department that role belongs to, and the salary for that role

                    break;
                case 'viewEmployees':
                    //formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
                    break;
                case 'addDepartment':
                    break;
                case 'addRole':
                    break;
                case 'addEmployee':
                    break;
                case 'updateRole':
                    break;
                case 'quit':
                    return console.log('User has requested to quit application.');
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