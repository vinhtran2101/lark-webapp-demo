import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  Lock,
  MoreVertical,
  Search,
  Settings,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import AdminMetric from "../../components/admin/AdminMetric";
import { AddRoleUsersModal, ConfirmDialog, RoleCreateModal } from "../../components/admin/AdminModals";
import CustomSelect from "../../components/ui/CustomSelect";
import { requestJson } from "../../services/apiClient";

function SystemSwitcher() {
  return null;
}

function normalizePermissionLevel(value) {
  if (value === "Toàn quyền") return "full";
  if (value === "Không") return "locked";
  if (value === "Xem") return "view";
  return "scoped";
}

export default function SystemPermissions({
  onUsers,
  onChannelConfig,
  onApprovalConfig,
  onSlaConfig,
  permissionDrafts,
  setPermissionDrafts,
  onPreviewRole,
  roles = [],
  setRoles,
  users = [],
  setUsers,
  permissionMatrix: activePermissionMatrix = [],
  permissionActivityLog: activePermissionActivityLog = [],
  fallbackRoles = [],
  fallbackPermissionMatrix = [],
  permissionLevelOptions = [],
  onDataSaved,
  showToast,
}) {
  const [selectedRoleId, setSelectedRoleId] = useState("admin");
  const [roleUserSearch, setRoleUserSearch] = useState("");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [addUsersModalOpen, setAddUsersModalOpen] = useState(false);
  const [confirmDeleteRole, setConfirmDeleteRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });
  const fallbackRole = fallbackRoles[0] || roles[0] || {
    id: "admin",
    name: "Admin",
    description: "Full access",
    scope: "System",
    users: 0,
    risk: "High",
  };
  const rolesForDisplay = roles.length ? roles : [fallbackRole];
  const selectedRole = rolesForDisplay.find((role) => role.id === selectedRoleId) || rolesForDisplay[0];
  const selectedPermissions = permissionDrafts?.[selectedRole.id] || {};
  const permissionRowsForDisplay = activePermissionMatrix.length ? activePermissionMatrix : fallbackPermissionMatrix;
  const roleUserCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  const roleUsers = users.filter((user) => user.role === selectedRole.name);
  const visibleRoleUsers = roleUsers.filter((user) => {
    const haystack = `${user.name} ${user.email} ${user.scope}`.toLowerCase();
    return haystack.includes(roleUserSearch.toLowerCase());
  });
  const updateRolePermission = async (module, level) => {
    if (selectedRole.id === "admin") return;
    setPermissionDrafts((current) => ({
      ...current,
      [selectedRole.id]: {
        ...(current[selectedRole.id] || {}),
        [module]: level,
      },
    }));
    try {
      await requestJson("/api/admin/role-permissions", {
        method: "PATCH",
        body: JSON.stringify({ roleId: selectedRole.id, module, level }),
      });
      await onDataSaved?.();
    } catch (error) {
      showToast?.(`Không lưu được quyền: ${error.message}`);
    }
  };
  const createRole = async () => {
    const name = newRole.name.trim();
    if (!name || !setRoles) return;
    const id = `custom-${Date.now()}`;
    try {
      const payload = await requestJson("/api/admin/roles", {
        method: "POST",
        body: JSON.stringify({ role: newRole }),
      });
      setSelectedRoleId(payload.role?.code || id);
      setNewRole({ name: "", description: "" });
      setRoleModalOpen(false);
      await onDataSaved?.("Đã tạo vai trò trong database");
      if (!onDataSaved) {
        setRoles((current) => [
          ...current,
          {
            id,
            name,
            description: newRole.description.trim() || "Vai trò tùy chỉnh cho Forecast KD01",
            scope: "Theo phân quyền",
            users: 0,
            risk: "Trung bình",
          },
        ]);
        setPermissionDrafts((current) => ({
          ...current,
          [id]: permissionRowsForDisplay.reduce((acc, row) => ({ ...acc, [row.module]: "view" }), {}),
        }));
      }
    } catch (error) {
      showToast?.(`Không tạo được vai trò: ${error.message}`);
    }
  };
  const deleteRole = async (roleId) => {
    if (roleId === "admin" || !setRoles) return;
    try {
      await requestJson("/api/admin/roles", {
        method: "DELETE",
        body: JSON.stringify({ roleId }),
      });
      if (selectedRoleId === roleId) setSelectedRoleId("admin");
      await onDataSaved?.("Đã xóa vai trò khỏi database");
      if (!onDataSaved) {
        setRoles((current) => current.filter((role) => role.id !== roleId));
        setPermissionDrafts((current) => {
          const next = { ...current };
          delete next[roleId];
          return next;
        });
      }
    } catch (error) {
      showToast?.(`Không xóa được vai trò: ${error.message}`);
    }
  };
  const addUsersToRole = async (userIds) => {
    if (!setUsers || !userIds.length) return;
    try {
      await requestJson("/api/admin/role-users", {
        method: "POST",
        body: JSON.stringify({ roleId: selectedRole.id, userIds }),
      });
      setAddUsersModalOpen(false);
      setRoleUserSearch("");
      await onDataSaved?.("Đã gán nhân sự vào vai trò");
      if (!onDataSaved) {
        setUsers((current) =>
          current.map((user) =>
            userIds.includes(user.id)
              ? { ...user, role: selectedRole.name, scope: selectedRole.scope || "Theo phân quyền" }
              : user
          )
        );
      }
    } catch (error) {
      showToast?.(`Không gán được nhân sự: ${error.message}`);
    }
  };

  return (
    <section className="page-flow admin-page">
      <SystemSwitcher
        active="permissions"
        onUsers={onUsers}
        onChannelConfig={onChannelConfig}
        onApprovalConfig={onApprovalConfig}
        onSlaConfig={onSlaConfig}
      />

      <div className="admin-heading with-actions">
        <div className="admin-title-lockup">
          <span className="admin-title-icon blue">
            <Lock size={24} />
          </span>
          <div>
            <span>Quản trị hệ thống</span>
            <h2>Phân quyền</h2>
            <p>Thiết lập role, phạm vi dữ liệu và quyền thao tác cho từng bước Forecast KD01.</p>
          </div>
        </div>
        <button className="primary-button" onClick={() => setRoleModalOpen(true)}>
          <UserPlus size={18} />
          Tạo vai trò
        </button>
      </div>

      <div className="admin-metric-grid">
        <AdminMetric label="Vai trò" value={rolesForDisplay.length} hint="Nhóm quyền" icon={Lock} tone="blue" />
        <AdminMetric label="Nhân sự" value={users.length} hint="Đang quản lý" icon={Users} tone="green" />
        <AdminMetric label="Phạm vi" value="8" hint="Lớp dữ liệu KD01" icon={Settings} tone="cyan" />
        <AdminMetric label="Rủi ro" value="4" hint="Role nhạy cảm" icon={AlertTriangle} tone="orange" />
      </div>

      <div className="permission-layout">
        <section className="panel role-list-panel">
          <div className="panel-title-row">
            <h3>Vai trò</h3>
          </div>
          {rolesForDisplay.map((role) => (
            <article className={`role-list-item ${role.id === selectedRoleId ? "active" : ""} ${role.id !== "admin" ? "can-delete" : ""}`} key={role.id}>
              <button className="role-pick-button" onClick={() => setSelectedRoleId(role.id)}>
                <div>
                  <strong>{role.name}</strong>
                  <span>{role.description}</span>
                  <small>{role.scope}</small>
                </div>
                <span className="role-count-slot">
                  <b>{roleUserCounts[role.name] || role.users || 0}</b>
                </span>
              </button>
              {role.id !== "admin" && (
                <button className="role-delete-button" onClick={() => setConfirmDeleteRole(role)} title="Xóa vai trò">
                  <Trash2 size={16} />
                </button>
              )}
            </article>
          ))}
        </section>

        <section className="panel permission-detail-panel">
          <div className="permission-detail-title">
            <div>
              <h3>{selectedRole.name}</h3>
              <p>{selectedRole.description}</p>
            </div>
            <div className="action-row">
              {selectedRole.id !== "admin" && (
                <button className="secondary-blue-button" onClick={() => onPreviewRole(selectedRole.id)}>
                  <Eye size={18} />
                  Xem trước
                </button>
              )}
            </div>
          </div>

          <div className="permission-table">
            <div className="permission-head">
              <span>Khu vực</span>
              <span>Quyền</span>
              <span>Dữ liệu</span>
            </div>
            {permissionRowsForDisplay.map((row) => {
              const level = selectedPermissions[row.module] || normalizePermissionLevel(row[selectedRole.id]);
              return (
                <article className="permission-row" key={row.module}>
                  <strong>{row.module}</strong>
                  <CustomSelect
                    className={`permission-level-select ${level}`}
                    value={level}
                    disabled={selectedRole.id === "admin"}
                    options={permissionLevelOptions}
                    onChange={(nextLevel) => updateRolePermission(row.module, nextLevel)}
                  />
                  <span>{row.data}</span>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="permission-lower-grid">
        <section className="panel role-users-panel">
          <div className="role-users-heading">
            <div>
              <h3>Người dùng</h3>
              <p>{visibleRoleUsers.length}/{roleUserCounts[selectedRole.name] || selectedRole.users || 0} người có thể truy cập với vai trò {selectedRole.name}</p>
            </div>
            <button className="icon-action-button" title="Tùy chọn">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="role-users-toolbar">
            <label className="admin-input-shell">
              <Search size={18} />
              <input
                value={roleUserSearch}
                onChange={(event) => setRoleUserSearch(event.target.value)}
                placeholder="Tìm nhân sự..."
              />
            </label>
            <button className="primary-square-button" title="Thêm người dùng" onClick={() => setAddUsersModalOpen(true)}>
              <UserPlus size={20} />
            </button>
          </div>

          <div className="role-users-table">
            {visibleRoleUsers.length ? (
              visibleRoleUsers.map((user) => (
                <article className="role-user-row" key={user.id}>
                  <input type="checkbox" aria-label={`Chọn ${user.name}`} />
                  <span className={`avatar ${user.tone}`}>{user.initials}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <b>{user.role}</b>
                  <span>{user.scope}</span>
                </article>
              ))
            ) : (
              <div className="empty-role-users">
                Chưa có người dùng mock nào được gán vai trò này.
              </div>
            )}
          </div>

          <div className="permission-card-footer">
            <span>Hiển thị {visibleRoleUsers.length ? `1-${visibleRoleUsers.length}` : "0"} / {roleUsers.length}</span>
            {roleUsers.length > 7 && (
              <div className="pager-actions">
                <button disabled>Trước</button>
                <strong>1/1</strong>
                <button disabled>Sau</button>
              </div>
            )}
          </div>
        </section>

        <section className="panel permission-activity-panel">
          <div className="role-users-heading">
            <div>
              <h3>Nhật ký gần đây</h3>
              <p>24 bản ghi thay đổi quyền và phạm vi dữ liệu</p>
            </div>
            <Clock3 size={20} />
          </div>

          <div className="permission-activity-list">
            {activePermissionActivityLog.map((item) => (
              <article className="permission-activity-item" key={item.id}>
                <span className={`activity-dot ${item.tone}`}>
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </div>
                <time>{item.time}</time>
              </article>
            ))}
          </div>

          <div className="permission-card-footer">
            <span>24 bản ghi</span>
            <div className="pager-actions">
              <button disabled>Trước</button>
              <strong>1/6</strong>
              <button>Sau</button>
            </div>
          </div>
        </section>
      </div>
      {roleModalOpen && (
        <RoleCreateModal
          role={newRole}
          setRole={setNewRole}
          onClose={() => setRoleModalOpen(false)}
          onSubmit={createRole}
        />
      )}
      {confirmDeleteRole && (
        <ConfirmDialog
          title="Xóa vai trò?"
          body={`Vai trò "${confirmDeleteRole.name}" sẽ bị xóa khỏi mock phân quyền. Admin mặc định vẫn được giữ nguyên.`}
          confirmLabel="Xóa vai trò"
          onCancel={() => setConfirmDeleteRole(null)}
          onConfirm={() => {
            deleteRole(confirmDeleteRole.id);
            setConfirmDeleteRole(null);
          }}
        />
      )}
      {addUsersModalOpen && (
        <AddRoleUsersModal
          role={selectedRole}
          users={users}
          onClose={() => setAddUsersModalOpen(false)}
          onSave={addUsersToRole}
        />
      )}
    </section>
  );
}
