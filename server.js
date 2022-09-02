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
//const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
//app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

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
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit']
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
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Exit':
                exit();
                break;
            }
        }).catch((err) => {
            if(err)throw err;
        });
    };

function viewAllEmployees() {
    let sql = `SELECT * FROM employee ORDER BY last_name`;

        connection.query(sql, (err, res) => {
            if (err) throw err;
                console.table(res);
                console.log('All Employees!');
                optionsPrompt();
        });
    }

function viewAllDepartments() {
    let sql = `SELECT * FROM departments ORDER BY department_name`;
    
        connection.query(sql, (err, res) => {
            if (err) throw err; 
                console.table(res);
                console.log('All Departments!');
                optionsPrompt();
            });
        }

function viewAllRoles() {
    let sql = `SELECT * FROM roles ORDER BY salary DESC`;
    
        connection.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            console.log('All Roles!');
            optionsPrompt();
        });
}

function addEmployee() {
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

function enterEmployee(roles) {
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

function exit() {
        process.exit();
    }

optionsPrompt();

// Start server after DB connection
connection.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

