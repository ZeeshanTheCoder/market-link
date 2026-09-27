# MarketLink JWT setup

The server loads `marketlink-server/.env` directly, regardless of the directory from which `npm run dev` is launched.

For local Compass/MongoDB Server use:

```env
MONGO_URI=mongodb://localhost:27017/marketlink
JWT_SECRET=marketlink-local-dev-secret-change-me
PORT=5000
CLIENT_URL=http://localhost:5173
```

In development, if `JWT_SECRET` is missing, the server uses a local fallback secret so login/register do not fail with `secretOrPrivateKey must have a value`.
For production, always set a strong `JWT_SECRET`.
