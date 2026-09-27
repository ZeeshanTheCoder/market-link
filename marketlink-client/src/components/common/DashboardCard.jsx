import { Link } from "react-router-dom";
import Icon from "./Icons";

export default function DashboardCard({ title, value, hint, icon, to }) {
  const body = (
    <div className="card flex items-start gap-4 transition hover:border-leaf-500 hover:shadow-md">
      {icon && (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <Icon name={icon} />
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-stone-500">{title}</p>
        {value !== undefined && <p className="mt-0.5 text-2xl font-extrabold text-navy-800">{value}</p>}
        {hint && <p className="mt-0.5 text-xs text-stone-500">{hint}</p>}
      </div>
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}
