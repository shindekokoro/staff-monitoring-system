const { view, getTable } = require('./view');
const { add, addDepartment, addRole, addEmployee } = require('./add');
const { update, updateEmployeeRole, updateEmployeeManager } = require('./update');
const { remove } = require('./remove');

// Return a list of items and their IDs based on the specified table and table map.
const getListWithIDs = async (table, tableMap, nullMessage) => {
	const staff = await getTable(table);
	if (!staff.length) {
		return [{ name: nullMessage, value: -1 }];
	}
	return staff.map(tableMap);
};
const getDepartmentsList = () => {
	const tableMap = department => ({ name: department.name, value: department.id });
	return getListWithIDs('department', tableMap, 'No departments, add one first.');
};
const getRolesList = () => {
	const tableMap = role => ({ name: role.title, value: role.id });
	return getListWithIDs('role', tableMap, 'No department roles, add some first.');
};
const getEmployeesList = () => {
	const tableMap = employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id });
	return getListWithIDs('employee', tableMap, 'No employees found, add some first.');
};
const getManagerList = async () => {
	const managerList = await getEmployeesList();
	if (managerList[0].value === -1) {
		return [{ name: 'No Manager', value: null }];
	} else {
		managerList.push({ name: 'No Manager', value: null });
		return managerList;
	}
};
const deleteDepartmentsList = async () => {
	const deleteList = await getDepartmentsList();
	deleteList.push({ name: 'Cancel', value: -1 });
	return deleteList;
};
const deleteRolesList = async () => {
	const deleteList = await getRolesList();
	deleteList.push({ name: 'Cancel', value: -1 });
	return deleteList;
};
const deleteEmployeesList = async () => {
	const deleteList = await getEmployeesList();
	deleteList.push({ name: 'Cancel', value: -1 });
	return deleteList;
};

module.exports = {
	view, getTable,
	getDepartmentsList, getRolesList, getEmployeesList, getManagerList,
	add, addDepartment, addRole, addEmployee,
	update, updateEmployeeRole, updateEmployeeManager,
	deleteDepartmentsList, deleteRolesList, deleteEmployeesList,
	remove
};