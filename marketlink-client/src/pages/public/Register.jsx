import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../../components/common/AuthShell";
import FormField from "../../components/common/FormField";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { validateRegister } from "../../utils/validators";
import { dashboardPathFor } from "../../utils/roleHome";

const empty = { name: "", email: "", phone: "", address: "", password: "", confirmPassword: "", stallName: "", contactPerson: "" };

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [role, setRole] = useState(params.get("role") === "farmer" ? "farmer" : "customer");
  const [form, setForm] = useState(empty);
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
    const found = validateRegister({ ...form, role });
    if (Object.keys(found).length) return setErrors(found);

    setSubmitting(true);
    try {
      const { confirmPassword, ...rest } = form; // eslint-disable-line no-unused-vars
      const user = await register({ ...rest, role });
      toast.success(
        role === "farmer"
          ? "Account created! Your stall is pending admin approval."
          : "Account created. Welcome to MarketLink!"
      );
      navigate(dashboardPathFor(user.role), { replace: true });
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      else setFormError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const tab = (value, label) => (
    <button
      type="button"
      role="tab"
      aria-selected={role === value}
      onClick={() => setRole(value)}
      className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
        role === value ? "bg-leaf-600 text-white shadow-sm" : "text-navy-800 hover:bg-leaf-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join MarketLink as a customer or list your stall as a farmer."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-leaf-700 hover:underline">Login</Link></>}
    >
      <div role="tablist" aria-label="Account type" className="mb-5 flex gap-1 rounded-full bg-leaf-50 p-1">
        {tab("customer", "I'm a Customer")}
        {tab("farmer", "I'm a Farmer")}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}

        {role === "farmer" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Stall / business name" name="stallName" value={form.stallName} onChange={handleChange} error={errors.stallName} placeholder="e.g. Green Valley Farm" />
            <FormField label="Contact person" name="contactPerson" value={form.contactPerson} onChange={handleChange} error={errors.contactPerson} placeholder="Defaults to your name" />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" name="name" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
          <FormField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+92 300 1234567" />
        </div>
        <FormField label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label={role === "farmer" ? "Stall address" : "Address (optional)"} name="address" autoComplete="street-address" value={form.address} onChange={handleChange} error={errors.address} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} hint="8+ characters, with a letter and a number" />
          <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        </div>

        {role === "farmer" && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Farmer accounts are reviewed by our team. You can log in straight away, but products can only be published once your stall is approved.
          </p>
        )}

        <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
