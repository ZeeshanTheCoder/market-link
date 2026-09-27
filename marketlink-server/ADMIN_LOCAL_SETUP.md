# MarketLink Admin — Local Demo

The Admin Console is already part of the frontend and is protected by the `admin` role.

## Demo admin
- Email: `admin@gmail.com`
- Password: `admin123`

## Automatic database bootstrap
When the server starts successfully after MongoDB connects, it automatically creates/repairs this admin account in MongoDB for local/demo use. No separate `npm run seed:admin` command is required.

## Admin routes
- `/admin/dashboard`
- `/admin/farmers`
- `/admin/customers`
- `/admin/markets`
- `/admin/products`
- `/admin/reviews`
- `/admin/categories`
- `/admin/announcements`
- `/admin/reports`

For production, set your own `ADMIN_PASSWORD` and disable automatic seeding with `ADMIN_AUTO_SEED=false`.
