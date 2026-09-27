import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { requireDb } from "./middleware/dbReady.js";

import productRoutes from "./routes/productRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import pickupSlotRoutes from "./routes/pickupSlotRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import farmerCompatRoutes from "./routes/farmerCompatRoutes.js";

const app = express();

/* =========================================================
   CORS CONFIGURATION
   ========================================================= */

const allowedOrigins = [
  "https://marketlink-orpin.vercel.app",
  "http://localhost:5173"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (Postman, server-to-server requests, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
};

app.use(cors(corsOptions));

/* =========================================================
   BODY PARSER
   ========================================================= */

app.use(express.json({ limit: "1mb" }));

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    message: "MarketLink API is running",
    database: process.env.MONGO_URI ? "configured" : "missing"
  });
});

/* =========================================================
   AUTHENTICATION
   ========================================================= */

app.use("/api/auth", authRoutes);

/* =========================================================
   AI
   ========================================================= */

app.use("/api/ai", aiRoutes);

/* =========================================================
   PRODUCTS
   ========================================================= */

app.use("/api/products", requireDb, productRoutes);

/* =========================================================
   MARKETS
   ========================================================= */

app.use("/api/markets", requireDb, marketRoutes);

/* =========================================================
   FARMERS
   ========================================================= */

app.use("/api/farmers", requireDb, farmerRoutes);

/* =========================================================
   ORDERS
   ========================================================= */

app.use("/api/orders", requireDb, orderRoutes);

/* =========================================================
   REVIEWS
   ========================================================= */

app.use("/api/reviews", requireDb, reviewRoutes);

/* =========================================================
   FAVORITES
   ========================================================= */

app.use("/api/favorites", requireDb, favoriteRoutes);

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

app.use("/api/notifications", requireDb, notificationRoutes);

/* =========================================================
   PICKUP SLOTS
   ========================================================= */

app.use("/api/pickup-slots", requireDb, pickupSlotRoutes);

/* =========================================================
   CATEGORIES
   ========================================================= */

app.use("/api/categories", requireDb, categoryRoutes);

/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

app.use("/api/announcements", requireDb, announcementRoutes);

/* =========================================================
   ADMIN
   ========================================================= */

app.use("/api/admin", requireDb, adminRoutes);

/* =========================================================
   USERS / PROFILE
   ========================================================= */

app.use("/api/users", requireDb, profileRoutes);

/* =========================================================
   CUSTOMER
   ========================================================= */

app.use("/api/customer", requireDb, customerRoutes);

/* =========================================================
   FARMER COMPATIBILITY ROUTES
   ========================================================= */

app.use("/api/farmer", requireDb, farmerCompatRoutes);

/* =========================================================
   ERROR HANDLING
   ========================================================= */

app.use(notFound);
app.use(errorHandler);

export default app;