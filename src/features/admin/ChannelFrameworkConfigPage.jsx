import React, { useState } from "react";
import {
  ArrowRight,
  Clock3,
  Plus,
  Save,
  SquarePen,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { ConfirmDialog } from "../../components/admin/AdminModals";
import CustomSelect from "../../components/ui/CustomSelect";
import { requestJson } from "../../services/apiClient";

function SystemSwitcher() {
  return null;
}

function normalizeSearchValue(value = "") {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeRoleValue(value = "") {
  return normalizeSearchValue(value).replace(/[^a-z0-9]+/g, "");
}

function userHasRole(user, roleCode) {
  const target = normalizeRoleValue(roleCode);
  return [user.roleId, user.role, user.roleCode, user.title]
    .filter(Boolean)
    .some((value) => normalizeRoleValue(value).includes(target));
}

function Person({ name, badge, tone }) {
  return (
    <div className="person-cell">
      <span className={`person-badge ${tone}`}>{badge}</span>
      <span>{name}</span>
    </div>
  );
}

function ChannelConfigModal({ channel, users, onClose, onSave }) {
  const [form, setForm] = useState({
    code: channel?.code || "",
    channel: channel?.channel || "",
    shortName: channel?.shortName || channel?.channel || "",
    region: channel?.region || "",
    directorId: channel?.directorId || "",
    rsmId: channel?.rsmId || "",
    asmIds: channel?.asmIds || [],
    tone: channel?.tone || "blue",
    iconKey: channel?.iconKey || "store",
    iconTone: channel?.iconTone || "blue",
  });
  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.name}${user.title ? ` - ${user.title}` : ""}`,
  }));
  const asmUsers = users.filter((user) => userHasRole(user, "asm"));
  const toggleAsm = (userId) => {
    setForm((current) => ({
      ...current,
      asmIds: current.asmIds.includes(userId)
        ? current.asmIds.filter((id) => id !== userId)
        : [...current.asmIds, userId],
    }));
  };

  return (
    <div className="modal-backdrop">
      <section className="admin-modal user-modal-card channel-config-modal-card" role="dialog" aria-modal="true" aria-label="Cấu hình khung kênh">
        <div className="admin-modal-header">
          <h3>{channel ? "Chỉnh sửa khung kênh" : "Thêm cấu hình kênh"}</h3>
          <button className="modal-close-button" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="admin-modal-body modal-grid two-cols">
          <label>
            <span>Tên kênh</span>
            <input value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })} placeholder="Ví dụ: Kênh GT - Miền Bắc" />
          </label>
          <label>
            <span>Miền</span>
            <input value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} placeholder="Miền Bắc / Toàn quốc" />
          </label>
          <label>
            <span>GĐKD</span>
            <CustomSelect value={form.directorId} options={[{ value: "", label: "Chưa chọn" }, ...userOptions]} onChange={(directorId) => setForm({ ...form, directorId })} />
          </label>
          <label>
            <span>RSM phụ trách</span>
            <CustomSelect value={form.rsmId} options={[{ value: "", label: "Chưa chọn" }, ...userOptions]} onChange={(rsmId) => setForm({ ...form, rsmId })} />
          </label>
        </div>
        <div className="admin-modal-body add-role-users-body">
          <span className="modal-section-label">ASM thuộc kênh</span>
          <div className="add-role-users-table">
            {asmUsers.map((user) => {
              const checked = form.asmIds.includes(user.id);
              return (
                <button className={`add-role-user-row ${checked ? "selected" : ""}`} key={user.id} type="button" onClick={() => toggleAsm(user.id)}>
                  <input type="checkbox" checked={checked} onChange={() => toggleAsm(user.id)} onClick={(event) => event.stopPropagation()} />
                  <span className={`avatar ${user.tone}`}>{user.initials}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <b>{user.role}</b>
                  <span>{user.title || user.department}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="admin-modal-actions">
          <button className="secondary-button" onClick={onClose}>Hủy</button>
          <button className="primary-button" disabled={!form.channel.trim()} onClick={() => onSave(form)}>
            <Save size={17} />
            Lưu
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ChannelFrameworkConfig({ onUsers, onPermissions, onApprovalConfig, onSlaConfig, channelRows: rows = [], users = [], onDataSaved, showToast }) {
  const [channelModal, setChannelModal] = useState(null);
  const [confirmDeleteChannel, setConfirmDeleteChannel] = useState(null);
  const activeChannelCount = rows.length;
  const rsmCount = new Set(rows.map((row) => row.rsm)).size;
  const asmCount = rows.reduce((sum, row) => sum + row.asms.length, 0);
  const saveChannel = async (channel) => {
    try {
      await requestJson("/api/admin/channels", {
        method: "POST",
        body: JSON.stringify({ channel }),
      });
      setChannelModal(null);
      await onDataSaved?.("Đã lưu khung kênh vào database");
    } catch (error) {
      showToast?.(`Không lưu được khung kênh: ${error.message}`);
    }
  };
  const deleteChannel = async (channel) => {
    try {
      await requestJson("/api/admin/channels", {
        method: "DELETE",
        body: JSON.stringify({ code: channel.code, channel: channel.channel }),
      });
      setConfirmDeleteChannel(null);
      await onDataSaved?.("Đã xóa khung kênh khỏi danh sách hoạt động");
    } catch (error) {
      showToast?.(`Không xóa được khung kênh: ${error.message}`);
    }
  };

  return (
    <section className="page-flow frame-config-page">
      <SystemSwitcher active="channels" onUsers={onUsers} onPermissions={onPermissions} onApprovalConfig={onApprovalConfig} onSlaConfig={onSlaConfig} />

      <div className="frame-intro with-actions">
        <div>
          <p>Quản lý phân quyền, ánh xạ GĐKD - RSM - ASM và phạm vi kênh trong chuỗi Forecast KD01.</p>
          <div className="config-chip-row">
            <span className="config-chip blue">{activeChannelCount} Kênh Hoạt động</span>
            <span className="config-chip green">{rsmCount} RSM Phụ trách</span>
            <span className="config-chip slate">{asmCount} ASM Được gán</span>
          </div>
        </div>
        <button className="primary-button" onClick={() => setChannelModal({})}>
          <Plus size={20} />
          THÊM CẤU HÌNH KÊNH
        </button>
      </div>

      <section className="panel framework-table-panel">
        <div className="framework-table">
          <div className="framework-head">
            <span>Kênh bán hàng</span>
            <span>Miền</span>
            <span>Giám đốc kinh doanh</span>
            <span>RSM phụ trách</span>
            <span>Danh sách ASM thuộc kênh</span>
            <span>Thao tác</span>
          </div>
          {rows.map((row) => (
            <article className="framework-row" key={row.code || row.channel}>
              <div className="framework-channel">
                <i className={row.tone} />
                <strong>{row.channel}</strong>
              </div>
              <span>{row.region}</span>
              <Person name={row.director} badge={row.directorBadge} tone={row.tone === "green" ? "green" : "blue"} />
              <Person name={row.rsm} badge={row.rsmBadge} tone={row.tone === "green" ? "green" : "slate"} />
              <div className="asm-tag-list">
                {row.asms.map((asm) => (
                  <span key={asm}>{asm}</span>
                ))}
                {row.more && <button>{row.more}</button>}
              </div>
              <div className="framework-actions">
                <button title="Chỉnh sửa" onClick={() => setChannelModal(row)}>
                  <SquarePen size={20} />
                </button>
                <button title="Xóa" onClick={() => setConfirmDeleteChannel(row)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="pagination-row">
          <span>Hiển thị {activeChannelCount} trên {activeChannelCount} cấu hình kênh</span>
        </div>
      </section>

      <div className="framework-bottom-grid">
        <article className="panel framework-stat-card">
          <div className="stat-card-title">
            <h3>SLA Phân bổ</h3>
            <Clock3 size={20} />
          </div>
          <p>Thời gian trung bình RSM hoàn thành giao việc và xác nhận phạm vi kênh.</p>
          <strong>2.4 <span>ngày</span></strong>
          <i><span style={{ width: "75%" }} /></i>
        </article>
        <article className="panel framework-stat-card">
          <div className="stat-card-title green">
            <h3>Độ phủ Kênh</h3>
            <Users size={20} />
          </div>
          <p>Tỷ lệ các kênh đã được gán RSM và danh sách ASM đầy đủ.</p>
          <strong className="green">92% <span>hoàn tất</span></strong>
          <i><span className="green" style={{ width: "92%" }} /></i>
        </article>
        <article className="framework-guide-card">
          <h3>Hướng dẫn cấu hình</h3>
          <p>Đảm bảo mỗi RSM không quản lý quá 3 kênh chính để duy trì độ chính xác của dự báo doanh số. Mỗi kênh GT cần tối thiểu 3 ASM địa phương.</p>
          <button>
            Xem tài liệu vận hành
            <ArrowRight size={16} />
          </button>
        </article>
      </div>
      {channelModal && (
        <ChannelConfigModal
          channel={channelModal.code ? channelModal : null}
          users={users}
          onClose={() => setChannelModal(null)}
          onSave={saveChannel}
        />
      )}
      {confirmDeleteChannel && (
        <ConfirmDialog
          title="Xóa khung kênh?"
          body={`Kênh "${confirmDeleteChannel.channel}" sẽ bị ẩn khỏi cấu hình Forecast mới. Lịch Forecast cũ vẫn giữ dữ liệu lịch sử.`}
          confirmLabel="Xóa khung kênh"
          onCancel={() => setConfirmDeleteChannel(null)}
          onConfirm={() => deleteChannel(confirmDeleteChannel)}
        />
      )}
    </section>
  );
}
