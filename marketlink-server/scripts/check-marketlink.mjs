import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const server = path.resolve(here, "..");
const requiredModels = ["User.js","FarmerProfile.js","Market.js","Product.js","Order.js","Review.js","Favorite.js"];
const requiredRoutes = ["authRoutes.js","productRoutes.js","marketRoutes.js","farmerRoutes.js","orderRoutes.js","reviewRoutes.js","favoriteRoutes.js","adminRoutes.js","customerRoutes.js","pickupSlotRoutes.js","notificationRoutes.js"];
for (const file of requiredModels) if (!fs.existsSync(path.join(server,"src/models",file))) throw new Error(`Missing model: ${file}`);
for (const file of requiredRoutes) if (!fs.existsSync(path.join(server,"src/routes",file))) throw new Error(`Missing route: ${file}`);
const catalog = JSON.parse(fs.readFileSync(path.join(server,"src/seed/catalog.json"),"utf8"));
if (catalog.length < 24) throw new Error(`Expected at least 24 seeded products, found ${catalog.length}`);
console.log(`MarketLink backend static check passed: ${requiredModels.length} core models, ${requiredRoutes.length} core routes, ${catalog.length} seeded products.`);
