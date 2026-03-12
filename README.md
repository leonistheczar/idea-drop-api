# 💡 IdeaDrop API

> **Backend REST API for the IdeaDrop Project** — A platform for capturing, managing, and sharing ideas.

Built with **Node.js**, **Express 5**, and **MongoDB Atlas**, featuring JWT-based authentication, secure password hashing, and a clean modular architecture.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Database Setup](#database-setup)
- [API Reference](#api-reference)
  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
  - [Idea Routes](#idea-routes)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Author](#author)
- [License](#license)

---

## Overview

IdeaDrop API is a RESTful backend service that powers the IdeaDrop application. It provides:

- **User management** — registration, login, profile management
- **Idea management** — create, read, update, and delete ideas
- **Secure authentication** — JWT tokens via `jose`, stored in HTTP-only cookies
- **Password security** — bcrypt hashing with `bcryptjs`
- **MongoDB integration** — cloud-hosted via MongoDB Atlas, browsable with MongoDB Compass

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose 9 |
| Authentication | JWT (`jose`) + HTTP-only cookies |
| Password Hashing | `bcryptjs` |
| Environment | `dotenv` |
| CORS | `cors` |
| Cookie Parsing | `cookie-parser` |

---

## Project Structure

```
idea-drop-api/
├── config/
│   └── db.js               # MongoDB Atlas connection setup
├── middleware/
│   └── authMiddleware.js   # JWT verification middleware
├── models/
│   ├── User.js             # Mongoose User schema & model
│   └── Idea.js             # Mongoose Idea schema & model
├── routes/
│   ├── authRoutes.js       # Register / Login / Logout
│   ├── userRoutes.js       # User profile routes (protected)
│   └── ideaRoutes.js       # CRUD routes for ideas (protected)
├── utils/
│   └── generateToken.js    # JWT creation helper using jose
├── .gitignore
├── package.json
├── package-lock.json
└── server.js               # App entry point
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works fine)
- *(Optional)* [MongoDB Compass](https://www.mongodb.com/products/compass) for visual database browsing

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/leonistheczar/idea-drop-api.git

# 2. Navigate into the project directory
cd idea-drop-api

# 3. Install dependencies
npm install
```

---

### Environment Variables

Create a `.env` file in the root of the project. This file is listed in `.gitignore` and should **never** be committed to version control.

```env
# Server
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ideadrop?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default: `5000`) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g., `7d`, `24h`) |
| `NODE_ENV` | `development` or `production` |

---

### Running the Server

```bash
# Production
npm start

# Development (auto-restarts on file changes via --watch)
npm run dev
```

The server will start on `http://localhost:5000` (or the port defined in `.env`).

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

---

## Database Setup

This project uses **MongoDB Atlas** as the cloud database.

### Setting Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster.
2. Under **Database Access**, create a database user with a username and password.
3. Under **Network Access**, add your IP address (or `0.0.0.0/0` for all IPs during development).
4. Click **Connect → Connect your application** and copy the connection string.
5. Paste the connection string into your `.env` as `MONGO_URI`, replacing `<username>` and `<password>`.

### Browsing Data with MongoDB Compass

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass).
2. Open Compass and paste your `MONGO_URI` into the connection field.
3. Click **Connect** — you'll be able to visually browse collections (`users`, `ideas`) and run queries.

---

## API Reference

All routes are prefixed with `/api`. Protected routes require a valid JWT token sent via an HTTP-only cookie.

### Base URL

```
http://localhost:5000/api
```

---

### Auth Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear the auth cookie |

#### Register — `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Muhammad Ali",
  "email": "ali@example.com",
  "password": "securepassword123"
}
```

**Success Response `201`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Muhammad Ali",
  "email": "ali@example.com"
}
```

---

#### Login — `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "ali@example.com",
  "password": "securepassword123"
}
```

**Success Response `200`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Muhammad Ali",
  "email": "ali@example.com"
}
```
> A JWT is set as an HTTP-only cookie named `token`.

---

#### Logout — `POST /api/auth/logout`

Clears the `token` cookie.

**Success Response `200`:**
```json
{
  "message": "Logged out successfully"
}
```

---

### User Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Protected | Get logged-in user's profile |
| `PUT` | `/api/users/profile` | Protected | Update logged-in user's profile |

#### Get Profile — `GET /api/users/profile`

**Success Response `200`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Muhammad Ali",
  "email": "ali@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Update Profile — `PUT /api/users/profile`

**Request Body** *(all fields optional)*:
```json
{
  "name": "Ali Updated",
  "email": "new@example.com",
  "password": "newpassword456"
}
```

---

### Idea Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/ideas` | Protected | Get all ideas for the logged-in user |
| `GET` | `/api/ideas/:id` | Protected | Get a single idea by ID |
| `POST` | `/api/ideas` | Protected | Create a new idea |
| `PUT` | `/api/ideas/:id` | Protected | Update an existing idea |
| `DELETE` | `/api/ideas/:id` | Protected | Delete an idea |

#### Get All Ideas — `GET /api/ideas`

**Success Response `200`:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "title": "Build a habit tracker app",
    "description": "An app that helps users build and maintain daily habits.",
    "user": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]
```

---

#### Create Idea — `POST /api/ideas`

**Request Body:**
```json
{
  "title": "Build a habit tracker app",
  "description": "An app that helps users build and maintain daily habits."
}
```

**Success Response `201`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "title": "Build a habit tracker app",
  "description": "An app that helps users build and maintain daily habits.",
  "user": "64f1a2b3c4d5e6f7a8b9c0d1",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

---

#### Update Idea — `PUT /api/ideas/:id`

**Request Body** *(all fields optional)*:
```json
{
  "title": "Updated Title",
  "description": "Updated description."
}
```

---

#### Delete Idea — `DELETE /api/ideas/:id`

**Success Response `200`:**
```json
{
  "message": "Idea removed"
}
```

---

## Authentication

Authentication is handled using **JSON Web Tokens (JWT)** via the `jose` library.

- On login, a signed JWT is generated and stored in an **HTTP-only cookie** (`token`), making it inaccessible to JavaScript on the client and protecting against XSS attacks.
- Protected routes use the `authMiddleware` to verify the token from the cookie.
- If the token is missing or invalid, the server responds with `401 Unauthorized`.
- Passwords are hashed using **bcryptjs** before being stored in the database. Plain-text passwords are never persisted.

---

## Middleware

### `authMiddleware.js`

Applied to all protected routes. Extracts and verifies the JWT from the `token` cookie, attaches the decoded user to `req.user`, and calls `next()` if valid.

```
Request → Cookie Extracted → JWT Verified (jose) → req.user Set → Next()
                                      ↓ (invalid/missing)
                               401 Unauthorized
```

---

## Scripts

```bash
# Start the server (production)
npm start        # runs: node server.js

# Start in development mode with auto-reload
npm run dev      # runs: node --watch server.js
```

> **Note:** `npm run dev` uses Node's native `--watch` flag (available from Node v18+), so no `nodemon` dependency is required.

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | Web framework |
| `mongoose` | ^9.2.3 | MongoDB ODM |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `jose` | ^6.1.3 | JWT creation and verification |
| `cookie-parser` | ^1.4.7 | Parse HTTP cookies |
| `cors` | ^2.8.6 | Enable Cross-Origin Resource Sharing |
| `dotenv` | ^17.3.1 | Load environment variables from `.env` |

---

## Author

**Muhammad Ali**
- GitHub: [@leonistheczar](https://github.com/leonistheczar)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

> Made with ☕ and 💡 by Muhammad Ali
