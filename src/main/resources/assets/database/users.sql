INSERT INTO roles VALUES (1,'ROLE_ADMIN');
INSERT INTO roles VALUES(2,'ROLE_MANAGER');

INSERT INTO users (last_name, first_name, email, password, username) VALUES ('Test', 'Admin', 'admin@gmail.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'admin');
INSERT INTO users (last_name, first_name, email, password, username) VALUES ('Test', 'Manager', 'manager@gmail.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'manager');

INSERT INTO user_roles values(1,1);
INSERT INTO user_roles values(2,2);
