# MarketLink Server — Cloud DB Ready

This Express + MongoDB/Mongoose backend implements the MarketLink API layer and is ready for MongoDB Atlas.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` to your MongoDB Atlas connection string.
3. Set a strong `JWT_SECRET`.
4. Set `CLIENT_URL` to your React frontend origin.
5. Run `npm install`.
6. Run `npm run seed:demo` to create demo farmers, markets, categories, pickup slots and 25 products.
7. Run `npm run seed:admin` to create the admin account from the environment variables.
8. Run `npm run dev`.

Health: `GET /api/health`

## API areas

Auth, Products, Markets, Farmers, Orders, Reviews, Favorites, Notifications, Pickup Slots, Categories, Announcements, Admin management, Customer/Farmer dashboards, Profiles and the optional AI assistant.

## Cloud DB

The repository does not contain real MongoDB credentials. Add your Atlas `MONGO_URI` to `.env`; the server connects at startup and retries after connection failure.

## MongoDB connection troubleshooting

For a local MongoDB Server/Compass setup, use:

```env
MONGO_URI=mongodb://localhost:27017/marketlink
```

Compass is a client; the MongoDB Server/service itself must be running on port 27017. The API now waits for a successful database connection before announcing that it is listening, and authentication routes are blocked while MongoDB is unavailable so Mongoose queries do not sit in the buffer and fail later with `users.findOne() buffering timed out`.
