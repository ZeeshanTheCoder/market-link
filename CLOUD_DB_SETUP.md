# MarketLink — MongoDB Atlas + Full MERN Setup

## 1. MongoDB Atlas
Create a MongoDB Atlas cluster and a database user. Copy the Atlas connection string and put it in `marketlink-server/.env`:

`MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/marketlink?retryWrites=true&w=majority`

In Atlas Network Access, allow the IP address of the machine/server that will run the API.

## 2. Server environment
Copy `marketlink-server/.env.example` to `marketlink-server/.env` and set:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- optional `OPENAI_API_KEY`

Do not commit `.env` or real credentials.

## 3. Install + seed

From `marketlink-server`:

`npm install`

`npm run seed:demo`

`npm run seed:admin`

The demo seed creates 25 marketplace products, 8 approved farmers, 4 markets, 7 categories and pickup slots.

## 4. Run server

`npm run dev`

Health check: `GET http://localhost:5000/api/health`

## 5. Connect React client

Copy `marketlink-client/.env.example` to `marketlink-client/.env` and set:

`VITE_API_BASE_URL=http://localhost:5000/api`

Then from `marketlink-client`:

`npm install`

`npm run dev`

The frontend is wired to the Express API for products, profiles, pickup slots, orders, favorites, reviews, notifications and admin/farmer management, with local state kept only as an offline fallback.

## Production

For deployment, set the production API URL in `VITE_API_BASE_URL`, set the production frontend origin in `CLIENT_URL`, use a strong `JWT_SECRET`, and configure the production Atlas IP/network access rule.
