const sqlFunction = require('./database').sqlFunction;

// Actions Switch
switch (answers.action) {

    case 'goBack':
        return console.log('Going Back');
    default:
        throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`)
}