USE employeetracker_db;

INSERT INTO departments (department_name)
VALUES
('HR'), ('Customer Service'), ('Management'), ('Hourly'), ('Payroll'), ('Training');

INSERT INTO employee (first_name, last_name, roles_id, is_manager)
VALUES
  ('Ronald', 'Firbank', 6, 1),
  ('Virginia', 'Woolf', 4, 1),
  ('Piers', 'Gaveston', 1, 0),
  ('Charles', 'LeRoi', 2, 1),
  ('Katherine', 'Mansfield', 3, 1),
  ('Dora', 'Carrington', 5, 0),
  ('Edward', 'Bellamy', 3, 0),
  ('Montague', 'Summers', 2, 1),
  ('Octavia', 'Butler', 4, 1),
  ('Unica', 'Zurn', 4, 1);

  INSERT INTO roles (title, salary, departments_id)
  VALUES
  ("Janitor", 70000, 4), 
  ("Salesperson", 90000, 4), 
  ("Customer Service Tech", 150000, 2), 
  ("Customer Service Desk", 120000, 2), 
  ("Accountant", 122000, 5), 
  ("General Manager", 250000, 3), 
  ("Coach", 190000, 6);