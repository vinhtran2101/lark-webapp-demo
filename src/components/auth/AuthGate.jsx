import React from "react";
import { AlertTriangle, ArrowRight, Lock, X } from "lucide-react";

const PREVIEW_LABEL = "\u0110ang xem tr\u01b0\u1edbc vai tr\u00f2";
const EXIT_PREVIEW_LABEL = "Tho\u00e1t xem tr\u01b0\u1edbc";
const ROLE_LABEL = "Vai tr\u00f2";
const DENIED_SUFFIX = "kh\u00f4ng c\u00f3 quy\u1ec1n truy c\u1eadp m\u00e0n h\u00ecnh n\u00e0y";
const DENIED_HELP =
  "C\u00e1c menu v\u00e0 khu v\u1ef1c kh\u00f4ng n\u1eb1m trong ph\u1ea1m vi quy\u1ec1n \u0111\u00e3 \u0111\u01b0\u1ee3c \u1ea9n trong ch\u1ebf \u0111\u1ed9 xem tr\u01b0\u1edbc.";
const LOADING_TITLE = "\u0110ang ki\u1ec3m tra phi\u00ean \u0111\u0103ng nh\u1eadp";
const LOGIN_TITLE = "\u0110\u0103ng nh\u1eadp b\u1eb1ng Lark";
const AUTH_DESCRIPTION =
  "H\u1ec7 th\u1ed1ng d\u00f9ng Lark \u0111\u1ec3 x\u00e1c \u0111\u1ecbnh ng\u01b0\u1eddi truy c\u1eadp, sau \u0111\u00f3 \u00e1p quy\u1ec1n theo role \u0111\u00e3 c\u1ea5u h\u00ecnh trong PostgreSQL.";
const MISSING_CONFIG =
  "Ch\u01b0a c\u1ea5u h\u00ecnh LARK_APP_ID / LARK_APP_SECRET tr\u00ean server.";
const LOADING_TEXT = "\u0110ang t\u1ea3i...";
const LOGIN_BUTTON = "\u0110\u0103ng nh\u1eadp Lark";

const ERROR_MESSAGES = {
  not_allowed: "T\u00e0i kho\u1ea3n Lark n\u00e0y ch\u01b0a \u0111\u01b0\u1ee3c c\u1ea5p quy\u1ec1n trong Forecast KD01.",
  account_inactive: "T\u00e0i kho\u1ea3n \u0111ang inactive ho\u1eb7c b\u1ecb kh\u00f3a trong h\u1ec7 th\u1ed1ng.",
  lark_failed:
    "Lark ch\u01b0a x\u00e1c th\u1ef1c \u0111\u01b0\u1ee3c phi\u00ean \u0111\u0103ng nh\u1eadp. Ki\u1ec3m tra l\u1ea1i c\u1ea5u h\u00ecnh app Lark.",
};

export function RolePreviewBanner({ role, onExit }) {
  return (
    <div className="role-preview-banner">
      <div>
        <span>{PREVIEW_LABEL}</span>
        <strong>{role.name}</strong>
        <small>{role.description}</small>
      </div>
      <button className="secondary-button" onClick={onExit}>
        <X size={18} />
        {EXIT_PREVIEW_LABEL}
      </button>
    </div>
  );
}

export function PreviewAccessDenied({ role, onExit }) {
  return (
    <section className="preview-denied-card">
      <Lock size={28} />
      <h2>
        {ROLE_LABEL} {role?.name} {DENIED_SUFFIX}
      </h2>
      <p>{DENIED_HELP}</p>
      <button className="primary-button" onClick={onExit}>
        <X size={18} />
        {EXIT_PREVIEW_LABEL}
      </button>
    </section>
  );
}

export default function AuthGate({ auth }) {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const errorMessage = ERROR_MESSAGES[params.get("auth_error")] || "";

  return (
    <main className="auth-gate-page">
      <section className="auth-gate-card">
        <span className="auth-gate-icon">
          <Lock size={28} />
        </span>
        <div>
          <span className="eyebrow">Forecast KD01</span>
          <h1>{auth.loading ? LOADING_TITLE : LOGIN_TITLE}</h1>
          <p>{AUTH_DESCRIPTION}</p>
        </div>
        {errorMessage && (
          <div className="auth-gate-warning">
            <AlertTriangle size={18} />
            {errorMessage}
          </div>
        )}
        {!auth.loading && !auth.configured && (
          <div className="auth-gate-warning">
            <AlertTriangle size={18} />
            {MISSING_CONFIG}
          </div>
        )}
        {auth.loading ? (
          <div className="auth-gate-loading">{LOADING_TEXT}</div>
        ) : (
          <a className="primary-button auth-gate-login" href={auth.loginUrl || "/api/auth/lark/start"}>
            {LOGIN_BUTTON}
            <ArrowRight size={18} />
          </a>
        )}
      </section>
    </main>
  );
}
