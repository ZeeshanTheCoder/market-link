# MarketLink — after-change setup & deployment

## What was added

- Admin Products now has **Add to cart** and a dedicated **Admin Product Cart**.
- Customer cart continues to support quantity changes and removal.
- Order events create notifications for the customer, farmer, and active admins.
- Admin announcements notify the selected audience.
- Farmer profile has latitude/longitude fields, **Use my current location**, and an OpenStreetMap preview.
- Marketplace search supports farmer-name matching plus **Find near me** and a radius filter.
- Admin Reports can publish a report to a selected audience, create notifications, and download a Word-compatible `.doc` file.
- Farmer and Admin portals now have a Notifications page.

## Database

The server accepts either:

```env
MONGO_URI=mongodb+srv://...
```

or:

```env
MONGODB_URI=mongodb+srv://...
```

For Railway, add the variable in the Railway service Variables section. Do not commit the real MongoDB password to GitHub.

Recommended production variables:

```env
NODE_ENV=production
MONGO_URI=YOUR_ATLAS_CONNECTION_STRING
CLIENT_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
ADMIN_NAME=MarketLink Admin
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=YOUR_STRONG_ADMIN_PASSWORD
ADMIN_AUTO_SEED=true
```

If your MongoDB Atlas password contains special URL characters, URL-encode them in the connection string.

## Railway backend

1. Push the updated `marketlink-server` folder to GitHub.
2. Create a Railway project and deploy from the GitHub repository.
3. Set the Railway **Root Directory** to `marketlink-server` if the repository contains both client and server.
4. Railway should use:
   - Build: `npm install`
   - Start: `npm start`
5. Add the production environment variables above.
6. The backend API base URL will be similar to:
   `https://YOUR-RAILWAY-DOMAIN.up.railway.app/api`
7. Open the Railway public domain and confirm the server health response if your existing app health route is enabled.

## Vercel frontend

1. Import the same GitHub repository into Vercel.
2. Set the **Root Directory** to `marketlink-client`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add:
   ```env
   VITE_API_BASE_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app/api
   ```
6. Redeploy after saving the variable.

## MongoDB Atlas

In Atlas:

1. Create/use the database user.
2. Confirm the database user's password.
3. In Network Access, allow the deployment traffic according to your Atlas security setup.
4. Copy the connection string into Railway as `MONGO_URI`.
5. Do not put the connection string in frontend/Vercel variables.

## Final test order

1. Open Vercel site.
2. Register/login.
3. Open customer Products.
4. Search a farmer/product.
5. Test **Find near me** after granting browser location permission.
6. Add products to cart.
7. Place an order after selecting a valid pickup date/slot.
8. Check customer Notifications.
9. Login as farmer and check Orders + Notifications.
10. Login as admin and check Product Cart, Notifications and Reports.
11. Publish an admin report.
12. Confirm the selected audience receives the notification.
13. Download the report as a Word-compatible `.doc` file.

The database remains external to the frontend. Vercel should never receive `MONGO_URI`.
