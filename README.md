# CohortX

CohortX is a community app for software builders to share projects, discover other makers, and keep in touch. It combines a project feed and profiles with social features, direct messages, and Zoom-backed live sessions.

## Features

- **Accounts and profiles:** Register with an email and password, sign in, or configure GitHub OAuth. Profiles include a bio, avatar, social links, and follower/following lists.
- **Project showcases:** Publish a project with a description and optional GitHub, demo, and media links. Browse the feed, explore projects, and view project details.
- **Community activity:** Follow builders, like and comment on projects, and receive notifications about activity.
- **Stories:** Share image or video stories with captions. Stories have an expiry time.
- **Direct messages:** Start conversations with other users, search for people, and exchange messages. Socket.IO delivers messages to connected conversation participants in real time.
- **Live sessions:** Create and end live sessions using Zoom meetings, browse active sessions, track a viewer count, and attach a recording URL.

## Technology

| Area | Technology |
| --- | --- |
| Web client | React 19, Vite 8, React Router |
| API | Node.js, Express 5 |
| Database | PostgreSQL, Prisma 6 |
| Live messaging | Socket.IO |
| Authentication | Passport local strategy, JWT, optional GitHub OAuth |
| Media | Cloudinary integration for uploaded media |
| Live meetings | Zoom Server-to-Server OAuth and Meetings API |

The client and server are separate npm projects. The client calls the API over HTTP and opens a Socket.IO connection to the same API host.

## Repository layout

```text
client/
  src/
    components/   Reusable interface components
    context/      Shared client state, including authentication
    layout/       Application layout
    pages/        Route-level screens
    services/     API client
server/
  prisma/
    schema.prisma PostgreSQL data model
  src/
    config/       Database, authentication, and upload configuration
    controllers/  Request handlers
    middleware/   Authentication and request middleware
    routes/       HTTP route definitions
    services/     External service integrations
```

## Prerequisites

- Node.js and npm versions compatible with the dependencies in the client and server package manifests.
- PostgreSQL.
- Optional credentials for the integrations you want to use: GitHub OAuth, Cloudinary uploads, and Zoom live-session creation.

## Run locally

### 1. Configure the API

From the repository root:

```bash
cd server
npm install
```

Create `server/.env` from the example file:

```bash
cp .env.example .env
```

In PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set `DATABASE_URL` to a PostgreSQL database you can access. The example uses a local database named `cohortx`. Set distinct, private values for `SESSION_SECRET` and `JWT_SECRET`.

Generate the Prisma client and apply the database migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the API in development mode:

```bash
npm run dev
```

The API listens on port `5000` by default. Its root endpoint, `http://localhost:5000/`, returns a small status response.

### 2. Configure the client

Open a second terminal from the repository root:

```bash
cd client
npm install
```

Set the client API URL in `client/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
```

The client falls back to this local API URL when `VITE_API_URL` is unset. Start the Vite development server:

```bash
npm run dev
```

Vite serves the client at `http://localhost:5173` by default. Keep both terminals running while developing.

## Configuration

The server reads `server/.env`. The available example variables are:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `5000`. |
| `CLIENT_URL` | Client origin used for CORS and OAuth redirects; the local default is `http://localhost:5173`. |
| `API_URL` | API's externally reachable base URL for integrations that need it. |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `SESSION_SECRET` | Secret for Express sessions. Set a private value outside local development. |
| `JWT_SECRET` | Secret for signing authentication tokens. Set a private value outside local development. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth application credentials; needed only for GitHub sign-in. |
| `GITHUB_CALLBACK_URL` | OAuth callback registered with the GitHub application; the example is `http://localhost:5000/auth/github/callback`. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials for media uploads. |
| `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` | Zoom Server-to-Server OAuth credentials used when creating live sessions. Add these to `server/.env` to enable that integration. |

The Zoom variables are read by the live-session integration but are not currently listed in `server/.env.example`. GitHub OAuth, Cloudinary uploads, and Zoom live-session creation each depend on credentials from their respective providers.

Only expose `VITE_*` values to the browser. Do not put server secrets in client environment variables.

## API areas

The Express app mounts these route groups at the API root:

- `/auth` — registration, login, logout, current user, and GitHub OAuth.
- `/users` — user search, profiles, and follow relationships.
- `/projects` — project browsing and project interactions.
- `/feed` and `/stories` — feed and story content.
- `/upload` — media uploads.
- `/github` — GitHub profile lookup.
- `/conversations` and `/messages` — inbox and direct messages.
- `/notifications` — notifications and unread counts.
- `/live` — live session creation and management.
- `/webhooks` — provider webhooks.

Real-time chat uses Socket.IO events for joining and leaving a conversation and receiving messages.

## Available scripts

Run these commands from the relevant project directory:

| Directory | Command | Description |
| --- | --- | --- |
| `client` | `npm run dev` | Start Vite development server. |
| `client` | `npm run build` | Build the client for production. |
| `client` | `npm run preview` | Preview a built client locally. |
| `client` | `npm run lint` | Run ESLint. |
| `server` | `npm run dev` | Start the API with nodemon. |
| `server` | `npm start` | Start the API with Node.js. |

## Troubleshooting

- **The browser reports `ERR_CONNECTION_REFUSED` for port 5000:** Start the API and check its terminal for database or startup errors.
- **The client reaches the wrong API:** Set `VITE_API_URL=http://localhost:5000` in `client/.env`, then restart Vite.
- **The API cannot reach PostgreSQL:** Check that PostgreSQL is running, the database exists, and `DATABASE_URL` has the correct host, port, database, username, and password. Re-run `npx prisma migrate dev` after configuring the connection.
- **GitHub sign-in is unavailable:** Configure the GitHub OAuth credentials and callback URL in `server/.env` and in the GitHub OAuth application.
- **Uploads or live-session creation fail:** Check the corresponding Cloudinary or Zoom credentials in `server/.env`.

## Development notes

- Keep the API and client origins aligned with `CLIENT_URL` and `VITE_API_URL`; the API uses credentialed CORS for the client.
- Update `server/prisma/schema.prisma` and create a Prisma migration when changing database models.
- Keep credentials in local environment files and provider dashboards, not in source control.
