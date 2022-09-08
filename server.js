// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const express = require('express');
const inquirer = require('inquirer');
const connection = require('./db/connection');
require('console.table');

const app = express();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Initial Prompt Options
const optionsPrompt = () => {
    console.log(`
    ====================
      EMPLOYEE MANAGER
    ====================`);

    return inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What Would You Like To Do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Delete Employee', 'View All Roles', 'Add Role', 'Delete Role', 'View All Departments', 'Add Department', 'Delete Department', 'Exit']
        }
    ])
    .then((res) => {
        console.log(res.options);
        switch(res.options){
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Exit':
                exit();
                break;
            }
        }).catch((err) => {
            if(err)throw err;
        });
    };

const viewAllEmployees = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.is_manager AS manager_status, roles.title
    FROM employee
    JOIN roles ON employee.roles_id = roles.id
    `;

        connection.query(sql, (err, res) => {
            if (err) throw err;
                console.table(res);
                console.log('All Employees!');
                optionsPrompt();
        });
    }

const viewAllDepartments = () => {
    let sql = `SELECT * FROM departments ORDER BY department_name`;
    
        connection.query(sql, (err, res) => {
            if (err) throw err; 
                console.table(res);
                console.log('All Departments!');
                optionsPrompt();
            });
        }

const viewAllRoles = () => {
    let sql = `SELECT roles.title, roles.salary, departments_id AS departmentID , departments.department_name AS department FROM roles 
    JOIN departments ON roles.departments_id = departments.id`;
    
        connection.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            console.log('All Roles!');
            optionsPrompt();
        });
}

const addEmployee = () => {
    let sql = `SELECT roles.id, roles.title, roles.salary FROM roles`

        connection.query(sql,(err, res) => {
            if (err) throw err;
                const roles = res.map(({id, title, salary }) => ({
                    value: id,
                    title: `${title}`,
                    salary: `${salary}`
                }));
                console.log('Adding Employee!');
                console.table(res);
                enterEmployee(roles);
        });
}

const enterEmployee = (roles) => {
    inquirer.prompt([ 
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter Employees First Name: '
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter Employees Last Name: '
        },
        {
            type: 'confirm',
            name: 'isManager',
            message: 'Is Employee a Manager?',
            default: false
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Choose Employee Role',
            choices: roles
        }

    ]).then((res) => {
        let sql = `INSERT INTO employee SET ?`
        connection.query(sql,{
            first_name: res.firstName,
            last_name: res.lastName,
            roles_id: res.roleId,
            is_manager: res.isManager
        }, (err, res) => {
            if (err) throw err;
            console.log('Employee Added! See View All Employees!');
            optionsPrompt();
        });
    });
}

const updateEmployeeRole = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.id FROM employee
        JOIN roles ON employee.roles_id = roles.id`

    connection.query(sql, (err, res) => {
        if (err) throw err;
        const employee = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
        }));
        console.table(res);
        updateRole(employee)
    });
}

const updateRole = (employee) => {
    let sql = `SELECT roles.id, roles.title, roles.salary FROM roles`

    connection.query(sql, (err, res) => {
        if (err) throw err;
        let roleOptions = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));
        console.table(res);
        updatedRole(employee, roleOptions);
    });
}

const updatedRole = (employee, roleOptions) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select Employee who`s role will be Updated: ',
            choices: employee
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select New Role: ',
            choices: roleOptions
        },
    ]).then((res) => {
        let sql = 'UPDATE employee SET roles_id = ? WHERE id = ?'
        connection.query(sql,[ res.role, res.employee ],(err, res) => {
            if (err) throw err;
            console.log('Updated Employee Role!');
            optionsPrompt();
        });
    });
}

const deleteEmployee = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`

    connection.query(sql,(err, res) => {
        if (err) throw err;
        const employee = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${id} ${first_name} ${last_name}`
        }));
        console.table(res);
        addDelete(employee);
    });
}

const addDelete = (employee) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select Employee to be Deleted: ',
            choices: employee
        }
    ]).then((res) => {
        let sql = `DELETE FROM employee WHERE ?`;
        connection.query(sql, { id: res.employee }, (err, res) => {
            if (err) throw err;
            console.log('Employee Has Been Deleted!');
            optionsPrompt();
        });
    });
}

const deleteRole = () => {
    let sql = `SELECT roles.id, roles.title, roles.departments_id FROM roles`
    connection.query(sql,(err, res) => {
        if (err) throw err;
        const roles = res.map(({ id, title, departments_id }) => ({
            value: id,
            name: `${id} ${title} ${departments_id}`
        }));
        console.table(res);
        rolesDelete(roles);
    });
}

const rolesDelete = (roles) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'roles',
            message: 'Select Role to be Deleted: ',
            choices: roles
        }
    ]).then((res) => {
        let sql = `DELETE FROM roles WHERE ?`;
        connection.query(sql, { id: res.roles }, (err, res) => {
            if (err) throw err;
            console.log('Role Has Been Deleted!');
            optionsPrompt();
        });
    });
}

const addRole = () => {
    let sql = `SELECT departments.id, departments.department_name FROM departments
        `

        connection.query(sql, (err, res) => {
            if (err) throw err;
            const departments = res.map(({id, department_name}) => ({
                value: id,
                name: `${id} ${department_name}`
            }));
            console.log('Adding Role!');
            console.table(res);
            enterRole(departments);
        });
}

const enterRole = (departments) => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter Role Title: '
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter Role Salary: '
        },
        {
            type: 'list',
            name: 'departmentId',
            choices: departments
        },
    ]).then((res) => {
        let sql = `INSERT INTO roles SET ?`;
        connection.query(sql,{
            title: res.roleTitle,
            salary: res.roleSalary,
            departments_id: res.departmentId
        },(err, res) => {
            if (err) throw err;
            console.log('Role Added! See View All Roles!');
            optionsPrompt();
        });
    });
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter Department Name: '
        }
    ]).then ((res) => {
        let sql = 'INSERT INTO departments SET ?';
        connection.query(sql,{
            department_name: res.departmentName
        },(err, res) => {
            if(err) throw err;
            console.log('Department Added! See View All Departments!');
            optionsPrompt();
        });
    });
}

const deleteDepartment = () => {
    let sql = `SELECT departments.id, departments.department_name FROM departments`
    connection.query(sql,(err, res) => {
        if (err) throw err;
        const  departments = res.map(({ id, department_name }) => ({
            value: id,
            name: `${id} ${department_name}`
        }));
        console.table(res);
        departmentDelete(departments);
    });
}

const departmentDelete = (departments) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'departments',
            message: 'Select department to be Deleted: ',
            choices: departments
        }
    ]).then((res) => {
        let sql = `DELETE FROM departments WHERE ?`;
        connection.query(sql, { id: res.departments }, (err, res) => {
            if (err) throw err;
            console.log('Department Has Been Deleted!');
            optionsPrompt();
        });
    });
}

const exit = () => {
        process.exit();
    }


// Start server after DB connection
connection.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  optionsPrompt();
  });


