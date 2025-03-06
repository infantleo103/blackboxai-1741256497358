# Fashion Hub Backend API

RESTful API for Fashion Hub e-commerce platform built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a .env file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fashion-hub
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
BCRYPT_SALT_ROUNDS=10
```

3. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication Routes
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - Login user
- GET `/api/v1/auth/logout` - Logout user
- GET `/api/v1/auth/me` - Get current user
- PUT `/api/v1/auth/updatedetails` - Update user details
- PUT `/api/v1/auth/updatepassword` - Update password

### Product Routes
- GET `/api/v1/products` - Get all products
- GET `/api/v1/products/:id` - Get single product
- POST `/api/v1/products` - Create new product (Admin)
- PUT `/api/v1/products/:id` - Update product (Admin)
- DELETE `/api/v1/products/:id` - Delete product (Admin)
- GET `/api/v1/products/stats/all` - Get product statistics (Admin)

### Order Routes
- POST `/api/v1/orders` - Create new order
- GET `/api/v1/orders` - Get all orders (Admin)
- GET `/api/v1/orders/my` - Get user orders
- GET `/api/v1/orders/:id` - Get single order
- PUT `/api/v1/orders/:id/status` - Update order status (Admin)
- GET `/api/v1/orders/stats/all` - Get order statistics (Admin)

## Models

### User Model
- name: String (required)
- email: String (required, unique)
- password: String (required)
- role: String (enum: ['user', 'admin'])
- createdAt: Date

### Product Model
- name: String (required)
- description: String (required)
- price: Number (required)
- category: String (required)
- stock: Number
- imageUrl: String
- isCustomizable: Boolean
- customizationOptions: Object
  - colors: Array
  - sizes: Array
  - printLocations: Array
- createdAt: Date
- updatedAt: Date

### Order Model
- user: ObjectId (ref: 'User')
- items: Array
  - product: ObjectId (ref: 'Product')
  - quantity: Number
  - price: Number
  - customization: Object
    - color: String
    - size: String
    - printLocation: String
    - customText: String
    - designUrl: String
- totalAmount: Number
- status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
- shippingAddress: Object
- paymentStatus: String
- paymentMethod: String
- createdAt: Date
- updatedAt: Date

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API includes centralized error handling with appropriate status codes and error messages. Common error scenarios:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Data Validation

Input validation is implemented using Mongoose schemas with required fields and appropriate data types.
