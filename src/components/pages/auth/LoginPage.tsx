import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../../auth/AuthLayout";
import { safeDestination } from "../../auth/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";
import { authErrorMessage } from "../../../services/authErrors";
export default function LoginPage() {
  const { login, signInWithGoogle, isAuthenticated, isLoading, sessionError } =
    useAuth();
  const location = useLocation();
  const target = safeDestination(location.state?.from);
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
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
  if (isAuthenticated && !busy) return <Navigate to={target} replace />;
  return (
    <AuthLayout
      title="Welcome back."
      description="Sign in to your OminiCode workspace."
    >
      {sessionError && (
        <p className="auth-session" role="status">
          {sessionError}
        </p>
      )}
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(() => login(email, password));
        }}
      >
        <label className="auth-field" htmlFor="login-email">
          Email
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
        </label>
        <label className="auth-field" htmlFor="login-password">
          Password
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
        </label>
        <Link
          className="auth-forgot"
          to="/forgot-password"
          state={{ from: target }}
        >
          Forgot password?
        </Link>
        <p className="auth-status auth-error" role="alert">
          {error}
        </p>
        <button className="auth-submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <div className="auth-divider">or</div>
      <button
        className="auth-google"
        disabled={busy}
        onClick={() => void submit(signInWithGoogle)}
      >
        Continue with Google
      </button>
      <p className="auth-footer">
        New to OminiCode?{" "}
        <Link to="/register" state={{ from: target }}>
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
