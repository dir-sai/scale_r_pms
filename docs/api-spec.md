# Scale-R PMS API Specification

## Authentication Endpoints

### POST /auth/login

Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "admin" | "property_manager" | "landlord" | "tenant" | "maintenance",
    "phoneNumber": "string?",
    "profileImage": "string?",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string",
  "refreshToken": "string"
}
```

### POST /auth/register

Registers a new user.

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "admin" | "property_manager" | "landlord" | "tenant" | "maintenance",
  "phoneNumber": "string?"
}
```

**Response:** Same as login endpoint

### POST /auth/reset-password

Initiates password reset process.

**Request Body:**

```json
{
  "email": "string"
}
```

**Response:**

```json
{
  "message": "Password reset instructions sent to email"
}
```

### POST /auth/verify-email

Verifies user's email address.

**Request Body:**

```json
{
  "token": "string"
}
```

**Response:**

```json
{
  "message": "Email verified successfully"
}
```

### POST /auth/refresh-token

Refreshes an expired JWT token.

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response:**

```json
{
  "token": "string",
  "refreshToken": "string"
}
```

### POST /auth/google

Authenticates user with Google.

**Request Body:**

```json
{
  "token": "string" // Google OAuth access token
}
```

**Response:** Same as login endpoint

### POST /auth/facebook

Authenticates user with Facebook.

**Request Body:**

```json
{
  "token": "string" // Facebook OAuth access token
}
```

**Response:** Same as login endpoint

## User Endpoints

### GET /user/profile

Gets the current user's profile.

**Response:**

```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "admin" | "property_manager" | "landlord" | "tenant" | "maintenance",
  "phoneNumber": "string?",
  "profileImage": "string?",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT /user/profile

Updates the current user's profile.

**Request Body:**

```json
{
  "firstName": "string?",
  "lastName": "string?",
  "phoneNumber": "string?",
  "profileImage": "string?"
}
```

**Response:** Same as GET /user/profile

### POST /user/change-password

Changes the current user's password.

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

## Authentication

All endpoints except `/auth/login`, `/auth/register`, and `/auth/reset-password` require authentication via Bearer token:

```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Other endpoints: 60 requests per minute

## CORS Configuration

The API should be configured to accept requests from:

- `http://localhost:19000` (Expo development)
- `https://scale-r-pms.com` (Production)
- `exp://localhost:19000`
- `https://auth.expo.io`
