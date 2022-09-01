USE employeetracker_db;

INSERT INTO departments (department_name)
VALUES
('HR'), ('Customer Service'), ('Management'), ('Hourly'), ('Payroll'), ('Training');

INSERT INTO employee (first_name, last_name, role_id, is_manager)
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