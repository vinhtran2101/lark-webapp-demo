export const mockRoles = [
  { id: "admin", code: "admin", name: "Admin", description: "Toàn quyền cấu hình và giám sát Forecast KD01", scopeType: "all", scopeLabel: "Toàn hệ thống", isSystem: true, risk: "Cao" },
  { id: "planning", code: "planning", name: "Planning", description: "Tạo kỳ Forecast, tổng hợp file và trình hồ sơ", scopeType: "department", scopeLabel: "Phòng Kế hoạch", isSystem: true, risk: "Trung bình" },
  { id: "asm", code: "asm", name: "ASM", description: "Cập nhật file Forecast theo kênh được phân công", scopeType: "channel", scopeLabel: "Theo kênh/vùng", isSystem: true, risk: "Thấp" },
  { id: "rsm", code: "rsm", name: "RSM", description: "Rà soát và duyệt Forecast cấp quản lý vùng/kênh", scopeType: "channel", scopeLabel: "Theo kênh", isSystem: true, risk: "Trung bình" },
  { id: "gdkd", code: "gdkd", name: "GĐKD", description: "Duyệt Forecast cấp Giám đốc kinh doanh", scopeType: "business_unit", scopeLabel: "Theo khối kinh doanh", isSystem: true, risk: "Cao" },
  { id: "supply", code: "supply", name: "Cung ứng", description: "Thẩm định tồn kho, nguồn hàng và khả năng đáp ứng", scopeType: "department", scopeLabel: "Dữ liệu cung ứng", isSystem: true, risk: "Trung bình" },
  { id: "finance", code: "finance", name: "Tài chính", description: "Thẩm định giá vốn, biên lợi nhuận và ngân sách", scopeType: "department", scopeLabel: "Dữ liệu tài chính", isSystem: true, risk: "Cao" },
  { id: "bi", code: "bi", name: "BI", description: "Đối chiếu lịch sử bán hàng, dữ liệu forecast và báo cáo", scopeType: "department", scopeLabel: "Dữ liệu phân tích", isSystem: true, risk: "Trung bình" },
  { id: "factory", code: "factory", name: "Nhà máy", description: "Thẩm định năng lực sản xuất và lịch giao hàng", scopeType: "department", scopeLabel: "Dữ liệu sản xuất", isSystem: true, risk: "Trung bình" },
  { id: "ceo", code: "ceo", name: "CEO", description: "Phê duyệt cuối và phát hành bản Forecast chính thức", scopeType: "company", scopeLabel: "Toàn công ty", isSystem: true, risk: "Cao" },
  { id: "viewer", code: "viewer", name: "Viewer", description: "Chỉ xem báo cáo và kho lưu trữ", scopeType: "custom", scopeLabel: "Theo phân quyền", isSystem: true, risk: "Thấp" },
];

export const mockUsers = [
  { id: "u-01", employeeCode: "NV-001", fullName: "Nguyễn Tú Anh", email: "tu.anh@elmich.vn", phone: "", department: "Admin", title: "Admin hệ thống", status: "Active", initials: "NA", tone: "blue" },
  { id: "u-02", employeeCode: "NV-002", fullName: "Trần Văn A", email: "planning@elmich.vn", phone: "", department: "Phòng Kế hoạch", title: "Planning", status: "Active", initials: "TA", tone: "green" },
  { id: "u-03", employeeCode: "NV-003", fullName: "Lê Quang Minh", email: "asm.ec@elmich.vn", phone: "", department: "Kinh doanh", title: "ASM TMĐT", status: "Active", initials: "LM", tone: "blue" },
  { id: "u-04", employeeCode: "NV-004", fullName: "Nguyễn Diệp Chi", email: "asm.gt@elmich.vn", phone: "", department: "Kinh doanh", title: "ASM GT", status: "Active", initials: "DC", tone: "purple" },
  { id: "u-05", employeeCode: "NV-005", fullName: "Đặng Văn D", email: "asm.mt@elmich.vn", phone: "", department: "Kinh doanh", title: "ASM MT", status: "Inactive", initials: "DD", tone: "slate" },
  { id: "u-06", employeeCode: "NV-006", fullName: "Lê Thị Thảo", email: "rsm.mt@elmich.vn", phone: "", department: "Kinh doanh", title: "RSM MT", status: "Active", initials: "LT", tone: "green" },
  { id: "u-07", employeeCode: "NV-007", fullName: "Nguyễn Văn Nam", email: "gdkd@elmich.vn", phone: "", department: "Kinh doanh", title: "Giám đốc kinh doanh", status: "Active", initials: "NN", tone: "blue" },
  { id: "u-08", employeeCode: "NV-008", fullName: "Bộ phận Cung ứng", email: "supply@elmich.vn", phone: "", department: "Cung ứng", title: "Supply reviewer", status: "Active", initials: "CU", tone: "green" },
  { id: "u-09", employeeCode: "NV-009", fullName: "Phòng Tài chính", email: "finance@elmich.vn", phone: "", department: "Tài chính", title: "Finance reviewer", status: "Active", initials: "TC", tone: "orange" },
  { id: "u-10", employeeCode: "NV-010", fullName: "BI Team", email: "bi@elmich.vn", phone: "", department: "BI", title: "Data reviewer", status: "Active", initials: "BI", tone: "purple" },
  { id: "u-11", employeeCode: "NV-011", fullName: "Kế hoạch Nhà máy", email: "factory@elmich.vn", phone: "", department: "Nhà máy", title: "Factory planner", status: "Active", initials: "NM", tone: "slate" },
  { id: "u-12", employeeCode: "NV-012", fullName: "CEO Office", email: "ceo@elmich.vn", phone: "", department: "Ban điều hành", title: "CEO", status: "Active", initials: "CO", tone: "purple" },
  { id: "u-13", employeeCode: "NV-013", fullName: "Ban điều hành", email: "viewer@elmich.vn", phone: "", department: "Ban điều hành", title: "Viewer", status: "Active", initials: "VD", tone: "blue" },
];

export const mockUserRoles = [
  { id: "ur-01", userId: "u-01", roleId: "admin", scopeNote: "Toàn hệ thống" },
  { id: "ur-02", userId: "u-02", roleId: "planning", scopeNote: "Phòng Kế hoạch" },
  { id: "ur-03", userId: "u-03", roleId: "asm", scopeNote: "Kênh TMĐT" },
  { id: "ur-04", userId: "u-04", roleId: "asm", scopeNote: "Kênh GT - Miền Bắc" },
  { id: "ur-05", userId: "u-05", roleId: "asm", scopeNote: "Kênh MT - Toàn quốc" },
  { id: "ur-06", userId: "u-06", roleId: "rsm", scopeNote: "Kênh MT" },
  { id: "ur-07", userId: "u-07", roleId: "gdkd", scopeNote: "GT/MT/TMĐT" },
  { id: "ur-08", userId: "u-08", roleId: "supply", scopeNote: "Tồn kho và khả năng cung ứng" },
  { id: "ur-09", userId: "u-09", roleId: "finance", scopeNote: "Giá vốn, margin, ngân sách" },
  { id: "ur-10", userId: "u-10", roleId: "bi", scopeNote: "Dữ liệu bán hàng và lịch sử forecast" },
  { id: "ur-11", userId: "u-11", roleId: "factory", scopeNote: "Năng lực sản xuất và lịch giao hàng" },
  { id: "ur-12", userId: "u-12", roleId: "ceo", scopeNote: "Phê duyệt cuối" },
  { id: "ur-13", userId: "u-13", roleId: "viewer", scopeNote: "Báo cáo và kho lưu trữ" },
];

export const mockModules = [
  { id: "mod-schedule", code: "forecast_schedule", name: "Lịch Forecast", dataLabel: "Kỳ forecast", sortOrder: 10 },
  { id: "mod-assignment", code: "task_assignment", name: "Giao việc kênh", dataLabel: "Task theo kênh", sortOrder: 20 },
  { id: "mod-submit", code: "forecast_submit", name: "Nộp file Forecast", dataLabel: "File ASM/kênh", sortOrder: 30 },
  { id: "mod-sales-approval", code: "sales_approval", name: "Duyệt kinh doanh", dataLabel: "File đã nộp", sortOrder: 40 },
  { id: "mod-supply", code: "supply_appraisal", name: "Thẩm định Cung ứng", dataLabel: "Tồn kho/nguồn hàng", sortOrder: 50 },
  { id: "mod-finance", code: "finance_appraisal", name: "Thẩm định Tài chính", dataLabel: "Giá vốn/margin", sortOrder: 60 },
  { id: "mod-bi", code: "bi_appraisal", name: "Thẩm định BI", dataLabel: "Lịch sử bán hàng", sortOrder: 70 },
  { id: "mod-factory", code: "factory_planning", name: "Kế hoạch Nhà máy", dataLabel: "Năng lực sản xuất", sortOrder: 80 },
  { id: "mod-ceo", code: "ceo_approval", name: "Phê duyệt CEO", dataLabel: "Bản cuối", sortOrder: 90 },
  { id: "mod-storage", code: "storage", name: "Kho lưu trữ", dataLabel: "File phát hành", sortOrder: 100 },
  { id: "mod-admin", code: "system_admin", name: "Quản trị hệ thống", dataLabel: "User/role/SLA", sortOrder: 110 },
];

const permissionSeed = {
  forecast_schedule: { admin: "full", planning: "scoped", asm: "view", rsm: "view", gdkd: "view", supply: "view", finance: "view", bi: "view", factory: "view", ceo: "view", viewer: "view" },
  task_assignment: { admin: "full", planning: "scoped", asm: "scoped", rsm: "scoped", gdkd: "view", supply: "locked", finance: "locked", bi: "locked", factory: "locked", ceo: "view", viewer: "locked" },
  forecast_submit: { admin: "full", planning: "view", asm: "scoped", rsm: "view", gdkd: "view", supply: "locked", finance: "locked", bi: "locked", factory: "locked", ceo: "view", viewer: "locked" },
  sales_approval: { admin: "full", planning: "view", asm: "locked", rsm: "scoped", gdkd: "scoped", supply: "locked", finance: "locked", bi: "locked", factory: "locked", ceo: "view", viewer: "locked" },
  supply_appraisal: { admin: "full", planning: "scoped", asm: "locked", rsm: "view", gdkd: "view", supply: "scoped", finance: "view", bi: "view", factory: "view", ceo: "view", viewer: "view" },
  finance_appraisal: { admin: "full", planning: "scoped", asm: "locked", rsm: "view", gdkd: "view", supply: "view", finance: "scoped", bi: "view", factory: "locked", ceo: "view", viewer: "view" },
  bi_appraisal: { admin: "full", planning: "scoped", asm: "locked", rsm: "view", gdkd: "view", supply: "view", finance: "view", bi: "scoped", factory: "locked", ceo: "view", viewer: "view" },
  factory_planning: { admin: "full", planning: "scoped", asm: "locked", rsm: "view", gdkd: "view", supply: "view", finance: "locked", bi: "view", factory: "scoped", ceo: "view", viewer: "view" },
  ceo_approval: { admin: "full", planning: "view", asm: "locked", rsm: "locked", gdkd: "view", supply: "view", finance: "view", bi: "view", factory: "view", ceo: "scoped", viewer: "view" },
  storage: { admin: "full", planning: "scoped", asm: "view", rsm: "view", gdkd: "view", supply: "view", finance: "view", bi: "view", factory: "view", ceo: "view", viewer: "view" },
  system_admin: { admin: "full", planning: "scoped", asm: "locked", rsm: "locked", gdkd: "locked", supply: "locked", finance: "locked", bi: "locked", factory: "locked", ceo: "view", viewer: "locked" },
};

export const mockRolePermissions = Object.entries(permissionSeed).flatMap(([moduleCode, roleMap]) => {
  const module = mockModules.find((item) => item.code === moduleCode);
  return Object.entries(roleMap).map(([roleCode, permissionLevel]) => ({
    id: `perm-${moduleCode}-${roleCode}`,
    moduleId: module.id,
    roleId: roleCode,
    permissionLevel,
    dataScope: permissionLevel === "full" ? "all" : permissionLevel === "locked" ? "none" : "assigned",
  }));
});

export const mockSalesChannels = [
  { id: "ch-gt-north", code: "GT_NORTH", name: "Kênh GT - Miền Bắc", shortName: "Kênh GT", region: "Miền Bắc", status: "active", iconKey: "store", iconTone: "blue", marker: "blue" },
  { id: "ch-gt-central", code: "GT_CENTRAL", name: "Kênh GT - Miền Trung", shortName: "Kênh GT", region: "Miền Trung", status: "active", iconKey: "store", iconTone: "blue", marker: "blue" },
  { id: "ch-gt-south", code: "GT_SOUTH", name: "Kênh GT - Miền Nam", shortName: "Kênh GT", region: "Miền Nam", status: "active", iconKey: "store", iconTone: "blue", marker: "blue" },
  { id: "ch-mt", code: "MT", name: "Kênh MT - Toàn Quốc", shortName: "Kênh MT", region: "Toàn quốc", status: "active", iconKey: "shoppingCart", iconTone: "orange", marker: "green" },
  { id: "ch-b2b", code: "B2B", name: "Kênh B2B", shortName: "Kênh B2B", region: "Toàn quốc", status: "active", iconKey: "building", iconTone: "slate", marker: "slate" },
  { id: "ch-dealer", code: "DEALER", name: "Kênh Đại lý tỉnh", shortName: "Kênh Đại lý", region: "Toàn quốc", status: "active", iconKey: "store", iconTone: "green", marker: "green" },
  { id: "ch-showroom", code: "SHOWROOM", name: "Kênh Showroom", shortName: "Kênh Showroom", region: "Miền Nam", status: "active", iconKey: "building", iconTone: "green", marker: "slate" },
  { id: "ch-showroom-north", code: "SHOWROOM_NORTH", name: "Kênh Showroom - Miền Bắc", shortName: "Kênh Showroom", region: "Miền Bắc", status: "active", iconKey: "building", iconTone: "green", marker: "slate" },
  { id: "ch-ecommerce", code: "ECOM", name: "Kênh TMĐT", shortName: "Kênh TMĐT", region: "Toàn quốc", status: "active", iconKey: "globe", iconTone: "purple", marker: "blue" },
  { id: "ch-marketplace", code: "MARKETPLACE", name: "Kênh Marketplace", shortName: "Kênh Marketplace", region: "Toàn quốc", status: "active", iconKey: "globe", iconTone: "purple", marker: "blue" },
];

export const mockChannelAssignments = [
  { id: "ca-gt-asm", channelId: "ch-gt-north", userId: "u-04", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-rsm", channelId: "ch-gt-north", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-gdkd", channelId: "ch-gt-north", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-central-asm", channelId: "ch-gt-central", userId: "u-04", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-central-rsm", channelId: "ch-gt-central", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-central-gdkd", channelId: "ch-gt-central", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-south-asm", channelId: "ch-gt-south", userId: "u-04", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-south-rsm", channelId: "ch-gt-south", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-gt-south-gdkd", channelId: "ch-gt-south", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-mt-asm", channelId: "ch-mt", userId: "u-05", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-mt-rsm", channelId: "ch-mt", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-mt-gdkd", channelId: "ch-mt", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-b2b-asm", channelId: "ch-b2b", userId: "u-03", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-b2b-rsm", channelId: "ch-b2b", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-b2b-gdkd", channelId: "ch-b2b", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-dealer-asm", channelId: "ch-dealer", userId: "u-04", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-dealer-rsm", channelId: "ch-dealer", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-dealer-gdkd", channelId: "ch-dealer", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-showroom-asm", channelId: "ch-showroom", userId: "u-05", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-showroom-rsm", channelId: "ch-showroom", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-showroom-gdkd", channelId: "ch-showroom", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-showroom-north-asm", channelId: "ch-showroom-north", userId: "u-05", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-showroom-north-rsm", channelId: "ch-showroom-north", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-showroom-north-gdkd", channelId: "ch-showroom-north", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-ecom-asm", channelId: "ch-ecommerce", userId: "u-03", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-ecom-rsm", channelId: "ch-ecommerce", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-ecom-gdkd", channelId: "ch-ecommerce", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
  { id: "ca-marketplace-asm", channelId: "ch-marketplace", userId: "u-03", roleCode: "ASM", effectiveFrom: "2026-06-01" },
  { id: "ca-marketplace-rsm", channelId: "ch-marketplace", userId: "u-06", roleCode: "RSM", effectiveFrom: "2026-06-01" },
  { id: "ca-marketplace-gdkd", channelId: "ch-marketplace", userId: "u-07", roleCode: "GDKD", effectiveFrom: "2026-06-01" },
];

export const mockForecastCycles = [
  { id: "fc-2026-07", code: "FC-2026-07", month: 7, year: 2026, title: "Forecast Tháng 07/2026", createdAt: "2026-06-24T03:00:00+07:00", totalDeadlineAt: "2026-07-22T17:00:00+07:00", status: "Đang thực hiện", tone: "active", note: "Ưu tiên rà soát kênh TMĐT, MT và GT do có nhiều chương trình khuyến mãi tháng 07.", template: "Template_FC_KD01_T07_2026.xlsx", createdBy: "u-02" },
  { id: "fc-2026-06", code: "FC-2026-06", month: 6, year: 2026, title: "Forecast Tháng 06/2026", createdAt: "2026-05-20T03:00:00+07:00", totalDeadlineAt: "2026-06-22T17:00:00+07:00", status: "Phát hành", tone: "ended-blue", note: "Kỳ Forecast đã phát hành và lưu trữ chính thức.", template: "Template_FC_KD01_T06_2026.xlsx", createdBy: "u-02" },
];

export const mockForecastTasks = [
  { id: "task-2026-07-mt", forecastCycleId: "fc-2026-07", channelId: "ch-mt", ownerId: "u-05", rsmId: "u-06", directorId: "u-07", deadlineAt: "2026-07-18T17:00:00+07:00", status: "GĐKD đã duyệt", statusTone: "success", progress: 100, dueText: "Đã được GĐKD duyệt" },
  { id: "task-2026-07-ec", forecastCycleId: "fc-2026-07", channelId: "ch-ecommerce", ownerId: "u-03", rsmId: "u-06", directorId: "u-07", deadlineAt: "2026-07-19T17:00:00+07:00", status: "Chờ ASM cập nhật", statusTone: "warning", progress: 35, dueText: "Còn 2 ngày tới hạn nộp file" },
  { id: "task-2026-07-gt", forecastCycleId: "fc-2026-07", channelId: "ch-gt-north", ownerId: "u-04", rsmId: "u-06", directorId: "u-07", deadlineAt: "2026-07-17T17:00:00+07:00", status: "Chờ RSM duyệt", statusTone: "warning", progress: 60, dueText: "Đã nộp file, chờ RSM duyệt" },
  { id: "task-2026-07-showroom", forecastCycleId: "fc-2026-07", channelId: "ch-showroom", ownerId: "u-05", rsmId: "u-06", directorId: "u-07", deadlineAt: "2026-07-20T17:00:00+07:00", status: "Chờ ASM cập nhật", statusTone: "neutral", progress: 10, dueText: "Chưa có file" },
  { id: "task-2026-06-mt", forecastCycleId: "fc-2026-06", channelId: "ch-mt", ownerId: "u-05", rsmId: "u-06", directorId: "u-07", deadlineAt: "2026-06-18T17:00:00+07:00", status: "Phát hành", statusTone: "success", progress: 100, dueText: "Đã phát hành" },
];

export const mockForecastFiles = [
  { id: "ff-2026-07-mt-v2", forecastTaskId: "task-2026-07-mt", fileName: "Forecast_MT_T07_2026_v2.xlsx", fileUrl: "/mock/files/Forecast_MT_T07_2026_v2.xlsx", fileSize: "4.8 MB", version: 2, uploadedBy: "u-05", uploadedAt: "2026-07-18T10:30:00+07:00", note: "" },
  { id: "ff-2026-07-gt-v1", forecastTaskId: "task-2026-07-gt", fileName: "Forecast_GT_T07_2026_v1.xlsx", fileUrl: "/mock/files/Forecast_GT_T07_2026_v1.xlsx", fileSize: "3.9 MB", version: 1, uploadedBy: "u-04", uploadedAt: "2026-07-17T16:00:00+07:00", note: "" },
  { id: "ff-2026-06-mt-final", forecastTaskId: "task-2026-06-mt", fileName: "Forecast_MT_T06_2026_final.xlsx", fileUrl: "/mock/files/Forecast_MT_T06_2026_final.xlsx", fileSize: "4.1 MB", version: 3, uploadedBy: "u-05", uploadedAt: "2026-06-22T14:30:00+07:00", note: "Bản phát hành chính thức" },
];

export const mockActivityLogs = [
  { id: "evt-1", actorId: "u-02", entityType: "forecast_cycle", entityId: "fc-2026-07", action: "opened", message: "Kỳ Forecast 07/2026 đã mở", detail: "Hệ thống đã tạo task cho các kênh trong kỳ 07/2026.", tone: "blue", iconKey: "calendar", createdAtLabel: "10 phút trước" },
  { id: "evt-2", actorId: "u-07", entityType: "forecast_task", entityId: "task-2026-07-mt", action: "approved", message: "Kênh MT đã được GĐKD duyệt", detail: "Task Forecast MT sẵn sàng cho bước tổng hợp.", tone: "green", iconKey: "checkCircle", createdAtLabel: "2 giờ trước" },
  { id: "evt-3", actorId: "u-06", entityType: "forecast_task", entityId: "task-2026-07-gt", action: "sla_warning", message: "Cảnh báo SLA Kênh GT", detail: "Task GT đang chờ RSM duyệt, cần xử lý trước deadline.", tone: "red", iconKey: "alertTriangle", createdAtLabel: "4 giờ trước" },
];

export const mockPermissionActivityLogs = [
  { id: "pa-01", title: "Cập nhật người dùng: Nguyễn Tú Anh", detail: "Admin -> Toàn hệ thống", time: "10:58 29/06/2026", tone: "blue" },
  { id: "pa-02", title: "Gán quyền: Phòng Tài chính", detail: "Tài chính -> Thẩm định giá vốn/margin", time: "10:42 29/06/2026", tone: "green" },
  { id: "pa-03", title: "Cập nhật phạm vi Planning", detail: "Thêm quyền phát hành file forecast chính thức", time: "09:20 29/06/2026", tone: "green" },
  { id: "pa-04", title: "Rà soát quyền Nhà máy", detail: "Giới hạn quyền ở dữ liệu năng lực sản xuất", time: "17:35 28/06/2026", tone: "orange" },
];

export const mockDatabase = {
  users: mockUsers,
  roles: mockRoles,
  userRoles: mockUserRoles,
  modules: mockModules,
  rolePermissions: mockRolePermissions,
  salesChannels: mockSalesChannels,
  channelAssignments: mockChannelAssignments,
  forecastCycles: mockForecastCycles,
  forecastTasks: mockForecastTasks,
  forecastFiles: mockForecastFiles,
  activityLogs: mockActivityLogs,
  permissionActivityLogs: mockPermissionActivityLogs,
};
