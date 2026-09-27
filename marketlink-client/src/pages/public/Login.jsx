import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/common/AuthShell";
import FormField from "../../components/common/FormField";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { validateLogin } from "../../utils/validators";
import { dashboardPathFor } from "../../utils/roleHome";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const found = validateLogin(form);
    if (Object.keys(found).length) return setErrors(found);

    setSubmitting(true);
    try {
      const user = await login({ email: form.email.trim(), password: form.password });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(location.state?.from?.pathname || dashboardPathFor(user.role), { replace: true });
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      else setFormError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your orders, stall and favourites."
      footer={<>New to MarketLink? <Link to="/register" className="font-semibold text-leaf-700 hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
        <FormField label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
        <FormField label="Password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Your password" />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-semibold text-leaf-700 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}
