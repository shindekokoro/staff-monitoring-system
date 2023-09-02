const sqlFunction = require('./database').sqlFunction;

const removeFromTable = async (table, column, value) => {
    let sql = 'DELETE FROM `' + table + '` WHERE `' + column + '` = ?;';
    let logSuccess = `Entry deleted from ${table} table.`;
    let logError = `Unable to remove selected ${table} entry.`;

    return await sqlFunction(sql, value, logSuccess, logError);
}

const remove = async (questions, answers) => {
    // Actions Switch
    let table = answers.action;
    switch (table) {
        case 'department':
            return await questions.inquirer
                .prompt(questions.deleteDepartment)
                .then((answer) => {
                    if (!answer.confirmDelete) { return console.log('  Did not delete department'.blue); }
                    let department_id = answer.department_id
                    return removeFromTable(table, 'id', department_id)
                });
        case 'role':
            return await questions.inquirer
                .prompt(questions.deleteRole)
                .then((answer) => {
                    if (!answer.confirmDelete) { return console.log('  Did not delete role'.blue); }
                    let role_id = answer.role_id
                    return removeFromTable(table, 'id', role_id)
                });
        case 'employee':
            return await questions.inquirer
                .prompt(questions.deleteEmployee)
                .then((answer) => {
                    if (!answer.confirmDelete) { return console.log('  Did not delete employee'.blue); }
                    let employee_id = answer.id
                    return removeFromTable(table, 'id', employee_id)
                });
        case 'goBack':
            return console.log('Going Back');
        default:
            throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`)
    }
}

module.exports = { remove }