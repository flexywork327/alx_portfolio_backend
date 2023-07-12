-- create database ;
    CREATE DATABASE portfolio;

-- connect to database
    \c portfolio;
    \d -- show all tables in database
    \d users -- show all tables in users database
    \? -- show all commands


-- create table for Admin
    CREATE TABLE admin (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- CREATE TABLES FOR THE SELLERS
    CREATE TABLE sellers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL UNIQUE,
        country VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL UNIQUE,
        business_category VARCHAR(255) NOT NULL,
        token VARCHAR(255),
        activated BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO SELLERS (first_name,last_name, email, password,company_name,country,contact,business_category) 
    VALUES ('John','Doe','flexywork327@gmail.com', '123456','flexywork','Nigeria','09012345678','fashion');

-- CREATE TABLES FOR THE SHOPPERS
    CREATE TABLE shoppers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        token VARCHAR(255),
        activated BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- CREATE TABLES FOR THE PRODUCTS
    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        product_category VARCHAR(255) NOT NULL,
        product_description VARCHAR(65530) NOT NULL,
        product_price VARCHAR(255) NOT NULL,
        product_quantity VARCHAR(255) NOT NULL,
        product_image VARCHAR(255) NOT NULL,
        product_section VARCHAR(255),
        seller_id INTEGER NOT NULL,
        product_activated BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        image_id VARCHAR(255),
    );


-- CREATE TABLES FOR THE CART
    CREATE TABLE cart (
        cart_id SERIAL PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        product_category VARCHAR(255) NOT NULL,
        product_description VARCHAR(65530) NOT NULL,
        product_price VARCHAR(255) NOT NULL,
        product_quantity VARCHAR(255) NOT NULL,
        product_image VARCHAR(255) NOT NULL,
        product_section VARCHAR(255),
        seller_id INTEGER NOT NULL,
        product_activated BOOLEAN,
        cart_quantity VARCHAR(255),
        shopper_id INTEGER NOT NULL,
        total_cost VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- CREATE TABLES FOR THE industries
    CREATE TABLE industries (
        id SERIAL PRIMARY KEY,
        industry_name VARCHAR(255) NOT NULL UNIQUE
    );

-- CREATE TABLES FOR product sections
    CREATE TABLE product_sections (
        id SERIAL PRIMARY KEY,
        product_section_name VARCHAR(255) NOT NULL UNIQUE
    );

-- CREATE TABLES FOR THE categories
    CREATE TABLE product_categories (
        id SERIAL PRIMARY KEY,
        product_category_name VARCHAR(255) NOT NULL UNIQUE
    );
    


-- drop TABLES
    DROP TABLE IF EXISTS users;

-- INSERT DATA
    INSERT INTO users (first_name,last_name, email, password,role) VALUES ('John','Doe' 'flexywork327@gmail.com', '123456','admin');


-- Delete DATA
    DELETE FROM users WHERE id = 1;

-- Show items in table
    SELECT * FROM users;

-- update items in table
    UPDATE users SET first_name = 'John' WHERE id = 1;    

-- modify column
    ALTER TABLE products MODIFY product_description VARCHAR(65530) NOT NULL;
    
-- insert new column 
    ALTER TABLE products ADD image_id VARCHAR(255) DEFAULT 'no image';
