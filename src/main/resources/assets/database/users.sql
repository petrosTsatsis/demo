INSERT INTO roles VALUES (1,'ROLE_ADMIN');
INSERT INTO roles VALUES(2,'ROLE_MANAGER');

INSERT INTO users (last_name, first_name, email, password, username, description)
VALUES ('Admin', 'Test', 'admin@gmail.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'admin', 'This is the admin');

INSERT INTO users (last_name, first_name, email, password, username, description)
VALUES ('Manager', 'Test', 'manager@gmail.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'manager', 'This is the manager');

INSERT INTO user_roles values(1,1);
INSERT INTO user_roles values(2,2);
