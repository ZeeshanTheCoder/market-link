import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../../components/common/ProductCard";
import RatingStars from "../../components/common/RatingStars";
import Icon from "../../components/common/Icons";
import { useStore } from "../../context/StoreContext";
import { getProduct } from "../../api/productApi";
import { getFarmer } from "../../api/farmerApi";
import { getMarket } from "../../api/marketApi";
import { farmerSeed, marketSeed } from "../portal/shared";

function Info({ label, value, href }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <span className="block text-xs text-stone-400">{label}</span>
      {href ? (
        <Link className="mt-1 block text-sm font-bold text-leaf-700" to={href}>
          {value}
        </Link>
      ) : (
        <strong className="mt-1 block text-sm">{value}</strong>
      )}
    </div>
  );
}

function normalizeId(value) {
  return String(value || "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
}

export function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const customerArea = location.pathname.startsWith("/customer/");
  const productsPath = customerArea ? "/customer/products" : "/products";
  const farmersPath = customerArea ? "/customer/farmers" : "/farmers";
  const { products, addToCart, toggleFavorite, favorites } = useStore();
  const localProduct = products.find((item) => item.id === id) || null;
  const [product, setProduct] = useState(localProduct);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    let active = true;
    setLoading(true);

    getProduct(id)
      .then(({ data }) => {
        if (!active || !data?.product) return;
        const remoteProduct = data.product;
        setProduct({
          ...remoteProduct,
          id: remoteProduct.slug || remoteProduct.id || remoteProduct._id || id,
          mongoId: remoteProduct._id || remoteProduct.mongoId,
          stock: Number(remoteProduct.quantityAvailable ?? remoteProduct.stock ?? 0),
          farmer: remoteProduct.farmerId?.name || remoteProduct.farmer || "Local farmer",
          marketName: remoteProduct.marketId?.name || remoteProduct.marketName,
        });
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      })
      .catch(() => {
        // Keep the local catalog fallback available when the API is unavailable.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading && !product) {
    return (
      <div className="shell section-space">
        <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-semibold text-stone-500">Loading product details…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shell section-space">
        <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-extrabold">Product not found</h1>
          <Link to={productsPath} className="btn-primary mt-5 inline-flex">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const farmerSlug = normalizeId(product.farmer);
  const useCaseLabel =
    product.useCase === "farm"
      ? "Farm & production"
      : product.useCase === "bulk"
        ? "Bulk orders"
        : product.useCase === "market"
          ? "Market day"
          : "Daily use";

  return (
    <div className="section-space">
      <div className="shell">
        <Link to={productsPath} className="text-sm font-bold text-leaf-700">
          ← Back to products
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.02fr_.98fr]">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-stone-50">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-leaf-100 text-leaf-800">{product.badge || "Fresh"}</span>
              <span className="badge bg-navy-50 text-navy-700">{useCaseLabel}</span>
              {product.organic ? (
                <span className="badge bg-emerald-50 text-emerald-800">Organic</span>
              ) : null}
            </div>

            <p className="mt-5 eyebrow">{product.category}</p>
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <RatingStars value={Number(product.rating || 0)} />
              <span className="text-sm font-bold">{product.rating || 0}</span>
              <span className="text-sm text-stone-500">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            <p className="mt-5 text-base leading-8 text-stone-600">
              {product.description || "Fresh local produce prepared for convenient market pickup."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info
                label="Farmer"
                value={product.farmer || "Local farmer"}
                href={`${farmersPath}/${farmerSlug}`}
              />
              <Info label="Market" value={product.marketName || "Local market"} />
              <Info label="Harvest" value={product.harvestStatus || "Fresh"} />
              <Info label="Pickup" value="Market pickup" />
            </div>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-y border-stone-100 py-6">
              <div>
                <span className="text-xs text-stone-400">Price</span>
                <div className="text-3xl font-extrabold text-navy-800">
                  ${Number(product.price || 0).toFixed(2)}
                  <span className="text-sm font-semibold text-stone-400"> {product.unit}</span>
                </div>
                {Number(product.bulkPrice) > 0 ? (
                  <p className="mt-1 text-xs font-bold text-leaf-700">
                    Bulk: ${Number(product.bulkPrice).toFixed(2)} {product.unit} · min {product.minOrder}
                  </p>
                ) : null}
              </div>

              <div className="text-right text-sm">
                <span
                  className={
                    Number(product.stock) <= 8
                      ? "font-bold text-amber-700"
                      : "font-semibold text-leaf-700"
                  }
                >
                  {Number(product.stock || 0)} in stock
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1" onClick={() => addToCart(product)}>
                Add to cart
              </button>
              <button
                className={favorites.includes(product.id) ? "btn-primary" : "btn-outline"}
                onClick={() => toggleFavorite(product.id)}
                aria-label="Favorite product"
              >
                ♥
              </button>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Customer feedback</p>
              <h2 className="mt-1 text-2xl font-extrabold">Reviews</h2>
            </div>
            <span className="text-sm text-stone-500">
              {reviews.length} visible review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.length ? (
              reviews.map((review) => (
                <article
                  key={review._id || review.id}
                  className="rounded-2xl border border-stone-200 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <b>{review.customerId?.name || review.customer || "Customer"}</b>
                    <RatingStars value={Number(review.rating || 0)} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{review.comment}</p>
                  {review.farmerReply ? (
                    <div className="mt-3 rounded-xl bg-leaf-50 p-3 text-xs text-leaf-900">
                      <strong>Farmer reply:</strong> {review.farmerReply}
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-sm text-stone-500 md:col-span-2">
                No reviews yet. Be the first to review this product after a completed pickup.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export function FarmerDetails() {
  const { id } = useParams();
  const location = useLocation();
  const customerArea = location.pathname.startsWith("/customer/");
  const productsPath = customerArea ? "/customer/products" : "/products";
  const farmersPath = customerArea ? "/customer/farmers" : "/farmers";
  const { products } = useStore();
  const fallback =
    farmerSeed.find((item) => item.id === id) ||
    farmerSeed.find((item) => normalizeId(item.name) === id) ||
    farmerSeed[0];
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    let active = true;
    getFarmer(id)
      .then(({ data }) => {
        if (active) setRemote(data);
      })
      .catch(() => {})
      .finally(() => {});

    return () => {
      active = false;
    };
  }, [id]);

  const farmer = remote?.farmer?.user?.name
    ? {
        name: remote.farmer.user.name,
        specialty: remote.farmer.profile?.specialty || fallback?.specialty,
        bio: remote.farmer.profile?.bio || fallback?.bio,
        rating: remote.farmer.profile?.rating || fallback?.rating,
        market: remote.farmer.profile?.markets?.[0]?.name || fallback?.market,
        phone: remote.farmer.user.phone || fallback?.phone,
        image: remote.farmer.profile?.image || fallback?.image,
        lat: remote.farmer.profile?.latitude,
        lng: remote.farmer.profile?.longitude,
      }
    : fallback;

  const listed = remote?.products?.length
    ? remote.products
        .map((item) => ({
          ...item,
          id: item.slug || item._id,
          mongoId: item._id,
          stock: item.quantityAvailable,
          farmer: farmer?.name,
        }))
        .slice(0, 8)
    : products.filter((item) => item.farmer === farmer?.name).slice(0, 8);

  return (
    <div className="section-space">
      <div className="shell">
        <Link to={farmersPath} className="text-sm font-bold text-leaf-700">
          ← Back to farmers
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[.8fr_1.2fr]">
            <div className="min-h-72 overflow-hidden bg-stone-100">
              <img src={farmer.image} alt={farmer.name} className="h-full w-full object-cover" />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-leaf-100 text-leaf-800">Approved profile</span>
                <span className="badge bg-amber-50 text-amber-800">{farmer.rating || 0} ★</span>
              </div>

              <h1 className="mt-4 text-4xl font-extrabold">{farmer.name}</h1>
              <p className="mt-2 text-lg font-semibold text-leaf-700">{farmer.specialty}</p>
              <p className="mt-5 text-sm leading-8 text-stone-600">{farmer.bio}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Info label="Primary market" value={farmer.market || "—"} />
                <Info label="Products" value={`${listed.length} visible`} />
                <Info label="Contact" value={farmer.phone || "—"} />
                <Info label="Pickup" value="Market pickup" />
              </div>

              {farmer.lat && farmer.lng ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200">
                  <iframe
                    title="Farmer location map"
                    className="h-64 w-full"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(
                      farmer.lng,
                    ) - 0.01}%2C${Number(farmer.lat) - 0.01}%2C${Number(farmer.lng) + 0.01}%2C${
                      Number(farmer.lat) + 0.01
                    }&layer=mapnik&marker=${farmer.lat}%2C${farmer.lng}`}
                  />
                </div>
              ) : null}

              <Link to={productsPath} className="btn-primary mt-7 inline-flex">
                Browse farm products
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <p className="eyebrow">Current stock</p>
          <h2 className="mt-1 text-2xl font-extrabold">Products from this farmer</h2>

          {listed.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {listed.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed p-8 text-sm text-stone-500">
              No live listings are available yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function MarketDetails() {
  const { id } = useParams();
  const location = useLocation();
  const customerArea = location.pathname.startsWith("/customer/");
  const marketsPath = customerArea ? "/customer/markets" : "/markets";
  const fallback =
    marketSeed.find((item) => item.id === id) ||
    marketSeed.find((item) => normalizeId(item.name) === id) ||
    marketSeed[0];
  const { products } = useStore();
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    let active = true;
    getMarket(id)
      .then(({ data }) => {
        if (active) setRemote(data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [id]);

  const market = remote?.market
    ? {
        ...remote.market,
        id: remote.market._id || remote.market.id,
        day: remote.market.day || remote.market.operatingDays?.[0],
        time: remote.market.time || remote.market.timings,
        tag: "Open this week",
        lat: remote.market.latitude,
        lng: remote.market.longitude,
      }
    : fallback;

  const marketIndex = Math.max(
    0,
    marketSeed.findIndex((item) => item.id === fallback.id),
  );

  const marketProducts = remote?.products?.length
    ? remote.products
        .map((item) => ({
          ...item,
          id: item.slug || item._id,
          mongoId: item._id,
          stock: item.quantityAvailable,
          farmer: item.farmerId?.name || "Local Farmer",
        }))
        .slice(0, 8)
    : products.filter((_, index) => index % 4 === marketIndex).slice(0, 8);

  const directions =
    market.lat && market.lng
      ? `https://www.openstreetmap.org/directions?from=&to=${market.lat}%2C${market.lng}`
      : null;

  return (
    <div className="section-space">
      <div className="shell">
        <Link to={marketsPath} className="text-sm font-bold text-leaf-700">
          ← Back to markets
        </Link>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <span className="badge bg-leaf-100 text-leaf-800">{market.tag || "Market"}</span>
              <p className="mt-4 eyebrow">{market.area}</p>
              <h1 className="mt-2 text-4xl font-extrabold">{market.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-stone-600">
                {market.description}
              </p>
            </div>

            <div className="rounded-2xl bg-navy-900 p-5 text-white">
              <span className="text-xs text-white/60">Market day</span>
              <strong className="mt-1 block text-xl text-white">{market.day}</strong>
              <span className="mt-1 block text-sm text-white/70">{market.time}</span>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Address" value={market.address} />
            <Info label="Stalls" value={market.stalls} />
            <Info label="Latitude" value={market.lat || "—"} />
            <Info label="Longitude" value={market.lng || "—"} />
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Icon name="mapPin" className="h-5 w-5 text-blue-700" />
                <div>
                  <h2 className="font-extrabold text-blue-900">Pickup location</h2>
                  <p className="mt-1 text-sm leading-7 text-blue-900/75">
                    {market.address}. Stored coordinates are ready for map markers and directions.
                  </p>
                </div>
              </div>

              {directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline border-blue-200 text-blue-800"
                >
                  Get directions →
                </a>
              ) : null}
            </div>
          </div>

          {market.lat && market.lng ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-blue-100">
              <iframe
                title="Market location map"
                className="h-72 w-full"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(market.lng) - 0.01}%2C${
                  Number(market.lat) - 0.01
                }%2C${Number(market.lng) + 0.01}%2C${Number(market.lat) + 0.01}&layer=mapnik&marker=${
                  market.lat
                }%2C${market.lng}`}
              />
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <p className="eyebrow">Market picks</p>
          <h2 className="mt-1 text-2xl font-extrabold">What you can find here</h2>

          {marketProducts.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {marketProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed p-8 text-sm text-stone-500">
              Market listings will appear here when farmers publish their weekly stock.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
