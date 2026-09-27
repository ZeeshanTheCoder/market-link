import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";

export default function ComingSoon({ title }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="mb-6 text-3xl font-extrabold">{title}</h1>
      <EmptyState
        title="This section is being built"
        message="This page will go live in an upcoming development phase."
        action={<Link to="/" className="btn-primary">Back to home</Link>}
      />
    </div>
  );
}
