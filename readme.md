# 🚀 Noorm REST API

A simple REST API built with **Node.js** for an article web application.

This project was created as a learning project to understand how to build **CRUD operations with a database without using an ORM**, using native SQL queries and a simple migration runner script.

## ✨ Features

* **Node.js** — Built with Express, bcrypt for password hashing, Zod for payload validation, and the PostgreSQL driver.
* **RESTful API** — Uses standard HTTP methods for handling API operations.
* **Error Handling** — Provides clear and consistent error messages for failed requests.
* **Posts** — Create posts, like other people's posts, and comment on posts.
* **Users** — Create accounts and update user profiles.
* **Database Migration** — Uses a simple custom migration runner to manage database schema changes.

## ⚡ Quick Start

### 1. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 2. Build

Build the project before starting the server:

```bash
npm run build
```

### 3. Start

Start the API server:

```bash
npm run start
```

### 4. Check the API

Once the server is running, open:

```text
http://localhost:5000/api
```

If the API is running correctly, you should receive a response from the server.

## 📖 API Documentation

The complete API documentation is available through Postman:

**[View API Documentation](https://documenter.getpostman.com/view/39800955/2sBYAysTuN)**

The documentation includes:

* Authentication
* User management
* Post management
* Comments and replies
* Request body examples
* Response examples
* Error responses

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **bcrypt**
* **Zod**
* **Native SQL Queries**
* **Postman**

## 🚧 Next Steps

Planned features and improvements for future versions:

* [ ] Docker Containerization
* [ ] API Rate Limiting
* [ ] Favorite Posts
* [ ] Logging
