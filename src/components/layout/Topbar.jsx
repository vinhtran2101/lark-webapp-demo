import React from "react";
import { ArrowLeft, Bell, CircleHelp, Grip, Search } from "lucide-react";

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
  const displayName = currentUser?.name || "Nguyễn Tú Anh";
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
          <button className="icon-button ghost" onClick={onBack} title="Quay lại">
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
        <button className="icon-button" title="Thông báo">
          <Bell size={20} />
        </button>
        <button className="icon-button" title="Ứng dụng">
          <Grip size={20} />
        </button>
        <button className="icon-button optional" title="Trợ giúp">
          <CircleHelp size={20} />
        </button>
        <button
          className="user-chip"
          type="button"
          onClick={authRequired ? onLogout : undefined}
          title={authRequired ? "Đăng xuất" : displayName}
        >
          <strong>{displayName}</strong>
          <span className="avatar">{initials}</span>
        </button>
      </div>
    </header>
  );
}
