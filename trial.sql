-- create database trial;
    CREATE DATABASE trial;

-- drop TABLES
    DROP TABLE IF EXISTS users;

-- CREATE TABLES
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL,
        business_category VARCHAR(255) NOT NULL,
        token VARCHAR(255),
        activated BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- INSERT DATA
    INSERT INTO users (first_name,last_name, email, password,role) VALUES ('John','Doe' 'flexywork327@gmail.com', '123456','admin');

-- SELECT DATA
    SELECT * FROM users;

-- Delete DATA
    DELETE FROM users WHERE id = 1;

-- Show items in table
    SELECT * FROM users;

-- update items in table
    UPDATE users SET first_name = 'John' WHERE id = 1;    