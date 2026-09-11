# 🚀 Noorm REST API

A simple REST API built with **Node.js** for a simple article web application.

This project was created to learn how to build **CRUD operations with a database without using an ORM**, using only native SQL queries and a simple migration runner script.

---

## ✨ Features

* **Node.js** — Express, bcrypt for password hashing, Zod for payload validation, and PostgreSQL driver.
* **RESTful API** — Uses standard HTTP methods for all processes.
* **Error Handling** — Provides clear error messages for failed processes.
* **Posts** — Create new posts, like other people's posts, and comment on posts.
* **Users** — Create new accounts and edit user profiles.
* **Database Migration** — A simple migration runner script for managing database changes.

---

## ⚡ Quick Start

### 1. Build

Build the project before starting the server:

```bash
npm run build
```

### 2. Start

Start the API server:

```bash
npm run start
```

### 3. Check the API

Open your browser and access:

```text
http://localhost:5000/api
```

If the API is running correctly, you should get a response from the server.

---

## 📖 API Documentation

You can use **Postman** to explore and test the available API endpoints.

The API documentation includes:

* Authentication
* User management
* Post management
* Comments and replies
* Request body examples
* Response examples
* Error responses

---

## 🛠️ Next Steps

Here are some features and improvements planned for the next version:

* Docker Containerization
* API Rate Limiting
* Favorite Posts
* Logging
