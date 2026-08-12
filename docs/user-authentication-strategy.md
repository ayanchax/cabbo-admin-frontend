# User Authentication And Session Strategy

This document records the intended production direction for Cabbo system user authentication. The current V1 system user frontend stores the OTP login JWT in browser local storage and sends it as a Bearer token on API requests. That was acceptable for fast feature development, but the production direction is to move system user sessions to backend-managed, HttpOnly secure cookies.

## Current State

- system user login is username and password based.
- After successful verification, the backend returns an access token.
- `Login.jsx` stores the token in local storage through `useLocalStorage` via `useAuth`. We do not need either the `role` or the `access_token`
- `client.js` reads the token from local storage and attaches it to requests as:

```http
Authorization: Bearer <token>
```

This works functionally, but the token is readable by browser JavaScript and can be copied from local storage. If a token is stolen, it can be replayed from another browser or device until expiry or server invalidation.

## Target State

Cabbo system user authentication should use backend-managed sessions carried by HttpOnly secure cookies.

Recommended flow:

```txt
system user enters username and password
        ↓
Cabbo verifies it and creates/updates system user session record
        ↓        ↓
Backend sets HttpOnly Secure SameSite cookie
        ↓
Frontend calls APIs with credentials enabled
        ↓
Backend authenticates requests from the session cookie
```

The frontend should no longer store authentication tokens in local storage. Local storage may still be used for non-sensitive app state such as recent places, search context, and cached geography preferences.

## Why This Direction

- Browser JavaScript cannot read HttpOnly cookies, reducing token-theft risk from XSS.
- Users cannot easily copy an auth token from local storage and replay it elsewhere.
- Backend can revoke sessions on logout, suspicious activity, or account changes.
- Session records make device/session tracking, expiry, and future account-security features easier.
- The system user app remains simple: restore user state from the backend instead of trusting client-side token presence.

This does not fully protect an unlocked device with an active browser session. That risk should be handled with reasonable expiry, inactivity handling, logout, and future session management.But for a system user facing app this risk is not a direct risk created by Cabbo - this is more of carefulness of the system user to not leave their devices unlocked and unmonitored with an active session.

## Cookie Shape

The backend should set a system user session cookie after successful login.

Suggested attributes:

```http
Set-Cookie: cabbo_system user_session=<opaque-session-token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=<duration>
```

Recommended choices:

- Use an opaque random session token rather than exposing user data in the cookie.
- Store only a hash of the session token in the database.
- Use `HttpOnly` so frontend JavaScript cannot read the cookie.
- Use `Secure` so the cookie is sent only over HTTPS.
- Use `SameSite=Lax` as the default browser-friendly protection for normal system user navigation.
- Use a clear cookie name scoped to system user auth, such as `cabbo_system user_session`.

## Backend Session Record

Create a server-side session table/model for system user sessions.

Recommended fields:

- `id`
- `system user_id`
- `session_token_hash`
- `created_at`
- `last_used_at`
- `expires_at`
- `revoked_at`
- `revoked_reason`
- `user_agent`
- `ip_address` or coarse network metadata, if appropriate
- `device_label`, optional future enhancement

The backend should treat a session as invalid when:

- the token hash does not match any active session
- the session is expired
- the session is revoked
- the system user account is suspended/deactivated

## Frontend Changes

### API Client

Enable browser credentials on API requests:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

Remove the request interceptor that reads the auth token from local storage and sends the Bearer header.

### Login Verify

After successful verification:

- backend sets the session cookie
- frontend does not store an access token
- frontend navigates to the app after success
- frontend may store only safe profile/UI state if needed

### App Restore

Add or use a backend endpoint such as:

```http
GET /system user/me
```

or:

```http
GET /auth/session
```

On app load, the frontend calls this endpoint to restore the logged-in system user. If the endpoint returns 401, the user is treated as logged out.

### Logout

Logout should call a backend endpoint, for example:

```http
POST /auth/logout
```

The backend should:

- revoke the current session record
- clear the session cookie

The frontend should:

- clear system user-specific query/cache state
- clear non-sensitive local auth UI state
- navigate back to login

## CSRF Position

Cookie-based authentication requires CSRF awareness because browsers attach cookies automatically.

For V1, use at least:

- `SameSite=Lax` on the session cookie
- CORS restricted to Cabbo frontend origins
- no wildcard credentialed CORS
- backend method and origin checks for sensitive mutations where practical

For stronger hardening, add a CSRF token pattern for sensitive mutation endpoints:

- backend issues a non-HttpOnly CSRF token or returns it from a session bootstrap endpoint
- frontend sends it in a header such as `X-CSRF-Token`
- backend validates the token for state-changing requests

 
## Non-Goals For This Step

- Do not introduce enterprise SSO or third-party identity management for the system user app.
- Do not add a cookie banner for essential auth cookies only.
- Do not store sensitive authentication tokens in local storage, session storage, IndexedDB, or readable JavaScript state after migration.
- Do not depend on frontend role/status checks for authorization. Backend authorization remains the source of truth.

## Decision

Cabbo system user auth will remain username and password based and backend owned. The production hardening path is to replace local-storage JWT persistence with backend-managed, revocable HttpOnly cookie sessions.
