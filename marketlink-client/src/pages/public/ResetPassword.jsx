import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthShell from "../../components/common/AuthShell";
import FormField from "../../components/common/FormField";
import { resetPassword } from "../../api/authApi";
import { useToast } from "../../hooks/useToast";
import { validateReset } from "../../utils/validators";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
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
    const found = validateReset(form);
    if (Object.keys(found).length) return setErrors(found);

    setSubmitting(true);
    try {
      await resetPassword({ token, password: form.password });
      toast.success("Password updated. Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      if (err.fieldErrors?.password) setErrors({ password: err.fieldErrors.password });
      else setFormError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you have not used before."
      footer={<Link to="/login" className="font-semibold text-leaf-700 hover:underline">Back to login</Link>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
        <FormField label="New password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} hint="8+ characters, with a letter and a number" />
        <FormField label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
