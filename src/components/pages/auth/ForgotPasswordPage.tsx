import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthLayout } from "../../auth/AuthLayout";
import { useAuth } from "../../../context/AuthContext";
import { authErrorMessage } from "../../../services/authErrors";
export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthLayout
      title="Reset your password."
      description="We’ll help you get back to your workspace."
    >
      {sent ? (
        <p className="auth-status auth-success" role="status">
          If an account exists for that email, you’ll receive a password reset
          link. Check your inbox and spam folder.
        </p>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field" htmlFor="reset-email">
            Email
            <input
              id="reset-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
          </label>
          <p className="auth-status auth-error" role="alert">
            {error}
          </p>
          <button className="auth-submit" disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
      <p className="auth-footer">
        <Link to="/login" state={location.state}>
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
