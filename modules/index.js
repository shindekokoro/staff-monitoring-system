const MySQL = require('mysql2');
const Inquirer = require('inquirer')
const config = require('../config/config.json');

const questions = require('./questions');

Inquirer
    .prompt(questions.actions)
    .then((answers) => {
        console.log(answers);
        // Actions Switch
        switch (answers.action) {
            case 'viewDepartments':
                //formatted table showing department names and department ids
                viewDepartments
                break;
            case 'viewRoles':
                //job title, role id, the department that role belongs to, and the salary for that role

                viewRoles
                break;
            case 'viewEmployees':
                //formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
                viewEmployees
                break;
            default:
                throw new Error(`Given answer ${answers.action} not a valid choice`);
        }
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.error('Prompt cannot be rendered in the current environment.');
        } else {
            console.error('Something went wrong %s', error);
        }
    });
