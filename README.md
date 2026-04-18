# Anas Market Backend

A secure Node.js backend for Anas Market with authentication and product management.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your MongoDB URI, JWT secret, and frontend URL.

4. Start the server:
   ```bash
   npm start
   ```

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin
- **Input Validation**: Email format and password strength validation
- **Input Sanitization**: XSS protection for product data
- **JWT Authentication**: Secure token-based auth

## API Endpoints

- `GET /` - Health check
- `POST /api/auth/signup` - User registration (email validation, strong password required)
- `POST /api/auth/login` - User login
- `GET /api/dashboard` - Protected dashboard (requires token)
- `POST /api/products/add` - Add product (requires token, input sanitized)
- `GET /api/products` - Get all products

## Validation Rules

- **Email**: Must be valid email format
- **Password**: Minimum 6 characters, must contain uppercase, lowercase, and number
- **Product Name**: Required, sanitized
- **Product Price**: Required, must be positive number

## Usage

Include the JWT token in the Authorization header as `Bearer <token>` for protected routes.