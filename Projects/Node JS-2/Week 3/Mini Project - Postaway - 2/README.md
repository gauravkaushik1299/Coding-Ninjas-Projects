# Mini Project - Postaway-II

---

# Postaway-II: Social Media Backend API

## Objective

Postaway-II is a **social media backend REST API** built using **Node.js, Express.js, and MongoDB**.

The API allows users to:

- Register and authenticate accounts
- Create posts
- Comment on posts
- Like posts and comments
- Send and accept friend requests
- Reset passwords using OTP authentication
- Update user profile information including avatar uploads

The project follows a **modular MVC architecture** to ensure scalability and maintainability.

---

# Features

### User Authentication

- User signup
- User login
- Logout
- Logout from all devices
- JWT-based authentication

### Post Management

- Create posts with captions and optional images
- Retrieve news feed posts
- Retrieve a specific post
- Update posts
- Delete posts
- Get posts created by a specific user

### Comment System

- Add comments on posts
- Update comments
- Delete comments
- Retrieve comments for a post

### Like System

- Like or unlike posts
- Like or unlike comments
- Retrieve list of likes

### Friendship System

- Send friend request
- Accept or reject friend request
- Get friends list
- Get pending friend requests

### User Profile

- Retrieve user profile details
- Update user profile information
- Upload user avatar

### OTP-Based Password Reset

- Send OTP to registered email
- Verify OTP
- Reset password securely

---

# Technologies Used

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose ODM

### Authentication

- JSON Web Tokens (JWT)

### Email Service

- Nodemailer (for OTP email delivery)

### File Upload

- Multer (for avatar uploads)

### Environment Variables

- dotenv

### Security & Middleware

- Helmet
- Morgan
- Custom error middleware

---

# Project Structure

project-root
│
├── config
│ └── db.js
│
├── controllers
│ ├── authController.js
│ ├── commentController.js
│ ├── friendController.js
│ ├── likeController.js
│ ├── otpController.js
│ ├── postController.js
│ └── userController.js
│
├── middlewares
│ ├── authMiddleware.js
│ ├── avatarUpload.js
│ └── errorMiddleware.js
│
├── models
│ ├── commentModel.js
│ ├── likeModel.js
│ ├── otpModel.js
│ ├── postModel.js
│ └── userModel.js
│
├── routes
│ ├── authRoutes.js
│ ├── commentRoutes.js
│ ├── friendRoutes.js
│ ├── likeRoutes.js
│ ├── otpRoutes.js
│ ├── postRoutes.js
│ └── userRoutes.js
│
├── utils
│ ├── emailUtils.js
│ ├── sendOtp.js
│ └── tokenUtils.js
│
├── uploads
│ └── avatars
│
├── index.js
├── package.json
└── .env.example

---

# Installation & Setup

## 1. Clone the Repository

---

# Installation & Setup

## 1. Clone the Repository

git clone https://github.com/<your-repository-url>
cd postaway_backend

---

## 2. Install Dependencies

npm install

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:
PORT=3000

MONGO_URI=mongodb://127.0.0.1:27017/postaway

ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

OTP_EXPIRY=300000

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

---

## 4. Start the Server

Run the application:

npm start

or for development:

npm run dev

Server will start on:

http://localhost:3000

---

# API Endpoints

## Authentication Routes

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | `/api/users/signup`             | Register a new user     |
| POST   | `/api/users/signin`             | Login user              |
| POST   | `/api/users/logout`             | Logout current session  |
| POST   | `/api/users/logout-all-devices` | Logout from all devices |

---

## User Profile Routes

| Method | Endpoint                            | Description      |
| ------ | ----------------------------------- | ---------------- |
| GET    | `/api/users/get-details/:userId`    | Get user profile |
| GET    | `/api/users/get-all-details`        | Get all users    |
| PUT    | `/api/users/update-details/:userId` | Update profile   |
| PUT    | `/api/users/update-avatar/:userId`  | Upload avatar    |

---

## Post Routes

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | `/api/posts/all`     | Retrieve all posts     |
| GET    | `/api/posts/:postId` | Retrieve specific post |
| POST   | `/api/posts`         | Create new post        |
| PUT    | `/api/posts/:postId` | Update post            |
| DELETE | `/api/posts/:postId` | Delete post            |

---

## Comment Routes

| Method | Endpoint                   | Description    |
| ------ | -------------------------- | -------------- |
| GET    | `/api/comments/:postId`    | Get comments   |
| POST   | `/api/comments/:postId`    | Add comment    |
| PUT    | `/api/comments/:commentId` | Update comment |
| DELETE | `/api/comments/:commentId` | Delete comment |

---

## Like Routes

| Method | Endpoint                | Description |
| ------ | ----------------------- | ----------- |
| GET    | `/api/likes/:id`        | Get likes   |
| POST   | `/api/likes/toggle/:id` | Toggle like |

---

## Friendship Routes

| Method | Endpoint                                     | Description           |
| ------ | -------------------------------------------- | --------------------- |
| GET    | `/api/friends/get-friends/:userId`           | Get friends           |
| GET    | `/api/friends/get-pending-requests`          | Pending requests      |
| POST   | `/api/friends/toggle-friendship/:friendId`   | Send/remove request   |
| POST   | `/api/friends/response-to-request/:friendId` | Accept/reject request |

---

## OTP Routes

| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| POST   | `/api/otp/send`           | Send OTP       |
| POST   | `/api/otp/verify`         | Verify OTP     |
| POST   | `/api/otp/reset-password` | Reset password |

---

# Testing

The API can be tested using **Postman**.

Steps:

1. Import the Postman collection.
2. Configure environment variables.
3. Test endpoints sequentially.

---

# Future Improvements

- Real-time notifications using WebSockets
- Rate limiting and enhanced security
- Image upload for posts
- Notification system
- GraphQL support

---

# License

This project is licensed under the **MIT License**.

---

**Author: GK**
