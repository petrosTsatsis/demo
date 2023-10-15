INSERT INTO roles VALUES (1,'ROLE_ADMIN');
INSERT INTO roles VALUES(2,'ROLE_MANAGER');
INSERT INTO roles VALUES(3,'ROLE_USER');

INSERT INTO users (email, password, username) VALUES ('admin@gmail.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'admin');
INSERT INTO users (email, password, username) VALUES ('manager@gmail.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'manager');
INSERT INTO users (email, password, username) VALUES ('user@gmail.com', '$2a$12$UQBpJuYn9nhq/MDdWBgw.OmcTrcaDhve03L0Tf89iemyxoZRrByIy', 'user');

INSERT INTO user_roles values(1,1);
INSERT INTO user_roles values(2,2);
INSERT INTO user_roles values(3,3);
