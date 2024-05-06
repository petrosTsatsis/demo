INSERT INTO roles VALUES (1,'ROLE_ADMIN');
INSERT INTO roles VALUES(2,'ROLE_MANAGER');

INSERT INTO users (last_name, first_name, email, password, username, description, phone_number)
VALUES ('John', 'Doe', 'admin@example.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'admin', 'This is the admin', '1234567890');

INSERT INTO users (last_name, first_name, email, password, username, description, phone_number)
VALUES ('George', 'John', 'manager@example.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'manager', 'This is the first manager', '1234567891');

INSERT INTO users (last_name, first_name, email, password, username, description, phone_number)
VALUES ('Doe', 'George', 'manager2@example.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'manager2', 'This is the second manager', '1234567892');

INSERT INTO user_roles values(1,1);
INSERT INTO user_roles values(2,2);
INSERT INTO user_roles values(3,2);


-- CUSTOMERS

-- Customer 1
INSERT INTO customers (dtype, first_name, last_name, phone_number, email, registration_date, birth_date)
VALUES ('Customer', 'Nick', 'Johnson', '1234567895', 'nick1@example.gr', CURRENT_DATE, '1998-11-22');

-- Customer 2
INSERT INTO customers (dtype, first_name, last_name, phone_number, email, registration_date, birth_date)
VALUES ('Customer', 'Jane', 'Smith', '9876543210', 'jane.@example.com', CURRENT_DATE, '1990-05-15');

-- Customer 3
INSERT INTO customers (dtype, first_name, last_name, phone_number, email, registration_date, birth_date)
VALUES ('Customer', 'Bob', 'Johnson', '5551234567', 'bob.@example.com', CURRENT_DATE, '1985-08-30');



-- COMPANIES

-- Company 1
INSERT INTO customers (dtype, name, email, phone_number, registration_date, annual_revenue, employees_number, industry, website, description)
VALUES ('Company', 'Tech Solutions', 'example@solutions.com', '1234567899', CURRENT_DATE, 1000000, 25, 'Information Technology', 'https://www.solutions.com', 'Tech Solutions LLC provides innovative technology solutions for businesses of all sizes.');

-- Company 2
INSERT INTO customers (dtype, name, email, phone_number, registration_date, annual_revenue, employees_number, industry, website, description)
VALUES ('Company', 'Innovative Technologies', 'example@innovative.com', '9876543219', CURRENT_DATE, 2000000, 50, 'Software Development', 'https://www.innovative.com', 'Innovative Technologies Corp specializes in developing cutting-edge software solutions to meet the needs of modern businesses.');

-- Company 3
INSERT INTO customers (dtype, name, email, phone_number, registration_date, annual_revenue, employees_number, industry, website, description)
VALUES ('Company', 'Creative Solutions', 'example@creative.com', '5551234565', CURRENT_DATE, 1500000, 35, 'Creative Services', 'https://www.creative.com', 'Creative Solutions Ltd offers a wide range of creative services including graphic design, branding, and marketing strategies.');



-- SOFTWARE

-- Software 1
INSERT INTO software (name, description, version, category, price, system_requirements, release_date, developer, registration_date)
VALUES ('Software1', 'Description of Software1', '1.0', 'Category1', 9.99, 'System Requirements for Software1', '2019-04-08', 'Developer1', CURRENT_DATE);

-- Licensing Options for Software 1
INSERT INTO software_licensingoptions (licensing_options, software_id)
VALUES ('1 Month', 1),
       ('3 Months', 1),
       ('6 Months', 1),
       ('1 Year', 1);

-- Supported Platforms for Software 1
INSERT INTO software_supportedplatforms (supported_platforms, software_id)
VALUES ('Windows', 1),
       ('macOS', 1),
       ('Linux', 1);

-- Software 2
INSERT INTO software (name, description, version, category, price, system_requirements, release_date, developer, registration_date)
VALUES ('Software2', 'Description of Software2', '2.0', 'Category2', 4.99, 'System Requirements for Software2', '2020-09-09', 'Developer2', CURRENT_DATE);

-- Licensing Options for Software 2
INSERT INTO software_licensingoptions (licensing_options, software_id)
VALUES ('1 Month', 2),
       ('3 Months', 2),
       ('6 Months', 2),
       ('1 Year', 2);

-- Supported Platforms for Software 2
INSERT INTO software_supportedplatforms (supported_platforms, software_id)
VALUES ('Windows', 2),
       ('Linux', 2);

-- Software 3
INSERT INTO software (name, description, version, category, price, system_requirements, release_date, developer, registration_date)
VALUES ('Software3', 'Description of Software3', '3.0', 'Category3', 12.99, 'System Requirements for Software3', '2021-10-10', 'Developer3', CURRENT_DATE);

-- Licensing Options for Software 3
INSERT INTO software_licensingoptions (licensing_options, software_id)
VALUES ('1 Month', 3),
       ('6 Months', 3),
       ('1 Year', 3);

-- Supported Platforms for Software 3
INSERT INTO software_supportedplatforms (supported_platforms, software_id)
VALUES ('Windows', 3),
       ('macOS', 3),
       ('Linux', 3);



-- PURCHASES

-- Purchase 1
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('3 Months', 19.98, '2024-02-18', 1, 1, CURRENT_DATE);

-- Software License 1 for Purchase 1
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software1 License', 'Active', '2024-02-18', '2024-05-18', CURRENT_DATE, 1, 1);

-- Purchase 2
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('1 Month', 12.99, '2024-03-10', 2, 3, CURRENT_DATE);

-- Software License 2 for Purchase 2
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software2 License', 'Active', '2024-03-10', '2024-04-10', CURRENT_DATE, 2, 3);

-- Purchase 4
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('6 Months', 49.95, '2024-04-05', 3, 1, CURRENT_DATE);

-- Software License 4 for Purchase 4
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software1 License', 'Active', '2024-04-05', '2024-10-05', CURRENT_DATE, 3, 1);

-- Purchase 5
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('1 Month', 12.99, '2024-03-01', 1, 3, CURRENT_DATE);

-- Software License 5 for Purchase 5
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software3 License', 'Expired', '2024-03-01', '2024-04-01', CURRENT_DATE, 1, 3);

-- Purchase 6
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('1 Year', 99.90, '2024-06-15', 2, 1, CURRENT_DATE);

-- Software License 6 for Purchase 6
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software1 License', 'Active', '2024-06-15', '2025-06-15', CURRENT_DATE, 2, 1);

-- Purchase 7
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('3 Months', 14.97, '2024-01-20', 3, 2, CURRENT_DATE);

-- Software License 7 for Purchase 7
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software2 License', 'Expired', '2024-01-20', '2024-04-20', CURRENT_DATE, 3, 2);

-- Purchase 8
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('6 Months', 29.94, '2024-08-25', 1, 2, CURRENT_DATE);

-- Software License 8 for Purchase 8
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software2 License', 'Active', '2024-08-25', '2025-02-25', CURRENT_DATE, 1, 2);

-- Purchase 9
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('1 Year', 99.90, '2024-02-20', 4, 1, CURRENT_DATE);

-- Software License 9 for Purchase 9
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software1 License', 'Active', '2024-02-20', '2025-02-20', CURRENT_DATE, 4, 1);

-- Purchase 10
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('6 Months', 24.95, '2023-09-10', 4, 2, CURRENT_DATE);

-- Software License 10 for Purchase 10
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software2 License', 'Active', '2023-09-10', '2024-03-10', CURRENT_DATE, 4, 2);

-- Purchase 11
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('3 Months', 19.98, '2023-07-05', 5, 1, CURRENT_DATE);

-- Software License 11 for Purchase 11
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software1 License', 'Expired', '2023-07-05', '2023-10-05', CURRENT_DATE, 5, 1);

-- Purchase 12
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('1 Month', 12.99, '2024-06-15', 5, 3, CURRENT_DATE);

-- Software License 12 for Purchase 12
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software3 License', 'Active', '2024-06-15', '2024-07-15', CURRENT_DATE, 5, 3);

-- Purchase 13
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('1 Year', 49.90, '2024-07-05', 6, 2, CURRENT_DATE);

-- Software License 13 for Purchase 13
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software2 License', 'Active', '2024-07-05', '2025-07-05', CURRENT_DATE, 6, 2);

-- Purchase 14
INSERT INTO purchases (licensing_option, price, purchase_date, customer_id, software_id, registration_date)
VALUES ('6 Months', 64.95, '2024-06-05', 6, 3, CURRENT_DATE);

-- Software License 14 for Purchase 14
INSERT INTO softwareLicences (name, status, activation_date, expiration_date, registration_date,
                              customer_id, software_id)
VALUES ('Software3 License', 'Active', '2024-06-05', '2024-12-05', CURRENT_DATE, 6, 3);



-- SSL CERTIFICATES

-- Ssl Certificate 1
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('DV', 'Active', 'Symantec', '2024-08-25', CURRENT_DATE, 1);

-- Ssl Certificate 2
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('OV', 'Expired', 'GeoTrust', '2024-11-11', CURRENT_DATE, 2);

-- Ssl Certificate 3
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('Wildcard', 'Expired', 'RapidSSL', '2023-10-20', CURRENT_DATE, 3);

-- Ssl Certificate 4
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('Wildcard', 'Active', 'Symantec', '2024-09-30', CURRENT_DATE, 1);

-- Ssl Certificate 5
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('Multi-Domain', 'Expired', 'GeoTrust', '2023-12-15', CURRENT_DATE, 2);

-- Ssl Certificate 6
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('EV', 'Expired', 'RapidSSL', '2024-09-01', CURRENT_DATE, 3);

-- SSL Certificate 7
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('Wildcard', 'Expired', 'DigiCert', '2023-12-31', CURRENT_DATE, 4);

-- SSL Certificate 8
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('EV', 'Active', 'Symantec', '2024-08-30', CURRENT_DATE, 4);

-- SSL Certificate 9
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('Multi-Domain', 'Active', 'Comodo', '2025-01-28', CURRENT_DATE, 5);

-- SSL Certificate 10
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('CodeSigning', 'Expired', 'GeoTrust', '2024-04-15', CURRENT_DATE, 5);

-- SSL Certificate 11
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('EV', 'Active', 'RapidSSL', '2025-08-31', CURRENT_DATE, 6);

-- SSL Certificate 12
INSERT INTO sslcertificates (type, status, issuer, expiration_date, registration_date, customer_id)
VALUES ('Wildcard', 'Active', 'Sectigo', '2025-12-31', CURRENT_DATE, 6);



-- Tasks

-- Tasks for User 1
INSERT INTO tasks (subject, status, priority, description, due_date, user_id)
VALUES ('Task 1 for User 1', 'Expired', 'High', 'Description of Task 1.', '2024-04-10', 1),
       ('Task 2 for User 1', 'In Progress', 'Medium', 'Description of Task 2.', '2024-05-15', 1),
       ('Task 3 for User 1', 'Completed', 'Low', 'Description of Task 3.', '2024-05-20', 1);

-- Tasks for User 2
INSERT INTO tasks (subject, status, priority, description, due_date, user_id)
VALUES ('Task 1 for User 2', 'Expired', 'High', 'Description of Task 1.', '2024-04-12', 2),
       ('Task 2 for User 2', 'In Progress', 'Medium', 'Description of Task 2.', '2024-05-17', 2),
       ('Task 3 for User 2', 'Completed', 'Low', 'Description of Task 3.', '2024-05-22', 2);

-- Tasks for User 3
INSERT INTO tasks (subject, status, priority, description, due_date, user_id)
VALUES ('Task 1 for User 3', 'Expired', 'High', 'Description of Task 1.', '2024-04-14', 3),
       ('Task 2 for User 3', 'In Progress', 'Medium', 'Description of Task 2.', '2024-05-19', 3),
       ('Task 3 for User 3', 'Completed', 'Low', 'Description of Task 3.', '2024-05-24', 3);



-- Contacts

-- Contact 1 (High priority) for User 1
INSERT INTO contacts (first_name, last_name, phone_number, email, registration_date, birth_date, notes, priority, user_id, company_id)
VALUES ('John', 'Doe', '1112223333', 'john.doe@example.com', CURRENT_DATE, '1995-03-10', 'This is a note for High priority contact', 'High', 1, 5);

-- Contact 2 (Low priority) for User 1
INSERT INTO contacts (first_name, last_name, phone_number, email, registration_date, birth_date, notes, priority, user_id, company_id)
VALUES ('Alice', 'Johnson', '4445556666', 'alice.johnson@example.com', CURRENT_DATE, '1988-07-21', 'This is a note for Low priority contact', 'Low', 1, 5);

-- Contact 1 (High priority) for User 2
INSERT INTO contacts (first_name, last_name, phone_number, email, registration_date, birth_date, notes, priority, user_id, company_id)
VALUES ('Michael', 'Brown', '7778889999', 'michael.brown@example.com', CURRENT_DATE, '1992-09-15', 'This is a note for High priority contact', 'High', 2, 4);

-- Contact 2 (Low priority) for User 2
INSERT INTO contacts (first_name, last_name, phone_number, email, registration_date, birth_date, notes, priority, user_id, company_id)
VALUES ('Emma', 'Wilson', '1239876543', 'emma.wilson@example.com', CURRENT_DATE, '1986-05-29', 'This is a note for Low priority contact', 'Low', 2, 6);

-- Contact 1 (High priority) for User 3
INSERT INTO contacts (first_name, last_name, phone_number, email, registration_date, birth_date, notes, priority, user_id)
VALUES ('David', 'Smith', '4567891230', 'david.smith@example.com', CURRENT_DATE, '1990-11-03', 'This is a note for High priority contact', 'High', 3);

-- Contact 2 (Low priority) for User 3
INSERT INTO contacts (first_name, last_name, phone_number, email, registration_date, birth_date, notes, priority, user_id)
VALUES ('Sophia', 'Miller', '9876543210', 'sophia.miller@example.com', CURRENT_DATE, '1994-02-18', 'This is a note for Low priority contact', 'Low', 3);



-- Events

INSERT INTO events (date, description, title, software_id)
VALUES ('2024-06-01', 'This is a new update where we will add new features, fix bugs and improve your experience, stay tuned !', 'Update time !', 1);

INSERT INTO events (date, description, title, software_id)
VALUES ('2024-06-01', 'This is a new update where we will add new features, fix bugs and improve your experience, stay tuned !', 'Update time !', 2);

INSERT INTO events (date, description, title, software_id)
VALUES ('2024-06-01', 'This is a new update where we will add new features, fix bugs and improve your experience, stay tuned !', 'Update time !', 3);

INSERT INTO events (date, description, title)
VALUES ('2024-05-09', 'This is a meeting to solve a customer problem !', 'Meeting');

INSERT INTO events (date, description, title)
VALUES ('2024-05-27', 'This is a personal event !', 'Personal');

INSERT INTO events (date, description, title)
VALUES ('2024-05-09', 'This is an event about a Software !', 'Software bug');

INSERT INTO user_events (event_id, user_id)
VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 3), (6, 1);

INSERT INTO event_users (user_id, event_id)
VALUES (1, 1), (1, 2), (1, 3), (2, 4), (3, 5), (1, 6);

INSERT INTO event_customers (event_id, customer_id)
VALUES (1, 1), (2, 1), (3, 1), (2, 2), (3, 2), (1, 3), (3, 3), (4, 1), (6, 2);

INSERT INTO customer_events (customer_id, event_id)
VALUES (1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 1), (3, 3), (1, 4), (2, 6);



-- Appointments

INSERT INTO appointments (call_url, start_time, end_time, related_to, type, id)
VALUES ('https://meet.google.com/', '12:00', '12:30', 'Meeting', 'Online', 4);

INSERT INTO appointments (call_url, start_time, end_time, related_to, type, id)
VALUES (' ', '12:00', '12:30', 'Other', 'In Person', 5);

INSERT INTO appointments (call_url, start_time, end_time, related_to, type, id)
VALUES ('https://meet.google.com/', '15:00', '15:30', 'Software', 'Online', 6);



-- Notifications

INSERT INTO notifications (content, status, timestamp, type, user_id, event_id)
VALUES ('Don''t forget, you have an event in three days!', false, '2024-05-06 00:00:00', 'IN_APP', 2, 4);

INSERT INTO notifications (content, status, timestamp, type, user_id, event_id)
VALUES ('Don''t forget, you have an event in three days!', false, '2024-05-06 00:00:00', 'IN_APP', 1, 6);





