# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Authentication security model

The frontend uses a split-token strategy to reduce risk if browser storage is compromised:

- **Preferred mode (default): HttpOnly cookie refresh sessions**
  - Configure `VITE_AUTH_USE_COOKIE_REFRESH=true` (default).
  - Refresh token handling is delegated to backend-issued `HttpOnly`, `Secure`, `SameSite` cookies.
  - The SPA keeps the **access token in memory only** and sends refresh requests with `withCredentials`.
  - Result: JavaScript cannot read the refresh token directly, which lowers XSS blast radius.

- **Fallback mode: body-based refresh token**
  - Set `VITE_AUTH_USE_COOKIE_REFRESH=false` only if the backend cannot issue refresh cookies.
  - A refresh token is retained in persisted auth state so session continuity still works after reload.
  - The app stores only minimal persisted fields (`refreshToken` and refresh-session marker), never the access token.
  - Refresh rotation is applied aggressively: when the backend returns a new refresh token during refresh, the client replaces the old one immediately.

### Forced logout behavior

When refresh fails (expired/invalid token, cookie revoked, or refresh endpoint error), the app:

1. Clears all auth state atomically (`accessToken`, `refreshToken`, session marker, and persisted auth storage).
2. Redirects the user to `/login`.
3. Shows a session-expired notification.

This guarantees there is no stale auth residue left in memory or storage after a failed refresh attempt.

### Security trade-offs

- **Cookie refresh (recommended)**
  - Pros: refresh token not exposed to JS; strongest default for browsers.
  - Cons: requires backend CORS + credential configuration and careful CSRF controls.

- **Persisted refresh token fallback**
  - Pros: easier compatibility with token-only backends.
  - Cons: any storage-access vulnerability has higher impact than HttpOnly cookies.

- **In-memory access token**
  - Pros: token disappears on hard reload/tab close; reduced long-lived token exposure.
  - Cons: app may need a refresh round-trip after reload before protected API calls succeed.

## Django backend CORS/CSRF reference

If your API is served by Django, align backend settings with the frontend auth model:

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "corsheaders",
    # ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # keep near the top
    "django.middleware.common.CommonMiddleware",
    # ...
]

# Use exact frontend origins (no wildcard) for production + staging.
CORS_ALLOWED_ORIGINS = [
    "https://<frontend-production-origin>",
    "https://<frontend-staging-origin>",
]

CSRF_TRUSTED_ORIGINS = [
    "https://<frontend-production-origin>",
    "https://<frontend-staging-origin>",
]

# Explicit headers used by SPA auth requests.
from corsheaders.defaults import default_headers
CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
    "content-type",
]

# Scope CORS handling to API routes and include preflight OPTIONS.
CORS_URLS_REGEX = r"^/api/.*$"
```

### OPTIONS preflight behavior for `/api/*`

- Ensure your reverse proxy (nginx, ingress, CDN) forwards `OPTIONS` requests to Django for `/api/*`.
- Verify `CorsMiddleware` is enabled and ordered before response-short-circuiting middleware.
- Validate preflight with:

```bash
curl -i -X OPTIONS "https://<api-origin>/api/v2/lexicon/" \
  -H "Origin: https://<frontend-production-origin>" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,content-type"
```

The response should include an allow-origin header matching the caller origin, allow-headers including `authorization` and `content-type`, and an allow-methods list that covers your request method.

### Cookie auth hardening checklist (if moving from bearer-only)

```python
# Cross-site cookie usage for SPA <-> API on different domains.
SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SECURE = True
```

- Keep `CSRF_TRUSTED_ORIGINS` set to the exact frontend production and staging origins.
- Send credentialed requests from the SPA (`withCredentials: true` / `credentials: "include"`).
- Expose a CSRF bootstrap endpoint (or template render) that sets the CSRF cookie, then include `X-CSRFToken` on unsafe methods (`POST`, `PUT`, `PATCH`, `DELETE`).
- Do **not** disable CSRF checks for session/cookie-authenticated API routes.
