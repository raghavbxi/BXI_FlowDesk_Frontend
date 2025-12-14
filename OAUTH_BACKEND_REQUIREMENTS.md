# OAuth Backend API Requirements

This document specifies the exact API endpoints and formats required for OAuth integration in the frontend.

## Overview

The frontend expects the backend to handle OAuth authentication using a **redirect-based flow** (OAuth 2.0 Authorization Code Flow). The flow works as follows:

1. Frontend requests OAuth URL from backend
2. User is redirected to OAuth provider (Google, GitHub, etc.)
3. OAuth provider redirects back with authorization code
4. Frontend sends code to backend to exchange for JWT token

---

## Required API Endpoints

### 1. Get OAuth Authorization URL

**Endpoint:** `GET /api/auth/oauth/:provider/url`

**Description:** Returns the OAuth provider's authorization URL that the user should be redirected to.

**URL Parameters:**
- `provider` (string, required): OAuth provider name (e.g., `google`, `github`, `microsoft`)

**Query Parameters:** None

**Request Headers:**
```
Content-Type: application/json
```

**Response Format:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=...&state=..."
}
```

**Response Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid provider
- `500 Internal Server Error`: Server error

**Example Request:**
```http
GET /api/auth/oauth/google/url
```

**Example Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=123456789.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/oauth/callback&response_type=code&scope=openid%20email%20profile&state=random_state_string"
}
```

**Backend Implementation Notes:**
- Generate a secure `state` parameter for CSRF protection
- Store the `state` value (e.g., in session or database) to validate on callback
- Include the redirect URI: `{FRONTEND_URL}/auth/oauth/callback`
- Required scopes for Google: `openid email profile`

---

### 2. Handle OAuth Callback

**Endpoint:** `GET /api/auth/oauth/:provider/callback`

**Description:** Exchanges the authorization code from OAuth provider for a JWT token and user information.

**URL Parameters:**
- `provider` (string, required): OAuth provider name (e.g., `google`, `github`, `microsoft`)

**Query Parameters:**
- `code` (string, required): Authorization code from OAuth provider
- `state` (string, optional): State parameter for CSRF protection

**Request Headers:**
```
Content-Type: application/json
```

**Response Format (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

**Response Format (Error):**
```json
{
  "message": "Invalid authorization code",
  "error": "invalid_code"
}
```

**Response Status Codes:**
- `200 OK`: Success - user authenticated
- `400 Bad Request`: Invalid code or state
- `401 Unauthorized`: Authentication failed
- `500 Internal Server Error`: Server error

**Example Request:**
```http
GET /api/auth/oauth/google/callback?code=4/0AeanS0X...&state=random_state_string
```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzEyMzQ1Njc4OTAxIiwiaWF0IjoxNzM0NTY3ODkwfQ...",
  "user": {
    "_id": "6712345678901",
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "avatar": "https://lh3.googleusercontent.com/a/...",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Backend Implementation Notes:**
1. **Validate state parameter** - Check that the state matches what was stored during URL generation
2. **Exchange code for tokens** - Use OAuth provider's token endpoint to exchange authorization code for access token
3. **Get user info** - Use access token to fetch user profile from OAuth provider
4. **Create or update user** - If user exists (by email), update their info; if not, create new user
5. **Generate JWT token** - Create JWT token using your existing auth system (same format as OTP login)
6. **Return token and user** - Return the same format as your existing `/auth/login` endpoint

---

## Optional: Token-Based OAuth Login

If you prefer a token-based flow (where frontend handles OAuth and sends token to backend):

**Endpoint:** `POST /api/auth/oauth/:provider/login`

**Description:** Authenticates user using OAuth access token directly.

**URL Parameters:**
- `provider` (string, required): OAuth provider name

**Request Body:**
```json
{
  "token": "ya29.a0AfH6SMC..."
}
```

**Response Format:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

**Note:** This endpoint is optional. The redirect-based flow (endpoints 1 & 2) is recommended and already implemented in the frontend.

---

## Backend Configuration Requirements

### 1. OAuth Provider Setup

For **Google OAuth**, you need:
- Google Cloud Console project
- OAuth 2.0 Client ID
- Client Secret
- Authorized redirect URI: `{FRONTEND_URL}/auth/oauth/callback`

### 2. Environment Variables

Your backend should have:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000  # or your production URL
JWT_SECRET=your_jwt_secret  # Same as used for OTP login
```

### 3. State Management

- Store `state` parameter when generating OAuth URL
- Validate `state` on callback to prevent CSRF attacks
- State can be stored in:
  - Session storage
  - Redis (with expiration)
  - Database (with expiration)

---

## Example Backend Implementation (Node.js/Express)

```javascript
// GET /api/auth/oauth/:provider/url
router.get('/oauth/:provider/url', async (req, res) => {
  const { provider } = req.params;
  
  if (provider === 'google') {
    const state = generateSecureState(); // Store this
    const redirectUri = `${process.env.FRONTEND_URL}/auth/oauth/callback`;
    const scopes = 'openid email profile';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${state}`;
    
    // Store state in session/redis/db
    await storeState(state, req.sessionId);
    
    res.json({ url: authUrl });
  } else {
    res.status(400).json({ message: 'Invalid provider' });
  }
});

// GET /api/auth/oauth/:provider/callback
router.get('/oauth/:provider/callback', async (req, res) => {
  const { provider } = req.params;
  const { code, state } = req.query;
  
  // Validate state
  const isValidState = await validateState(state);
  if (!isValidState) {
    return res.status(400).json({ message: 'Invalid state parameter' });
  }
  
  if (provider === 'google') {
    try {
      // Exchange code for tokens
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.FRONTEND_URL}/auth/oauth/callback`,
        grant_type: 'authorization_code',
      });
      
      const { access_token } = tokenResponse.data;
      
      // Get user info from Google
      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      
      const { email, name, picture } = userResponse.data;
      
      // Find or create user
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          name,
          avatar: picture,
          authProvider: 'google',
        });
      } else {
        // Update user info
        user.name = name;
        user.avatar = picture;
        await user.save();
      }
      
      // Generate JWT token (same as your OTP login)
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(401).json({ message: 'OAuth authentication failed' });
    }
  } else {
    res.status(400).json({ message: 'Invalid provider' });
  }
});
```

---

## Testing Checklist

- [ ] `GET /api/auth/oauth/google/url` returns valid Google OAuth URL
- [ ] OAuth URL includes correct redirect URI
- [ ] State parameter is generated and stored
- [ ] `GET /api/auth/oauth/google/callback` validates state
- [ ] Callback exchanges code for access token
- [ ] Callback fetches user info from Google
- [ ] Callback creates new user if email doesn't exist
- [ ] Callback updates existing user if email exists
- [ ] Callback returns JWT token in same format as OTP login
- [ ] Callback returns user object in same format as OTP login
- [ ] Error handling for invalid codes
- [ ] Error handling for invalid states
- [ ] CORS configured for frontend URL

---

## Summary

**Minimum Required:**
1. `GET /api/auth/oauth/:provider/url` - Returns OAuth authorization URL
2. `GET /api/auth/oauth/:provider/callback?code=...&state=...` - Exchanges code for JWT token

**Response Format:** Must match your existing `/auth/login` endpoint format:
```json
{
  "token": "jwt_token_string",
  "user": { /* user object */ }
}
```

The frontend is already configured to work with these endpoints. Just implement them in your backend!

