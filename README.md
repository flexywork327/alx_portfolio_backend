# Introduction to Portfolio Project for ALX

This is a portfolio project for ALX to showcase the skills and experience earned in the ALX Software Engineering program for the foundational period.

## Technologies

- Node JS
- Python
- JavaScript
- Express JS
- Nodemailer
- JWT
- Cloudinary
- Multer
- Bcrypt
- PostgreSQL
- Cors

## Setup

- Clone this repository to your local machine using

```
  $ git clone https://github.com/flexywork327/portfolio_backend.git
```

- cd into the cloned repository

  ```
  $ cd portfolio_backend
  ```

- Install the required dependencies

  ```
  $ npm install
  ```

- Create a .env file in the root directory of the project and add the following environment variables

  ```
  PORT = 5000
  JWT_SECRET = your_secret_key
  POSTGRESS_USERNAME = your_postgress_username
  POSTGRESS_PASSWORD = your_postgress_password
  POSTGRESS_DB = your_postgress_db
  POSTGRESS_HOST = your_postgress_host
  POSTGRESS_PORT = your_postgress_port

  CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
  CLOUDINARY_API_KEY = your_cloudinary_api_key
  CLOUDINARY_API_SECRET = your_cloudinary_api_secret
  ```

- Run the application

  ```
  $ npm run dev
  ```

- The application should now be running at http://localhost:5000

## Database Schema

- connecting the database to the application

  ```
  const pool = new Pool({
    user: process.env.POSTGRESS_USERNAME,
    password: process.env.POSTGRESS_PASSWORD,
    host: process.env.POSTGRESS_HOST,
    port: process.env.POSTGRESS_PORT,
    database: process.env.POSTGRESS_DB,
  });
  ```

- switching to psql user from your terminal

  ```
  $ sudo -u postgres psql
  ```

## API Documentation

The API documentation for this project can be found [here](https://documenter.getpostman.com/view/13392160/Tz5tZ6QJ)

## Author

- [Felix Asare](https://github.com/flexywork327)

- [Foster Adu-Gyamfi](https://github.com/Foxynero)
