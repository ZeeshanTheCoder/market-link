import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import { useStore } from "../../context/StoreContext";
import { getMarkets } from "../../api/marketApi";
import { getFarmers } from "../../api/farmerApi";

const categories = ["All", "Vegetables", "Fruits", "Greens", "Dairy", "Honey", "Grains", "Spices"];
const marketDays = ["Monday", "Wednesday", "Thursday", "Saturday", "Sunday"];

export default function Products() {
  const { products } = useStore();
  const [params] = useSearchParams();
  const initial = params.get("category");
  const [filter, setFilter] = useState(
    initial
      ? ({
          fruits: "Fruits",
          vegetables: "Vegetables",
          dairy: "Dairy",
          honey: "Honey",
          grains: "Grains",
          spices: "Spices",
        }[initial] || "All")
      : "All",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [market, setMarket] = useState("");
  const [marketDay, setMarketDay] = useState("");
  const [markets, setMarkets] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [radius, setRadius] = useState("10");
  const [userLocation, setUserLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");

  useEffect(() => {
    getMarkets().then(({ data }) => setMarkets(data.markets || [])).catch(() => setMarkets([]));
    getFarmers().then(({ data }) => setFarmers(data.farmers || [])).catch(() => setFarmers([]));
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Your browser does not support location services.");
      return;
    }
    setLocationMessage("Finding nearby farmers…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearbyOnly(true);
        setLocationMessage("Nearby farmer mode is active.");
      },
      () => setLocationMessage("Location access was blocked. Allow location permission and try again."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const farmer = String(p.farmer || "").toLowerCase();
      const farmerRecord = farmers.find((f) => String(f._id || f.id) === String(p.farmerId)) || farmers.find((f) => String(f.name || "").toLowerCase() === farmer);
      const farmerMatches = farmerRecord ? `${farmerRecord.name || ""} ${farmerRecord.stallName || ""} ${farmerRecord.specialty || ""}`.toLowerCase().includes(query.toLowerCase()) : farmer.includes(query.toLowerCase());
      const distance = userLocation && farmerRecord?.latitude != null && farmerRecord?.longitude != null
        ? distanceKm(userLocation.lat, userLocation.lng, Number(farmerRecord.latitude), Number(farmerRecord.longitude))
        : null;
      p._nearbyDistance = distance;
      return (
        (filter === "All" || p.category === filter) &&
        (!market || String(p.marketId || "") === String(market)) &&
        (name.includes(query.toLowerCase()) || farmerMatches) &&
        (!nearbyOnly || (distance != null && distance <= Number(radius)))
      );
    });

    if (marketDay) {
      list = list.filter((p) => {
        const m = markets.find((x) => String(x._id || x.id) === String(p.marketId));
        return m && (m.day === marketDay || m.operatingDays?.includes(marketDay));
      });
    }

    if (sort === "price-low") list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "price-high") list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sort === "rating") list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    if (nearbyOnly && userLocation) list.sort((a, b) => Number(a._nearbyDistance ?? 9999) - Number(b._nearbyDistance ?? 9999));
    return list;
  }, [products, filter, query, sort, market, marketDay, markets, farmers, nearbyOnly, radius, userLocation]);

  const clearFilters = () => {
    setFilter("All");
    setMarket("");
    setMarketDay("");
    setSort("featured");
    setQuery("");
    setNearbyOnly(false);
    setLocationMessage("");
  };

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-leaf-50/60 to-cream py-8 sm:py-10">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">MarketLink marketplace</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Fresh from farms. Ready for everyday life.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Shop local produce for home kitchens, market days, bulk baskets and farm & production needs — all in one clean marketplace.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-6 sm:py-8">
        <div className="shell">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Browse products</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">Find exactly what you need</h2>
            </div>
            <span className="text-xs font-semibold text-stone-400">Search, filter, then shop</span>
          </div>

          <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-3 shadow-[0_10px_28px_rgba(35,56,74,.06)] sm:p-4">
            <div className="grid gap-2.5 md:grid-cols-[minmax(0,2fr)_minmax(150px,1fr)_minmax(150px,1fr)] lg:grid-cols-[minmax(0,2fr)_170px_170px_170px_170px]">
              <label className="block min-w-0">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Search</span>
                <input
                  className="input h-10 w-full text-sm"
                  placeholder="Search products or farmers..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-2.5">
                <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">Nearby farmers</span>
                <div className="mt-1.5 flex gap-2">
                  <button type="button" onClick={requestLocation} className={nearbyOnly?"btn-primary flex-1 px-3 py-2 text-xs":"btn-outline flex-1 px-3 py-2 text-xs"}>📍 {nearbyOnly?"Nearby on":"Find near me"}</button>
                  <select className="input h-9 w-20 text-xs" value={radius} onChange={(e)=>setRadius(e.target.value)} title="Nearby radius">
                    {["5","10","25","50"].map(x=><option key={x} value={x}>{x} km</option>)}
                  </select>
                </div>
              </div>

              <label className="block min-w-0">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Category</span>
                <select className="input h-10 w-full text-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Market</span>
                <select className="input h-10 w-full text-xs" value={market} onChange={(e) => setMarket(e.target.value)}>
                  <option value="">All markets</option>
                  {markets.map((m) => (
                    <option key={m._id || m.id} value={m._id || m.id}>{m.name}</option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Market day</span>
                <select className="input h-10 w-full text-xs" value={marketDay} onChange={(e) => setMarketDay(e.target.value)}>
                  <option value="">All days</option>
                  {marketDays.map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
              </label>

              <label className="block min-w-0">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Sort</span>
                <select className="input h-10 w-full text-xs" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="rating">Top rated</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
              <p className="text-xs font-semibold text-stone-500">Browse by category, market and market day without extra filter clutter.</p>
              <button type="button" onClick={clearFilters} className="text-xs font-bold text-leaf-700 hover:text-leaf-800">
                Clear filters
              </button>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-navy-800">{visible.length} products available</p>
              <p className="text-xs text-stone-400">Fresh listings from local farmers and growers</p>
            </div>
            <span className="w-fit rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-800">🌱 Farm-to-table</span>
          </div>

          {visible.length ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <div className="text-4xl">🔎</div>
              <h2 className="mt-3 text-xl font-extrabold">No products match</h2>
              <p className="mt-2 text-sm text-stone-500">Try another category, market, market day or search term.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
