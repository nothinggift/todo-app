Register a new user:

POST http://localhost:3000/auth/register
Content-Type: application/json

{
"email": "user@example.com",
"password": "password123"
}
Login to get a JWT token:

POST http://localhost:3000/auth/login
Content-Type: application/json

{
"email": "user@example.com",
"password": "password123"
}
This will return a JWT token. Use this token in the Authorization header for subsequent requests.

Create a new todo:

POST http://localhost:3000/todos
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
"content": "My first todo"
}
Get all todos:

GET http://localhost:3000/todos
Authorization: Bearer <your_jwt_token>
Get a specific todo:

GET http://localhost:3000/todos/:id
Authorization: Bearer <your_jwt_token>
Update a todo:

PUT http://localhost:3000/todos/:id
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
"content": "Updated todo content",
"completed": true
}
Delete a todo:

DELETE http://localhost:3000/todos/:id
Authorization: Bearer <your_jwt_token>