import React, { useEffect, useState } from "react";
import { BarChart3, ChevronDown, HelpCircle, LogOut } from "lucide-react";

const systemScreens = ["system-users", "system-permissions", "channel-config", "approval-config", "sla-config"];

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
    if (systemScreens.includes(screen)) return true;
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("forecast-kd01-system-nav-open") === "1";
  });

  useEffect(() => {
    if (systemScreens.includes(screen)) setIsSystemOpen(true);
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

        <nav className="nav-list" aria-label="Điều hướng chính">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isDashboard = item.label === "Dashboard" && screen === "overview";
            const isForecastFlow =
              item.label === "Lá»‹ch Forecast" && ["list", "detail", "create-1", "create-2"].includes(screen);
            const isTaskFlow = item.label === "CÃ´ng viá»‡c" && ["tasks", "task-update"].includes(screen);
            const isAppraisalFlow =
              item.label === "Tháº©m Ä‘á»‹nh" && ["appraisal", "appraisal-detail"].includes(screen);
            const isApprovalFlow = item.label === "PhÃª duyá»‡t" && ["approval", "approval-detail"].includes(screen);
            const isStorageFlow =
              item.label === "Kho lÆ°u trá»¯" && ["storage", "storage-folder", "storage-file"].includes(screen);
            const isSystemFlow =
              item.label === "Quáº£n trá»‹ há»‡ thá»‘ng" &&
              ["system-users", "system-permissions", "channel-config", "approval-config", "sla-config"].includes(screen);
            const isActive =
              isDashboard ||
              isForecastFlow ||
              isTaskFlow ||
              isAppraisalFlow ||
              isApprovalFlow ||
              isStorageFlow ||
              isSystemFlow;
            const isSystemItem = item.label === "Quáº£n trá»‹ há»‡ thá»‘ng";

            return (
              <React.Fragment key={item.label}>
                <button
                  className={`nav-item ${isActive ? "active" : ""} ${isSystemItem ? "system-nav-trigger" : ""}`}
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
          <span>Há»— trá»£</span>
        </button>
        <button className="nav-item compact" type="button" onClick={onLogout}>
          <LogOut size={20} />
          <span>ÄÄƒng xuáº¥t</span>
        </button>
      </div>
    </aside>
  );
}
