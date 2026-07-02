import React from "react";
import { ArrowLeft, Bell, CircleHelp, Grip, Search } from "lucide-react";

const FALLBACK_USER_NAME = "Nguy\u1ec5n T\u00fa Anh";
const BACK_LABEL = "Quay l\u1ea1i";
const NOTIFICATION_LABEL = "Th\u00f4ng b\u00e1o";
const APPS_LABEL = "\u1ee8ng d\u1ee5ng";
const HELP_LABEL = "Tr\u1ee3 gi\u00fap";
const LOGOUT_LABEL = "\u0110\u0103ng xu\u1ea5t";

export default function Topbar({
  title,
  search,
  showBack,
  hideSearch,
  onBack,
  currentUser,
  authRequired,
  onLogout,
}) {
  const displayName = currentUser?.name || FALLBACK_USER_NAME;
  const initials =
    currentUser?.initials ||
    displayName
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ||
    "NA";

  return (
    <header className="topbar">
      <div className="topbar-title">
        {showBack && (
          <button className="icon-button ghost" onClick={onBack} title={BACK_LABEL}>
            <ArrowLeft size={22} />
          </button>
        )}
        <h1>{title}</h1>
      </div>
      <div className="topbar-tools">
        {!hideSearch && (
          <label className="search-box">
            <Search size={20} />
            <input placeholder={search} />
          </label>
        )}
        <button className="icon-button" title={NOTIFICATION_LABEL}>
          <Bell size={20} />
        </button>
        <button className="icon-button" title={APPS_LABEL}>
          <Grip size={20} />
        </button>
        <button className="icon-button optional" title={HELP_LABEL}>
          <CircleHelp size={20} />
        </button>
        <button
          className="user-chip"
          type="button"
          onClick={authRequired ? onLogout : undefined}
          title={authRequired ? LOGOUT_LABEL : displayName}
        >
          <strong>{displayName}</strong>
          <span className="avatar">{initials}</span>
        </button>
      </div>
    </header>
  );
}
