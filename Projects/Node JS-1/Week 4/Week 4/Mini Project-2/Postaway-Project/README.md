# Postaway API

Postaway is a modular social media REST API built using Express.js and in-memory data structures.

This project implements user authentication, post creation with media upload, likes, comments, logging, and centralized error handling. The application follows a feature-based architecture and uses JWT-based authentication to secure protected routes.

Author: GK12

---

## Features

- User Registration
- User Login (JWT Authentication)
- Create Post (with image upload)
- View All Posts
- View User-Specific Posts
- View Single Post
- Update Post
- Delete Post
- Add Comment
- Update Comment
- Delete Comment
- Toggle Like (Like / Unlike)
- View Likes on a Post
- Centralized Error Handling
- Request Logging using Winston
- Feature-Based Modular Architecture

---

## Additional Enhancements Implemented

The following features were added beyond the basic assignment requirements:

- Pagination for posts using `page` and `limit` query parameters
- Caption-based post filtering using `search` query parameter
- Post sorting (latest and oldest)
- Draft post support
- Archive post support
- Structured request logging with timestamp and user ID tracking
- Secure JWT authentication using Authorization header

---

## Project Structure

Project Structure

src/
├── features/
│ ├── user/
│ ├── post/
│ ├── comment/
│ └── like/
├── middleware/

server.js
README.md

The project follows:

- Repository Pattern
- ES6 Modules
- Centralized Error Middleware
- JWT-Based Route Protection
- In-Memory Data Storage

---

## Installation & Setup

1. Download the project from GitHub: https://github.com/gauravkaushik1299/Coding-Ninjas-Projects

2. Install dependencies:

   npm install

3. Start the server:

Development mode:
npm run dev

Production mode:
npm start

Server runs at: http://localhost:3000

---

## Authentication

1. Register user: POST /api/v1/users/signup

2. Login user: POST /api/v1/users/signin

You will receive a JWT token in the response.

3. Use the token for protected routes:

Add this header:

Authorization: Bearer <your_token>

All routes except /api/v1/users require authentication.

---

## Post Query Features

Pagination: GET /api/v1/posts/all?page=1&limit=5

Search by caption: GET /api/v1/posts/all?search=travel

Sort posts: GET /api/v1/posts/all?sort=latest
GET /api/v1/posts/all?sort=oldest

Create draft post: {
"caption": "My draft",
"isDraft": true
}

Archive post: {
"isArchived": true
}

---

## Image Upload

Uploaded files are stored in: public/uploads/

Uploaded images can be accessed at:

http://localhost:3000/uploads/<generated_filename>

---

## Logging

All non-user API requests are logged in:

combined.log

The file is automatically created when the first request is logged.

You can delete the empty `combined.log` file before submission. It will be recreated automatically when the server runs.

---

## Notes

- Data is stored in-memory.
- Restarting the server resets all data.
- Passwords are stored in plain text for assignment purposes only.
- No external database is used.
- No `.env` file is required.
- JWT secret uses an internal development fallback.

---

## Tech Stack

- Node.js
- Express.js
- JSON Web Token (jsonwebtoken)
- Multer
- Winston
- ES6 Modules
