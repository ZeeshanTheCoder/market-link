import { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../../components/common/AuthShell";
import FormField from "../../components/common/FormField";
import { forgotPassword } from "../../api/authApi";
import { validateForgot } from "../../utils/validators";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const found = validateForgot({ email });
    if (Object.keys(found).length) return setErrors(found);

    setSubmitting(true);
    try {
      const { data } = await forgotPassword({ email: email.trim() });
      setResult(data);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      else setFormError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we will send you a link to reset it."
      footer={<Link to="/login" className="font-semibold text-leaf-700 hover:underline">Back to login</Link>}
    >
      {result ? (
        <div className="space-y-4">
          <div role="status" className="rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-sm text-leaf-800">{result.message}</div>
          {result.devResetUrl && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Development mode (email sending is not set up yet):{" "}
              <a className="break-all font-semibold underline" href={result.devResetUrl}>open reset link</a>
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
          <FormField label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({}); }} error={errors.email} placeholder="you@example.com" />
          <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
