# AceRound Backend

Authenticated Node.js / Express / MongoDB API for the AceRound interview-prep app.
Replaces the old localStorage-only frontend with real accounts, real data storage,
and dynamically AI-generated interview questions.

## What changed vs. the old frontend-only version

| Before (frontend only)                          | Now (this backend)                                             |
|---------------------------------------------------|------------------------------------------------------------------|
| Users stored in `localStorage`, plaintext password | Users in MongoDB, passwords hashed with bcrypt                 |
| Fake `mock-token-<id>` in `localStorage`          | Real JWT in an **httpOnly cookie** (not reachable by JS/XSS)    |
| Interview results in `localStorage`               | Interviews stored in MongoDB, scoped to the logged-in user      |
| Fixed 20-question static bank per role            | Questions generated dynamically by **Gemini or OpenAI**, with an automatic static fallback so it never breaks |
| Correct answers shipped to the browser up front   | Correct answers stay server-side until you submit the interview |

## Stack

- Express 4
- MongoDB + Mongoose
- JWT auth via httpOnly cookies (`jsonwebtoken`, `cookie-parser`)
- `bcryptjs` password hashing
- `helmet`, `cors`, `express-rate-limit`, `express-mongo-sanitize`, `express-validator`
- Gemini (`GEMINI_API_KEY`) or OpenAI (`OPENAI_API_KEY`) for dynamic question generation

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env — at minimum set MONGO_URI and JWT_SECRET
npm run dev      # nodemon, auto-restarts
# or
npm start
```

### MongoDB

- **Local**: install MongoDB Community Server, then `MONGO_URI=mongodb://127.0.0.1:27017/aceround`
- **Atlas (free tier, no local install needed)**: create a cluster at https://cloud.mongodb.com,
  get the connection string, set it as `MONGO_URI` (looks like
  `mongodb+srv://user:pass@cluster.mongodb.net/aceround`)

### JWT secret

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Put the result in `JWT_SECRET`.

### AI question generation (optional but recommended)

Set `AI_PROVIDER` to `gemini`, `openai`, or `groq`, and provide the matching API key:

- **Groq (recommended — free, no credit card)**: get a key at https://console.groq.com/keys → `GROQ_API_KEY`. Extremely fast (runs on dedicated LPU hardware), generous free-tier rate limits (14,400 requests/day).
- **Gemini (free)**: get a key at https://aistudio.google.com/apikey → `GEMINI_API_KEY`. Note: brand-new Gemini models can return `503 UNAVAILABLE` for the first days/weeks after launch due to high demand — if that happens, switch to Groq or an older-but-stable Gemini model.
- **OpenAI (paid)**: get a key at https://platform.openai.com/api-keys → `OPENAI_API_KEY`. Requires billing set up on your OpenAI account.

**If you leave both keys empty, or set `AI_PROVIDER=none`, the app still works** —
it automatically uses the built-in static question bank (200 questions across
10 roles, ported from the original frontend) instead. Every AI call is also
wrapped in a try/catch that falls back to the static bank on any failure
(bad key, rate limit, network issue, malformed AI output), so a broken key
never takes the app down.

## OAuth setup (optional — Google / GitHub sign-in)

The app works fine with just email/password. To enable "Continue with Google/GitHub" buttons:

**Google:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create an OAuth Client ID (Application type: **Web application**)
3. Add an Authorized redirect URI: `https://aceround-backend.onrender.com///api/auth/google/callback`
4. Copy the Client ID and Client Secret into `.env` → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**GitHub:**
1. Go to https://github.com/settings/developers → "New OAuth App"
2. Set the Authorization callback URL to: `https://aceround-backend.onrender.com/api/auth/github/callback`
3. Copy the Client ID and generate a Client Secret into `.env` → `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

Restart the backend after adding these. If a key is missing, the corresponding button simply redirects back to the login page with a friendly error instead of crashing.

## Admin dashboard

Any user with `role: 'admin'` in MongoDB sees an "Admin" link in the nav and can access `/admin` (frontend) and `/api/admin/*` (backend) — platform-wide stats: total users, completed interviews, average score, most-practiced roles, AI-vs-static question source breakdown, and a recent-users table.

There's no signup flow for admins (by design, for safety). To make your own account an admin: open MongoDB Atlas → Browse Collections → `users` → find your user document → edit the `role` field from `"user"` to `"admin"` → save. Log out and back in for the change to take effect.

## API overview

All routes are prefixed with `/api`. Auth uses an httpOnly cookie set by the
server — the frontend just needs `credentials: "include"` on its fetch calls
(already wired up in `src/services/api.js`).

| Method | Route                        | Auth | Description |
|--------|-------------------------------|------|-------------|
| POST   | `/auth/register`              | –    | Create account, sets auth cookie |
| POST   | `/auth/login`                 | –    | Log in, sets auth cookie |
| POST   | `/auth/logout`                | –    | Clears auth cookie |
| GET    | `/auth/me`                    | ✓    | Current user |
| PATCH  | `/auth/profile`               | ✓    | Update name/email |
| PATCH  | `/auth/password`              | ✓    | Change password |
| DELETE | `/auth/account`               | ✓    | Delete account + all interview history |
| GET    | `/auth/google`, `/auth/github`| –    | Start OAuth sign-in (browser redirect) |
| GET    | `/questions/roles`             | ✓    | List of roles with a guaranteed fallback bank |
| POST   | `/resume/extract`              | ✓    | Extract text from an uploaded PDF/.txt resume |
| POST   | `/interviews/start`            | ✓    | Generates questions (role, count, difficulty, targetCompany, resumeText), returns them **without** correct answers |
| POST   | `/interviews/:id/submit`       | ✓    | Scores the interview server-side, returns full detail incl. correct answers/explanations |
| GET    | `/interviews`                  | ✓    | Summary list of your completed interviews (for the Dashboard) |
| GET    | `/interviews/:id`               | ✓    | Full detail of one completed interview (for the Results review) |

## Security notes

- Passwords hashed with bcrypt (cost factor 12), never returned in API responses.
- Auth token lives in an httpOnly, sameSite cookie — not in localStorage, so it
  can't be stolen via XSS the way `mock-token-...` in localStorage could be.
- 5 failed logins locks the account for 15 minutes.
- Rate limiting on auth routes and on the (expensive) AI generation route.
- `express-mongo-sanitize` strips `$`/`.` operators from request bodies to
  block NoSQL-injection payloads.
- Interview correct answers are never sent to the client until after submit —
  the previous version calculated the score in the browser using data the
  user already had, which meant a technically savvy user could see answers
  early. Scoring now happens entirely server-side.

## Folder structure

```
backend/
  server.js              # entrypoint
  src/
    app.js                # express app + middleware wiring
    config/db.js           # mongoose connection
    models/                # User, Interview
    middleware/             # auth, error handler, rate limiters
    controllers/             # route handlers
    routes/                   # route definitions
    services/
      aiQuestionService.js    # Gemini / OpenAI generation + fallback logic
      fallbackQuestions.js     # static question bank (ported from the old frontend)
    utils/                      # asyncHandler, ApiError, JWT helpers
```
