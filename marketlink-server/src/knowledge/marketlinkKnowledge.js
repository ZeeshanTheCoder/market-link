export const marketlinkKnowledge = [
  {id:"what-is-marketlink", topics:["marketlink","platform","website","what","is"], answer:"MarketLink connects local farmers-market farmers with customers. Customers can discover markets and products, reserve items for pickup, and review purchases; farmers can manage listings, stock, orders and pickup windows."},
  {id:"pickup-model", topics:["pickup","collect","collection","market","handover"], answer:"MarketLink is built around market pickup. The customer chooses a market and available pickup window during checkout, then collects the order at the market."},
  {id:"payment", topics:["payment","pay","cash","card","checkout"], answer:"Online payment is not part of the MarketLink core flow. Payment is settled in person when the customer collects the order at the market."},
  {id:"delivery", topics:["delivery","deliver","courier","shipping","home"], answer:"Delivery and courier logistics are outside the MarketLink scope. The supported fulfillment method is market pickup."},
  {id:"customer-register", topics:["customer","register","signup","sign up","account"], answer:"Customers can register, log in, manage their profile, browse products and markets, use the cart, place pickup pre-orders, manage eligible orders, save favorites, and review completed purchases."},
  {id:"customer-browse", topics:["customer","browse","search","filter","products","markets"], answer:"Customers can browse markets, farmers and products, then narrow products by category, price, market and market day where those filters are available."},
  {id:"customer-orders", topics:["order","orders","history","reorder","cancel","modify"], answer:"Customers can place pickup pre-orders and view order history. Eligible orders can be updated or cancelled according to the farmer's cutoff rules; completed purchases can be used for reordering when that feature is available."},
  {id:"favorites", topics:["favorite","favorites","save","saved","heart"], answer:"Customers can save favorite products and farmers so they are easier to find again."},
  {id:"reviews", topics:["review","reviews","rating","ratings","feedback"], answer:"Customers can rate and review farmers or products after eligible completed orders. Farmers can view reviews and reply when that workflow is enabled."},
  {id:"notifications", topics:["notification","notifications","alert","alerts","restock","ready"], answer:"MarketLink supports in-app notifications for order confirmation, order updates, ready-for-pickup messages, and optional restock or favorite alerts."},
  {id:"farmer-role", topics:["farmer","seller","grower","stall","farmer dashboard"], answer:"Farmers can maintain their profile and market details, add/edit/delete products, manage weekly stock and prices, set pickup slots and order cutoffs, handle pre-orders, review sales insights, and respond to customer reviews."},
  {id:"admin-role", topics:["admin","administrator","console","moderate","approve","suspend"], answer:"Admins manage farmers, customers, markets, products, reviews, categories, reports and announcements, including farmer approval or suspension and account moderation."},
  {id:"product-create", topics:["add product","create product","new product","listing","listing product"], answer:"A farmer product listing can include name, category, description, price, unit, available quantity, image, availability, use case, harvest information, minimum order and optional bulk pricing, plus pickup details."},
  {id:"product-categories", topics:["category","categories","vegetables","fruits","greens","dairy","honey","grains","spices"], answer:"MarketLink's main product categories are Fresh Fruits, Vegetables, Dairy Products, Organic Honey, Grains & Pulses, and Spices & Herbs; the seeded catalogue also uses Greens as a product category."},
  {id:"use-cases", topics:["daily","home","kitchen","farm use","farm","production","bulk","wholesale","market day"], answer:"Products are organized for practical use cases such as Daily Use, Farm & Production, Bulk/Wholesale, and Market Day use."},
  {id:"organic", topics:["organic","natural","pesticide","chemical-free"], answer:"The catalogue includes products marked as organic. The MarketLink app displays the farmer's listing data; it does not independently verify organic or food-safety certification."},
  {id:"freshness", topics:["fresh","freshness","harvested today","picked today","harvest"], answer:"Product cards can show freshness or harvest status such as Harvested today, Picked this week, Packed fresh, or other farmer-provided status information."},
  {id:"stock", topics:["stock","available","availability","sold out","inventory","quantity"], answer:"Product listings show available quantity and availability status. Farmers can update stock and mark listings unavailable when they run out."},
  {id:"bulk", topics:["bulk","wholesale","large quantity","restaurant","minimum order","bulk price"], answer:"Some products support larger quantities through minimum-order and bulk-price fields. Bulk or wholesale suitability is shown on relevant product listings."},
  {id:"market-days", topics:["saturday","sunday","wednesday","market day","days","open"], answer:"The seeded MarketLink markets include Saturday, Sunday and Wednesday market days. Always check the selected market's current listing for its exact day and hours."},
  {id:"greenfield", topics:["greenfield","downtown karachi","saturday market"], answer:"Greenfield Saturday Market is a Downtown Karachi market listed with Saturday hours of 8:00 AM–1:00 PM and 28 stalls in the seeded demo data."},
  {id:"riverside", topics:["riverside","sunday market","riverside karachi"], answer:"Riverside Farmers Market is a Sunday market in the seeded demo data, listed from 9:00 AM–2:00 PM with 19 stalls."},
  {id:"harvest-lane", topics:["harvest lane","north karachi","wednesday market"], answer:"Harvest Lane Market is the seeded midweek market, listed on Wednesday from 4:00 PM–8:00 PM with 14 stalls."},
  {id:"oak-orchard", topics:["oak","orchard","east karachi","saturday market"], answer:"Oak & Orchard Market is a seasonal Saturday market in the seeded demo data, listed from 9:00 AM–1:00 PM with 22 stalls."},
  {id:"karachi-farmers", topics:["karachi farmer","karachi farmers","local farmer","grower"], answer:"The demo catalogue includes Karachi-based/local grower information and farmer profiles. Use the Farmers page to browse individual grower profiles and the markets they attend."},
  {id:"checkout", topics:["checkout","place order","pre-order","preorder","basket"], answer:"The customer flow is: browse a product, add it to the cart, choose a pickup date/time slot, place the pre-order, and then collect it at the market after the farmer prepares it."},
  {id:"order-status", topics:["placed","accepted","ready","completed","status"], answer:"The intended order workflow is PLACED → ACCEPTED → READY → COMPLETED. Customers should see order updates as the farmer progresses the order."},
  {id:"pickup-slots", topics:["pickup slot","pickup slots","time slot","window","pickup time"], answer:"Pickup slots are defined by the farmer and are tied to a market date and time. Customers choose an available slot during checkout when slots are configured."},
  {id:"maps", topics:["map","maps","directions","location","address","marker"], answer:"MarketLink is designed to show market/farmer locations, pickup points and directions using a map provider such as OpenStreetMap with Leaflet or Google Maps."},
  {id:"about", topics:["about","company","mission","story"], answer:"The About area explains MarketLink's purpose: making local market shopping easier while helping farmers present weekly stock and pickup information clearly."},
  {id:"contact", topics:["contact","support","help","message","reach"], answer:"Use the Contact page for MarketLink support and general enquiries. For account/order-specific issues, the signed-in customer or farmer area is the more useful place to check first."},
  {id:"ai", topics:["ai","assistant","chatbot","help me","ask"], answer:"MarketLink AI is a website-aware assistant for products, farmers, markets, pickup, order flow and basic platform guidance. It should answer from MarketLink data and avoid inventing availability or prices."},
  {id:"security", topics:["security","password","jwt","login security","account security"], answer:"The platform uses role-aware protected routes, JWT authentication and bcrypt password hashing on the server. Keep your account password private and never share secrets in chat."},
  {id:"scope", topics:["scope","online payment","banking","delivery","verification"], answer:"Online payments, banking integration, delivery/courier logistics, farmer licensing verification and organic/food-safety certification verification are outside the core project scope."},
  {id:"website-navigation", topics:["where","find","page","navigation","navigate","menu"], answer:"The main public areas are Home, Markets, Farmers, Products, How It Works, About and Contact. The AI Assistant is also available through the floating help button and its dedicated assistant page."},
  {id:"farm-production", topics:["farm production","seed","compost","feed","production supplies","agriculture"], answer:"The seeded catalogue includes farm-oriented products such as Farm Seed Mix, Natural Farm Compost and Fresh Alfalfa Feed, along with farm-use grains and produce."},
  {id:"restaurant", topics:["restaurant","chef","food business","bulk order"], answer:"Customers looking for larger quantities can use listings marked for bulk or wholesale use, subject to each farmer's minimum-order and stock information."},
  {id:"popular", topics:["popular","best seller","bestseller","top rated","recommended"], answer:"Product cards can show popularity or badges such as Bestseller, Popular, Top Rated, New, Fresh and Farm Use. These labels describe listing data and do not replace the product details page."},
  {id:"farmer-approval", topics:["farmer approval","approved farmer","pending farmer","suspended farmer"], answer:"The intended admin workflow includes approving or suspending farmer registrations. Farmer approval is also a prerequisite for publishing listings in the SRS design."},
  {id:"recurring-stock", topics:["recurring","weekly template","weekly stock","template"], answer:"Farmers can use recurring weekly stock templates to make repeated market-day inventory easier to maintain."},
  {id:"market-management", topics:["manage market","add market","edit market","remove market","market admin"], answer:"Admins can add, edit and remove markets, including operating days, timings, address, coordinates and status."},
  {id:"announcement", topics:["announcement","announcement page","publish","news"], answer:"Admins can publish platform-wide announcements so customers and farmers can see market or platform updates."},
  {id:"reports", topics:["report","reports","analytics","dashboard stats","revenue"], answer:"The project includes dashboard/reporting areas for platform-wide and farmer-level insights such as orders, revenue summaries and best-selling products."},
];

export function retrieveKnowledge(message, limit = 8) {
  const q = String(message || "").toLowerCase();
  const tokens = q.split(/[^a-z0-9]+/).filter((t) => t.length > 1);
  return marketlinkKnowledge
    .map((item) => {
      let score = 0;
      for (const topic of item.topics) {
        const term = topic.toLowerCase();
        if (q.includes(term)) score += term.includes(" ") ? 4 : 2;
      }
      for (const token of tokens) {
        if (item.topics.some((topic) => topic.toLowerCase().split(/[^a-z0-9]+/).includes(token))) score += 0.35;
      }
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}
