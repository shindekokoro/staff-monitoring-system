const sqlFunction = require('./database').sqlFunction;

const update = async (questions, answers) => {
	// Actions Switch
	switch (answers.action) {
	case 'role':
		return await questions.inquirer
			.prompt(questions.updateRole)
			.then((role) => {
				updateEmployeeRole(role.employee_id, role.role_id);
			});
	case 'manager':
		return await questions.inquirer
			.prompt(questions.updateManager)
			.then((employee) => {
				updateEmployeeManager(employee.employee_id, employee.manager_id);
			});
	case 'goBack':
		return console.log('Going Back');
	default:
		throw new Error(`${answers.action} has not been accounted for, submit an issue on GitHub`);
	}
};

// Update role of employee.
const updateEmployeeRole = (employee_id, role_id) => {
	if (!employee_id || !role_id) { return 'Needed IDs not provided, please try again'; }
	let sql = 'UPDATE `employee` SET `role_id` = ? WHERE `id` = ?';
	sqlFunction(
		sql,
		[role_id, employee_id],
		'Successfully updated employee\'s role.',
		'Unable to update employee'
	);
};
// Update manager of employee.
const updateEmployeeManager = (employee_id, manager_id) => {
	if (!employee_id) { return 'Needed IDs not provided, please try again'; }
	let sql = 'UPDATE `employee` SET `manager_id` = ? WHERE `id` = ?';
	sqlFunction(
		sql,
		[manager_id, employee_id],
		'Successfully updated employee\'s role.',
		'Unable to update employee'
	);
};

module.exports = { update, updateEmployeeRole, updateEmployeeManager };