# CohortX

## Local Development

Run the API server and React client in two terminals:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

By default, the client runs on `http://localhost:5173` and calls the API at
`http://localhost:5000`. If you change ports, copy the example env files and
update the URLs:

- `client/.env.example` -> `client/.env`
- `server/.env.example` -> `server/.env`

If the browser console shows `net::ERR_CONNECTION_REFUSED` for
`localhost:5000`, the backend is not running or crashed before it started
listening.
