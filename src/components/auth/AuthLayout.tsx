import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import OminiCodeLogo from "../brand/OminiCodeLogo";
import "./auth.css";
export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-page">
      <Link className="auth-brand" to="/" aria-label="OminiCode home">
        <OminiCodeLogo size={36} />
      </Link>
      <section className="auth-card" aria-labelledby="auth-title">
        <h1 id="auth-title">{title}</h1>
        <p className="auth-intro">{description}</p>
        {children}
      </section>
      <p className="auth-footnote">Your next idea starts here.</p>
    </main>
  );
}
