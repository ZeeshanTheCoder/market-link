const styles = {
  PLACED: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-navy-100 text-navy-800",
  READY: "bg-leaf-100 text-leaf-800",
  COMPLETED: "bg-stone-200 text-stone-700",
  DECLINED: "bg-red-100 text-red-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-leaf-100 text-leaf-800",
  SUSPENDED: "bg-red-100 text-red-700",
  ACTIVE: "bg-leaf-100 text-leaf-800",
  INACTIVE: "bg-stone-200 text-stone-600",
};

export default function StatusBadge({ status }) {
  const key = String(status || "").toUpperCase();
  return (
    <span className={`badge ${styles[key] || "bg-stone-100 text-stone-600"}`}>
      {key.charAt(0) + key.slice(1).toLowerCase()}
    </span>
  );
}
