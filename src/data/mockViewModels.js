import { mockDatabase } from "./mockDatabase";

const permissionLabels = {
  full: "Toàn quyền",
  scoped: "Theo phạm vi",
  view: "Xem",
  locked: "Không",
};

export const permissionLevelOptions = [
  { value: "full", label: "Toàn quyền" },
  { value: "scoped", label: "Theo phạm vi" },
  { value: "view", label: "Chỉ xem" },
  { value: "locked", label: "Khóa" },
];

const userStatusLabels = {
  active: "Active",
  inactive: "Inactive",
  locked: "Locked",
};

const forecastStatusLabels = {
  draft: "Nháp",
  active: "Đang thực hiện",
  appraisal: "Chờ thẩm định",
  approval: "Chờ CEO duyệt",
  published: "Phát hành",
  rejected: "CEO không duyệt",
};

const taskStatusLabels = {
  draft: "Chưa đủ thông tin",
  assigned: "Chờ ASM cập nhật",
  submitted: "Đang gửi duyệt",
  in_approval: "Đang duyệt trên Lark",
  need_revision: "Cần chỉnh sửa",
  rejected: "Đã từ chối",
  approved: "Đã duyệt",
  completed: "Hoàn tất",
};

const taskStatusTones = {
  draft: "neutral",
  assigned: "neutral",
  submitted: "warning",
  in_approval: "warning",
  need_revision: "danger",
  rejected: "danger",
  approved: "success",
  completed: "success",
};

function normalizeTaskStatusLabel(status = "") {
  const value = String(status || "").toLowerCase();
  const plain = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (taskStatusLabels[value]) return value;
  if (plain.includes("phat") || plain.includes("hoan")) return "completed";
  if (plain.includes("gdkd") || plain.includes("duyet")) return "approved";
  if (plain.includes("rsm") || plain.includes("submitted")) return "in_approval";
  if (plain.includes("asm") || plain.includes("assigned")) return "assigned";
  if (plain.includes("reject") || plain.includes("tu choi")) return "rejected";
  return value || "draft";
}

function normalizeBootstrapDatabase(bootstrap = {}) {
  const rolesByUuid = new Map((bootstrap.roles || []).map((role) => [role.id, role]));
  const modulesByUuid = new Map((bootstrap.modules || []).map((module) => [module.id, module]));

  const users = (bootstrap.users || []).map((user) => ({
    id: user.id,
    employeeCode: user.employee_code,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone || "",
    department: user.department || "",
    title: user.title || "",
    status: userStatusLabels[user.status] || "Active",
    initials: user.initials,
    tone: user.tone,
    avatarUrl: user.avatar_url || "",
    larkOpenId: user.lark_open_id || "",
    larkUnionId: user.lark_union_id || "",
    lastLoginAt: user.last_login_at || "",
  }));

  const roles = (bootstrap.roles || []).map((role) => ({
    id: role.code,
    code: role.code,
    name: role.name,
    description: role.description || "",
    scopeType: role.scope_type,
    scopeLabel: role.scope_label || "",
    isSystem: role.is_system,
    risk: role.risk || "Trung bình",
  }));

  const userRoles = (bootstrap.userRoles || []).map((userRole) => {
    const role = rolesByUuid.get(userRole.role_id);
    return {
      id: userRole.id,
      userId: userRole.user_id,
      roleId: role?.code || userRole.role_id,
      scopeNote: userRole.scope_note || role?.scope_label || "",
    };
  });

  const modules = (bootstrap.modules || []).map((module) => ({
    id: module.code,
    code: module.code,
    name: module.name,
    dataLabel: module.data_label || "",
    sortOrder: module.sort_order || 0,
  }));

  const rolePermissions = (bootstrap.rolePermissions || []).map((permission) => {
    const role = rolesByUuid.get(permission.role_id);
    const module = modulesByUuid.get(permission.module_id);
    return {
      id: permission.id,
      roleId: role?.code || permission.role_id,
      moduleId: module?.code || permission.module_id,
      permissionLevel: permission.permission_level,
      dataScope: permission.data_scope,
    };
  });

  const salesChannels = (bootstrap.salesChannels || []).map((channel) => ({
    id: channel.id,
    code: channel.code,
    name: channel.name,
    shortName: channel.short_name || channel.name,
    region: channel.region || "",
    status: channel.status || "active",
    iconKey: channel.icon_key || "store",
    iconTone: channel.icon_tone || "blue",
    marker: channel.marker || "blue",
  }));

  const channelAssignments = (bootstrap.channelAssignments || []).map((assignment) => ({
    id: assignment.id,
    channelId: assignment.channel_id,
    userId: assignment.user_id,
    roleCode: assignment.role_code,
    effectiveFrom: assignment.effective_from,
  }));

  const forecastCycles = (bootstrap.forecastCycles || []).map((cycle) => ({
    id: cycle.id,
    code: cycle.code,
    month: cycle.month,
    year: cycle.year,
    title: cycle.title,
    createdAt: cycle.created_at,
    totalDeadlineAt: cycle.total_deadline_at,
    status: forecastStatusLabels[cycle.status] || cycle.status,
    tone: cycle.tone || cycle.status,
    note: cycle.note || "",
    template: cycle.template_file_name || "",
    createdBy: cycle.created_by,
  }));

  const forecastTasks = (bootstrap.forecastTasks || []).map((task) => ({
    id: task.id,
    forecastCycleId: task.forecast_cycle_id,
    channelId: task.channel_id,
    ownerId: task.owner_id,
    rsmId: task.rsm_id,
    directorId: task.director_id,
    deadlineAt: task.deadline_at,
    status: task.status,
    currentApprovalRequestId: task.current_approval_request_id || "",
    currentFileVersion: task.current_file_version || null,
    assignmentSnapshot: task.assignment_snapshot || {},
    channelConfigSnapshot: task.channel_config_snapshot || {},
    statusTone: task.status_tone,
    progress: task.progress,
    dueText: task.due_text || "",
  }));

  const forecastFiles = (bootstrap.forecastFiles || []).map((file) => ({
    id: file.id,
    forecastTaskId: file.forecast_task_id,
    fileName: file.file_name,
    fileUrl: file.file_url,
    storagePath: file.storage_path || "",
    channelId: file.channel_id || "",
    asmUserId: file.asm_user_id || "",
    status: file.status || "draft",
    mimeType: file.mime_type || "",
    fileSize: file.file_size,
    version: file.version,
    uploadedBy: file.uploaded_by,
    uploadedAt: file.uploaded_at,
    note: file.note || "",
  }));

  const taskAssignments = (bootstrap.taskAssignments || []).map((assignment) => ({
    id: assignment.id,
    forecastTaskId: assignment.forecast_task_id,
    userId: assignment.user_id,
    roleCode: assignment.role_code,
    status: assignment.status,
    assignedAt: assignment.assigned_at,
    note: assignment.note || "",
  }));

  const approvalRequests = (bootstrap.approvalRequests || []).map((request) => ({
    id: request.id,
    forecastCycleId: request.forecast_cycle_id,
    forecastTaskId: request.forecast_task_id,
    channelId: request.channel_id,
    requesterId: request.requester_id,
    submittedBy: request.submitted_by,
    larkApprovalCode: request.lark_approval_code || "",
    larkInstanceCode: request.lark_instance_code || "",
    externalApprovalUrl: request.external_approval_url || "",
    status: request.status,
    approverSnapshot: request.approver_snapshot || {},
    channelConfigSnapshot: request.channel_config_snapshot || {},
    syncError: request.sync_error || "",
    submittedAt: request.submitted_at,
    resolvedAt: request.resolved_at,
  }));

  const approvalRequestFiles = (bootstrap.approvalRequestFiles || []).map((row) => ({
    id: row.id,
    approvalRequestId: row.approval_request_id,
    forecastFileId: row.forecast_file_id,
  }));

  const approvalEvents = (bootstrap.approvalEvents || []).map((event) => ({
    id: event.id,
    approvalRequestId: event.approval_request_id,
    eventKey: event.event_key,
    eventType: event.event_type,
    status: event.status,
    payload: event.payload || {},
    occurredAt: event.occurred_at,
  }));

  const activityLogs = (bootstrap.activityLogs || []).map((log) => ({
    id: log.metadata?.sourceId || log.id,
    actorId: log.actor_id,
    entityType: log.entity_type,
    entityId: log.metadata?.sourceEntityId || log.entity_id,
    action: log.action,
    message: log.message,
    detail: log.metadata?.detail || "",
    tone: log.metadata?.tone || "blue",
    iconKey: log.metadata?.iconKey || "calendar",
    createdAtLabel: log.metadata?.createdAtLabel || "",
  }));

  const permissionActivityLogs = activityLogs
    .filter((log) => log.entityType === "permission")
    .map((log) => ({
      id: log.id,
      title: log.message,
      detail: log.detail,
      time: log.createdAtLabel,
      tone: log.tone,
    }));

  return {
    users,
    roles,
    userRoles,
    modules,
    rolePermissions,
    salesChannels,
    channelAssignments,
    forecastCycles,
    forecastTasks,
    forecastFiles,
    taskAssignments,
    approvalRequests,
    approvalRequestFiles,
    approvalEvents,
    activityLogs,
    permissionActivityLogs,
  };
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

function formatMonth(month, year) {
  return `Tháng ${String(month).padStart(2, "0")}/${year}`;
}

function formatMonthShort(month, year) {
  return `T${String(month).padStart(2, "0")}/${year}`;
}

function byId(rows) {
  return rows.reduce((acc, row) => {
    acc[row.id] = row;
    return acc;
  }, {});
}

function getAssignment(assignments, channelId, roleCode) {
  return assignments.find((item) => item.channelId === channelId && item.roleCode === roleCode);
}

function getUserName(usersById, userId) {
  return usersById[userId]?.fullName || "Chưa phân công";
}

function getUserTitle(usersById, userId) {
  return usersById[userId]?.title || "";
}

function getIcon(iconRegistry, iconKey) {
  return iconRegistry[iconKey] || iconRegistry.store;
}

function buildAppData(db, iconRegistry) {
  const usersById = byId(db.users);
  const rolesById = byId(db.roles);
  const channelsById = byId(db.salesChannels);
  const cyclesById = byId(db.forecastCycles);
  const approvalRequestsById = byId(db.approvalRequests || []);
  const roleUserCounts = db.userRoles.reduce((acc, row) => {
    acc[row.roleId] = (acc[row.roleId] || 0) + 1;
    return acc;
  }, {});
  const primaryUserRoles = db.userRoles.reduce((acc, row) => {
    if (!acc[row.userId]) acc[row.userId] = row;
    return acc;
  }, {});

  const roleDefinitions = db.roles.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    scope: role.scopeLabel,
    users: roleUserCounts[role.id] || 0,
    risk: role.risk,
    isSystem: role.isSystem,
  }));

  const adminUsers = db.users.map((user) => {
    const userRole = primaryUserRoles[user.id];
    const role = rolesById[userRole?.roleId] || db.roles[0];
    return {
      id: user.id,
      employeeCode: user.employeeCode,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      title: user.title,
      roleId: role.id,
      role: role.name,
      scope: userRole?.scopeNote || role.scopeLabel,
      status: user.status,
      initials: user.initials,
      tone: user.tone,
    };
  });

  const permissionMatrix = db.modules
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((module) => {
      const row = { module: module.name, data: module.dataLabel };
      db.roles.forEach((role) => {
        const permission = db.rolePermissions.find((item) => item.moduleId === module.id && item.roleId === role.id);
        row[role.id] = permissionLabels[permission?.permissionLevel || "locked"];
      });
      return row;
    });

  const activeSalesChannels = db.salesChannels.filter((channel) => channel.status !== "inactive");

  const workflowChannels = activeSalesChannels.map((channel) => {
    const asm = getAssignment(db.channelAssignments, channel.id, "ASM");
    const rsm = getAssignment(db.channelAssignments, channel.id, "RSM");
    const director = getAssignment(db.channelAssignments, channel.id, "GDKD");
    return {
      channel: channel.shortName,
      region: channel.region,
      owner: getUserName(usersById, asm?.userId),
      ownerRole: getUserTitle(usersById, asm?.userId),
      rsm: getUserName(usersById, rsm?.userId),
      director: getUserName(usersById, director?.userId),
      marker: channel.marker,
      icon: getIcon(iconRegistry, channel.iconKey),
      iconTone: channel.iconTone,
    };
  });

  const channelRows = activeSalesChannels.map((channel) => {
    const rsm = getAssignment(db.channelAssignments, channel.id, "RSM");
    const director = getAssignment(db.channelAssignments, channel.id, "GDKD");
    const asmAssignments = db.channelAssignments
      .filter((item) => item.channelId === channel.id && item.roleCode === "ASM");
    const asms = asmAssignments.map((item) => getUserTitle(usersById, item.userId) || getUserName(usersById, item.userId));
    return {
      id: channel.id,
      code: channel.code,
      channel: channel.name,
      shortName: channel.shortName,
      region: channel.region,
      directorId: director?.userId || "",
      director: getUserName(usersById, director?.userId),
      directorBadge: usersById[director?.userId]?.initials || "NA",
      rsmId: rsm?.userId || "",
      rsm: getUserName(usersById, rsm?.userId),
      rsmBadge: usersById[rsm?.userId]?.initials || "NA",
      asmIds: asmAssignments.map((item) => item.userId),
      asms,
      tone: channel.marker,
      iconKey: channel.iconKey,
      iconTone: channel.iconTone,
      status: channel.status,
    };
  });

  const initialForecasts = db.forecastCycles.map((cycle) => ({
    id: cycle.id,
    title: cycle.title,
    month: formatMonth(cycle.month, cycle.year),
    monthShort: formatMonthShort(cycle.month, cycle.year),
    created: formatDate(cycle.createdAt),
    deadline: formatDate(cycle.totalDeadlineAt),
    status: cycle.status,
    tone: cycle.tone,
    note: cycle.note,
    template: cycle.template,
  }));

  const initialTasks = db.forecastTasks.map((task) => {
    const cycle = cyclesById[task.forecastCycleId];
    const channel = channelsById[task.channelId];
    const activeAssignments = (db.taskAssignments || [])
      .filter((item) => item.forecastTaskId === task.id && item.status === "active");
    const firstAsm = activeAssignments[0];
    const file = db.forecastFiles
      .filter((item) => item.forecastTaskId === task.id)
      .sort((a, b) => (b.version || 0) - (a.version || 0))[0];
    const approvalRequest = approvalRequestsById[task.currentApprovalRequestId];
    const statusCode = normalizeTaskStatusLabel(task.status);
    return {
      id: task.id,
      forecastId: task.forecastCycleId,
      title: `Forecast ${channel.shortName} - ${formatMonth(cycle.month, cycle.year)}`,
      channel: channel.shortName,
      region: channel.region,
      ownerId: firstAsm?.userId || task.ownerId,
      owner: getUserName(usersById, firstAsm?.userId || task.ownerId),
      ownerRole: getUserTitle(usersById, firstAsm?.userId || task.ownerId),
      asmUserIds: activeAssignments.map((item) => item.userId),
      rsm: getUserName(usersById, task.rsmId),
      director: getUserName(usersById, task.directorId),
      deadline: formatDate(task.deadlineAt),
      due: task.dueText,
      progress: task.progress,
      statusCode,
      status: taskStatusLabels[statusCode] || task.status,
      statusTone: task.statusTone || taskStatusTones[statusCode] || "neutral",
      currentApprovalRequestId: task.currentApprovalRequestId,
      currentFileVersion: task.currentFileVersion,
      approvalStatus: approvalRequest?.status || "",
      approvalUrl: approvalRequest?.externalApprovalUrl || "",
      marker: channel.marker,
      fileId: file?.id || "",
      file: file?.fileName || "",
      fileSize: file?.fileSize || "",
      fileVersion: file?.version || "",
      fileStatus: file?.status || "",
      icon: getIcon(iconRegistry, channel.iconKey),
      iconTone: channel.iconTone,
      template: cycle.template,
    };
  });

  const initialEvents = db.activityLogs
    .filter((event) => event.entityType !== "permission")
    .map((event) => ({
      id: event.id,
      tone: event.tone,
      icon: getIcon(iconRegistry, event.iconKey),
      title: event.message,
      body: event.detail,
      time: event.createdAtLabel,
    }));

  const initialPublishedFiles = db.forecastFiles
    .filter((file) => cyclesById[db.forecastTasks.find((task) => task.id === file.forecastTaskId)?.forecastCycleId]?.status === "Phát hành")
    .map((file) => {
      const task = db.forecastTasks.find((item) => item.id === file.forecastTaskId);
      const cycle = cyclesById[task.forecastCycleId];
      const channel = channelsById[task.channelId];
      return {
        id: file.id,
        forecastId: cycle.id,
        name: file.fileName,
        channel: channel.shortName,
        month: formatMonthShort(cycle.month, cycle.year),
        size: file.fileSize,
        modified: `${formatDate(file.uploadedAt)} 14:30`,
        owner: "Nguyễn Tú Anh",
        version: `v${file.version}.0`,
      };
    });

  return {
    mockDatabase: db,
    workflowChannels,
    channelRows,
    initialForecasts,
    initialTasks,
    initialEvents,
    initialPublishedFiles,
    adminUsers,
    roleDefinitions,
    permissionMatrix,
    permissionActivityLog: db.permissionActivityLogs || [],
    permissionLevelOptions,
  };
}

export function buildMockAppData(iconRegistry) {
  return buildAppData(mockDatabase, iconRegistry);
}

export function buildAppDataFromBootstrap(bootstrap, iconRegistry) {
  return buildAppData(normalizeBootstrapDatabase(bootstrap), iconRegistry);
}
