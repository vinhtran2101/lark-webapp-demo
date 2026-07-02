import React, { useEffect, useState } from "react";
import { BarChart3, ChevronDown, HelpCircle, LogOut } from "lucide-react";

const SYSTEM_SCREENS = ["system-users", "system-permissions", "channel-config", "approval-config", "sla-config"];
const SUPPORT_LABEL = "H\u1ed7 tr\u1ee3";
const LOGOUT_LABEL = "\u0110\u0103ng xu\u1ea5t";
const NAV_ARIA_LABEL = "\u0110i\u1ec1u h\u01b0\u1edbng ch\u00ednh";

const ACTIVE_SCREEN_GROUPS = {
  overview: ["overview"],
  list: ["list", "detail", "create-1", "create-2"],
  tasks: ["tasks", "task-update"],
  appraisal: ["appraisal", "appraisal-detail"],
  approval: ["approval", "approval-detail"],
  storage: ["storage", "storage-folder", "storage-file"],
  "system-users": SYSTEM_SCREENS,
};

export default function Sidebar({
  screen,
  setScreen,
  previewPermissions,
  onLogout,
  navItems,
  systemSubItems,
  previewNavModules,
  hasPreviewAccess,
}) {
  const visibleNavItems = previewPermissions
    ? navItems.filter((item) => hasPreviewAccess(previewPermissions, previewNavModules[item.screen] || []))
    : navItems;
  const visibleSystemSubItems = previewPermissions
    ? systemSubItems.filter((item) => hasPreviewAccess(previewPermissions, previewNavModules[item.screen] || []))
    : systemSubItems;
  const [isSystemOpen, setIsSystemOpen] = useState(() => {
    if (SYSTEM_SCREENS.includes(screen)) return true;
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("forecast-kd01-system-nav-open") === "1";
  });

  useEffect(() => {
    if (SYSTEM_SCREENS.includes(screen)) setIsSystemOpen(true);
  }, [screen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("forecast-kd01-system-nav-open", isSystemOpen ? "1" : "0");
  }, [isSystemOpen]);

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-mark">
            <BarChart3 size={20} />
          </div>
          <div>
            <strong>Elmich Ops</strong>
            <span>Operations Platform</span>
          </div>
        </div>

        <nav className="nav-list" aria-label={NAV_ARIA_LABEL}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isSystemItem = item.screen === "system-users";
            const isActive = (ACTIVE_SCREEN_GROUPS[item.screen] || [item.screen]).includes(screen);

            return (
              <React.Fragment key={item.screen || item.label}>
                <button
                  className={`nav-item ${isActive ? "active" : ""} ${isSystemItem ? "system-nav-trigger" : ""}`}
                  type="button"
                  onClick={() => {
                    if (isSystemItem) {
                      setIsSystemOpen((current) => !current);
                      return;
                    }
                    setScreen(item.screen);
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isSystemItem && <ChevronDown className={`nav-chevron ${isSystemOpen ? "open" : ""}`} size={16} />}
                </button>
                {isSystemItem && isSystemOpen && visibleSystemSubItems.length > 0 && (
                  <div className="sidebar-submenu">
                    {visibleSystemSubItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <button
                          key={subItem.screen}
                          className={`sidebar-subitem ${screen === subItem.screen ? "active" : ""}`}
                          type="button"
                          onClick={() => setScreen(subItem.screen)}
                        >
                          <SubIcon size={16} />
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item compact" type="button">
          <HelpCircle size={20} />
          <span>{SUPPORT_LABEL}</span>
        </button>
        <button className="nav-item compact" type="button" onClick={onLogout}>
          <LogOut size={20} />
          <span>{LOGOUT_LABEL}</span>
        </button>
      </div>
    </aside>
  );
}
