CREATE TABLE users (
                       id BINARY(16) DEFAULT (uuid_to_bin(uuid())) NOT NULL PRIMARY KEY,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL
);

CREATE TABLE tasks (
                       id BINARY(16) DEFAULT (uuid_to_bin(uuid())) NOT NULL PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       status VARCHAR(20),
                       priority VARCHAR(20),
                       due_date DATE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       user_id BINARY(16),
                       CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (email, password, role)
VALUES ('admin@gmail.com', '$2a$12$xiJr3Pv0vsSf79USrIE9oeFHYdUyG7jIOr7DyZPFDuN/bSvMkNAkC', 'ADMIN');