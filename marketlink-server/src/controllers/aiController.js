import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import Product from "../models/Product.js";
import Market from "../models/Market.js";
import FarmerProfile from "../models/FarmerProfile.js";
import PickupSlot from "../models/PickupSlot.js";
import { retrieveKnowledge } from "../knowledge/marketlinkKnowledge.js";

const MAX_MESSAGE_LENGTH = 600;
const MAX_PRODUCTS = 60;
const MAX_MARKETS = 20;
const MAX_FARMERS = 20;
const MAX_SLOTS = 20;

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toId(value) {
  if (!value) return "";
  return typeof value === "string" ? value : String(value._id ?? value.id ?? value);
}

function mergeUnique(primary = [], secondary = [], key = (item) => item.id ?? item._id ?? JSON.stringify(item)) {
  const out = [];
  const seen = new Set();
  for (const item of [...primary, ...secondary]) {
    const k = String(key(item));
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

async function getLiveContext() {
  if (mongoose.connection.readyState !== 1) return null;

  try {
    const [products, markets, farmers, slots] = await Promise.all([
      Product.find({ isAvailable: true }).populate("farmerId", "name").populate("marketId", "name slug").sort({ soldCount: -1, rating: -1 }).limit(MAX_PRODUCTS).lean(),
      Market.find({ status: "active" }).sort({ name: 1 }).limit(MAX_MARKETS).lean(),
      FarmerProfile.find({ approvalStatus: "approved" }).populate("markets", "name slug").sort({ rating: -1, stallName: 1 }).limit(MAX_FARMERS).lean(),
      PickupSlot.find({ active: true }).sort({ date: 1, start: 1 }).limit(MAX_SLOTS).lean(),
    ]);

    return {
      products: products.map((p) => ({
        id: toId(p._id),
        name: p.name,
        slug: p.slug,
        category: p.category,
        description: p.description,
        price: p.price,
        unit: p.unit,
        stock: p.quantityAvailable,
        rating: p.rating,
        reviews: p.reviews,
        farmer: p.farmerId?.name || toId(p.farmerId),
        farmerId: toId(p.farmerId),
        marketId: toId(p.marketId),
        marketName: p.marketId?.name || "",
        organic: p.organic,
        useCase: p.useCase,
        productType: p.productType,
        harvestStatus: p.harvestStatus,
        deliveryType: p.deliveryType,
        minOrder: p.minOrder,
        bulkPrice: p.bulkPrice,
        badge: p.badge,
        soldCount: p.soldCount,
      })),
      markets: markets.map((m) => ({
        id: toId(m._id),
        slug: m.slug,
        name: m.name,
        area: m.area,
        day: m.day || m.operatingDays?.[0],
        time: m.time || m.timings,
        timings: m.timings,
        address: m.address,
        stalls: m.stalls,
        description: m.description,
      })),
      farmers: farmers.map((f) => ({
        id: toId(f._id),
        slug: f.slug,
        userId: toId(f.userId),
        name: f.stallName,
        specialty: f.specialty,
        market: Array.isArray(f.markets) ? f.markets.map((m) => m.name || m.slug || toId(m)).join(", ") : "",
        rating: f.rating,
        products: f.productCount,
        bio: f.bio,
        address: f.address,
        operatingDays: f.operatingDays,
        pickupWindows: f.pickupWindows,
      })),
      slots: slots.map((s) => ({
        id: toId(s._id),
        day: s.day,
        date: s.date,
        start: s.start,
        end: s.end,
        capacity: s.capacity,
        booked: s.booked,
        active: s.active,
      })),
    };
  } catch (error) {
    console.error("MarketLink AI live-context error:", error.message);
    return null;
  }
}

function normalizeContext(clientContext = {}, liveContext = null) {
  const client = clientContext && typeof clientContext === "object" ? clientContext : {};
  const live = liveContext || {};
  return {
    products: mergeUnique(live.products || [], client.products || [], (p) => p.id || p._id || p.slug).slice(0, MAX_PRODUCTS),
    markets: mergeUnique(live.markets || [], client.markets || [], (m) => m.id || m._id || m.slug).slice(0, MAX_MARKETS),
    farmers: mergeUnique(live.farmers || [], client.farmers || [], (f) => f.id || f._id).slice(0, MAX_FARMERS),
    slots: mergeUnique(live.slots || [], client.slots || [], (s) => s.id || s._id || `${s.date}-${s.start}`).slice(0, MAX_SLOTS),
  };
}

function findMatches(message, context = {}) {
  const q = normalize(message);
  const products = Array.isArray(context.products) ? context.products.slice(0, MAX_PRODUCTS) : [];
  const markets = Array.isArray(context.markets) ? context.markets : [];
  const farmers = Array.isArray(context.farmers) ? context.farmers : [];

  const productMatches = products
    .map((p) => {
      const haystack = normalize([
        p.name, p.category, p.productType, p.useCase, p.farmer, p.badge,
        p.description, p.harvestStatus, p.deliveryType,
      ].join(" "));
      let score = 0;
      if (!q) score = 1;
      for (const token of q.split(/[^a-z0-9]+/).filter((x) => x.length > 2)) {
        if (haystack.includes(token)) score += 1;
      }
      if (/organic|natural/.test(q) && (p.organic || /organic|natural/i.test(p.badge || ""))) score += 4;
      if (/bulk|wholesale|restaurant|large order/.test(q) && ["bulk", "farm"].includes(normalize(p.useCase))) score += 3;
      if (/farm|production|seed|compost|feed/.test(q) && ["farm", "bulk"].includes(normalize(p.useCase))) score += 3;
      if (/daily|home|kitchen|house/.test(q) && normalize(p.useCase) === "daily") score += 2;
      if (/cheap|lowest|low price|budget|affordable/.test(q) && safeNumber(p.price) < 2.5) score += 2;
      if (/fresh|today|harvest|picked/.test(q) && /today|fresh|picked|harvested|collected|made fresh/i.test(p.harvestStatus || "")) score += 2;
      if (/available|stock|in stock/.test(q) && safeNumber(p.stock) > 0) score += 1;
      if (/sold out|out of stock/.test(q) && safeNumber(p.stock) <= 0) score += 4;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || safeNumber(b.p?.rating) - safeNumber(a.p?.rating))
    .slice(0, 6)
    .map((x) => x.p);

  const marketMatches = markets
    .map((m) => {
      const haystack = normalize([m.name, m.area, m.day, m.description, m.address, m.operatingDays].join(" "));
      let score = 0;
      for (const token of q.split(/[^a-z0-9]+/).filter((x) => x.length > 2)) {
        if (haystack.includes(token)) score += 1;
      }
      if (m.day && q.includes(normalize(m.day))) score += 4;
      return { m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => x.m);

  const farmerMatches = farmers
    .map((f) => {
      const haystack = normalize([f.name, f.stallName, f.specialty, f.market, f.bio, f.address].join(" "));
      let score = 0;
      for (const token of q.split(/[^a-z0-9]+/).filter((x) => x.length > 2)) {
        if (haystack.includes(token)) score += 1;
      }
      return { f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || safeNumber(b.f?.rating) - safeNumber(a.f?.rating))
    .slice(0, 5)
    .map((x) => x.f);

  return { products: productMatches, markets: marketMatches, farmers: farmerMatches };
}

function fmtPrice(p) {
  return `${Number(p.price ?? 0).toFixed(2)}${p.unit || ""}`;
}

function listNames(items, limit = 4) {
  return items.slice(0, limit).map((item) => item.name).join(", ");
}

function answerWithKnowledge(message, context) {
  const q = normalize(message);
  const matches = findMatches(message, context);
  const products = Array.isArray(context.products) ? context.products : [];
  const markets = Array.isArray(context.markets) ? context.markets : [];
  const farmers = Array.isArray(context.farmers) ? context.farmers : [];
  const slots = Array.isArray(context.slots) ? context.slots : [];
  const knowledge = retrieveKnowledge(message, 4);

  if (/^(hi|hello|hey|salam|assalam|aoa)\b/.test(q)) {
    return "Hi! I’m MarketLink AI. Ask me about products, farmers, markets, pickup, orders, reviews, favorites, or how the website works.";
  }

  if (/what can you do|help me|how can you help|features|what is marketlink/.test(q)) {
    return "I can help you find products, compare prices, check stock, explore farmers and market days, explain pickup/orders, and guide you around MarketLink.";
  }

  if (/how.*(order|shop|checkout)|place.*order|pre.?order|checkout/.test(q)) {
    return "Shop a product → add it to your cart → choose a pickup date/time slot → place the pre-order → wait for the farmer to prepare it → collect at the selected market.";
  }

  if (/payment|pay|cash|online payment|bank/.test(q)) {
    return "MarketLink does not use an online payment gateway. Payment is settled in person when you collect the order at the market.";
  }

  if (/deliver|delivery|courier|shipping|home delivery/.test(q)) {
    return "MarketLink is designed for market pickup rather than delivery. Choose a market and pickup window during checkout.";
  }

  if (/pickup|collect|collection|slot|window/.test(q)) {
    const active = slots.filter((s) => s.active !== false && safeNumber(s.capacity) > safeNumber(s.booked));
    if (active.length) {
      const first = active[0];
      const date = first.date ? new Date(first.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "the selected date";
      return `Pickup is at the market you choose. One available demo slot is ${first.day}, ${date}, ${first.start}–${first.end}. Payment is settled at pickup.`;
    }
    return "Pickup is handled at the selected market. Choose an available pickup slot during checkout; payment is settled in person at pickup.";
  }

  if (/market|markets|open|opening|timing|day|saturday|sunday|wednesday/.test(q)) {
    if (matches.markets.length) {
      const m = matches.markets[0];
      return `${m.name} is listed for ${m.day} ${m.time || m.timings || ""}. ${m.address ? `Address: ${m.address}.` : ""}`.trim();
    }
    if (markets.length) {
      return `Markets currently in the MarketLink catalogue: ${listNames(markets)}. Ask for a day such as Saturday, Sunday or Wednesday for a more specific result.`;
    }
  }

  if (/farmer|farmers|grower|seller|stall/.test(q)) {
    if (matches.farmers.length) {
      const f = matches.farmers[0];
      return `${f.name || f.stallName} focuses on ${f.specialty || "local farm produce"}. ${f.market ? `Market: ${f.market}. ` : ""}${f.rating ? `Rating: ${f.rating}/5.` : ""}`.trim();
    }
    if (farmers.length) {
      return `You can browse local growers such as ${listNames(farmers)} on the Farmers page.`;
    }
  }

  if (/cheapest|lowest|budget|affordable|low price/.test(q) && products.length) {
    const cheapest = [...products].filter((p) => safeNumber(p.stock) > 0 || p.stock === undefined).sort((a, b) => safeNumber(a.price) - safeNumber(b.price)).slice(0, 4);
    return `Lower-priced options include ${cheapest.map((p) => `${p.name} (${fmtPrice(p)})`).join(", ")}.`;
  }

  if (/available|stock|in stock|sold out|out of stock/.test(q) && matches.products.length) {
    return matches.products.map((p) => `${p.name}: ${safeNumber(p.stock) > 0 ? `${p.stock} available` : "sold out"}`).join(" · ");
  }

  if (/price|cost|rate|how much/.test(q) && matches.products.length) {
    return matches.products.slice(0, 4).map((p) => `${p.name} is ${fmtPrice(p)}`).join(" · ");
  }

  if (/organic|natural/.test(q) && matches.products.length) {
    return `Organic/natural matches: ${matches.products.map((p) => `${p.name} (${fmtPrice(p)})`).join(", ")}.`;
  }

  if (/bulk|wholesale|restaurant|large quantity|farm use|production|seed|compost|feed/.test(q) && matches.products.length) {
    return `Relevant larger-use products: ${matches.products.map((p) => `${p.name} (${fmtPrice(p)})`).join(", ")}.`;
  }

  if (/fresh|today|harvest|picked/.test(q) && matches.products.length) {
    return `Freshness matches: ${matches.products.map((p) => `${p.name} — ${p.harvestStatus || "fresh listing"}`).join(" · ")}`;
  }

  if (/product|produce|fruit|vegetable|greens|dairy|honey|grain|spice/.test(q) && matches.products.length) {
    return `I found: ${matches.products.map((p) => `${p.name} (${fmtPrice(p)})`).join(", ")}.`;
  }

  if (/category|categories/.test(q)) {
    return "MarketLink categories include Fresh Fruits, Vegetables, Dairy Products, Organic Honey, Grains & Pulses, Spices & Herbs, plus Greens in the seeded catalogue.";
  }

  if (/review|rating|feedback/.test(q)) {
    return "Customers can review eligible completed purchases, and farmer profiles can show ratings and review feedback.";
  }

  if (/favorite|saved|save/.test(q)) {
    return "Customers can save favorite products and farmers for quick access later.";
  }

  if (/notification|alert|restock/.test(q)) {
    return "MarketLink supports in-app order and pickup notifications, with optional restock/favorite alerts.";
  }

  if (/login|register|sign up|account|password/.test(q)) {
    return "Use Login or Sign Up from the public site. Customer and farmer accounts have role-specific protected workspaces after authentication.";
  }

  if (/admin|moderate|approve|suspend|announcement|report/.test(q)) {
    return "The Admin Console covers farmer/customer management, markets, products, reviews, categories, announcements and reports.";
  }

  if (/map|maps|direction|directions|where.*(located|market)|address/.test(q)) {
    return "MarketLink supports market/farmer location information and a map-based pickup point/directions workflow; use the market or farmer details page for location information.";
  }

  if (matches.products.length) {
    return `I found ${matches.products.map((p) => `${p.name} (${fmtPrice(p)})`).join(", ")}. Ask me for price, stock, freshness, farmer, category, or pickup details.`;
  }

  if (knowledge.length) return knowledge[0].answer;

  return "I’m focused on MarketLink. Try asking about a product, a farmer, a market day, pickup, orders, payment, reviews, favorites, or how the website works.";
}

function buildPrompt(message, context, matches, knowledge) {
  const compact = {
    products: (context.products || []).slice(0, MAX_PRODUCTS).map((p) => ({
      id: p.id || p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock: p.stock ?? p.quantityAvailable,
      farmer: p.farmer,
      rating: p.rating,
      reviews: p.reviews,
      organic: p.organic,
      useCase: p.useCase,
      productType: p.productType,
      harvestStatus: p.harvestStatus,
      deliveryType: p.deliveryType,
      minOrder: p.minOrder,
      bulkPrice: p.bulkPrice,
      badge: p.badge,
      description: p.description,
    })),
    markets: (context.markets || []).slice(0, MAX_MARKETS),
    farmers: (context.farmers || []).slice(0, MAX_FARMERS),
    slots: (context.slots || []).slice(0, MAX_SLOTS),
  };

  return [
    "You are the MarketLink website assistant.",
    "Ground every answer in the supplied MarketLink knowledge and live catalogue context.",
    "Do not invent prices, stock, farmer names, market times, or pickup availability.",
    "MarketLink's core fulfillment is market pickup; online payment and delivery are out of scope.",
    "Be concise, friendly, practical, and guide the user to a relevant MarketLink page when appropriate.",
    `Relevant website knowledge: ${JSON.stringify(knowledge.map((k) => ({ id: k.id, answer: k.answer })))}`,
    `Matched products: ${JSON.stringify(matches.products.slice(0, 6))}`,
    `Matched markets: ${JSON.stringify(matches.markets.slice(0, 5))}`,
    `Matched farmers: ${JSON.stringify(matches.farmers.slice(0, 5))}`,
    `Live MarketLink context: ${JSON.stringify(compact)}`,
    `User question: ${message}`,
  ].join("\n\n");
}

async function callProvider(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) return null;

  const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1/responses";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: prompt, max_output_tokens: 420 }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`AI provider error (${response.status})${details ? `: ${details.slice(0, 180)}` : ""}`);
  }

  const data = await response.json();
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();

  const text = (data.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .join(" ")
    .trim();
  return text || null;
}

export async function assistant(req, res, next) {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) throw new AppError("Please enter a question for MarketLink AI.", 400);
    if (message.length > MAX_MESSAGE_LENGTH) throw new AppError(`Please keep the question under ${MAX_MESSAGE_LENGTH} characters.`, 422);

    const liveContext = await getLiveContext();
    const context = normalizeContext(req.body?.context || {}, liveContext);
    const matches = findMatches(message, context);
    const knowledge = retrieveKnowledge(message, 6);

    let reply = null;
    let source = "local-knowledge";
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL) {
      try {
        reply = await callProvider(buildPrompt(message, context, matches, knowledge));
        source = reply ? "ai-provider-grounded" : "local-knowledge";
      } catch (providerError) {
        console.error(providerError.message);
      }
    }

    if (!reply) reply = answerWithKnowledge(message, context);

    return res.json({
      reply,
      source,
      matches,
      knowledge: knowledge.map((k) => ({ id: k.id, answer: k.answer })),
    });
  } catch (error) {
    return next(error);
  }
}
