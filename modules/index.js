const config = require('../config/config.json');
const questions = require('./questions');
const actions = require('./actions');
const colors = require('colors');

colors.enable();

// Display Name of App/LOGO
function displayLogo() {
	const appLogo = '              _____ _         __  __               \r\n             / ____| |       / _|/ _|              \r\n            | (___ | |_ __ _| |_| |_               \r\n             \\___ \\| __/ _` |  _|  _|              \r\n             ____) | || (_| | | | |                \r\n  __  __    |_____/ \\__\\__,_|_| |_|  _             \r\n |  \\/  |           (_) |           (_)            \r\n | \\  / | ___  _ __  _| |_ ___  _ __ _ _ __   __ _ \r\n | |\\/| |/ _ \\| \'_ \\| | __/ _ \\| \'__| | \'_ \\ / _` |\r\n | |  | | (_) | | | | | || (_) | |  | | | | | (_| |\r\n |_|  |_|\\___/|_| |_|_|\\__\\___/|_|  |_|_| |_|\\__, |\r\n        / ____|         | |                   __/ |\r\n       | (___  _   _ ___| |_ ___ _ __ ___    |___/ \r\n        \\___ \\| | | / __| __/ _ \\ \'_ ` _ \\         \r\n        ____) | |_| \\__ \\ ||  __/ | | | | |        \r\n       |_____/ \\__, |___/\\__\\___|_| |_| |_|        \r\n                __/ |                              \r\n               |___/\n';
	console.log(appLogo.green);
}

// Init function, starts inquirer question prompt.
async function init() {
	return await questions.inquirer
		.prompt(questions.menu)
		.then(async (answers) => {
			config.logging.enabled ? console.log(answers) : '';

			// Call functions based on selected options
			let option = answers.option.toLowerCase();
			switch (option) {
			case 'view':
				await actions.view(questions, answers);
				break;
			case 'add':
				await actions.add(questions, answers);
				break;
			case 'update':
				await actions.update(questions, answers);
				break;
			case 'delete':
				await actions.remove(questions, answers);
				break;
			case 'quit':
				console.log('User has requested to quit application.'.blue);
				return process.exit();
			default:
				throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`);
			}
			return await init();
		})
		.catch(async (error) => {
			if (error.isTtyError) {
				console.error('Prompt cannot be rendered in the current environment.'.red);
			} else {
				console.error('Something went wrong: %s'.red, error);
			}
			// Re-Initiate App for graceful error
			return await init();
		});
}
displayLogo();
init();