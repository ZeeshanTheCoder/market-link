**MARKETLINK — MERN PROJECT REQUIREMENTS**

*Theme: eGreen Basket | Techwiz 7 | MERN Stack*

This document converts the MarketLink SRS into a practical development blueprint. The SRS requirements remain the source of truth; implementation details below are organized for a MERN-based team project.

# **1. Project Overview**

MarketLink is a full-stack web application connecting local farmers-market farmers with customers. Farmers can publish weekly stock and prices and manage pickup pre-orders. Customers can discover markets/farmers, browse products, reserve items for pickup, and leave reviews and ratings.

· Project: MarketLink

· Theme: eGreen Basket

· Category: End-to-End Web Solutions

· Stack: MongoDB + Express.js + React + Node.js (MERN)

· Payments: No online payment gateway; payment is settled at pickup.

· Delivery: Out of scope; the system supports market pickup.

· Farmer identity/licensing/food-safety verification: Out of scope.

# **2. Architecture**

Three-tier MERN architecture:

· Frontend: React + Vite, React Router, Axios, Context API, Tailwind CSS, charts/icons as needed.

· Backend: Node.js + Express.js REST API.

· Database: MongoDB with Mongoose.

· Authentication: JWT + bcryptjs.

· Maps: Google Maps API or OpenStreetMap. Recommended implementation: OpenStreetMap + Leaflet initially.

· Optional AI: Customer assistant/chatbot after the core requirements are complete.

Flow:

React Frontend → Axios → Express/Node REST API → Mongoose → MongoDB

# **3. Roles & Permissions**

## **3.1 Customer**

· Register and securely log in.

· Manage profile: name, contact number, email, address.

· Browse nearby markets and farmers.

· View farmer profiles and current weekly stock.

· Search and filter products by price, category, market, and market day.

· View product details.

· Add products to cart and place pickup pre-orders.

· Select pickup date and available time slot.

· View, modify, and cancel eligible orders.

· View order history and reorder previous items.

· Favorite farmers and products.

· View market/farmer locations and directions.

· Rate and review farmers/products after completed orders.

· Receive order confirmations and ready-for-pickup notifications.

· Optionally use the AI assistant.

## **3.2 Farmer**

· Register with stall/business and contact information.

· Maintain farmer profile, markets, operating days, pickup windows and location.

· Add, edit, view and delete products.

· Manage weekly stock and prices.

· Use recurring weekly stock templates.

· Mark products sold out or temporarily unavailable.

· View incoming pre-orders.

· Accept or decline orders.

· Mark orders ready for pickup.

· Set order cutoff times and pickup slots.

· View order history and sales insights.

· View total orders, pending orders and revenue summary.

· View best-selling products.

· View customer reviews and optionally respond.

## **3.3 Admin**

· Secure admin login and dedicated dashboard.

· View total farmers, customers, markets and orders.

· Approve or suspend farmer registrations.

· Activate or deactivate customer accounts.

· Add, edit and remove markets.

· Moderate/remove inappropriate product listings and reviews.

· View platform-wide reports and analytics.

· Manage master product categories.

· Publish platform-wide notifications/announcements.

# **4. Database Models**

## **User**

· name

· email

· password

· phone

· address

· role: customer/farmer/admin

· status

· createdAt

## **FarmerProfile**

· userId

· stallName

· contactPerson

· markets[]

· operatingDays[]

· pickupWindows[]

· address

· latitude

· longitude

· approvalStatus

## **Market**

· name

· address

· operatingDays[]

· timings

· latitude

· longitude

· mapProvider

· status

## **Product**

· farmerId

· marketId

· name

· category

· description

· price

· unit

· quantityAvailable

· image

· isAvailable

· weeklyTemplate

## **Order**

· customerId

· farmerId

· marketId

· items[]

· totalAmount

· pickupDate

· pickupTimeSlot

· status

· createdAt

## **Review**

· customerId

· farmerId

· productId

· orderId

· rating

· comment

· farmerReply

· createdAt

## **Favorite**

· userId

· farmerId

· productId

Note: The SRS gives example entities including Users, Products, Orders, Reviews, Reports and Markets and allows the team to design its own database structure.

# **5. Frontend Pages**

## **5.1 Public**

· Home

· Markets

· Farmers

· Products

· Product Details

· Farmer Details

· Market Details

· Login

· Register

· About Us

· Contact Us

## **5.2 Customer**

· Customer Dashboard

· Cart

· Pre-Order/Checkout

· Orders

· Order Details

· Favorites

· Profile

· Notifications

· Reviews

## **5.3 Farmer**

· Farmer Dashboard

· Farmer Profile

· Products

· Add Product

· Edit Product

· Orders

· Order Details

· Pickup Slots

· Reviews

· Analytics

## **5.4 Admin**

· Admin Dashboard

· Farmers

· Customers

· Markets

· Products

· Reviews

· Reports

· Categories

· Announcements

# **6. Backend API Plan**

## **Authentication**

· POST /api/auth/register

· POST /api/auth/login

· GET /api/auth/me

· POST /api/auth/forgot-password

· POST /api/auth/reset-password

## **Products**

· GET /api/products

· GET /api/products/\:id

· POST /api/products

· PUT /api/products/\:id

· DELETE /api/products/\:id

· GET /api/products?search=&category=&market=&minPrice=&maxPrice=

## **Markets**

· GET /api/markets

· GET /api/markets/\:id

· POST /api/markets

· PUT /api/markets/\:id

· DELETE /api/markets/\:id

## **Farmers**

· GET /api/farmers

· GET /api/farmers/\:id

· GET /api/farmers/\:id/products

· PUT /api/farmers/profile

## **Admin Farmer Management**

· GET /api/admin/farmers

· PATCH /api/admin/farmers/\:id/approve

· PATCH /api/admin/farmers/\:id/suspend

## **Orders**

· POST /api/orders

· GET /api/orders/my-orders

· GET /api/orders/\:id

· PUT /api/orders/\:id

· PATCH /api/orders/\:id/cancel

· GET /api/farmer/orders

· PATCH /api/orders/\:id/accept

· PATCH /api/orders/\:id/decline

· PATCH /api/orders/\:id/ready

· PATCH /api/orders/\:id/complete

## **Reviews**

· POST /api/reviews

· GET /api/reviews/product/\:productId

· GET /api/reviews/farmer/\:farmerId

· PUT /api/reviews/\:id

· DELETE /api/reviews/\:id

· PATCH /api/reviews/\:id/reply

## **Favorites**

· POST /api/favorites

· GET /api/favorites

· DELETE /api/favorites/\:id

## **Dashboards**

· GET /api/customer/dashboard

· GET /api/farmer/dashboard

· GET /api/admin/dashboard

# **7. Authentication & Security**

· Customer and farmer registration/login.

· Secure password hashing with bcryptjs.

· JWT-based authentication.

· Protected API routes.

· Role-based middleware for customer/farmer/admin access.

· Farmer approval required before product listing.

· Password recovery/reset through email/token flow.

· Frontend protected routes for role-specific dashboards.

· Validate ownership: users can modify only their own permitted data.

# **8. Order Workflow**

Customer flow:

1. Customer browses product.

2. Customer adds product to cart.

3. Customer selects pickup date and time slot.

4. Customer places pre-order.

5. Order status becomes Placed.

6. Farmer accepts or declines.

7. If accepted, farmer prepares the order.

8. Farmer marks it Ready for Pickup.

9. Customer collects at the market and payment is settled in person.

10. Farmer/admin can mark the order Completed.

Status:

PLACED → ACCEPTED → READY → COMPLETED

Eligible cancellation/modification depends on the farmer's cutoff time.

# **9. Maps & Location**

· Store market/farmer address and latitude/longitude.

· Display market and farmer markers.

· Show pickup point.

· Allow directions through the selected map provider.

· Use Google Maps API or OpenStreetMap as permitted by the SRS.

# **10. Notifications**

· Order confirmation.

· Order accepted/updated.

· Order ready for pickup.

· Optional restock/favorite alerts.

· Implementation can start with in-app notifications; email can be added later.

# **11. Optional AI Assistant**

· Help customers find specific items across markets/farmers.

· Answer common questions about market timings.

· Answer farmer availability questions.

· Answer pickup-window questions.

· Answer product-detail questions.

· Implement only after core SRS functionality is stable.

# **12. Non-Functional Requirements**

· Safe to use.

· Accessible and legible UI.

· User-friendly navigation.

· Reliable and efficient operation.

· Good performance and smooth navigation.

· Scalable for increasing users, farmers and product listings.

· Secure authentication and protected features.

· High availability.

· Compatible with current browsers and devices.

· Responsive/mobile-friendly design.

# **13. Out of Scope**

· Online payment gateway.

· Actual payment processing.

· Delivery/courier logistics.

· Farmer identity/licensing verification.

· Organic/food-safety certification verification.

· Real banking integration.

# **14. Team Work Division**

## **Member 1 — Backend/Auth + Database**

· MongoDB connection and Mongoose setup

· User and FarmerProfile models

· Registration/login

· JWT and bcrypt

· Authentication middleware

· Role-based middleware

· User/farmer APIs

## **Member 2 — Products + Markets + Maps**

· Product model and CRUD

· Market model and CRUD

· Categories

· Search/filter

· Stock management

· Map integration

· Product/market/farmer browsing pages

## **Member 3 — Customer Orders + Engagement**

· Cart

· Order model and APIs

· Pickup workflow

· Favorites

· Reviews

· Notifications

· Customer order pages

## **Member 4 — Dashboards + Admin + UI**

· Customer dashboard

· Farmer dashboard

· Admin dashboard

· Admin management

· Reports/analytics

· Charts

· Responsive UI and polish

Competition rule reminder: the SRS allows AI tools as supporting aids, but the team's own design, development, problem-solving and understanding must drive the final project. The team should be able to explain and justify its implementation and acknowledge AI tools used.

# **15. Development Phases**

11. Phase 1 — Project setup: GitHub, React/Vite, Express/Node, MongoDB, environment variables.

12. Phase 2 — Authentication: register, login, bcrypt, JWT, roles, protected routes, password recovery.

13. Phase 3 — Core data: User, FarmerProfile, Market, Product.

14. Phase 4 — Customer browsing: markets, farmers, products, search, filters, product details.

15. Phase 5 — Cart and pre-orders: cart, checkout, pickup slot, order lifecycle.

16. Phase 6 — Engagement: favorites, reviews, notifications.

17. Phase 7 — Dashboards: customer, farmer, admin.

18. Phase 8 — Maps and directions.

19. Phase 9 — Optional AI assistant.

20. Phase 10 — Testing, validation, responsive polish, deployment, README, test data and demo preparation.

# **16. Recommended Starting Point**

We will start with the Backend because authentication and roles are dependencies for almost every other MarketLink feature.

21. Create MarketLink/backend.

22. Initialize Node project.

23. Install Express, Mongoose, CORS, dotenv, bcryptjs and jsonwebtoken.

24. Connect MongoDB.

25. Create User model.

26. Create register API.

27. Create login API.

28. Generate JWT.

29. Create auth middleware.

30. Create role middleware.

31. Test everything in Postman.

32. Then connect React Login/Register.