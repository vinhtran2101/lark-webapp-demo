import React, { useEffect, useState } from "react";
import { CheckCircle2, Cloud, Lock, Search, Settings, SquarePen, UserPlus, Users } from "lucide-react";
import AdminMetric from "../../components/admin/AdminMetric";
import { UserAccountModal } from "../../components/admin/AdminModals";
import CustomSelect from "../../components/ui/CustomSelect";
import { requestJson } from "../../services/apiClient";

function SystemSwitcher() {
  return null;
}

function getUserInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "NV";
  return parts.slice(-2).map((part) => part[0]).join("").toUpperCase();
}

function Badge({ children, tone }) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}
export default function SystemUsersPage({
  onPermissions,
  onChannelConfig,
  onApprovalConfig,
  onSlaConfig,
  roleCount = 0,
  roles = [],
  users = [],
  setUsers,
  onDataSaved,
  showToast,
}) {
  const [roleFilter, setRoleFilter] = useState("Tất cả vai trò");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [searchTerm, setSearchTerm] = useState("");
  const [userModal, setUserModal] = useState(null);
  const [userPage, setUserPage] = useState(1);
  const blankUser = {
    id: "",
    name: "",
    email: "",
    roleId: roles[0]?.id || "admin",
    role: roles[0]?.name || "Admin",
    scope: "Theo phân quyền",
    status: "Active",
    initials: "NV",
    tone: "blue",
  };
  const userForm = userModal?.user || blankUser;
  const roleOptions = ["Tất cả vai trò", ...Array.from(new Set(users.map((user) => user.role)))];
  const statusOptions = ["Tất cả trạng thái", "Active", "Inactive"];
  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter === "Tất cả vai trò" || user.role === roleFilter;
    const matchStatus = statusFilter === "Tất cả trạng thái" || user.status === statusFilter;
    const matchSearch = [user.name, user.email, user.role]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });
  const userPageSize = 10;
  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / userPageSize));
  const safeUserPage = Math.min(userPage, userTotalPages);
  const pagedUsers = filteredUsers.slice((safeUserPage - 1) * userPageSize, safeUserPage * userPageSize);
  const activeCount = users.filter((user) => user.status === "Active").length;
  const inactiveCount = users.filter((user) => user.status === "Inactive").length;

  useEffect(() => {
    setUserPage(1);
  }, [roleFilter, statusFilter, searchTerm, users.length]);
  const openCreateUser = () => setUserModal({ mode: "create", user: blankUser });
  const openEditUser = (user) =>
    setUserModal({
      mode: "edit",
      user: {
        ...user,
        status: ["Active", "Inactive"].includes(user.status) ? user.status : "Inactive",
      },
    });
  const updateUserForm = (patch) => {
    setUserModal((current) => ({ ...current, user: { ...(current?.user || blankUser), ...patch } }));
  };
  const saveUser = async () => {
    const name = userForm.name.trim() || "Người dùng mới";
    const role = roles.find((item) => item.id === userForm.roleId || item.name === userForm.role) || roles[0];
    const nextUser = {
      ...userForm,
      id: userForm.id || `u-${Date.now()}`,
      name,
      email: userForm.email.trim() || `user-${Date.now()}@elmich.local`,
      roleId: role?.id || userForm.roleId,
      role: role?.name || userForm.role,
      scope: role?.scope || userForm.scope?.trim() || "Theo phân quyền",
      initials: getUserInitials(name),
      tone: userForm.tone || "blue",
    };
    setUserModal(null);
    if (setUsers) {
      setUsers((current) =>
        userModal?.mode === "edit"
          ? current.map((user) => (user.id === nextUser.id ? nextUser : user))
          : [nextUser, ...current]
      );
    }
    try {
      await requestJson("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ user: nextUser }),
      });
      await onDataSaved?.("Đã lưu tài khoản vào database");
    } catch (error) {
      showToast?.(`Không lưu được tài khoản: ${error.message}`);
    }
  };

  return (
    <section className="page-flow admin-page">
      <SystemSwitcher
        active="users"
        onPermissions={onPermissions}
        onChannelConfig={onChannelConfig}
        onApprovalConfig={onApprovalConfig}
        onSlaConfig={onSlaConfig}
      />

      <div className="admin-heading with-actions">
        <div className="admin-title-lockup">
          <span className="admin-title-icon blue">
            <Users size={24} />
          </span>
          <div>
            <span>Quản trị hệ thống</span>
            <h2>Tài khoản</h2>
            <p>Mock danh sách người dùng, vai trò và trạng thái truy cập phục vụ Forecast KD01.</p>
          </div>
        </div>
        <div className="action-row">
          <button className="secondary-blue-button">
            <Cloud size={18} />
            Đồng bộ danh bạ
          </button>
          <button className="primary-button" onClick={openCreateUser}>
            <UserPlus size={18} />
            Tạo tài khoản
          </button>
        </div>
      </div>

      <div className="admin-metric-grid">
        <AdminMetric label="Tài khoản" value={users.length} hint="Tổng hồ sơ" icon={Users} tone="blue" />
        <AdminMetric label="Đang hoạt động" value={activeCount} hint="Có thể truy cập" icon={CheckCircle2} tone="green" />
        <AdminMetric label="Không hoạt động" value={inactiveCount} hint="Chưa truy cập" icon={Lock} tone="orange" />
        <AdminMetric label="Vai trò" value={roleCount} hint="Nhóm quyền" icon={Settings} tone="purple" />
      </div>

      <section className="panel admin-directory-panel">
        <div className="admin-filter-grid">
          <label>
            <span>Tìm kiếm</span>
            <div className="admin-input-shell">
              <Search size={18} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm tên, email, vai trò..."
              />
            </div>
          </label>
          <label>
            <span>Vai trò</span>
            <CustomSelect value={roleFilter} options={roleOptions} onChange={setRoleFilter} />
          </label>
          <label>
            <span>Trạng thái</span>
            <CustomSelect value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
          </label>
        </div>

        <div className="admin-user-table">
          <div className="admin-user-head">
            <span>Tài khoản</span>
            <span>Vai trò</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          {pagedUsers.map((user) => (
            <article className="admin-user-row" key={user.id}>
              <div className="admin-user-cell">
                <span className={`avatar ${user.tone}`}>{user.initials}</span>
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
              </div>
              <span><Badge tone="neutral">{user.role}</Badge></span>
              <span><Badge tone={user.status === "Active" ? "success" : "neutral"}>{user.status}</Badge></span>
              <button className="secondary-button compact-action" title="Chỉnh sửa" onClick={() => openEditUser(user)}>
                <SquarePen size={17} />
              </button>
            </article>
          ))}
        </div>
        <div className="permission-card-footer admin-user-pagination">
          <span>
            Hiển thị {filteredUsers.length ? `${(safeUserPage - 1) * userPageSize + 1}-${Math.min(safeUserPage * userPageSize, filteredUsers.length)}` : "0"} / {filteredUsers.length} tài khoản
          </span>
          {userTotalPages > 1 && (
            <div className="pager-actions">
              <button disabled={safeUserPage === 1} onClick={() => setUserPage((page) => Math.max(1, page - 1))}>Trước</button>
              <strong>{safeUserPage}/{userTotalPages}</strong>
              <button disabled={safeUserPage === userTotalPages} onClick={() => setUserPage((page) => Math.min(userTotalPages, page + 1))}>Sau</button>
            </div>
          )}
        </div>
      </section>
      {userModal && (
        <UserAccountModal
          mode={userModal.mode}
          user={userForm}
          roles={roles}
          onChange={updateUserForm}
          onClose={() => setUserModal(null)}
          onSave={saveUser}
        />
      )}
    </section>
  );
}
