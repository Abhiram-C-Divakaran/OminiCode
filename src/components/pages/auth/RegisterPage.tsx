import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../../auth/AuthLayout";
import { safeDestination } from "../../auth/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import { authErrorMessage } from "../../../services/authErrors";
export default function RegisterPage() {
  const { register, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const target = safeDestination(location.state?.from);
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirm) {
      setError("Your passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  if (isLoading)
    return (
      <div className="auth-loading" role="status">
        Checking your session…
      </div>
    );
  if (isAuthenticated && !busy && !error)
    return <Navigate to={target} replace />;
  return (
    <AuthLayout
      title="Create your account."
      description="A focused space to build better software."
    >
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-field" htmlFor="register-name">
          Name
          <input
            id="register-name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
          />
        </label>
        <label className="auth-field" htmlFor="register-email">
          Email
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
        </label>
        <label className="auth-field" htmlFor="register-password">
          Password
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            aria-describedby="password-help"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
          <small id="password-help">Use at least 8 characters.</small>
        </label>
        <label className="auth-field" htmlFor="register-confirm">
          Confirm password
          <input
            id="register-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={busy}
          />
        </label>
        <p className="auth-status auth-error" role="alert">
          {error}
        </p>
        <button className="auth-submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account?{" "}
        <Link to="/login" state={{ from: target }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
