import React, { useState } from "react";
import { Save, Search, X } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
export function RoleCreateModal({ role, setRole, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop">
      <section className="admin-modal role-modal-card" role="dialog" aria-modal="true" aria-label="Tạo vai trò">
        <div className="admin-modal-header">
          <div>
            <h3>Tạo vai trò</h3>
            <p>Nhập tên và mô tả vai trò, sau đó thiết lập quyền chi tiết ở bảng phân quyền.</p>
          </div>
          <button className="modal-close-button" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="admin-modal-body modal-grid">
          <label>
            <span>Tên vai trò</span>
            <input value={role.name} onChange={(event) => setRole({ ...role, name: event.target.value })} placeholder="Ví dụ: Quản lý vùng mới" />
          </label>
          <label>
            <span>Mô tả</span>
            <textarea value={role.description} onChange={(event) => setRole({ ...role, description: event.target.value })} placeholder="Mô tả trách nhiệm và phạm vi vận hành..." />
          </label>
        </div>
        <div className="admin-modal-actions">
          <button className="secondary-button" onClick={onClose}>Hủy</button>
          <button className="primary-button" onClick={onSubmit}>Tạo vai trò</button>
        </div>
      </section>
    </div>
  );
}

export function UserAccountModal({ mode, user, roles, onChange, onClose, onSave }) {
  const title = mode === "edit" ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới";
  const selectedRoleId = user.roleId || roles.find((role) => role.name === user.role)?.id || roles[0]?.id || "";
  return (
    <div className="modal-backdrop">
      <section className="admin-modal user-modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="modal-close-button" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="admin-modal-body modal-grid two-cols">
          <label>
            <span>Tên tài khoản</span>
            <input value={user.name} onChange={(event) => onChange({ name: event.target.value })} placeholder="Nguyễn Văn A" />
          </label>
          <label>
            <span>Mã nhân sự</span>
            <input value={user.employeeCode || ""} onChange={(event) => onChange({ employeeCode: event.target.value })} placeholder="NV-001" />
          </label>
          <label>
            <span>Email đăng nhập</span>
            <input value={user.email} onChange={(event) => onChange({ email: event.target.value })} placeholder="ten@elmich.vn" />
          </label>
          <label>
            <span>Số điện thoại</span>
            <input value={user.phone || ""} onChange={(event) => onChange({ phone: event.target.value })} placeholder="098xxxxxxx" />
          </label>
          <label>
            <span>Chức danh</span>
            <input value={user.title || ""} onChange={(event) => onChange({ title: event.target.value })} placeholder="Admin hệ thống" />
          </label>
          <label>
            <span>Phòng ban</span>
            <input value={user.department || ""} onChange={(event) => onChange({ department: event.target.value })} placeholder="Kế hoạch / Kinh doanh / Tài chính" />
          </label>
          <label>
            <span>Trạng thái</span>
            <CustomSelect value={user.status} options={["Active", "Inactive"]} onChange={(status) => onChange({ status })} />
          </label>
          <label>
            <span>Vai trò phân quyền</span>
            <CustomSelect
              value={selectedRoleId}
              options={roles.map((role) => ({ value: role.id, label: role.name }))}
              onChange={(roleId) => {
                const nextRole = roles.find((role) => role.id === roleId);
                onChange({ roleId, role: nextRole?.name || user.role });
              }}
            />
          </label>
        </div>
        <div className="admin-modal-actions">
          <button className="secondary-button" onClick={onClose}>Hủy</button>
          <button className="primary-button" onClick={onSave}>
            <Save size={17} />
            Lưu
          </button>
        </div>
      </section>
    </div>
  );
}

export function ConfirmDialog({ title, body, confirmLabel, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <section className="admin-modal confirm-modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="admin-modal-header">
          <div>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
          <button className="modal-close-button" onClick={onCancel} title="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="admin-modal-actions">
          <button className="secondary-button" onClick={onCancel}>Hủy</button>
          <button className="danger-button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}

export function AddRoleUsersModal({ role, users, onClose, onSave }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const candidates = users
    .filter((user) => user.role !== role.name)
    .filter((user) => {
      if (!normalizedSearch) return true;
      return [user.name, user.email, user.role, user.scope]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  const toggleUser = (userId) => {
    setSelectedIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  };

  return (
    <div className="modal-backdrop">
      <section className="admin-modal add-role-users-modal" role="dialog" aria-modal="true" aria-label={`Thêm nhân sự vào vai trò ${role.name}`}>
        <div className="admin-modal-header">
          <div>
            <h3>Thêm nhân sự vào vai trò {role.name}</h3>
            <p>Chọn nhân sự cần gán vào nhóm quyền này, sau đó bấm lưu để xác nhận.</p>
          </div>
          <button className="modal-close-button" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="admin-modal-body add-role-users-body">
          <label className="admin-input-shell add-role-users-search">
            <Search size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm tên, email, vai trò hiện tại..."
            />
          </label>

          <div className="add-role-users-table">
            {candidates.length ? (
              candidates.map((user) => {
                const checked = selectedIds.includes(user.id);
                return (
                  <button
                    className={`add-role-user-row ${checked ? "selected" : ""}`}
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    type="button"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleUser(user.id)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Chọn ${user.name}`}
                    />
                    <span className={`avatar ${user.tone}`}>{user.initials}</span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    <b>{user.role}</b>
                    <span>{user.scope}</span>
                  </button>
                );
              })
            ) : (
              <div className="empty-role-users">
                Không còn nhân sự phù hợp để thêm vào vai trò này.
              </div>
            )}
          </div>
        </div>
        <div className="admin-modal-actions">
          <span className="modal-selection-count">Đã chọn {selectedIds.length} nhân sự</span>
          <button className="secondary-button" onClick={onClose}>Hủy</button>
          <button className="primary-button" disabled={!selectedIds.length} onClick={() => onSave(selectedIds)}>
            <Save size={17} />
            Lưu
          </button>
        </div>
      </section>
    </div>
  );
}
