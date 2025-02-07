Task Management API
Overview
This API provides a simple task management system where users can register, log in, manage their tasks, and interact with other users (admin roles allowed).

Features
User Authentication: Register and log in with JWT-based authentication.
User Management: Admin users can manage all users, and non-admin users can manage only their own tasks.
Task Management: Create, read, update, and delete tasks with filtering, sorting, and pagination.
Role-based Access Control: Admin users have special privileges for managing tasks and users.
Installation
1. Clone the repository:

git clone https://github.com/swains313/task_managent.git
cd task_management
2. Install dependencies:

npm install
3. Set Up Environment Variables:
Copy the example.env file to .env:

cp example.env .env
Update the .env file with your MongoDB URL. If you're using MongoDB Atlas, your MongoDB URL will look like this:



When you first start the server, a default admin will be created with the following credentials:
Email: admin@gmail.com
Password: admin@123

5. Run the Server:
After configuring the environment variables, you can start the server with:
npm start

6. Run Tests:
To run automated tests for authentication, user management, and task management, use the following command:
npm test

API Documentation
You can import the provided Postman collection (task-management.postman_collection.json) to view and test all available API endpoints.

Postman Collection:
The API endpoints for the Task Management System are included in the task-management.postman_collection.json file. To use the collection:

 API Endpoints Overview:
POST /api/v1/auth/register: Register a new user.
POST /api/v1/auth/login: Log in with email and password (returns JWT).
GET /api/v1/users: Get all users (admin only).
GET /api/v1/users/{id}: Get a specific user (admin only).
PUT /api/v1/users/{id}: Update user info (admin only).
DELETE /api/v1/users/{id}: Delete user (admin only).
POST /api/v1/tasks: Create a new task.
GET /api/v1/tasks: Get all tasks (filter and sort by status, priority, due date).
GET /api/v1/tasks/{id}: Get a specific task.
PUT /api/v1/tasks/{id}: Update task details.
DELETE /api/v1/tasks/{id}: Delete a task.