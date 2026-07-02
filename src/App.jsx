import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Circle,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  Gauge,
  Globe2,
  Grip,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Save,
  SquarePen,
  Star,
  Store,
  Trash2,
  Upload,
  UploadCloud,
  UserPlus,
  Users,
  X,
  ShoppingCart,
  Cloud,
  Lock,
} from "lucide-react";
import { buildAppDataFromBootstrap, buildMockAppData } from "./data/mockViewModels";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, screen: "overview" },
  { label: "Lịch Forecast", icon: CalendarDays, screen: "list" },
  { label: "Công việc", icon: ClipboardList, screen: "tasks" },
  { label: "Thẩm định", icon: Star, screen: "appraisal" },
  { label: "Phê duyệt", icon: Check, screen: "approval" },
  { label: "Kho lưu trữ", icon: Folder, screen: "storage" },
  { label: "Quản trị hệ thống", icon: Settings, screen: "system-users" },
];

const systemSubItems = [
  { label: "Tài khoản", icon: Users, screen: "system-users" },
  { label: "Phân quyền", icon: Lock, screen: "system-permissions" },
  { label: "Khung kênh", icon: Store, screen: "channel-config" },
  { label: "Quy trình", icon: ClipboardList, screen: "approval-config" },
  { label: "SLA", icon: Clock3, screen: "sla-config" },
];

const recentRows = [
  {
    code: "FC-2026-07-MT",
    department: "Kênh MT",
    date: "20/07/2026",
    status: "Đã phát hành",
    sla: "Đúng hạn",
    mode: "success",
    action: "view",
  },
  {
    code: "FC-2026-07-EC",
    department: "Kênh TMĐT",
    date: "20/07/2026",
    status: "Chờ thẩm định",
    sla: "12:44:48",
    mode: "warning",
    action: "edit",
  },
  {
    code: "FC-2026-07-GT",
    department: "Kênh GT",
    date: "19/07/2026",
    status: "Cần điều chỉnh",
    sla: "Quá hạn 01 ngày",
    mode: "warning",
    action: "edit",
  },
];

const scheduleRows = [
  {
    title: "Forecast Tháng 07/2026",
    created: "24/06/2026",
    deadline: "22/07/2026",
    status: "Đang thực hiện",
    tone: "active",
  },
  {
    title: "Forecast Tháng 06/2026",
    created: "20/05/2026",
    deadline: "22/06/2026",
    status: "Kết thúc",
    tone: "ended",
  },
  {
    title: "Forecast Tháng 05/2026",
    created: "20/04/2026",
    deadline: "22/05/2026",
    status: "Kết thúc",
    tone: "ended-blue",
  },
  {
    title: "Forecast Tháng 04/2026",
    created: "20/03/2026",
    deadline: "22/04/2026",
    status: "Kết thúc",
    tone: "muted",
  },
];

const detailTaskRows = [
  {
    channel: "Kênh MT",
    owner: "Trần Văn A",
    deadline: "18/07/2026",
    file: "Forecast_MT_T07_2026_v2.xlsx",
    status: "Đã phát hành",
    statusTone: "success",
    icon: ShoppingCart,
    iconTone: "orange",
  },
  {
    channel: "Kênh TMĐT",
    owner: "Lê Thị B",
    deadline: "19/07/2026",
    sla: "SLA: 48h",
    upload: true,
    status: "Chờ thẩm định",
    statusTone: "warning",
    icon: Globe2,
    iconTone: "blue",
  },
  {
    channel: "Kênh GT",
    owner: "Nguyễn Văn C",
    deadline: "17/07/2026",
    danger: true,
    file: "Forecast_GT_T07_2026_v1.xlsx",
    status: "Cần điều chỉnh",
    statusTone: "danger",
    icon: Store,
    iconTone: "purple",
  },
  {
    channel: "Kênh Showroom",
    owner: "Đặng Văn D",
    deadline: "20/07/2026",
    emptyFile: "Chưa có file",
    status: "Đang nhập liệu",
    statusTone: "neutral",
    icon: Building2,
    iconTone: "slate",
  },
];

const taskRows = [
  {
    title: "Nhập Forecast SKU nhóm Gia dụng - Kênh TMĐT",
    channel: "Kênh TMĐT",
    owner: "Lê Quang Minh",
    ownerRole: "ASM TMĐT",
    deadline: "19/07/2026",
    due: "Còn 2 ngày tới hạn nộp file",
    progress: 75,
    status: "Đang nhập liệu",
    statusTone: "warning",
    marker: "blue",
  },
  {
    title: "Bổ sung Forecast WinMart+ Miền Bắc",
    channel: "Kênh MT",
    owner: "Chưa phân công",
    ownerRole: "",
    deadline: "18/07/2026",
    due: "Quá hạn 1 ngày",
    progress: 5,
    status: "Quá hạn SLA",
    statusTone: "danger",
    marker: "green",
  },
  {
    title: "Tổng hợp nhu cầu hàng KM đại lý GT Miền Tây",
    channel: "Kênh GT",
    owner: "Nguyễn Diệp Chi",
    ownerRole: "ASM GT Miền Tây",
    deadline: "20/07/2026",
    due: "Đã nộp file, chờ thẩm định",
    progress: 100,
    status: "Đã nộp",
    statusTone: "success",
    marker: "slate",
  },
  {
    title: "Forecast gói quà tặng B2B - Trung thu",
    channel: "Kênh B2B",
    owner: "Phạm Bảo Nam",
    ownerRole: "B2B Lead",
    deadline: "21/07/2026",
    due: "Còn 3 ngày tới hạn nộp file",
    progress: 30,
    status: "Cần bổ sung",
    statusTone: "warning",
    marker: "blue",
  },
];

const appraisalRows = [
  {
    channel: "Kênh MT",
    month: "Tháng 07/2026",
    sender: "Trần Văn A",
    sentAt: "10:30, 20/07/2026",
    file: "Forecast_MT_T07_2026_v2.xlsx",
    status: "Chờ thẩm định",
    statusTone: "warning",
    icon: Store,
    iconTone: "blue",
  },
  {
    channel: "Kênh TMĐT",
    month: "Tháng 07/2026",
    sender: "Lê Thị B",
    sentAt: "09:15, 20/07/2026",
    file: "Forecast_EC_T07_2026_v1.xlsx",
    status: "Chờ thẩm định",
    statusTone: "warning",
    icon: ShoppingCart,
    iconTone: "purple",
  },
  {
    channel: "Kênh GT",
    month: "Tháng 07/2026",
    sender: "Nguyễn Văn C",
    sentAt: "15:45, 19/07/2026",
    file: "Forecast_GT_T07_2026_v1.xlsx",
    status: "Cần điều chỉnh",
    statusTone: "danger",
    icon: Building2,
    iconTone: "green",
  },
];

const approvalRows = [
  {
    channel: "Kênh MT",
    month: "Tháng 07/2026",
    sender: "Trần Văn A",
    sentAt: "16:30, 21/07/2026",
    file: "Forecast_MT_T07_2026_v2.xlsx",
    status: "Đã phát hành",
    statusTone: "success",
    icon: Store,
    iconTone: "blue",
  },
  {
    channel: "Kênh TMĐT",
    month: "Tháng 07/2026",
    sender: "Lê Thị B",
    sentAt: "09:15, 22/07/2026",
    file: "Forecast_EC_T07_2026_v1.xlsx",
    status: "Chờ phê duyệt",
    statusTone: "danger",
    icon: ShoppingCart,
    iconTone: "purple",
  },
  {
    channel: "Kênh GT",
    month: "Tháng 07/2026",
    sender: "Nguyễn Văn C",
    sentAt: "15:45, 21/07/2026",
    file: "Forecast_GT_T07_2026_v2.xlsx",
    status: "Chờ phê duyệt",
    statusTone: "danger",
    icon: Building2,
    iconTone: "green",
  },
];

const iconRegistry = {
  calendar: Calendar,
  checkCircle: CheckCircle2,
  alertTriangle: AlertTriangle,
  shoppingCart: ShoppingCart,
  globe: Globe2,
  store: Store,
  building: Building2,
};

const {
  workflowChannels,
  channelRows,
  initialForecasts,
  initialTasks,
  initialEvents,
  initialPublishedFiles,
  adminUsers,
  roleDefinitions,
  permissionMatrix,
  permissionActivityLog,
  permissionLevelOptions,
} = buildMockAppData(iconRegistry);
const previewNavModules = {
  overview: ["Lịch Forecast"],
  list: ["Lịch Forecast"],
  tasks: ["Giao việc kênh", "Nộp file Forecast"],
  appraisal: ["Thẩm định Cung ứng", "Thẩm định Tài chính", "Thẩm định BI", "Kế hoạch Nhà máy"],
  approval: ["Phê duyệt CEO"],
  storage: ["Kho lưu trữ"],
  "system-users": ["Quản trị hệ thống"],
  "system-permissions": ["Quản trị hệ thống"],
  "channel-config": ["Quản trị hệ thống"],
  "approval-config": ["Quản trị hệ thống"],
  "sla-config": ["Quản trị hệ thống"],
};

const previewScreenModules = {
  overview: previewNavModules.overview,
  list: previewNavModules.list,
  detail: ["Lịch Forecast"],
  "create-1": ["Lịch Forecast"],
  "create-2": ["Lịch Forecast"],
  tasks: previewNavModules.tasks,
  "task-update": previewNavModules.tasks,
  appraisal: previewNavModules.appraisal,
  "appraisal-detail": previewNavModules.appraisal,
  approval: previewNavModules.approval,
  "approval-detail": previewNavModules.approval,
  storage: previewNavModules.storage,
  "storage-folder": previewNavModules.storage,
  "storage-file": previewNavModules.storage,
  "system-users": previewNavModules["system-users"],
  "system-permissions": previewNavModules["system-users"],
  "channel-config": previewNavModules["system-users"],
  "approval-config": previewNavModules["system-users"],
  "sla-config": previewNavModules["system-users"],
};

function normalizePermissionLevel(value) {
  if (value === "Toàn quyền") return "full";
  if (value === "Không") return "locked";
  if (value === "Xem") return "view";
  return "scoped";
}

function getUserInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "NV";
  return parts.slice(-2).map((part) => part[0]).join("").toUpperCase();
}

function buildPermissionDrafts(roles = roleDefinitions, matrix = permissionMatrix) {
  return roles.reduce((roleAcc, role) => {
    roleAcc[role.id] = matrix.reduce((matrixAcc, row) => {
      matrixAcc[row.module] = normalizePermissionLevel(row[role.id]);
      return matrixAcc;
    }, {});
    return roleAcc;
  }, {});
}

function buildInitialPermissionDrafts() {
  return buildPermissionDrafts();
}

function getPermissionLevel(permissions, module) {
  return permissions?.[module] || "locked";
}

function hasPreviewAccess(permissions, modules = []) {
  if (!permissions) return true;
  return modules.some((module) => getPermissionLevel(permissions, module) !== "locked");
}

function isPreviewScreenAllowed(screen, permissions) {
  return hasPreviewAccess(permissions, previewScreenModules[screen] || []);
}

function getFirstPreviewScreen(permissions) {
  const firstNav = navItems.find((item) => hasPreviewAccess(permissions, previewNavModules[item.screen] || []));
  return firstNav?.screen || "overview";
}

function canEditPermission(permissions, module) {
  return ["full", "scoped"].includes(getPermissionLevel(permissions, module));
}

const statusToneMap = {
  "Nháp": "neutral",
  "Đang thực hiện": "success",
  "Chờ ASM cập nhật": "neutral",
  "ASM đã cập nhật": "warning",
  "Chờ RSM duyệt": "warning",
  "Chờ GĐKD duyệt": "warning",
  "GĐKD đã duyệt": "success",
  "Chờ thẩm định": "warning",
  "Hoàn thành thẩm định": "success",
  "Chờ CEO duyệt": "danger",
  "Phát hành": "success",
  "Không duyệt thẩm định": "danger",
  "CEO không duyệt": "danger",
  "Quá hạn": "danger",
};

function getStatusTone(status) {
  return statusToneMap[status] || "neutral";
}

function getForecastProgress(forecast, tasks) {
  if (!forecast) return 0;
  if (forecast.status === "Phát hành") return 100;
  const ownTasks = tasks.filter((task) => task.forecastId === forecast.id);
  if (!ownTasks.length) return 0;
  const total = ownTasks.reduce((sum, task) => sum + task.progress, 0);
  return Math.round(total / ownTasks.length);
}

function buildTasksForForecast(forecast, assignmentRows = null) {
  const period = parseForecastMonth(forecast.month);
  const monthCode = String(period.month).padStart(2, "0");
  const year = period.year;
  const taskSource = assignmentRows?.length ? assignmentRows : workflowChannels;
  const cutoff = Math.ceil(taskSource.length / 2);

  return taskSource.map((channel, index) => ({
    id: `${forecast.id}-${toIdPart(channel.channel)}-${index}`,
    forecastId: forecast.id,
    title: `Forecast ${channel.channel} - ${forecast.month}`,
    channel: channel.channel,
    region: channel.region,
    owner: channel.asmNames?.length ? channel.asmNames.join(", ") : channel.owner || "Chưa phân công",
    ownerRole: channel.asmNames?.length ? `${channel.asmNames.length} ASM phụ trách` : channel.ownerRole || "ASM phụ trách",
    rsm: channel.rsm,
    director: channel.director,
    deadline: channel.deadline || `${index < cutoff ? "18" : "19"}/${monthCode}/${year}`,
    due: "Chờ ASM upload file Forecast",
    progress: 0,
    status: "Chờ ASM cập nhật",
    statusTone: "neutral",
    marker: channel.marker || channel.tone || "blue",
    file: "",
    fileSize: "",
    icon: channel.icon || Store,
    iconTone: channel.iconTone || channel.tone || "blue",
    template: channel.file || forecast.template || `Template_FC_KD01_T${monthCode}_${year}.xlsx`,
  }));
}

function nextEventId() {
  return `evt-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function toDateInputValue(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function toDisplayDate(value) {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || `request_failed_${response.status}`);
  }
  return payload;
}

async function fetchAuthState() {
  const response = await fetch(`/api/auth/me?t=${Date.now()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || `auth_${response.status}`);
  }
  return payload.auth || {
    required: false,
    configured: false,
    authenticated: false,
    mode: "mock",
  };
}

function App() {
  const [screen, setScreen] = useState("overview");
  const [forecasts, setForecasts] = useState(initialForecasts);
  const [tasks, setTasks] = useState(initialTasks);
  const [events, setEvents] = useState(initialEvents);
  const [publishedFiles, setPublishedFiles] = useState(initialPublishedFiles);
  const [selectedForecastId, setSelectedForecastId] = useState("fc-2026-07");
  const [selectedTaskId, setSelectedTaskId] = useState("task-2026-07-ec");
  const [selectedFileId, setSelectedFileId] = useState("file-2026-06-mt");
  const [draftForecast, setDraftForecast] = useState({
    month: "Tháng 08/2026",
    deadline: "22/08/2026",
    time: "17:00",
    note: "",
  });
  const [toast, setToast] = useState("");
  const [users, setUsers] = useState(adminUsers);
  const [roles, setRoles] = useState(roleDefinitions);
  const [permissionDrafts, setPermissionDrafts] = useState(buildInitialPermissionDrafts);
  const [systemChannelRows, setSystemChannelRows] = useState(channelRows);
  const [systemPermissionMatrix, setSystemPermissionMatrix] = useState(permissionMatrix);
  const [systemPermissionActivityLog, setSystemPermissionActivityLog] = useState(permissionActivityLog);
  const [previewRoleId, setPreviewRoleId] = useState("");
  const [authState, setAuthState] = useState({
    loading: true,
    required: false,
    configured: false,
    authenticated: false,
    user: null,
    role: null,
    permissions: null,
    loginUrl: "/api/auth/lark/start",
    logoutUrl: "/api/auth/logout",
  });

  const selectedForecast =
    forecasts.find((forecast) => forecast.id === selectedForecastId) || forecasts[0];
  const activeForecast =
    forecasts.find((forecast) => forecast.status !== "Phát hành") || selectedForecast;
  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) ||
    tasks.find((task) => task.forecastId === selectedForecast?.id) ||
    tasks[0];
  const selectedFile =
    publishedFiles.find((file) => file.id === selectedFileId) || publishedFiles[0];
  const previewRole = roles.find((role) => role.id === previewRoleId);
  const previewPermissions = previewRole ? permissionDrafts[previewRole.id] : null;
  const sessionPermissions = authState.required && authState.authenticated ? authState.permissions : null;
  const effectivePermissions = previewPermissions || sessionPermissions;
  const previewScreenAllowed = isPreviewScreenAllowed(screen, effectivePermissions);
  const canCreateForecast = !effectivePermissions || canEditPermission(effectivePermissions, "Lịch Forecast");

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const loadDatabaseData = async ({ shouldApply = () => true } = {}) => {
    const response = await fetch(`/api/data/bootstrap?t=${Date.now()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`bootstrap_${response.status}`);

    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.message || "bootstrap_failed");

    const nextData = buildAppDataFromBootstrap(payload.data, iconRegistry);
    if (!shouldApply()) return null;

    setForecasts(nextData.initialForecasts);
    setTasks(nextData.initialTasks);
    setEvents(nextData.initialEvents);
    setPublishedFiles(nextData.initialPublishedFiles);
    setUsers(nextData.adminUsers);
    setRoles(nextData.roleDefinitions);
    setPermissionDrafts(buildPermissionDrafts(nextData.roleDefinitions, nextData.permissionMatrix));
    setSystemChannelRows(nextData.channelRows);
    setSystemPermissionMatrix(nextData.permissionMatrix);
    setSystemPermissionActivityLog(nextData.permissionActivityLog);
    setSelectedForecastId((current) =>
      nextData.initialForecasts.some((forecast) => forecast.id === current)
        ? current
        : nextData.initialForecasts[0]?.id || current
    );
    setSelectedTaskId((current) =>
      nextData.initialTasks.some((task) => task.id === current)
        ? current
        : nextData.initialTasks[0]?.id || current
    );
    setSelectedFileId((current) =>
      nextData.initialPublishedFiles.some((file) => file.id === current)
        ? current
        : nextData.initialPublishedFiles[0]?.id || current
    );
    return nextData;
  };

  const loadCurrentAuth = async ({ shouldApply = () => true } = {}) => {
    try {
      const auth = await fetchAuthState();
      if (shouldApply()) setAuthState({ ...auth, loading: false });
      return auth;
    } catch (error) {
      console.warn("Auth status check failed.", error);
      const fallbackAuth = {
        loading: false,
        required: false,
        configured: false,
        authenticated: false,
        user: null,
        role: null,
        permissions: null,
        loginUrl: "/api/auth/lark/start",
        logoutUrl: "/api/auth/logout",
      };
      if (shouldApply()) setAuthState(fallbackAuth);
      return fallbackAuth;
    }
  };

  const reloadDatabaseData = async (message) => {
    await loadDatabaseData();
    await loadCurrentAuth();
    if (message) showToast(message);
  };

  useEffect(() => {
    let active = true;

    async function initializeAppData() {
      try {
        const auth = await loadCurrentAuth({ shouldApply: () => active });
        if (!auth.required || auth.authenticated) {
          await loadDatabaseData({ shouldApply: () => active });
        }
      } catch (error) {
        console.warn("Using mock fallback because database bootstrap failed.", error);
      }
    }

    initializeAppData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (effectivePermissions && !isPreviewScreenAllowed(screen, effectivePermissions)) {
      setScreen(getFirstPreviewScreen(effectivePermissions));
    }
  }, [screen, effectivePermissions]);

  const addEvent = ({ icon = CheckCircle2, tone = "blue", title, body }) => {
    setEvents((current) => [
      {
        id: nextEventId(),
        icon,
        tone,
        title,
        body,
        time: "Vừa xong",
      },
      ...current.slice(0, 19),
    ]);
  };

  const updateForecast = (forecastId, patch) => {
    setForecasts((current) =>
      current.map((forecast) =>
        forecast.id === forecastId ? { ...forecast, ...patch } : forecast
      )
    );
  };

  const updateTaskStatus = (taskId, patch, event) => {
    let nextTasks = [];
    let updatedTask;

    setTasks((current) => {
      nextTasks = current.map((task) => {
        if (task.id !== taskId) return task;
        updatedTask = {
          ...task,
          ...patch,
          statusTone: patch.status ? getStatusTone(patch.status) : task.statusTone,
        };
        return updatedTask;
      });
      return nextTasks;
    });

    if (updatedTask) {
      const ownTasks = nextTasks.filter((task) => task.forecastId === updatedTask.forecastId);
      const allBusinessApproved = ownTasks.length > 0 && ownTasks.every((task) => task.status === "GĐKD đã duyệt");
      if (allBusinessApproved) {
        updateForecast(updatedTask.forecastId, {
          status: "GĐKD đã duyệt",
          tone: "active",
        });
      }
    }

    if (event) addEvent(event);
  };

  const openForecast = (forecastId) => {
    setSelectedForecastId(forecastId);
    setScreen("detail");
  };

  const openTask = (taskId) => {
    setSelectedTaskId(taskId);
    setScreen("task-update");
  };

  const openAppraisal = (forecastId) => {
    setSelectedForecastId(forecastId);
    setScreen("appraisal-detail");
  };

  const openApproval = (forecastId) => {
    setSelectedForecastId(forecastId);
    setScreen("approval-detail");
  };

  const openTaskReport = (taskId) => {
    setSelectedTaskId(taskId);
    showToast("Đã mở khu vực báo cáo tổng quan cho task đang chọn.");
    setScreen("overview");
  };

  const openTaskAppraisal = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (task?.forecastId) setSelectedForecastId(task.forecastId);
    setSelectedTaskId(taskId);
    setScreen("appraisal-detail");
  };

  const openTaskApproval = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (task?.forecastId) setSelectedForecastId(task.forecastId);
    setSelectedTaskId(taskId);
    setScreen("approval-detail");
  };

  const openFile = (fileId) => {
    setSelectedFileId(fileId);
    setScreen("storage-file");
  };

  const handlePreviewRole = (roleId) => {
    const role = roles.find((item) => item.id === roleId);
    const permissions = permissionDrafts[roleId] || {};
    setPreviewRoleId(roleId);
    setScreen(getFirstPreviewScreen(permissions));
    showToast(`Đang xem trước giao diện vai trò ${role?.name || ""}.`);
  };

  const exitRolePreview = () => {
    setPreviewRoleId("");
    setScreen("system-permissions");
    showToast("Đã thoát chế độ xem trước.");
  };

  const handleCreateForecast = (assignmentRows = null) => {
    const monthNumber = draftForecast.month.match(/(\d{2})\/(\d{4})/)?.[1] || "08";
    const year = draftForecast.month.match(/\/(\d{4})/)?.[1] || "2026";
    const id = `fc-${year}-${monthNumber}`;
    const forecast = {
      id,
      title: `Forecast ${draftForecast.month}`,
      month: draftForecast.month,
      monthShort: `T${monthNumber}/${year}`,
      created: "29/06/2026",
      deadline: draftForecast.deadline,
      status: "Đang thực hiện",
      tone: "active",
      note: draftForecast.note || "Mock kỳ Forecast mới, dùng để chạy thử tròn luồng trên app.",
      template: `Template_FC_KD01_T${monthNumber}_${year}.xlsx`,
    };

    const existingForecast = forecasts.find((item) => item.id === id);
    if (existingForecast) {
      const existingTask = tasks.find((task) => task.forecastId === id);
      setSelectedForecastId(id);
      setSelectedTaskId(existingTask?.id || selectedTaskId);
      showToast("Kỳ Forecast này đã tồn tại, đã mở lịch hiện có để bạn test tiếp.");
      setScreen("detail");
      return;
    }

    const generatedTasks = buildTasksForForecast(forecast, assignmentRows);
    setForecasts((current) => [forecast, ...current]);
    setTasks((current) => [...generatedTasks, ...current]);
    setSelectedForecastId(id);
    setSelectedTaskId(generatedTasks[0]?.id || selectedTaskId);
    addEvent({
      icon: Calendar,
      tone: "blue",
      title: `${forecast.title} đã được tạo`,
      body: `Hệ thống đã sinh ${generatedTasks.length} task Forecast theo kênh.`,
    });
    showToast("Đã tạo lịch Forecast và sinh task mock.");
    setScreen("detail");
  };

  const handleTaskSubmit = (taskId, fileName, note) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    updateTaskStatus(
      taskId,
      {
        file: fileName,
        fileSize: "4.2 MB",
        due: "Đã nộp file, chờ RSM duyệt",
        progress: 55,
        status: "Chờ RSM duyệt",
      },
      {
        icon: Upload,
        tone: "green",
        title: `${task.channel} đã gửi file Forecast`,
        body: note || `${fileName} đã được upload và chuyển sang RSM duyệt.`,
      }
    );
    showToast("Đã gửi cập nhật, task chuyển sang chờ RSM duyệt.");
    setScreen("tasks");
  };

  const handleAssignTask = (taskId, user) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || !user) return;

    updateTaskStatus(
      taskId,
      {
        owner: user.name,
        ownerRole: user.title || user.role || "ASM phụ trách",
        due: `${user.name} nhận task, chờ cập nhật file Forecast`,
        progress: Math.max(task.progress || 0, 10),
        status: "Chờ ASM cập nhật",
      },
      {
        icon: UserPlus,
        tone: "blue",
        title: `Đã phân công ${task.channel}`,
        body: `${user.name} được gán phụ trách task Forecast kênh này.`,
      }
    );
    showToast(`Đã phân công ${user.name} phụ trách ${task.channel}.`);
  };

  const handleRsmApprove = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    updateTaskStatus(
      taskId,
      {
        due: "RSM đã duyệt, chờ GĐKD duyệt",
        progress: 75,
        status: "Chờ GĐKD duyệt",
      },
      {
        icon: CheckCircle2,
        tone: "blue",
        title: `RSM đã duyệt ${task.channel}`,
        body: `Task được chuyển sang ${task.director} phê duyệt cấp kinh doanh.`,
      }
    );
    showToast("RSM đã duyệt, chuyển tiếp GĐKD.");
  };

  const handleGdkdApprove = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    updateTaskStatus(
      taskId,
      {
        due: "Đã được GĐKD duyệt",
        progress: 100,
        status: "GĐKD đã duyệt",
      },
      {
        icon: CheckCircle2,
        tone: "green",
        title: `GĐKD đã duyệt ${task.channel}`,
        body: "Forecast kênh đã hoàn tất duyệt cấp kinh doanh.",
      }
    );
    showToast("GĐKD đã duyệt task.");
  };

  const handleSubmitAppraisal = (forecastId) => {
    updateForecast(forecastId, {
      status: "Chờ thẩm định",
      tone: "active",
    });
    addEvent({
      icon: Star,
      tone: "blue",
      title: "Hồ sơ đã trình thẩm định",
      body: "Các bộ phận Cung ứng, BI, Nhà máy và Tài chính nhận task thẩm định.",
    });
    showToast("Đã trình hồ sơ sang thẩm định.");
    setScreen("appraisal");
  };

  const handleAppraisalResult = (forecastId, approved) => {
    updateForecast(forecastId, {
      status: approved ? "Chờ CEO duyệt" : "Không duyệt thẩm định",
      tone: approved ? "active" : "muted",
    });
    addEvent({
      icon: approved ? CheckCircle2 : X,
      tone: approved ? "green" : "red",
      title: approved ? "Hoàn thành thẩm định" : "Thẩm định không duyệt",
      body: approved
        ? "Hồ sơ được chuyển sang CEO/BĐH phê duyệt cuối."
        : "Hồ sơ được trả về Phòng Kế hoạch để điều chỉnh.",
    });
    showToast(approved ? "Đã hoàn thành thẩm định, chuyển CEO duyệt." : "Đã trả hồ sơ về sau thẩm định.");
    setScreen(approved ? "approval" : "detail");
  };

  const handleApprovalResult = (forecastId, approved) => {
    const forecast = forecasts.find((item) => item.id === forecastId);
    if (!forecast) return;

    updateForecast(forecastId, {
      status: approved ? "Phát hành" : "CEO không duyệt",
      tone: approved ? "ended-blue" : "muted",
    });

    if (approved) {
      const fileId = `file-${forecastId}`;
      const file = {
        id: fileId,
        forecastId,
        name: `Forecast_${forecast.monthShort.replace("/", "_")}_final.xlsx`,
        channel: "Toàn công ty",
        month: forecast.monthShort,
        size: "5.6 MB",
        modified: "29/06/2026 16:30",
        owner: "Nguyễn Tú Anh",
        version: "v1.0",
      };
      setPublishedFiles((current) => {
        if (current.some((item) => item.id === fileId)) return current;
        return [file, ...current];
      });
      setSelectedFileId(fileId);
    }

    addEvent({
      icon: approved ? CheckCircle2 : X,
      tone: approved ? "green" : "red",
      title: approved ? `${forecast.title} đã phát hành` : `${forecast.title} bị CEO trả lại`,
      body: approved
        ? "Bản Forecast chính thức đã được đưa vào Kho lưu trữ."
        : "Phòng Kế hoạch cần điều chỉnh hồ sơ trước khi trình lại.",
    });
    showToast(approved ? "CEO đã duyệt, Forecast được phát hành." : "CEO không duyệt, hồ sơ được trả lại.");
    setScreen(approved ? "storage" : "detail");
  };

  const headerTitle =
    screen === "list"
      ? "Lịch Forecast"
      : screen === "storage-file"
        ? "File Details"
        : screen === "system-users"
          ? "Tài khoản"
          : screen === "system-permissions"
            ? "Phân quyền"
            : screen === "channel-config"
              ? "Cấu hình Khung Forecast"
              : screen === "approval-config"
                ? "Quản lý hệ thống"
                : screen === "sla-config"
                  ? "Cấu hình SLA"
        : "Forecast Management";
  const isBackScreen =
    screen === "create-1" ||
    screen === "create-2" ||
    screen === "detail" ||
    screen === "appraisal-detail" ||
    screen === "approval-detail" ||
    screen === "storage-file";

  const handleLogout = () => {
    window.location.href = authState.logoutUrl || "/api/auth/logout";
  };

  if (authState.loading || (authState.required && !authState.authenticated)) {
    return <AuthGate auth={authState} />;
  }

  return (
    <div className="app-shell">
      <Sidebar screen={screen} setScreen={setScreen} previewPermissions={effectivePermissions} onLogout={handleLogout} />
      <main className="main-shell">
        <Topbar
          title={headerTitle}
          currentUser={authState.user}
          authRequired={authState.required}
          onLogout={handleLogout}
          showBack={isBackScreen}
          hideSearch={screen === "detail" || screen === "storage-file"}
          onBack={() => {
            if (screen === "create-2") setScreen("create-1");
            else if (screen === "appraisal-detail") setScreen("appraisal");
            else if (screen === "approval-detail") setScreen("approval");
            else if (screen === "storage-file") setScreen("storage-folder");
            else setScreen("list");
          }}
          search={
            screen === "list"
              ? "Tìm kiếm tài liệu, lịch..."
              : screen === "tasks"
                ? "Tìm kiếm task..."
              : screen === "task-update"
                ? "Tìm kiếm task, tệp, hoặc người dùng..."
              : screen === "appraisal" || screen === "appraisal-detail" || screen === "approval" || screen === "approval-detail"
                ? "Tìm kiếm task, hồ sơ..."
              : screen === "storage" || screen === "storage-folder" || screen === "storage-file"
                ? "Tìm kiếm file forecast, thư mục..."
              : screen === "system-users"
                ? "Tìm tên, email, vai trò..."
              : screen === "system-permissions"
                ? "Tìm vai trò hoặc quyền..."
              : screen === "channel-config"
                ? "Tìm kiếm kênh hoặc RSM..."
              : screen === "approval-config"
                ? "Tìm kiếm quy trình..."
              : screen === "sla-config"
                ? "Tìm kiếm cấu hình..."
              : screen === "create-1" || screen === "create-2"
                ? "Tìm kiếm quy trình..."
                : "Tìm kiếm forecast, task..."
          }
        />
        {previewRole && <RolePreviewBanner role={previewRole} onExit={exitRolePreview} />}
        <div className="content-area">
          {toast && <div className="mock-toast">{toast}</div>}
          {!previewScreenAllowed ? (
            <PreviewAccessDenied role={previewRole} onExit={exitRolePreview} />
          ) : (
            <>
          {screen === "overview" && (
            <Overview
              forecasts={forecasts}
              tasks={tasks}
              events={events}
              activeForecast={activeForecast}
              onCreate={canCreateForecast ? () => setScreen("create-1") : null}
            />
          )}
          {screen === "list" && (
            <ScheduleList
              forecasts={forecasts}
              tasks={tasks}
              onCreate={canCreateForecast ? () => setScreen("create-1") : null}
              onOpen={openForecast}
            />
          )}
          {screen === "detail" && (
            <ForecastDetail
              forecast={selectedForecast}
              tasks={tasks.filter((task) => task.forecastId === selectedForecast?.id)}
              users={users}
              progress={getForecastProgress(selectedForecast, tasks)}
              onOpenTask={openTask}
              onAssignTask={handleAssignTask}
              onOpenReport={openTaskReport}
              onOpenAppraisal={openTaskAppraisal}
              onOpenApproval={openTaskApproval}
              onRsmApprove={handleRsmApprove}
              onGdkdApprove={handleGdkdApprove}
              onSubmitAppraisal={handleSubmitAppraisal}
            />
          )}
          {screen === "tasks" && (
            <TaskList
              tasks={tasks.filter((task) => task.forecastId === selectedForecast?.id)}
              onOpen={openTask}
              onRsmApprove={handleRsmApprove}
              onGdkdApprove={handleGdkdApprove}
            />
          )}
          {screen === "task-update" && (
            <TaskUpdate
              task={selectedTask}
              forecast={forecasts.find((forecast) => forecast.id === selectedTask?.forecastId)}
              onBack={() => setScreen("tasks")}
              onSubmit={handleTaskSubmit}
            />
          )}
          {screen === "appraisal" && (
            <AppraisalList
              forecasts={forecasts}
              tasks={tasks}
              events={events}
              onOpen={openAppraisal}
            />
          )}
          {screen === "appraisal-detail" && (
            <AppraisalDetail
              forecast={selectedForecast}
              tasks={tasks.filter((task) => task.forecastId === selectedForecast?.id)}
              onSubmit={handleAppraisalResult}
              onBack={() => setScreen("appraisal")}
            />
          )}
          {screen === "approval" && (
            <ApprovalList
              forecasts={forecasts}
              tasks={tasks}
              events={events}
              onOpen={openApproval}
            />
          )}
          {screen === "approval-detail" && (
            <ApprovalDetail
              forecast={selectedForecast}
              tasks={tasks.filter((task) => task.forecastId === selectedForecast?.id)}
              onSubmit={handleApprovalResult}
              onBack={() => setScreen("approval")}
            />
          )}
          {screen === "storage" && (
            <StoragePage
              level="root"
              forecasts={forecasts}
              files={publishedFiles}
              onOpenFolder={() => setScreen("storage-folder")}
              onOpenFile={openFile}
            />
          )}
          {screen === "storage-folder" && (
            <StoragePage
              level="folder"
              forecasts={forecasts}
              files={publishedFiles}
              onOpenFolder={() => setScreen("storage-file")}
              onOpenFile={openFile}
            />
          )}
          {screen === "storage-file" && (
            <StorageFileDetail
              file={selectedFile}
              forecast={forecasts.find((forecast) => forecast.id === selectedFile?.forecastId)}
            />
          )}
          {screen === "system-users" && (
            <SystemUsers
              onPermissions={() => setScreen("system-permissions")}
              onChannelConfig={() => setScreen("channel-config")}
              onApprovalConfig={() => setScreen("approval-config")}
              onSlaConfig={() => setScreen("sla-config")}
              roleCount={roles.length}
              roles={roles}
              users={users}
              setUsers={setUsers}
              onDataSaved={reloadDatabaseData}
              showToast={showToast}
            />
          )}
          {screen === "system-permissions" && (
            <SystemPermissions
              onUsers={() => setScreen("system-users")}
              onChannelConfig={() => setScreen("channel-config")}
              onApprovalConfig={() => setScreen("approval-config")}
              onSlaConfig={() => setScreen("sla-config")}
              permissionDrafts={permissionDrafts}
              setPermissionDrafts={setPermissionDrafts}
              onPreviewRole={handlePreviewRole}
              roles={roles}
              setRoles={setRoles}
              users={users}
              setUsers={setUsers}
              permissionMatrix={systemPermissionMatrix}
              permissionActivityLog={systemPermissionActivityLog}
              onDataSaved={reloadDatabaseData}
              showToast={showToast}
            />
          )}
          {screen === "channel-config" && (
            <ChannelFrameworkConfig
              onUsers={() => setScreen("system-users")}
              onPermissions={() => setScreen("system-permissions")}
              onApprovalConfig={() => setScreen("approval-config")}
              onSlaConfig={() => setScreen("sla-config")}
              channelRows={systemChannelRows}
              users={users}
              onDataSaved={reloadDatabaseData}
              showToast={showToast}
            />
          )}
          {screen === "approval-config" && (
            <ApprovalWorkflowConfig
              onUsers={() => setScreen("system-users")}
              onPermissions={() => setScreen("system-permissions")}
              onChannelConfig={() => setScreen("channel-config")}
              onSlaConfig={() => setScreen("sla-config")}
            />
          )}
          {screen === "sla-config" && (
            <SlaConfig
              onUsers={() => setScreen("system-users")}
              onPermissions={() => setScreen("system-permissions")}
              onChannelConfig={() => setScreen("channel-config")}
              onApprovalConfig={() => setScreen("approval-config")}
            />
          )}
          {screen === "create-1" && (
            <CreateForecastStepOne
              draft={draftForecast}
              setDraft={setDraftForecast}
              onCancel={() => setScreen("list")}
              onNext={() => setScreen("create-2")}
            />
          )}
          {screen === "create-2" && (
            <CreateForecastStepTwo
              draft={draftForecast}
              onBack={() => setScreen("create-1")}
              onFinish={handleCreateForecast}
              channelRows={systemChannelRows}
              users={users}
            />
          )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function RolePreviewBanner({ role, onExit }) {
  return (
    <div className="role-preview-banner">
      <div>
        <span>Đang xem trước vai trò</span>
        <strong>{role.name}</strong>
        <small>{role.description}</small>
      </div>
      <button className="secondary-button" onClick={onExit}>
        <X size={18} />
        Thoát xem trước
      </button>
    </div>
  );
}

function PreviewAccessDenied({ role, onExit }) {
  return (
    <section className="preview-denied-card">
      <Lock size={28} />
      <h2>Vai trò {role?.name} không có quyền truy cập màn hình này</h2>
      <p>Các menu và khu vực không nằm trong phạm vi quyền đã được ẩn trong chế độ xem trước.</p>
      <button className="primary-button" onClick={onExit}>
        <X size={18} />
        Thoát xem trước
      </button>
    </section>
  );
}

function AuthGate({ auth }) {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const error = params.get("auth_error");
  const errorMessage =
    error === "not_allowed"
      ? "Tài khoản Lark này chưa được cấp quyền trong Forecast KD01."
      : error === "account_inactive"
        ? "Tài khoản đang inactive hoặc bị khóa trong hệ thống."
        : error === "lark_failed"
          ? "Lark chưa xác thực được phiên đăng nhập. Kiểm tra lại cấu hình app Lark."
          : "";

  return (
    <main className="auth-gate-page">
      <section className="auth-gate-card">
        <span className="auth-gate-icon">
          <Lock size={28} />
        </span>
        <div>
          <span className="eyebrow">Forecast KD01</span>
          <h1>{auth.loading ? "Đang kiểm tra phiên đăng nhập" : "Đăng nhập bằng Lark"}</h1>
          <p>
            Hệ thống dùng Lark để xác định người truy cập, sau đó áp quyền theo role đã cấu hình trong PostgreSQL.
          </p>
        </div>
        {errorMessage && (
          <div className="auth-gate-warning">
            <AlertTriangle size={18} />
            {errorMessage}
          </div>
        )}
        {!auth.loading && !auth.configured && (
          <div className="auth-gate-warning">
            <AlertTriangle size={18} />
            Chưa cấu hình LARK_APP_ID / LARK_APP_SECRET trên server.
          </div>
        )}
        {auth.loading ? (
          <div className="auth-gate-loading">Đang tải...</div>
        ) : (
          <a className="primary-button auth-gate-login" href={auth.loginUrl || "/api/auth/lark/start"}>
            Đăng nhập Lark
            <ArrowRight size={18} />
          </a>
        )}
      </section>
    </main>
  );
}

function toSelectOption(option) {
  return typeof option === "string" ? { value: option, label: option } : option;
}

function normalizeSearchValue(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .toLowerCase();
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

function uniqueTextOptions(rows, selector) {
  return Array.from(
    new Set(rows.map(selector).filter((value) => value && String(value).trim()))
  );
}

function CustomSelect({ value, options, onChange, placeholder = "Chọn", className = "", disabled = false }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const normalizedOptions = options.map(toSelectOption);
  const selected = normalizedOptions.find((option) => option.value === value);
  const displayLabel = selected?.label || placeholder;
  const isPermissionSelect = className.includes("permission-level-select");

  useEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return undefined;
    }
    if (typeof window === "undefined") return undefined;

    const updateMenuPosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const gap = 6;
      const preferredMaxHeight = 240;
      const optionHeight = Math.min(preferredMaxHeight, normalizedOptions.length * 44 + 12);
      const menuWidth = Math.min(
        Math.max(rect.width, isPermissionSelect ? 180 : rect.width),
        window.innerWidth - 16
      );
      const menuLeft = Math.min(Math.max(8, rect.left), window.innerWidth - menuWidth - 8);
      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const placeAbove = spaceBelow < optionHeight && spaceAbove > spaceBelow;
      const availableHeight = Math.max(
        128,
        Math.min(preferredMaxHeight, (placeAbove ? spaceAbove : spaceBelow) - 8)
      );

      setMenuStyle({
        left: menuLeft,
        right: "auto",
        top: placeAbove ? "auto" : rect.bottom + gap,
        bottom: placeAbove ? window.innerHeight - rect.top + gap : "auto",
        width: menuWidth,
        maxHeight: availableHeight,
      });
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, normalizedOptions.length, isPermissionSelect]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;

    const closeOnOutsidePointer = (event) => {
      if (wrapperRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsidePointer);
    return () => document.removeEventListener("mousedown", closeOnOutsidePointer);
  }, [open]);

  const menu = (
    <div
      className={`custom-select-menu floating-select-menu ${isPermissionSelect ? "permission-level-menu" : ""}`}
      role="listbox"
      ref={menuRef}
      style={menuStyle || undefined}
    >
      {normalizedOptions.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`custom-select-option ${isSelected ? "selected" : ""}`}
            key={option.value}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            <Check size={16} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={`custom-select ${open ? "open" : ""} ${disabled ? "disabled" : ""} ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !menuRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{displayLabel}</span>
        <ChevronDown size={17} />
      </button>
      {open && !disabled && menuStyle && typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}

function Sidebar({ screen, setScreen, previewPermissions, onLogout }) {
  const visibleNavItems = previewPermissions
    ? navItems.filter((item) => hasPreviewAccess(previewPermissions, previewNavModules[item.screen] || []))
    : navItems;
  const visibleSystemSubItems = previewPermissions
    ? systemSubItems.filter((item) => hasPreviewAccess(previewPermissions, previewNavModules[item.screen] || []))
    : systemSubItems;
  const systemScreens = ["system-users", "system-permissions", "channel-config", "approval-config", "sla-config"];
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
            const isDashboard =
              item.label === "Dashboard" && screen === "overview";
            const isForecastFlow =
              item.label === "Lịch Forecast" &&
              ["list", "detail", "create-1", "create-2"].includes(screen);
            const isTaskFlow =
              item.label === "Công việc" && ["tasks", "task-update"].includes(screen);
            const isAppraisalFlow =
              item.label === "Thẩm định" && ["appraisal", "appraisal-detail"].includes(screen);
            const isApprovalFlow =
              item.label === "Phê duyệt" && ["approval", "approval-detail"].includes(screen);
            const isStorageFlow =
              item.label === "Kho lưu trữ" && ["storage", "storage-folder", "storage-file"].includes(screen);
            const isSystemFlow =
              item.label === "Quản trị hệ thống" && ["system-users", "system-permissions", "channel-config", "approval-config", "sla-config"].includes(screen);
            const isActive = isDashboard || isForecastFlow || isTaskFlow || isAppraisalFlow || isApprovalFlow || isStorageFlow || isSystemFlow;
            const isSystemItem = item.label === "Quản trị hệ thống";

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
          <span>Hỗ trợ</span>
        </button>
        <button className="nav-item compact" type="button" onClick={onLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

function Topbar({ title, search, showBack, hideSearch, onBack, currentUser, authRequired, onLogout }) {
  const displayName = currentUser?.name || "Nguyễn Tú Anh";
  const initials = currentUser?.initials || displayName.trim().split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase() || "NA";

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
        <button className="user-chip" type="button" onClick={authRequired ? onLogout : undefined} title={authRequired ? "Đăng xuất" : displayName}>
          <strong>{displayName}</strong>
          <span className="avatar">{initials}</span>
        </button>
      </div>
    </header>
  );
}

function Overview({
  onCreate,
  forecasts = initialForecasts,
  tasks = initialTasks,
  events = initialEvents,
  activeForecast,
}) {
  const currentForecast = activeForecast || forecasts[0];
  const forecastTasks = tasks.filter((task) => task.forecastId === currentForecast?.id);
  const submittedCount = forecastTasks.filter((task) => task.file).length;
  const totalTasks = forecastTasks.length || 1;
  const onTimeRate = Math.max(
    0,
    Math.round((forecastTasks.filter((task) => task.status !== "Quá hạn").length / totalTasks) * 100)
  );
  const appraisalCount = forecasts.filter((forecast) => forecast.status === "Chờ thẩm định").length;
  const approvalCount = forecasts.filter((forecast) => forecast.status === "Chờ CEO duyệt").length;

  return (
    <section className="page-flow">
      <div className="page-heading with-actions">
        <div>
          <h2>Tổng quan vận hành</h2>
          <p>Thứ Tư, 24 Tháng 6, 2026 • Kỳ Forecast đang mở: 07/2026</p>
        </div>
        <div className="action-row">
          <button className="secondary-button">
            <Filter size={18} />
            Lọc dữ liệu
          </button>
          {onCreate && (
            <button className="primary-button" onClick={onCreate}>
              <Plus size={18} />
              Tạo Forecast mới
            </button>
          )}
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard
          icon={Gauge}
          label="SLA đúng hạn"
          value={`${onTimeRate}%`}
          hint="+6%"
          tone="blue"
          footer={<div className="metric-progress"><span style={{ width: `${onTimeRate}%` }} /></div>}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Kênh đã nộp file"
          value={`${submittedCount}/${totalTasks}`}
          hint={currentForecast?.monthShort || "Mock"}
          tone="green"
          footer={<span>{totalTasks - submittedCount} kênh còn chờ file</span>}
        />
        <MetricCard
          icon={ClipboardList}
          label="Chờ thẩm định"
          value={String(appraisalCount).padStart(2, "0")}
          hint="Mock workflow"
          tone="red"
          footer={<AvatarStack />}
        />
        <MetricCard
          icon={Clock3}
          label="Chờ CEO duyệt"
          value={String(approvalCount).padStart(2, "0")}
          hint="Sắp tới hạn"
          tone="soft-red"
          footer={<span>Deadline phê duyệt: {currentForecast?.deadline}</span>}
        />
      </div>

      <div className="overview-grid">
        <ChartPanel forecast={currentForecast} tasks={forecastTasks} />
        <NoticePanel events={events} />
      </div>

      <RecentApprovals forecasts={forecasts} tasks={tasks} />
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, hint, tone, footer }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className={`icon-badge ${tone}`}>
          <Icon size={21} />
        </span>
        <small className={`metric-hint ${tone}`}>{hint}</small>
      </div>
      <span className="eyebrow">{label}</span>
      <strong className="metric-value">{value}</strong>
      <div className="metric-footer">{footer}</div>
    </article>
  );
}

function AvatarStack() {
  return (
    <div className="avatar-stack" aria-label="Nhóm xử lý">
      <span>AT</span>
      <span>HN</span>
      <span>+8</span>
    </div>
  );
}

function ChartPanel({ forecast, tasks = [] }) {
  const bars = [
    { day: "T2", approved: 68, pending: 34 },
    { day: "T3", approved: 84, pending: 24 },
    { day: "T4", approved: 73, pending: 29 },
    { day: "T5", approved: 95, pending: 12 },
    { day: "T6", approved: 62, pending: 46 },
    { day: "T7", approved: 45, pending: 12 },
    { day: "CN", approved: 34, pending: 7 },
  ];

  return (
    <section className="panel chart-panel">
      <div className="panel-header">
        <div>
          <h3>Tiến độ kỳ Forecast 07/2026</h3>
          <p>Theo dõi số file kênh đã nộp và số file còn chờ thẩm định theo ngày</p>
        </div>
        <div className="legend">
          <span><i className="dot blue" />Đã xử lý</span>
          <span><i className="dot pale" />Còn chờ</span>
        </div>
      </div>
      <div className="bar-chart" aria-label="Biểu đồ trạng thái phê duyệt">
        {bars.map((bar) => (
          <div className="bar-group" key={bar.day}>
            <div className="bar-stack">
              <span className="pending" style={{ height: `${bar.pending}%` }} />
              <span className="approved" style={{ height: `${bar.approved}%` }} />
            </div>
            <strong>{bar.day}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function NoticePanel({ events = initialEvents }) {
  const [page, setPage] = useState(1);
  const notices = events.length ? events : [
    {
      icon: Calendar,
      tone: "blue",
      title: "Kỳ Forecast 07/2026 đã mở",
      body: "Các RSM/ASM bắt đầu nhập và tải file forecast theo kênh",
      time: "10 phút trước",
    },
    {
      icon: CheckCircle2,
      tone: "green",
      title: "Kênh MT đã được phát hành",
      body: "Bản chính thức đã được lưu vào Kho lưu trữ",
      time: "2 giờ trước",
    },
    {
      icon: AlertTriangle,
      tone: "red",
      title: "Cảnh báo SLA Task #4421",
      body: "Task Kênh GT quá hạn nộp file forecast",
      time: "4 giờ trước",
    },
    {
      icon: Upload,
      tone: "slate",
      title: "Cập nhật File mẫu Forecast mới",
      body: "Vui lòng sử dụng template v2.4 cho kỳ 07/2026",
      time: "Hôm qua",
    },
  ];
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(notices.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleNotices = notices.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [events.length]);

  return (
    <section className="panel notice-panel">
      <div className="panel-title-row">
        <h3>Thông báo kỳ Forecast</h3>
      </div>
      <div className="notice-list">
        {visibleNotices.map((notice) => {
          const Icon = notice.icon;
          return (
            <article className="notice-item" key={notice.title}>
              <span className={`notice-icon ${notice.tone}`}>
                <Icon size={21} />
              </span>
              <div>
                <strong>{notice.title}</strong>
                <p>{notice.body}</p>
                <small>{notice.time}</small>
              </div>
            </article>
          );
        })}
      </div>
      <div className="notice-footer">
        <span>Hiển thị {visibleNotices.length ? `${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, notices.length)}` : "0"} / {notices.length}</span>
        <SimplePagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  );
}

function RecentApprovals({ forecasts = initialForecasts, tasks = initialTasks }) {
  const rows = [
    ...tasks.slice(0, 5).map((task) => ({
      code: task.id.replace("task-", "FC-"),
      department: task.channel,
      date: task.deadline,
      status: task.status,
      sla: task.due,
      mode: task.statusTone,
      action: task.file ? "view" : "edit",
    })),
    ...forecasts.slice(0, 2).map((forecast) => ({
      code: forecast.id.toUpperCase(),
      department: "Phòng Kế hoạch",
      date: forecast.deadline,
      status: forecast.status,
      sla: forecast.monthShort,
      mode: getStatusTone(forecast.status),
      action: "view",
    })),
  ].slice(0, 5);

  return (
    <section className="panel table-panel">
      <div className="panel-title-row">
        <h3>Tác vụ xử lý gần đây</h3>
        <button>Tải báo cáo <Download size={14} /></button>
      </div>
      <div className="data-table recent-table">
        <div className="table-head">
          <span>Mã FC / Task</span>
          <span>Kênh / Bộ phận</span>
          <span>Ngày gửi</span>
          <span>Trạng thái</span>
          <span>SLA còn lại</span>
          <span>Hành động</span>
        </div>
        {rows.map((row) => (
          <div className="table-row" key={row.code}>
            <span>{row.code}</span>
            <span>{row.department}</span>
            <span>{row.date}</span>
            <span><Badge tone={row.mode}>{row.status}</Badge></span>
            <span className={`sla-cell ${row.mode}`}>
              {row.sla}
              <i style={{ width: row.mode === "success" ? "68px" : "48px" }} />
            </span>
            <span>
              <button className="icon-button table-action" title={row.action === "view" ? "Xem" : "Sửa"}>
                {row.action === "view" ? <Eye size={20} /> : <Pencil size={20} />}
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScheduleList({ onCreate, onOpen, forecasts = initialForecasts, tasks = initialTasks }) {
  const rows = forecasts.map((forecast) => ({
    ...forecast,
    deadline: forecast.deadline,
    tone: forecast.status === "Phát hành" ? "ended-blue" : "active",
    taskCount: tasks.filter((task) => task.forecastId === forecast.id).length,
  }));

  return (
    <section className="page-flow">
      <div className="schedule-top">
        <MiniMetric icon={Calendar} label="Đang kích hoạt" value="12 Lịch" tone="blue" />
        <MiniMetric icon={FileText} label="File mẫu" value="45 Bản" tone="green" />
        <MiniMetric icon={ClipboardList} label="Sắp tới hạn" value="03 Deadline" tone="pale" />
        <div className="schedule-actions">
          {onCreate && (
            <>
              <button className="primary-button" onClick={onCreate}>
                <Plus size={19} />
                Tạo lịch Forecast
              </button>
              <button className="muted-button">
                <Upload size={18} />
                Tải lên File mẫu
              </button>
            </>
          )}
        </div>
      </div>

      <div className="schedule-layout">
        <section className="panel schedule-list-panel">
          <div className="panel-title-row tabs-row">
            <h3>Danh sách Lịch Forecast</h3>
            <div className="tabs">
              <button className="active">Tất cả</button>
              <button>Đang chạy</button>
              <button>Kết thúc</button>
            </div>
          </div>
          <div className="schedule-table">
            <div className="schedule-head">
              <span>Tên Lịch / Kỳ Forecast</span>
              <span>Ngày tạo</span>
              <span>Hạn cuối (Deadline)</span>
              <span>Trạng thái</span>
              <span>Thao tác</span>
            </div>
            {rows.map((row, index) => (
              <article className={`schedule-row ${row.tone}`} key={row.title}>
                <button className="schedule-name schedule-open" onClick={() => onOpen(row.id)}>
                  <span className="calendar-token">
                    <Calendar size={18} />
                  </span>
                  <strong>{row.title}</strong>
                </button>
                <span>{row.created}</span>
                <span>
                  {row.deadline}
                  <i className="mini-bar" />
                </span>
                <span><Badge tone={getStatusTone(row.status)}>{row.status}</Badge></span>
                <span className="row-tools">
                  <button className="icon-button table-action" title="Xem chi tiết" onClick={() => onOpen(row.id)}>
                    {index === 3 ? <Eye size={19} /> : <SquarePen size={19} />}
                  </button>
                  <button className="icon-button table-action" title="Tùy chọn">
                    <MoreVertical size={19} />
                  </button>
                </span>
              </article>
            ))}
          </div>
        </section>

        <aside className="right-rail">
          <TemplatePanel />
          <DeadlinePanel />
        </aside>
      </div>
    </section>
  );
}

function TaskList({ onOpen, onRsmApprove, onGdkdApprove, tasks = initialTasks }) {
  const [page, setPage] = useState(1);
  const [taskSearch, setTaskSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const rowsPerPage = 6;
  const channelOptions = [
    { value: "all", label: "Tất cả kênh" },
    ...uniqueTextOptions(tasks, (task) => task.channel).map((channel) => ({ value: channel, label: channel })),
  ];
  const ownerOptions = [
    { value: "all", label: "Tất cả nhân sự" },
    ...uniqueTextOptions(tasks, (task) => task.owner).map((owner) => ({ value: owner, label: owner })),
  ];
  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    ...uniqueTextOptions(tasks, (task) => task.status).map((status) => ({ value: status, label: status })),
  ];
  const normalizedTaskSearch = normalizeSearchValue(taskSearch.trim());
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = !normalizedTaskSearch || normalizeSearchValue([
      task.title,
      task.channel,
      task.owner,
      task.ownerRole,
      task.status,
      task.deadline,
    ].join(" ")).includes(normalizedTaskSearch);
    const matchesChannel = channelFilter === "all" || task.channel === channelFilter;
    const matchesOwner = ownerFilter === "all" || task.owner === ownerFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesChannel && matchesOwner && matchesStatus;
  });
  const totalTasks = filteredTasks.length;
  const totalPages = Math.ceil(totalTasks / rowsPerPage);
  const currentPage = Math.min(page, totalPages || 1);
  const visibleTasks = filteredTasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const startRow = totalTasks ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = Math.min(currentPage * rowsPerPage, totalTasks);
  const doingTasks = filteredTasks.filter((task) => !["GĐKD đã duyệt", "Phát hành"].includes(task.status)).length;
  const doneTasks = filteredTasks.filter((task) => ["GĐKD đã duyệt", "Phát hành"].includes(task.status)).length;
  const lateTasks = filteredTasks.filter((task) => task.status === "Quá hạn").length;

  useEffect(() => {
    setPage(1);
  }, [taskSearch, channelFilter, ownerFilter, statusFilter]);

  return (
    <section className="page-flow task-page">
      <div className="task-filter-row">
        <label className="task-search-filter">
          <Search size={18} />
          <input
            value={taskSearch}
            onChange={(event) => setTaskSearch(event.target.value)}
            placeholder="Tìm task, kênh hoặc ASM..."
          />
        </label>
        <CustomSelect value={channelFilter} options={channelOptions} onChange={setChannelFilter} className="filter-select" />
        <CustomSelect value={ownerFilter} options={ownerOptions} onChange={setOwnerFilter} className="filter-select wide" />
        <CustomSelect value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="filter-select status" />
      </div>

      <div className="action-row">
        <button className="secondary-button">
          <Download size={18} />
          Xuất báo cáo
        </button>
        <button className="primary-button">
          <Plus size={18} />
          Tạo Task mới
        </button>
      </div>

      <div className="task-metric-grid">
        <TaskMetric title="Tổng số Task" value={String(totalTasks)} note="mock data" delta="+12%" tone="blue" />
        <TaskMetric title="Đang thực hiện" value={String(doingTasks)} progress={totalTasks ? Math.round((doingTasks / totalTasks) * 100) : 0} tone="orange" />
        <TaskMetric title="Hoàn thành" value={String(doneTasks)} progress={totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0} tone="green" />
        <TaskMetric title="Quá hạn SLA" value={String(lateTasks).padStart(2, "0")} note="Cần xử lý ngay" tone="red" />
      </div>

      <section className="panel task-list-panel">
        <div className="task-table">
          <div className="task-head">
            <span>Task & Kênh bán hàng</span>
            <span>Người phụ trách</span>
            <span>Thời hạn / SLA</span>
            <span>Tiến độ</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          {visibleTasks.map((row) => (
            <article className="task-row" key={row.title}>
              <button className="task-title-cell" onClick={() => onOpen(row.id)}>
                <i className={row.marker} />
                <span>
                  <strong>{row.title}</strong>
                  <small>{row.channel}</small>
                </span>
              </button>
              <div className="task-owner">
                {row.owner !== "Chưa phân công" && <span className="mini-avatar">{row.owner.slice(0, 1)}</span>}
                <span>
                  <strong>{row.owner}</strong>
                  {row.ownerRole && <small>{row.ownerRole}</small>}
                </span>
              </div>
              <div className={row.due.includes("Quá hạn") ? "task-due danger" : "task-due"}>
                <span>{row.deadline}</span>
                <small>{row.due}</small>
              </div>
              <div className="task-progress-cell">
                <i><span style={{ width: `${row.progress}%` }} /></i>
                <div>
                  <span>{row.progress}%</span>
                  {row.progress === 100 && <small>Hoàn tất</small>}
                  {row.progress === 30 && <small>Giai đoạn 1</small>}
                </div>
              </div>
              <span><Badge tone={row.statusTone}>{row.status}</Badge></span>
              <span className="detail-action-icons">
                <button className="icon-button table-action" onClick={() => onOpen(row.id)} title="Xem">
                  <Eye size={19} />
                </button>
                <button className="icon-button table-action" onClick={() => onOpen(row.id)} title="Sửa">
                  <Pencil size={19} />
                </button>
                {row.status === "Chờ RSM duyệt" && (
                  <button className="icon-button table-action" title="RSM duyệt" onClick={() => onRsmApprove(row.id)}>
                    <CheckCircle2 size={19} />
                  </button>
                )}
                {row.status === "Chờ GĐKD duyệt" && (
                  <button className="icon-button table-action" title="GĐKD duyệt" onClick={() => onGdkdApprove(row.id)}>
                    <Check size={19} />
                  </button>
                )}
                <button className="icon-button table-action" title="Báo cáo">
                  <BarChart3 size={19} />
                </button>
              </span>
            </article>
          ))}
          {!visibleTasks.length && (
            <div className="task-empty-state">Không có task phù hợp với bộ lọc hiện tại.</div>
          )}
        </div>
        <div className="table-footer">
          <span>Hiển thị {startRow} - {endRow} trên tổng số {totalTasks} Task</span>
          <SimplePagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>

      <button className="floating-create" title="Tạo Task">
        <SquarePen size={28} />
      </button>
    </section>
  );
}

function TaskMetric({ title, value, note, delta, progress, tone }) {
  return (
    <article className={`task-metric-card ${tone}`}>
      <div className="task-metric-title">
        <span className="eyebrow">{title}</span>
        <BarChart3 size={18} />
      </div>
      <strong>{value}</strong>
      {delta && <span className="metric-delta">{delta}</span>}
      {progress !== undefined && (
        <div className="task-metric-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      {note && <small>{note}</small>}
    </article>
  );
}

function TaskUpdate({ onBack, task, forecast, onSubmit }) {
  const displayTask = task || initialTasks[0];
  const [taskStatus, setTaskStatus] = useState("doing");
  const [fileName, setFileName] = useState(
    displayTask.file || `Forecast_${displayTask.channel.replace(/\s+/g, "_")}_${forecast?.monthShort || "T07_2026"}.xlsx`
  );
  const [note, setNote] = useState("");

  return (
    <section className="task-update-page">
      <div className="task-update-main">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={16} />
          Quay lại danh sách Task
        </button>
        <div className="task-update-title">
          <div>
            <h2>Cập nhật {displayTask.title}</h2>
            <p>Mã Task: #{displayTask.id} • Phân công: {displayTask.ownerRole}</p>
          </div>
        </div>

        <section className="panel instruction-card">
          <div className="instruction-title">
            <div>
              <Info size={22} />
              <h3>Hướng dẫn công việc</h3>
            </div>
            <span>Hết hạn trong 48 giờ</span>
          </div>
          <p>
            Vui lòng hoàn thiện file forecast tháng 07/2026 cho kênh TMĐT theo template KD01. Số liệu cần thể hiện nhu cầu theo SKU, chương trình khuyến mãi dự kiến, tồn kho đầu kỳ và các ghi chú bất thường để bộ phận thẩm định có đủ căn cứ rà soát.
          </p>
          <ul>
            <li>Không đổi cấu trúc cột của file mẫu forecast.</li>
            <li>Điền đầy đủ forecast theo SKU, khu vực và kênh bán hàng.</li>
            <li>Nếu có điều chỉnh lớn so với tháng trước, bắt buộc ghi lý do tại cột ghi chú.</li>
          </ul>
          <div className="instruction-meta">
            <div>
              <span className="eyebrow">Hạn chót</span>
              <strong>19/07/2026 • 17:00</strong>
            </div>
            <div>
              <span className="eyebrow">Độ ưu tiên</span>
              <strong className="danger-text">! Khẩn cấp</strong>
            </div>
          </div>
        </section>

        <section className="panel upload-card">
          <h3>
            <Upload size={22} />
            Tải lên dữ liệu Dự báo
          </h3>
          <div className="drop-zone">
            <UploadCloud size={42} />
            <strong>Kéo và thả tệp vào đây hoặc Chọn tệp từ máy tính</strong>
            <span>Hỗ trợ định dạng XLSX/CSV tối đa 50MB</span>
            <button className="secondary-button">Duyệt tệp tin</button>
          </div>
          <div className="uploaded-file">
            <span className="file-icon blue">
              <FileText size={22} />
            </span>
            <div>
              <strong>{fileName}</strong>
              <small>{displayTask.file ? "File đã có trong mock data" : "File mock sẽ được gửi khi bấm cập nhật"}</small>
            </div>
            <CheckCircle2 size={22} />
            <button className="icon-button table-action" title="Xóa">
              <Trash2 size={19} />
            </button>
          </div>
        </section>
      </div>

      <aside className="task-update-rail">
        <div className="task-update-actions">
          <button className="secondary-button">
            <Save size={18} />
            Lưu bản nháp
          </button>
          <button className="primary-button" onClick={() => onSubmit(displayTask.id, fileName, note)}>
            <CheckCircle2 size={18} />
            Gửi cập nhật
          </button>
        </div>
        <section className="panel status-update-card">
          <h3>Cập nhật trạng thái</h3>
          <button
            className={`status-option ${taskStatus === "doing" ? "active" : ""}`}
            type="button"
            onClick={() => setTaskStatus("doing")}
          >
            <Circle size={18} />
            <span>
              <strong>Đang thực hiện</strong>
              <small>Vẫn đang tổng hợp và kiểm tra dữ liệu.</small>
            </span>
          </button>
          <button
            className={`status-option ${taskStatus === "done" ? "active" : ""}`}
            type="button"
            onClick={() => setTaskStatus("done")}
          >
            <Circle size={18} />
            <span>
              <strong>Hoàn thành</strong>
              <small>Sẵn sàng để quản lý xem xét.</small>
            </span>
          </button>
        </section>

        <section className="panel record-history-card">
          <h3>
            <Clock3 size={21} />
            Lịch sử bản ghi
          </h3>
          {[
            ["10:00, 24/06/2026", "Nguyễn Tú Anh đã tạo task."],
            ["10:05, 24/06/2026", "Hệ thống đã gửi thông báo cho Lê Quang Minh."],
            ["11:30, 25/06/2026", "Lê Quang Minh đã đổi trạng thái sang \"Đang nhập liệu\"."],
            ["11:32, 25/06/2026", `${displayTask.owner} đã tải lên tệp ${fileName}.`],
          ].map((item, index) => (
            <article className={`history-item tone-${index}`} key={item[0]}>
              <i />
              <span>{item[0]}</span>
              <strong>{item[1]}</strong>
            </article>
          ))}
        </section>
      </aside>
    </section>
  );
}

function AppraisalList({ onOpen, forecasts = initialForecasts, tasks = initialTasks }) {
  const defaultForecast =
    forecasts.find((forecast) => ["Chờ thẩm định", "Chờ CEO duyệt"].includes(forecast.status)) ||
    forecasts[0];
  const [selectedForecastId, setSelectedForecastId] = useState(defaultForecast?.id || "");
  const [quickFilter, setQuickFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const selectedForecast =
    forecasts.find((forecast) => forecast.id === selectedForecastId) || defaultForecast;
  const forecastTasks = tasks.filter((task) => task.forecastId === selectedForecast?.id);

  const allRows = forecastTasks.map((task) => {
    const waitingApproval = selectedForecast?.status === "Chờ CEO duyệt";
    const waitingAppraisal =
      selectedForecast?.status === "Chờ thẩm định" ||
      ["GĐKD đã duyệt", "Chờ RSM duyệt", "Chờ GĐKD duyệt"].includes(task.status);
    const status = waitingApproval
      ? "Chờ duyệt"
      : waitingAppraisal
        ? "Chờ thẩm định"
        : task.file
          ? "Có file"
          : "Chưa có file";

    return {
      forecastId: selectedForecast?.id,
      taskId: task.id,
      channel: task.channel,
      month: selectedForecast?.month || task.deadline,
      sender: task.owner,
      sentAt: task.file ? "Vừa xong" : "Chưa gửi",
      file: task.file || task.template || selectedForecast?.template || "Chưa có file",
      status,
      statusTone:
        status === "Chờ duyệt"
          ? "danger"
          : status === "Chờ thẩm định" || status === "Có file"
            ? "warning"
            : "neutral",
      icon: task.icon || Star,
      iconTone: task.iconTone || "blue",
    };
  });

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const rows = allRows
    .filter((row) => {
      if (quickFilter === "appraisal") return row.status === "Chờ thẩm định";
      if (quickFilter === "approval") return row.status === "Chờ duyệt";
      return true;
    })
    .filter((row) => {
      if (!normalizedSearch) return true;
      return [row.channel, row.sender, row.file, row.month]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  const rowsPerPage = 6;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const currentPage = Math.min(page, totalPages || 1);
  const pagedRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const startRow = rows.length ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = Math.min(currentPage * rowsPerPage, rows.length);

  return (
    <section className="page-flow appraisal-page">
      <div className="breadcrumb appraisal-breadcrumb">
        <button>Forecast Management</button>
        <ChevronRight size={15} />
        <strong>Thẩm định & Phê duyệt</strong>
      </div>

      <div className="page-heading with-actions">
        <div>
          <h2>Thẩm định</h2>
          <p>Rà soát file forecast các kênh trước khi chuyển CEO phê duyệt.</p>
        </div>
        <button className="primary-button">
          <Download size={18} />
          Xuất báo cáo
        </button>
      </div>

      <section className="panel appraisal-table-panel">
        <div className="appraisal-toolbar">
          <div className="segmented-tabs">
            <button className={quickFilter === "all" ? "active" : ""} onClick={() => { setQuickFilter("all"); setPage(1); }}>Tất cả</button>
            <button className={quickFilter === "appraisal" ? "active" : ""} onClick={() => { setQuickFilter("appraisal"); setPage(1); }}>Chờ thẩm định</button>
            <button className={quickFilter === "approval" ? "active" : ""} onClick={() => { setQuickFilter("approval"); setPage(1); }}>Chờ duyệt</button>
          </div>
          <CustomSelect
            className="month-select forecast-month-select"
            value={selectedForecast?.id || ""}
            options={forecasts.map((forecast) => ({ value: forecast.id, label: forecast.month }))}
            onChange={(forecastId) => {
              setSelectedForecastId(forecastId);
              setPage(1);
            }}
          />
          <label className="appraisal-search">
            <Search size={19} />
            <input
              placeholder="Tìm kiếm kênh hoặc tên task..."
              value={searchTerm}
              onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }}
            />
          </label>
        </div>

        <div className="appraisal-table">
          <div className="appraisal-head">
            <span>Tên kênh</span>
            <span>Tháng thẩm định</span>
            <span>Người gửi</span>
            <span>Thời gian gửi</span>
            <span>Trạng thái</span>
            <span>Tài liệu</span>
            <span>Thao tác</span>
          </div>
          {pagedRows.map((row) => {
            const Icon = row.icon;
            return (
              <article className="appraisal-row" key={row.taskId}>
                <div className="appraisal-channel">
                  <span className={`task-icon ${row.iconTone}`}>
                    <Icon size={19} />
                  </span>
                  <strong>{row.channel}</strong>
                </div>
                <button className="appraisal-month" onClick={() => onOpen(row.forecastId)}>{row.month}</button>
                <span>{row.sender}</span>
                <span className="sent-at">
                  <Clock3 size={14} />
                  {row.sentAt}
                </span>
                <span><Badge tone={row.statusTone}>{row.status}</Badge></span>
                <span className="file-link">
                  <FileText size={16} />
                  <span className="file-link-text">{row.file}</span>
                </span>
                <span className="row-tools">
                  <button className="icon-button table-action" title="Thẩm định" onClick={() => onOpen(row.forecastId)}>
                    <ClipboardList size={20} />
                  </button>
                  <button className="icon-button table-action" title="Xem" onClick={() => onOpen(row.forecastId)}>
                    <Eye size={20} />
                  </button>
                </span>
              </article>
            );
          })}
          {!rows.length && (
            <div className="appraisal-empty-row">
              Chưa có kênh phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
        <div className="table-footer">
          <span>Hiển thị {startRow} - {endRow} trong tổng số {rows.length} tác vụ</span>
          <SimplePagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>

      <div className="appraisal-bottom-grid">
        <article className="appraisal-stat-card">
          <div>
            <span className="icon-badge soft-red">
              <ClipboardList size={20} />
            </span>
            <strong>↗ 12%</strong>
          </div>
          <span className="eyebrow">Chờ thẩm định</span>
          <b>08</b>
        </article>
        <article className="appraisal-stat-card">
          <div>
            <span className="icon-badge blue">
              <Settings size={20} />
            </span>
            <strong className="green-text">⌁ 4%</strong>
          </div>
          <span className="eyebrow">Chờ duyệt</span>
          <b>04</b>
        </article>
        <article className="appraisal-stat-card blue-card">
          <span className="eyebrow">Hiệu suất trung bình</span>
          <b>2.4 giờ</b>
          <p>Thời gian phản hồi SLA đang được tối ưu hóa.</p>
        </article>
        <section className="panel recent-activity-card">
          <h3>
            <Clock3 size={21} />
            Hoạt động gần đây
          </h3>
          {[
            ["Trần Văn A vừa cập nhật file Forecast_MT_T07_2026_v2.xlsx", "10 phút trước"],
            ["Bạn đã thẩm định Task \"Kênh TMĐT T07\"", "2 giờ trước"],
            ["Hệ thống tự động nhắc nhở Task \"Kênh GT\" quá hạn", "Hôm qua"],
          ].map((item, index) => (
            <article className="activity-item" key={item[0]}>
              <i className={index === 0 ? "active" : ""} />
              <div>
                <strong>{item[0]}</strong>
                <small>{item[1]}</small>
              </div>
            </article>
          ))}
          <button className="floating-create appraisal-add" title="Thêm">
            <Plus size={30} />
          </button>
        </section>
      </div>
    </section>
  );
}

function AppraisalDetail({ forecast, tasks = [], onSubmit, onBack }) {
  const [decision, setDecision] = useState("approve");
  const displayForecast = forecast || initialForecasts[0];
  const sourceTask = tasks.find((task) => task.file) || tasks[0] || initialTasks[0];

  return (
    <section className="appraisal-detail-layout">
      <div className="appraisal-detail-main">
        <div className="breadcrumb">
          <button>Forecast Management</button>
          <ChevronRight size={15} />
          <button>Quy trình Phê duyệt</button>
          <ChevronRight size={15} />
          <strong>Chi tiết thẩm định task</strong>
        </div>

        <section className="panel appraisal-hero-card">
          <span className={`status-badge ${getStatusTone(displayForecast.status)}`}>{displayForecast.status}</span>
          <h2>Thẩm định {displayForecast.title}</h2>
          <div className="sla-countdown">
            <span>SLA còn lại</span>
            <strong>04:22:09</strong>
          </div>
          <div className="appraisal-hero-meta">
            <div>
              <span className="eyebrow">Người thẩm định</span>
              <strong>Nguyễn Tú Anh</strong>
            </div>
            <div>
              <span className="eyebrow">Bộ phận</span>
              <strong>BP. Cung ứng</strong>
            </div>
            <div>
              <span className="eyebrow">Hạn chót</span>
              <strong>20/07/2026 - 17:00</strong>
            </div>
            <div>
              <span className="eyebrow">Độ ưu tiên</span>
              <strong className="danger-text">Cao</strong>
            </div>
          </div>
        </section>

        <section className="panel forecast-data-card">
          <div className="panel-title-row">
            <h3>Dữ liệu Forecast kênh</h3>
            <div className="action-row">
              <button className="secondary-button">
                <Eye size={18} />
                Xem trước
              </button>
              <button className="primary-button">
                <Download size={18} />
                Tải file
              </button>
            </div>
          </div>
          <div className="forecast-file-box">
            <span className="file-icon green">
              <FileText size={26} />
            </span>
            <div>
              <strong>{sourceTask.file || displayForecast.template}</strong>
              <p>Dung lượng: {sourceTask.fileSize || "4.2 MB"} • Cập nhật trong mock workflow</p>
              <div className="forecast-values">
                <div>
                  <span>Tổng doanh thu dự kiến</span>
              <strong>1,450,000,000đ</strong>
                </div>
                <div>
                  <span>Số lượng SKUs</span>
                  <strong>152</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel department-status-card">
          <h3>Trạng thái thẩm định các bộ phận</h3>
          <div className="department-grid">
            {[
              ["BP. Cung ứng", "Đã hoàn thành", "success"],
              ["BP. BI/Data", "Đã hoàn thành", "success"],
              ["BP. Nhà máy", "Đang chờ", "warning"],
              ["BP. Tài chính", "Đang chờ", "warning"],
            ].map((item) => (
              <article className="department-card" key={item[0]}>
                <CheckCircle2 size={20} />
                <div>
                  <strong>{item[0]}</strong>
                  <small className={item[2]}>{item[1]}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel approval-result-card appraisal-decision-card">
          <h3>Kết quả thẩm định</h3>
          <span className="approval-section-label">Quyết định</span>
          <div className="decision-toggle">
            <button className={decision === "approve" ? "active" : ""} onClick={() => setDecision("approve")}>
              <CheckCircle2 size={20} />
              Phê duyệt
            </button>
            <button className={decision === "reject" ? "active" : ""} onClick={() => setDecision("reject")}>
              <X size={20} />
              Từ chối
            </button>
          </div>
          <label className="approval-note">
            <span>Lý do / Ghi chú</span>
            <textarea placeholder="Nhập ý kiến thẩm định hoặc lý do từ chối..." />
          </label>
          <div className="approval-attachment">
            <span>Tài liệu đính kèm (nếu có)</span>
            <div className="small-drop-zone appraisal-drop-zone">
              <UploadCloud size={34} />
              <strong>Kéo và thả file tại đây</strong>
              <small>Hỗ trợ PDF, XLSX, JPG (Tối đa 10MB)</small>
              <button>Hoặc chọn từ máy tính</button>
            </div>
          </div>
        </section>

        <div className="approval-fixed-actions appraisal-submit-row">
          <button className="secondary-button" onClick={onBack}>
            <ArrowLeft size={18} />
            Quay lại
          </button>
          <button className="primary-button submit-appraisal-button" onClick={() => onSubmit(displayForecast.id, decision === "approve")}>
            Gửi kết quả thẩm định
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <aside className="panel appraisal-timeline-card">
        <h3>
          <Clock3 size={21} />
          Lịch sử tác vụ
        </h3>
        {[
          ["Kênh TMĐT đã gửi Forecast", "Người thực hiện: Lê Văn Hùng", "20/07/2026 - 09:45:12", "blue"],
          ["Hệ thống gán người thẩm định", "Tự động điều phối theo cấu hình KD01", "20/07/2026 - 09:46:00", "slate"],
          ["Bắt đầu xem xét dữ liệu", "Người thực hiện: Nguyễn Tú Anh", "20/07/2026 - 14:20:05", "yellow"],
          ["Đang xử lý thẩm định...", "Trạng thái hiện tại", "", "muted"],
        ].map((item) => (
          <article className={`timeline-row ${item[3]}`} key={item[0]}>
            <i />
            <strong>{item[0]}</strong>
            <span>{item[1]}</span>
            {item[2] && <small>{item[2]}</small>}
          </article>
        ))}
        <div className="timeline-note">
          Tác vụ này yêu cầu phê duyệt đúng hạn để kịp thời gian triển khai kế hoạch nhập hàng tháng tới.
        </div>
      </aside>
    </section>
  );
}

function ApprovalList({ onOpen, forecasts = initialForecasts, tasks = initialTasks }) {
  const defaultForecast =
    forecasts.find((forecast) => ["Chờ CEO duyệt", "Phát hành"].includes(forecast.status)) ||
    forecasts[0];
  const [selectedForecastId, setSelectedForecastId] = useState(defaultForecast?.id || "");
  const [quickFilter, setQuickFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const selectedForecast =
    forecasts.find((forecast) => forecast.id === selectedForecastId) || defaultForecast;
  const forecastTasks = tasks.filter((task) => task.forecastId === selectedForecast?.id);

  const allRows = forecastTasks.map((task) => {
    const status =
      selectedForecast?.status === "Phát hành"
        ? "Đã phê duyệt"
        : selectedForecast?.status === "CEO không duyệt"
          ? "Trả lại"
          : "Chờ phê duyệt";

    return {
      forecastId: selectedForecast?.id,
      taskId: task.id,
      channel: task.channel,
      month: selectedForecast?.month || task.deadline,
      sender: "Phòng Kế hoạch",
      sentAt: task.file ? "Vừa xong" : "Chưa gửi",
      file: task.file || task.template || selectedForecast?.template || "Chưa có file",
      status,
      statusTone:
        status === "Đã phê duyệt"
          ? "success"
          : status === "Trả lại"
            ? "danger"
            : "warning",
      icon: task.icon || CheckCircle2,
      iconTone: task.iconTone || "purple",
    };
  });

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const rows = allRows
    .filter((row) => {
      if (quickFilter === "pending") return row.status === "Chờ phê duyệt";
      if (quickFilter === "approved") return row.status === "Đã phê duyệt";
      return true;
    })
    .filter((row) => {
      if (!normalizedSearch) return true;
      return [row.channel, row.sender, row.file, row.month]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  const rowsPerPage = 6;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const currentPage = Math.min(page, totalPages || 1);
  const pagedRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const startRow = rows.length ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = Math.min(currentPage * rowsPerPage, rows.length);

  return (
    <section className="page-flow appraisal-page">
      <div className="breadcrumb appraisal-breadcrumb">
        <button>Forecast Management</button>
        <ChevronRight size={15} />
        <strong>Thẩm định & Phê duyệt</strong>
      </div>

      <div className="page-heading with-actions">
        <div>
          <h2>Phê duyệt</h2>
          <p>Xem các file đã qua thẩm định và chờ quyết định phê duyệt cuối.</p>
        </div>
        <button className="primary-button">
          <Download size={18} />
          Xuất báo cáo
        </button>
      </div>

      <section className="panel appraisal-table-panel">
        <div className="appraisal-toolbar approval-toolbar">
          <div className="segmented-tabs approval-tabs">
            <button className={quickFilter === "all" ? "active" : ""} onClick={() => { setQuickFilter("all"); setPage(1); }}>Tất cả</button>
            <button className={quickFilter === "pending" ? "active" : ""} onClick={() => { setQuickFilter("pending"); setPage(1); }}>Chờ phê duyệt</button>
            <button className={quickFilter === "approved" ? "active" : ""} onClick={() => { setQuickFilter("approved"); setPage(1); }}>Đã phê duyệt</button>
          </div>
          <CustomSelect
            className="month-select forecast-month-select"
            value={selectedForecast?.id || ""}
            options={forecasts.map((forecast) => ({ value: forecast.id, label: forecast.month }))}
            onChange={(forecastId) => {
              setSelectedForecastId(forecastId);
              setPage(1);
            }}
          />
          <label className="appraisal-search">
            <Search size={19} />
            <input
              placeholder="Tìm kiếm kênh hoặc tên task..."
              value={searchTerm}
              onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }}
            />
          </label>
        </div>

        <div className="appraisal-table">
          <div className="appraisal-head">
            <span>Tên kênh</span>
            <span>Tháng thẩm định</span>
            <span>Người gửi</span>
            <span>Thời gian gửi</span>
            <span>Trạng thái</span>
            <span>Tài liệu</span>
            <span>Thao tác</span>
          </div>
          {pagedRows.map((row) => {
            const Icon = row.icon;
            return (
              <article className="appraisal-row" key={row.taskId}>
                <div className="appraisal-channel">
                  <span className={`task-icon ${row.iconTone}`}>
                    <Icon size={19} />
                  </span>
                  <strong>{row.channel}</strong>
                </div>
                <button className="appraisal-month" onClick={() => onOpen(row.forecastId)}>{row.month}</button>
                <span>{row.sender}</span>
                <span className="sent-at">
                  <Clock3 size={14} />
                  {row.sentAt}
                </span>
                <span><Badge tone={row.statusTone}>{row.status}</Badge></span>
                <span className="file-link">
                  <FileText size={16} />
                  <span className="file-link-text">{row.file}</span>
                </span>
                <span className="row-tools">
                  <button className="icon-button table-action" title={row.status === "Đã phê duyệt" ? "Đã duyệt" : "Phê duyệt"} onClick={() => onOpen(row.forecastId)}>
                    {row.status === "Đã phê duyệt" ? <SquarePen size={20} /> : <CheckCircle2 size={20} />}
                  </button>
                  <button className="icon-button table-action" title="Xem" onClick={() => onOpen(row.forecastId)}>
                    <Eye size={20} />
                  </button>
                </span>
              </article>
            );
          })}
          {!rows.length && (
            <div className="appraisal-empty-row">
              Chưa có kênh phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
        <div className="table-footer">
          <span>Hiển thị {startRow} - {endRow} trong tổng số {rows.length} tác vụ</span>
          <SimplePagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>

      <div className="appraisal-bottom-grid">
        <article className="appraisal-stat-card">
          <div>
            <span className="icon-badge soft-red">
              <ClipboardList size={20} />
            </span>
            <strong>↗ 12%</strong>
          </div>
          <span className="eyebrow">Chờ phê duyệt</span>
          <b>04</b>
        </article>
        <article className="appraisal-stat-card">
          <div>
            <span className="icon-badge blue">
              <Settings size={20} />
            </span>
            <strong className="green-text">⌁ 4%</strong>
          </div>
          <span className="eyebrow">Đã phát hành</span>
          <b>07</b>
        </article>
        <article className="appraisal-stat-card blue-card">
          <span className="eyebrow">Hiệu suất trung bình</span>
          <b>2.4 giờ</b>
          <p>Thời gian phản hồi SLA đang được tối ưu hóa.</p>
        </article>
        <section className="panel recent-activity-card">
          <h3>
            <Clock3 size={21} />
            Hoạt động gần đây
          </h3>
          {[
            ["Trần Văn A vừa gửi file Forecast_MT_T07_2026_v2.xlsx lên duyệt", "10 phút trước"],
            ["CEO đã phê duyệt Task \"Kênh MT T07\"", "2 giờ trước"],
            ["Hệ thống tự động nhắc nhở Task \"Kênh GT\" quá hạn", "Hôm qua"],
          ].map((item, index) => (
            <article className="activity-item" key={item[0]}>
              <i className={index === 0 ? "active" : ""} />
              <div>
                <strong>{item[0]}</strong>
                <small>{item[1]}</small>
              </div>
            </article>
          ))}
          <button className="floating-create appraisal-add" title="Thêm">
            <Plus size={30} />
          </button>
        </section>
      </div>
    </section>
  );
}

function ApprovalDetail({ forecast, tasks = [], onSubmit, onBack }) {
  const [decision, setDecision] = useState("approve");
  const displayForecast = forecast || initialForecasts[0];
  const sourceTask = tasks.find((task) => task.file) || tasks[0] || initialTasks[0];

  return (
    <section className="appraisal-detail-layout approval-detail-layout">
      <div className="appraisal-detail-main">
        <div className="breadcrumb">
          <button>Forecast Management</button>
          <ChevronRight size={15} />
          <button>Quy trình Phê duyệt</button>
          <ChevronRight size={15} />
          <strong>Chi tiết phê duyệt task</strong>
        </div>

        <section className="panel appraisal-hero-card">
          <span className={`status-badge ${getStatusTone(displayForecast.status)}`}>{displayForecast.status}</span>
          <h2>Phê duyệt {displayForecast.title}</h2>
          <div className="sla-countdown">
            <span>SLA còn lại</span>
            <strong>04:22:09</strong>
          </div>
          <div className="appraisal-hero-meta">
            <div>
              <span className="eyebrow">Người phê duyệt</span>
              <strong>Phạm Thu Hiền</strong>
            </div>
            <div>
              <span className="eyebrow">Bộ phận</span>
              <strong>CEO</strong>
            </div>
            <div>
              <span className="eyebrow">Hạn chót</span>
              <strong>22/07/2026 - 17:00</strong>
            </div>
            <div>
              <span className="eyebrow">Độ ưu tiên</span>
              <strong className="danger-text">Cao</strong>
            </div>
          </div>
        </section>

        <section className="panel forecast-data-card">
          <div className="panel-title-row">
            <h3>Dữ liệu Forecast kênh</h3>
            <div className="action-row">
              <button className="secondary-button">
                <Eye size={18} />
                Xem trước
              </button>
              <button className="primary-button">
                <Download size={18} />
                Tải file
              </button>
            </div>
          </div>
          <div className="forecast-file-box">
            <span className="file-icon green">
              <FileText size={26} />
            </span>
            <div>
              <strong>{sourceTask.file || displayForecast.template}</strong>
              <p>Dung lượng: {sourceTask.fileSize || "5.6 MB"} • Hồ sơ đã hoàn tất thẩm định</p>
              <div className="forecast-values">
                <div>
                  <span>Tổng doanh thu dự kiến</span>
                  <strong>1,450,000,000đ</strong>
                </div>
                <div>
                  <span>Số lượng SKUs</span>
                  <strong>152</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel department-status-card">
          <h3>Trạng thái thẩm định các bộ phận</h3>
          <div className="department-grid">
            {[
              ["BP. Cung ứng", "Đã hoàn thành", "success"],
              ["BP. BI/Data", "Đã hoàn thành", "success"],
              ["BP. Nhà máy", "Đã hoàn thành", "success"],
              ["CEO", "Đang chờ", "warning"],
            ].map((item) => (
              <article className="department-card" key={item[0]}>
                <CheckCircle2 size={20} />
                <div>
                  <strong>{item[0]}</strong>
                  <small className={item[2]}>{item[1]}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel approval-result-card">
          <h3>Kết quả phê duyệt</h3>
          <span className="approval-section-label">Quyết định</span>
          <div className="decision-toggle">
            <button className={decision === "approve" ? "active" : ""} onClick={() => setDecision("approve")}>
              <CheckCircle2 size={20} />
              Phê duyệt
            </button>
            <button className={decision === "reject" ? "active" : ""} onClick={() => setDecision("reject")}>
              <X size={20} />
              Từ chối
            </button>
          </div>
          <label className="approval-note">
            <span>Lý do / Ghi chú</span>
            <textarea placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối..." />
          </label>
          <div className="approval-attachment">
            <span>Tài liệu đính kèm (nếu có)</span>
            <div className="small-drop-zone">
              <UploadCloud size={34} />
              <strong>Kéo và thả file tại đây</strong>
              <small>Hỗ trợ PDF, XLSX, JPG (Tối đa 10MB)</small>
              <button>Hoặc chọn từ máy tính</button>
            </div>
          </div>
        </section>

        <div className="approval-fixed-actions">
          <button className="secondary-button" onClick={onBack}>
            <ArrowLeft size={18} />
            Quay lại
          </button>
          <button className="approve-button" onClick={() => onSubmit(displayForecast.id, decision === "approve")}>
            {decision === "approve" ? "Duyệt" : "Từ chối"}
            <CheckCircle2 size={18} />
          </button>
        </div>
      </div>

      <aside className="panel appraisal-timeline-card">
        <h3>
          <Clock3 size={21} />
          Lịch sử tác vụ
        </h3>
        {[
          ["Kênh TMĐT đã gửi Forecast", "Người thực hiện: Lê Văn Hùng", "20/07/2026 - 09:45:12", "blue"],
          ["Hệ thống gán người thẩm định", "Tự động điều phối theo cấu hình KD01", "20/07/2026 - 09:46:00", "slate"],
          ["Hoàn tất thẩm định", "Người thực hiện: Nguyễn Tú Anh", "21/07/2026 - 14:20:05", "yellow"],
          ["Hệ thống gán người phê duyệt", "Tự động chuyển sang CEO phê duyệt cuối", "21/07/2026 - 14:22:00", "slate"],
          ["Đang xử lý Phê duyệt", "Trạng thái hiện tại", "", "muted"],
        ].map((item) => (
          <article className={`timeline-row ${item[3]}`} key={item[0]}>
            <i />
            <strong>{item[0]}</strong>
            <span>{item[1]}</span>
            {item[2] && <small>{item[2]}</small>}
          </article>
        ))}
        <div className="timeline-note">
          Tác vụ này yêu cầu phê duyệt đúng hạn để kịp thời gian triển khai kế hoạch nhập hàng tháng tới.
        </div>
      </aside>
    </section>
  );
}

function SystemSwitcher({ active, onUsers, onPermissions, onChannelConfig, onApprovalConfig, onSlaConfig }) {
  return null;
}

function RoleCreateModal({ role, setRole, onClose, onSubmit }) {
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

function UserAccountModal({ mode, user, roles, onChange, onClose, onSave }) {
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

function ConfirmDialog({ title, body, confirmLabel, onCancel, onConfirm }) {
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

function AddRoleUsersModal({ role, users, onClose, onSave }) {
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

function SystemUsers({
  onPermissions,
  onChannelConfig,
  onApprovalConfig,
  onSlaConfig,
  roleCount = roleDefinitions.length,
  roles = roleDefinitions,
  users = adminUsers,
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
      await apiRequest("/api/admin/users", {
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

function SystemPermissions({
  onUsers,
  onChannelConfig,
  onApprovalConfig,
  onSlaConfig,
  permissionDrafts,
  setPermissionDrafts,
  onPreviewRole,
  roles = roleDefinitions,
  setRoles,
  users = adminUsers,
  setUsers,
  permissionMatrix: activePermissionMatrix = permissionMatrix,
  permissionActivityLog: activePermissionActivityLog = permissionActivityLog,
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
  const selectedRole = roles.find((role) => role.id === selectedRoleId) || roles[0];
  const selectedPermissions = permissionDrafts[selectedRole.id] || {};
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
      await apiRequest("/api/admin/role-permissions", {
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
      const payload = await apiRequest("/api/admin/roles", {
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
          [id]: activePermissionMatrix.reduce((acc, row) => ({ ...acc, [row.module]: "view" }), {}),
        }));
      }
    } catch (error) {
      showToast?.(`Không tạo được vai trò: ${error.message}`);
    }
  };
  const deleteRole = async (roleId) => {
    if (roleId === "admin" || !setRoles) return;
    try {
      await apiRequest("/api/admin/roles", {
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
      await apiRequest("/api/admin/role-users", {
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
        <AdminMetric label="Vai trò" value={roles.length} hint="Nhóm quyền" icon={Lock} tone="blue" />
        <AdminMetric label="Nhân sự" value={users.length} hint="Đang quản lý" icon={Users} tone="green" />
        <AdminMetric label="Phạm vi" value="8" hint="Lớp dữ liệu KD01" icon={Settings} tone="cyan" />
        <AdminMetric label="Rủi ro" value="4" hint="Role nhạy cảm" icon={AlertTriangle} tone="orange" />
      </div>

      <div className="permission-layout">
        <section className="panel role-list-panel">
          <div className="panel-title-row">
            <h3>Vai trò</h3>
          </div>
          {roles.map((role) => (
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
            {activePermissionMatrix.map((row) => {
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

function AdminMetric({ label, value, hint, icon: Icon, tone }) {
  return (
    <article className="admin-metric-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
      <i className={tone}>
        <Icon size={22} />
      </i>
    </article>
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

function ChannelFrameworkConfig({ onUsers, onPermissions, onApprovalConfig, onSlaConfig, channelRows: rows = channelRows, users = adminUsers, onDataSaved, showToast }) {
  const [channelModal, setChannelModal] = useState(null);
  const [confirmDeleteChannel, setConfirmDeleteChannel] = useState(null);
  const activeChannelCount = rows.length;
  const rsmCount = new Set(rows.map((row) => row.rsm)).size;
  const asmCount = rows.reduce((sum, row) => sum + row.asms.length, 0);
  const saveChannel = async (channel) => {
    try {
      await apiRequest("/api/admin/channels", {
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
      await apiRequest("/api/admin/channels", {
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

function ApprovalWorkflowConfig({ onUsers, onPermissions, onChannelConfig, onSlaConfig }) {
  const [finalApprover, setFinalApprover] = useState("CEO");

  return (
    <section className="page-flow workflow-config-page">
      <SystemSwitcher active="workflow" onUsers={onUsers} onPermissions={onPermissions} onChannelConfig={onChannelConfig} onSlaConfig={onSlaConfig} />

      <div className="page-heading with-actions workflow-heading">
        <div>
          <div className="breadcrumb">
            <button>Quản lý hệ thống</button>
            <ChevronRight size={15} />
            <strong>Cấu hình Quy trình Phê duyệt</strong>
          </div>
          <h2>Cấu hình Quy trình Phê duyệt</h2>
          <p>Thiết lập các bước thẩm định song song và phê duyệt cuối cho Forecast KD01.</p>
        </div>
        <div className="action-row">
          <button className="secondary-button">Hủy</button>
          <button className="primary-button">
            <Save size={18} />
            Lưu cấu hình
          </button>
        </div>
      </div>

      <div className="workflow-grid">
        <section className="panel workflow-step-card">
          <div className="workflow-step-title">
            <span>1</span>
            <h3>Bước 1: Thẩm định song song</h3>
          </div>

          <WorkflowRoleCard role="BP. Cung ứng" sla="24" priority="Trung bình" />
          <WorkflowRoleCard role="BP. BI & Data" sla="12" priority="Cao" />
          <WorkflowRoleCard role="BP. Nhà máy" sla="24" priority="Trung bình" />
          <WorkflowRoleCard role="BP. Tài chính" sla="24" priority="Trung bình" />

          <button className="add-role-button">
            <Plus size={21} />
            Thêm vai trò thẩm định
          </button>

          <div className="monthly-deadline-box muted">
            <Circle size={18} />
            <div>
              <strong>Hạn định cố định hàng tháng</strong>
                <p>Kết thúc trước ngày <input value="20" readOnly /> hàng tháng</p>
            </div>
          </div>
        </section>

        <aside className="workflow-side">
          <section className="panel workflow-final-card">
            <div className="workflow-step-title green">
              <span>2</span>
              <h3>Bước 2: Phê duyệt cuối cùng</h3>
            </div>
            <label className="workflow-field full">
              <span>Người quyết định cuối cùng</span>
              <CustomSelect value={finalApprover} options={["CEO", "COO"]} onChange={setFinalApprover} />
            </label>
            <div className="workflow-two-cols">
              <label className="workflow-field">
                <span>SLA phê duyệt (giờ)</span>
                <input value="48" readOnly />
              </label>
              <div className="workflow-priority">
                <span>Loại ưu tiên</span>
                <strong>Urgent</strong>
              </div>
            </div>
            <div className="monthly-deadline-box active">
              <Circle size={18} />
              <div>
                <strong>Hạn định cố định hàng tháng</strong>
                <p>Hoàn tất trước ngày <input value="22" readOnly /> hàng tháng</p>
              </div>
            </div>
          </section>

          <section className="panel workflow-logic-card">
            <h3>LOGIC & ĐIỀU KIỆN</h3>
            <div className="logic-toggle-row">
              <div>
                <strong>Yêu cầu tất cả thẩm định</strong>
                <p>Tất cả các bộ phận ở Bước 1 phải hoàn tất thẩm định trước khi chuyển sang Bước 2.</p>
              </div>
              <button className="switch-toggle active" aria-label="Bật yêu cầu tất cả thẩm định" />
            </div>
            <div className="logic-info-box">
              <Info size={19} />
              <p>Khi SLA thẩm định vượt quá 100%, hệ thống sẽ tự động nhắc nhở qua Lark và email của người phụ trách.</p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function SlaConfig({ onUsers, onPermissions, onChannelConfig, onApprovalConfig }) {
  return (
    <section className="page-flow sla-config-page">
      <SystemSwitcher active="sla" onUsers={onUsers} onPermissions={onPermissions} onChannelConfig={onChannelConfig} onApprovalConfig={onApprovalConfig} />

      <div className="page-heading with-actions sla-heading">
        <div>
          <h2>Cấu hình SLA</h2>
          <p>Thiết lập thời gian phản hồi cho các mốc nộp file, thẩm định và phê duyệt trong quy trình Forecast KD01.</p>
        </div>
        <div className="action-row">
          <button className="secondary-button">Hủy</button>
          <button className="primary-button">
            <Save size={18} />
            Lưu cấu hình
          </button>
        </div>
      </div>

      <div className="sla-grid">
        <SlaStageCard
          tone="blue"
          icon={ClipboardList}
          title="SLA Thẩm định"
          badge="GIAI ĐOẠN 1"
          description="Áp dụng cho các bước rà soát file forecast từ kênh, kiểm tra logic dữ liệu và đối chiếu năng lực cung ứng."
          dayValue="2"
          monthlyValue="20"
          firstActive
          roles={["BP. Cung ứng", "BP. BI/Data", "BP. Nhà máy", "BP. Tài chính"]}
        />
        <div className="sla-right-column">
          <SlaStageCard
            tone="green"
            icon={Settings}
            title="SLA Phê duyệt"
            badge="GIAI ĐOẠN 2"
            description="Áp dụng cho bước CEO/Ban Giám đốc xác nhận bản forecast chính thức trước khi phát hành."
            dayValue="2"
            monthlyValue="22"
            roles={["CEO / Ban Giám đốc", "Admin vận hành"]}
          />
          <article className="sla-warning-card">
            <AlertTriangle size={24} />
            <div>
              <strong>Lưu ý quan trọng</strong>
              <p>Việc rút ngắn SLA phê duyệt xuống dưới 2 ngày có thể khiến các bộ phận chưa đủ thời gian rà soát file điều chỉnh. Hệ thống sẽ tự động gửi nhắc nhở 24h trước khi hết hạn.</p>
            </div>
          </article>
        </div>
      </div>

      <div className="sla-footer-card">
        <div className="avatar-stack compact">
          <span>VA</span>
          <span>TA</span>
          <span>+3</span>
        </div>
        <p>Sửa đổi lần cuối bởi Nguyễn Tú Anh vào 14:30, 24/06/2026</p>
        <strong><i />Trạng thái: Hoạt động</strong>
      </div>
      <footer className="sla-page-footer">ELMICH OPS © 2026 • FORECAST MANAGEMENT KD01</footer>
    </section>
  );
}

function SlaStageCard({ tone, icon: Icon, title, badge, description, dayValue, monthlyValue, firstActive, roles }) {
  return (
    <section className={`panel sla-stage-card ${tone}`}>
      <div className="sla-card-header">
        <span className={`sla-card-icon ${tone}`}>
          <Icon size={24} />
        </span>
        <h3>{title}</h3>
        <small>{badge}</small>
      </div>
      <p>{description}</p>
      <div className={`sla-option ${firstActive ? "active" : ""}`}>
        <Circle size={18} />
        <div>
          <strong>Theo số ngày làm việc</strong>
          <p><input value={dayValue} readOnly /> ngày làm việc kể từ khi nhận file/task</p>
        </div>
      </div>
      <div className={`sla-option ${firstActive ? "" : "active"}`}>
        <Circle size={18} />
        <div>
          <strong>Hạn định cố định hàng tháng</strong>
          <p>{firstActive ? "Kết thúc vào ngày" : "Hoàn tất trước ngày"} <input value={monthlyValue} readOnly /> hàng tháng</p>
        </div>
      </div>
      <div className="sla-role-section">
        <span>Vai trò áp dụng</span>
        <div>
          {roles.map((role, index) => (
            <small key={role}>
              {index === 0 ? <Users size={13} /> : <Building2 size={13} />}
              {role}
            </small>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowRoleCard({ role, sla, priority }) {
  const [selectedRole, setSelectedRole] = useState(role);
  const [selectedPriority, setSelectedPriority] = useState(priority);

  return (
    <article className="workflow-role-card">
      <div className="workflow-role-grid">
        <label className="workflow-field">
          <span>Vai trò thẩm định</span>
          <CustomSelect
            value={selectedRole}
            options={[role, "BP. Nhà máy", "BP. Tài chính"]}
            onChange={setSelectedRole}
          />
        </label>
        <label className="workflow-field">
          <span>SLA (giờ)</span>
          <input value={sla} readOnly />
        </label>
      </div>
      <label className="workflow-field priority-select">
        <span>Ưu tiên</span>
        <CustomSelect value={selectedPriority} options={["Trung bình", "Cao", "Thấp"]} onChange={setSelectedPriority} />
      </label>
    </article>
  );
}

function StoragePage({ level, onOpenFolder, onOpenFile, forecasts = initialForecasts, files = initialPublishedFiles }) {
  const isFolder = level === "folder";
  const publishedForecasts = forecasts.filter((forecast) => forecast.status === "Phát hành");
  const rows = isFolder
    ? files.map((file) => [file.name, `${file.channel} • ${file.version}`, file.modified, file.size, file.id])
    : publishedForecasts.map((forecast) => [
        forecast.month,
        `Thư mục • ${files.filter((file) => file.forecastId === forecast.id).length || 1} tệp tin`,
        forecast.deadline,
        "--",
        forecast.id,
      ]);

  return (
    <section className="page-flow storage-page">
      <div className="storage-breadcrumb-row">
        <div className="breadcrumb">
          <button>⌂ Kho lưu trữ</button>
          <ChevronRight size={15} />
          <button>Bản Forecast chính thức</button>
          {isFolder && (
            <>
              <ChevronRight size={15} />
              <strong>T07.2026</strong>
            </>
          )}
        </div>
        <div className="action-row">
          <button className="secondary-button">
            <Filter size={18} />
            Phân loại
          </button>
          <button className="primary-button">
            <Download size={18} />
            Tải toàn bộ (.zip)
          </button>
        </div>
      </div>

      <div className="storage-top-grid">
        <button type="button" className="storage-folder-card" onClick={onOpenFolder}>
          <span className="folder-tile orange">
            <Folder size={24} />
          </span>
          <span className="pin-button" title="Ghim" aria-hidden="true">⌖</span>
          <strong>Forecast T07/2026</strong>
          <small>12 files • Cập nhật sau phê duyệt</small>
        </button>
        <article className="storage-folder-card">
          <span className="folder-tile blue">
            <Folder size={24} />
          </span>
          <button className="pin-button" title="Tùy chọn">
            <MoreVertical size={18} />
          </button>
          <strong>Lưu trữ Forecast 2026</strong>
          <small>48 files • 1.2 GB</small>
        </article>
        <article className="storage-usage-card">
          <div>
            <strong>Dung lượng kho lưu trữ</strong>
            <small>Đã dùng 45.2 GB trên 100 GB</small>
          </div>
          <Cloud size={24} />
          <i><span /></i>
        </article>
      </div>

      <section className="panel storage-list-panel">
        <div className="storage-list-title">
          <h3>
            <FolderOpen size={22} />
            Danh sách tệp tin
          </h3>
          <div className="storage-view-icons">
            <LayoutDashboard size={20} />
            <button>
              <ClipboardList size={20} />
            </button>
          </div>
        </div>
        <div className="storage-table">
          <div className="storage-head">
            <span>Tên tệp</span>
            <span>Ngày sửa đổi</span>
            <span>Kích thước</span>
          </div>
          {rows.map((row, index) => (
            <button
              className="storage-row"
              key={row[0]}
              onClick={() => (isFolder ? onOpenFile(row[4]) : onOpenFolder(row[4]))}
            >
              <span className="storage-name">
                <Folder size={22} />
                <span>
                  <strong>{row[0]}</strong>
                  <small>{row[1]}</small>
                </span>
              </span>
              <span className="mono-date">{row[2]}</span>
              <span>{row[3]}</span>
            </button>
          ))}
        </div>
        <div className="table-footer">
          <span>Hiển thị 1 - 4 trong tổng số 15 mục</span>
          <div className="pagination">
            <button className="ghost-page">‹</button>
            <button className="current">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>
      </section>
    </section>
  );
}

function StorageFileDetail({ file, forecast }) {
  const displayFile = file || initialPublishedFiles[0];
  const displayForecast = forecast || initialForecasts.find((item) => item.id === displayFile?.forecastId) || initialForecasts[0];

  return (
    <section className="storage-file-layout">
      <div className="storage-file-main">
        <section className="panel file-hero-card">
          <span className="file-icon green large-file-icon">
            <FileText size={36} />
          </span>
          <div className="file-hero-content">
            <div className="file-title-line">
              <h2>{displayFile?.name}</h2>
              <button className="primary-button">
                <Download size={18} />
                Tải xuống
              </button>
              <button className="secondary-button">
                <Eye size={18} />
                Xem trước
              </button>
            </div>
            <div className="file-published-row">
              <span className="status-badge success">Đã phát hành</span>
              <p>Cập nhật {displayFile?.modified} bởi <strong>{displayFile?.owner}</strong></p>
            </div>
            <div className="file-meta-grid">
              <div>
                <span className="eyebrow">Loại file</span>
                <strong>Microsoft Excel (.xlsx)</strong>
              </div>
              <div>
                <span className="eyebrow">Dung lượng</span>
                <strong>{displayFile?.size}</strong>
              </div>
              <div>
                <span className="eyebrow">Vị trí lưu</span>
                <strong>Forecast / {displayForecast?.monthShort} / {displayFile?.channel}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="panel version-card">
          <div className="panel-title-row">
            <h3>Lịch sử phiên bản</h3>
            <button>So sánh phiên bản</button>
          </div>
          <div className="version-table">
            <div className="version-head">
              <span>Phiên bản</span>
              <span>Thời gian</span>
              <span>Người cập nhật</span>
              <span>Nội dung thay đổi</span>
              <span>Thao tác</span>
            </div>
            {[
              [`${displayFile?.version || "v1.0"} (Hiện tại)`, displayFile?.modified || "29/06/2026 16:30", displayFile?.owner || "Nguyễn Tú Anh", "Bản Forecast chính thức sau phê duyệt CEO.", "more"],
              ["v2.0", "21/07/2026 09:15", "Lê Văn Khoa", "Nộp bản tổng hợp sau thẩm định.", "restore"],
              ["v1.8", "20/07/2026 16:45", "Trần Mỹ Linh", "Cập nhật nhu cầu SKU nhóm Gia dụng.", "restore"],
            ].map((row) => (
              <article className="version-row" key={row[0]}>
                <strong>{row[0]}</strong>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
                <button className="icon-button table-action">
                  {row[4] === "more" ? <MoreVertical size={20} /> : <Clock3 size={20} />}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <aside className="storage-file-rail">
        <section className="panel linked-context-card">
          <h3>Liên kết nghiệp vụ</h3>
          <article>
            <span className="large-icon blue">
              <Calendar size={22} />
            </span>
            <div>
              <span className="eyebrow">Lịch Forecast</span>
              <strong>{displayForecast?.title}</strong>
            </div>
            <ChevronRight size={20} />
          </article>
          <article>
            <span className="large-icon green">
              <CheckCircle2 size={22} />
            </span>
            <div>
              <span className="eyebrow">Task liên quan</span>
              <strong>{displayFile?.name}</strong>
            </div>
            <ChevronRight size={20} />
          </article>
        </section>
        <section className="panel file-stats-card">
          <h3>Thông số</h3>
          <span>Lượt tải xuống</span>
          <div>
            <strong>124</strong>
            <small>+12%<br />so với tháng trước</small>
          </div>
          <p>
            <Lock size={18} />
            Chỉ người có quyền được chỉnh sửa phiên bản đã phát hành.
          </p>
        </section>
      </aside>
    </section>
  );
}

function ForecastDetail({
  forecast,
  tasks = initialTasks,
  users = adminUsers,
  progress = 0,
  onOpenTask,
  onAssignTask,
  onOpenReport,
  onOpenAppraisal,
  onOpenApproval,
  onRsmApprove,
  onGdkdApprove,
  onSubmitAppraisal,
}) {
  const displayForecast = forecast || initialForecasts[0];
  const [assignTask, setAssignTask] = useState(null);
  const [taskSearch, setTaskSearch] = useState("");
  const allBusinessApproved = tasks.length > 0 && tasks.every((task) => task.status === "GĐKD đã duyệt");
  const doneCount = tasks.filter((task) => ["GĐKD đã duyệt", "Phát hành"].includes(task.status)).length;
  const waitingCount = tasks.filter((task) => ["Chờ RSM duyệt", "Chờ GĐKD duyệt"].includes(task.status)).length;
  const openCount = Math.max(0, tasks.length - doneCount - waitingCount);
  const assignableUsers = users.filter((user) => userHasRole(user, "asm") && user.status === "Active");
  const normalizedTaskSearch = normalizeSearchValue(taskSearch.trim());
  const visibleTasks = tasks.filter((task) => {
    if (!normalizedTaskSearch) return true;
    return normalizeSearchValue([
      task.channel,
      task.owner,
      task.ownerRole,
      task.status,
      task.deadline,
      task.file,
    ].join(" ")).includes(normalizedTaskSearch);
  });
  const handleApproveAction = (task) => {
    if (task.status === "Chờ RSM duyệt") {
      onRsmApprove(task.id);
      return;
    }
    if (task.status === "Chờ GĐKD duyệt") {
      onGdkdApprove(task.id);
      return;
    }
    onOpenApproval(task.id);
  };

  return (
    <section className="page-flow detail-page">
      <div className="detail-title-row">
        <div>
          <span className="detail-kicker">Chi tiết kế hoạch</span>
          <h2>Lịch Forecast KD01 - {displayForecast.month}</h2>
        </div>
        <div className="action-row">
          <button className="secondary-button">
            <Pencil size={18} />
            Chỉnh sửa
          </button>
          <button
            className="primary-button"
            disabled={!allBusinessApproved}
            onClick={() => onSubmitAppraisal(displayForecast.id)}
            title={allBusinessApproved ? "Trình thẩm định" : "Cần GĐKD duyệt 100% task trước"}
          >
            <Share2 size={18} />
            Tổng hợp
          </button>
        </div>
      </div>

      <section className="panel forecast-info-panel">
        <div className="panel-title-row">
          <h3>Thông tin tổng quan</h3>
          <span className="id-badge">ID: {displayForecast.id.toUpperCase()}</span>
        </div>
        <div className="forecast-info-grid">
          <div className="forecast-info-cell month-cell">
            <div className="label-row">
              <span className="eyebrow">Kỳ Forecast</span>
              <span className={`status-badge ${getStatusTone(displayForecast.status)}`}>{displayForecast.status}</span>
            </div>
            <strong>{displayForecast.month}</strong>
            <div className="divider-line" />
            <span className="eyebrow">Tiến độ hoàn thành</span>
            <div className="detail-progress">
              <i><span style={{ width: `${progress}%` }} /></i>
              <strong>{progress}%</strong>
            </div>
          </div>

          <div className="forecast-info-cell">
            <span className="eyebrow">Hạn chót phê duyệt tổng (Deadline)</span>
            <div className="deadline-summary">
              <span className="deadline-icon">
                <Calendar size={20} />
              </span>
              <div>
                <strong>{displayForecast.deadline}</strong>
                <small>Hạn CEO phê duyệt cuối</small>
              </div>
            </div>
          </div>

          <div className="forecast-info-cell note-cell">
            <span className="eyebrow">Ghi chú vận hành</span>
            <blockquote>{displayForecast.note}</blockquote>
          </div>
        </div>
      </section>

      <section className="panel detail-task-panel">
        <div className="panel-title-row detail-task-top">
          <h3>Danh sách Tasks theo Kênh</h3>
          <div className="detail-search-row">
            <label className="detail-search">
              <Search size={18} />
              <input
                value={taskSearch}
                onChange={(event) => setTaskSearch(event.target.value)}
                placeholder="Tìm kiếm kênh..."
              />
            </label>
            <button className="icon-button table-action" title="Lọc">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="detail-task-table">
          <div className="detail-task-head">
            <span>Tên kênh</span>
            <span>Hạn chót</span>
            <span>Tài liệu</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          {visibleTasks.map((row) => (
            <article className="detail-task-row" key={row.channel}>
              <div className="task-channel">
                <span className={`task-icon ${row.iconTone}`}>
                  <row.icon size={20} />
                </span>
                <div>
                  <strong>{row.channel}</strong>
                  <small>{row.owner}</small>
                </div>
              </div>
              <div className={row.danger ? "deadline-danger" : ""}>
                <span>{row.deadline}</span>
                {row.sla && <small>{row.sla}</small>}
              </div>
              <div>
                {row.file && (
                  <span className="file-pill">
                    <FileText size={14} />
                    {row.file}
                  </span>
                )}
                {!row.file && (
                  <button className="upload-pill" onClick={() => onOpenTask(row.id)}>
                    <Upload size={14} />
                    Tải lên
                  </button>
                )}
              </div>
              <span>
                <Badge tone={row.statusTone}>{row.status}</Badge>
              </span>
              <span className="detail-action-icons">
                <button className="icon-button table-action" title="Phân công ASM" onClick={() => setAssignTask(row)}>
                  <UserPlus size={18} />
                </button>
                <button className="icon-button table-action" title="Chỉnh sửa" onClick={() => onOpenTask(row.id)}>
                  <Pencil size={18} />
                </button>
                <button className="icon-button table-action" title="Báo cáo" onClick={() => onOpenReport(row.id)}>
                  <BarChart3 size={18} />
                </button>
                <button className="icon-button table-action" title="Thẩm định" onClick={() => onOpenAppraisal(row.id)}>
                  <Star size={18} />
                </button>
                <button className="icon-button table-action" title="Phê duyệt" onClick={() => handleApproveAction(row)}>
                  <CheckCircle2 size={18} />
                </button>
              </span>
            </article>
          ))}
          {!visibleTasks.length && (
            <div className="detail-empty-state">Không có task phù hợp với từ khóa hiện tại.</div>
          )}
        </div>

        <div className="detail-history-row">
          <em>Cập nhật lần cuối: 10 phút trước bởi Admin vận hành</em>
          <button>Xem tất cả lịch sử</button>
        </div>
      </section>

      <div className="detail-summary-strip">
        <article className="detail-summary-card green">
          <strong>{doneCount}</strong>
          <span>Kênh đã hoàn tất</span>
        </article>
        <article className="detail-summary-card yellow">
          <strong>{waitingCount}</strong>
          <span>Đang chờ duyệt</span>
        </article>
        <article className="detail-summary-card red">
          <strong>{openCount}</strong>
          <span>Cần xử lý lại</span>
        </article>
      </div>
      {assignTask && (
        <TaskAssignModal
          task={assignTask}
          users={assignableUsers.length ? assignableUsers : users.filter((user) => user.status === "Active")}
          onClose={() => setAssignTask(null)}
          onSave={(user) => {
            onAssignTask(assignTask.id, user);
            setAssignTask(null);
          }}
        />
      )}
    </section>
  );
}

function TaskAssignModal({ task, users, onClose, onSave }) {
  const [selectedUserId, setSelectedUserId] = useState(
    users.find((user) => user.name === task.owner)?.id || users[0]?.id || ""
  );
  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div className="modal-backdrop">
      <section className="admin-modal task-assign-modal" role="dialog" aria-modal="true" aria-label={`Phân công ${task.channel}`}>
        <header className="admin-modal-header">
          <div>
            <h3>Phân công ASM cho {task.channel}</h3>
            <p>RSM của kênh sẽ chọn ASM phụ trách cập nhật file Forecast.</p>
          </div>
          <button className="modal-close-button" type="button" onClick={onClose} title="Đóng">
            <X size={22} />
          </button>
        </header>
        <div className="admin-modal-body task-assign-body">
          <label>
            <span>ASM phụ trách</span>
            <CustomSelect
              value={selectedUserId}
              options={users.map((user) => ({ value: user.id, label: `${user.name} - ${user.scope}` }))}
              onChange={setSelectedUserId}
              placeholder="Chọn ASM"
            />
          </label>
          <article className="assign-preview-card">
            <span className={`mini-avatar ${selectedUser?.tone || "blue"}`}>{selectedUser?.initials || "ASM"}</span>
            <div>
              <strong>{selectedUser?.name || "Chưa chọn ASM"}</strong>
              <small>{selectedUser?.email || "Chọn người phụ trách trước khi lưu"}</small>
            </div>
            <b>{selectedUser?.title || "ASM phụ trách"}</b>
          </article>
          <p className="assign-helper-text">
            Sau khi lưu, task sẽ chuyển về trạng thái chờ ASM cập nhật file Forecast.
          </p>
        </div>
        <footer className="admin-modal-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Hủy</button>
          <button className="primary-button" type="button" disabled={!selectedUser} onClick={() => onSave(selectedUser)}>
            <UserPlus size={18} />
            Lưu phân công
          </button>
        </footer>
      </section>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value, tone }) {
  return (
    <article className="mini-metric">
      <span className={`large-icon ${tone}`}>
        <Icon size={24} />
      </span>
      <div>
        <span className="eyebrow">{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function TemplatePanel() {
  const files = [
    { icon: FileSpreadsheet, name: "Template_FC_KD01_T07_2026.xlsx", meta: "EXCEL • 1.2 MB", tone: "blue" },
    { icon: FileText, name: "Mapping_Channel_RSM_ASM.csv", meta: "CSV • 450 KB", tone: "green" },
    { icon: FileSpreadsheet, name: "Capacity_Check_NhaMay.xlsx", meta: "EXCEL • 2.5 MB", tone: "orange" },
  ];

  return (
    <section className="panel side-panel">
      <h3>File mẫu (Templates)</h3>
      <div className="file-list">
        {files.map((file) => {
          const Icon = file.icon;
          return (
            <article className="file-item" key={file.name}>
              <span className={`file-icon ${file.tone}`}>
                <Icon size={22} />
              </span>
              <div>
                <strong>{file.name}</strong>
                <small>{file.meta}</small>
              </div>
              <button className="icon-button table-action" title="Tải xuống">
                <Download size={18} />
              </button>
            </article>
          );
        })}
      </div>
      <button className="dashed-button">Xem tất cả 45 tệp tin</button>
    </section>
  );
}

function DeadlinePanel() {
  const items = [
    { name: "ASM/RSM nộp file kênh", value: "Còn 2 ngày", width: "86%", tone: "red" },
    { name: "Bộ phận thẩm định", value: "Còn 4 ngày", width: "60%", tone: "orange" },
    { name: "CEO phê duyệt cuối", value: "Còn 6 ngày", width: "30%", tone: "blue" },
  ];

  return (
    <section className="panel side-panel deadline-panel">
      <h3>Deadline theo mốc xử lý</h3>
      {items.map((item) => (
        <div className="deadline-item" key={item.name}>
          <div>
            <span>{item.name}</span>
            <strong className={item.tone}>{item.value}</strong>
          </div>
          <i><span className={item.tone} style={{ width: item.width }} /></i>
        </div>
      ))}
    </section>
  );
}

const forecastMonthOptions = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0");
  return { value, label: `Tháng ${value}` };
});

const forecastYearOptions = ["2026", "2027", "2028", "2029", "2030"];

function formatForecastMonth(month, year) {
  return `Tháng ${String(month).padStart(2, "0")}/${year}`;
}

function parseForecastMonth(value = "Tháng 08/2026") {
  const match = value.match(/(\d{2})\/(\d{4})/);
  if (!match) return { month: 8, year: 2026 };
  return { month: Number(match[1]), year: Number(match[2]) };
}

function buildQuickForecastMonths(period) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(period.year, period.month - 1 + index, 1);
    return formatForecastMonth(date.getMonth() + 1, date.getFullYear());
  });
}

function ForecastPeriodPicker({ value, onChange }) {
  const selected = parseForecastMonth(value);
  const monthValue = String(selected.month).padStart(2, "0");
  const yearValue = String(selected.year);
  const quickMonths = buildQuickForecastMonths(selected);
  const setPeriod = (patch) => {
    onChange(formatForecastMonth(patch.month ?? selected.month, patch.year ?? selected.year));
  };

  return (
    <div className="forecast-period-picker">
      <div className="period-select-grid">
        <label>
          <span>Tháng Forecast</span>
          <CustomSelect value={monthValue} options={forecastMonthOptions} onChange={(month) => setPeriod({ month: Number(month) })} />
        </label>
        <label>
          <span>Năm</span>
          <CustomSelect value={yearValue} options={forecastYearOptions} onChange={(year) => setPeriod({ year: Number(year) })} />
        </label>
      </div>
      <div className="period-quick-row">
        {quickMonths.map((month) => (
          <button className={month === value ? "selected" : ""} key={month} type="button" onClick={() => onChange(month)}>
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

function CreateForecastStepOne({ onCancel, onNext, draft, setDraft }) {
  const currentDraft = draft || { month: "Tháng 08/2026", deadline: "22/08/2026", time: "17:00", note: "" };
  const deadlineInputValue = toDateInputValue(currentDraft.deadline);
  const updateDraft = (patch) => setDraft({ ...currentDraft, ...patch });
  const updateForecastPeriod = (month) => {
    const period = parseForecastMonth(month);
    updateDraft({ month, deadline: `22/${String(period.month).padStart(2, "0")}/${period.year}` });
  };
  const openPicker = (event) => {
    const input = event.currentTarget.querySelector("input");
    input?.showPicker?.();
    input?.focus();
  };

  return (
    <section className="page-flow create-page">
      <Breadcrumb current="Tạo lịch mới" />
      <div className="page-heading">
        <h2>Thiết lập Forecast mới</h2>
        <p>Khởi tạo kỳ Forecast KD01, đặt hạn tổng và hướng dẫn cho các kênh nhập file.</p>
      </div>

      <StepTabs active={1} />

      <section className="panel form-panel">
        <div className="form-group">
          <label>Chọn kỳ Forecast <strong>*</strong></label>
          <ForecastPeriodPicker value={currentDraft.month} onChange={updateForecastPeriod} />
          <p>Kỳ Forecast sẽ tạo task cho từng kênh và theo dõi từ lúc giao việc đến khi phát hành bản chính thức.</p>
        </div>

        <div className="form-group">
          <label>Thiết lập Deadline tổng <strong>*</strong></label>
          <div className="input-grid">
            <div className="input-shell picker-shell" onClick={openPicker}>
              <input
                aria-label="Chọn ngày deadline tổng"
                type="date"
                value={deadlineInputValue}
                onChange={(event) => updateDraft({ deadline: toDisplayDate(event.target.value) })}
              />
              <Calendar size={20} />
            </div>
            <div className="input-shell picker-shell" onClick={openPicker}>
              <input
                aria-label="Chọn giờ deadline tổng"
                type="time"
                value={currentDraft.time || "17:00"}
                onChange={(event) => updateDraft({ time: event.target.value })}
              />
              <Clock3 size={20} />
            </div>
          </div>
          <div className="warning-box">
            <AlertTriangle size={19} />
            Deadline tổng là hạn phê duyệt cuối; các mốc nộp file/thẩm định sẽ được chia theo SLA bên dưới.
          </div>
        </div>

        <div className="form-group">
          <label>Ghi chú / Hướng dẫn cụ thể</label>
          <textarea
            placeholder="Nhập các lưu ý quan trọng cho các bộ phận tham gia forecast..."
            value={currentDraft.note}
            onChange={(event) => updateDraft({ note: event.target.value })}
          />
        </div>

        <div className="form-actions">
          <button className="secondary-button" onClick={onCancel}>Hủy bỏ</button>
          <button className="primary-button" onClick={onNext}>
            Tiếp tục
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </section>
  );
}

function toIdPart(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function buildFrameworkAsmCandidates(frameworkRows, users = []) {
  const tones = ["blue", "green", "purple", "slate"];
  const asmUsers = users.filter((user) =>
    userHasRole(user, "asm") &&
    String(user.status || "").toLowerCase() === "active"
  );
  if (asmUsers.length) {
    return asmUsers.map((user, index) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      region: user.scope || user.title || user.department || "Theo phân quyền",
      title: user.title || user.role,
      initials: user.initials || getUserInitials(user.name),
      tone: user.tone || tones[index % tones.length],
      status: user.status,
    }));
  }

  const byName = new Map();
  frameworkRows.forEach((row) => {
    row.asms.forEach((asm, index) => {
      const key = asm.trim();
      if (!key) return;
      if (!byName.has(key)) {
        byName.set(key, {
          id: `asm-${toIdPart(key)}`,
          name: key,
          email: `${toIdPart(key)}@elmich.local`,
          region: row.channel,
          initials: getUserInitials(key),
          tone: tones[(byName.size + index) % tones.length],
        });
        return;
      }
      const current = byName.get(key);
      if (!current.region.includes(row.channel)) {
        byName.set(key, { ...current, region: `${current.region}, ${row.channel}` });
      }
    });
  });
  return Array.from(byName.values());
}

function buildAssignmentRows(monthCode, year, frameworkRows, asmCandidates) {
  const byLookup = new Map();
  asmCandidates.forEach((asm) => {
    [asm.id, asm.name, asm.title, asm.email].filter(Boolean).forEach((value) => byLookup.set(value, asm.id));
  });
  const candidateIds = new Set(asmCandidates.map((asm) => asm.id));
  const cutoff = Math.ceil(frameworkRows.length / 2);
  return frameworkRows.map((row, index) => {
    const directAsmIds = (row.asmIds || []).filter((asmId) => candidateIds.has(asmId));
    const namedAsmIds = (row.asms || []).map((asm) => byLookup.get(asm)).filter(Boolean);
    const scopeText = normalizeSearchValue([row.channel, row.shortName, row.region].join(" "));
    const scopedAsmIds = asmCandidates
      .filter((asm) => normalizeSearchValue([asm.region, asm.scope, asm.title].join(" ")).includes(scopeText) || scopeText.includes(normalizeSearchValue(asm.region || "")))
      .map((asm) => asm.id);
    const asms = directAsmIds.length ? directAsmIds : namedAsmIds.length ? namedAsmIds : scopedAsmIds;

    return {
      id: `assignment-${toIdPart(row.channel)}-${index}`,
      channel: row.channel,
      region: row.region,
      director: row.director,
      directorBadge: row.directorBadge || getUserInitials(row.director).slice(0, 1),
      rsm: row.rsm,
      rsmBadge: row.rsmBadge || getUserInitials(row.rsm).slice(0, 1),
      asms,
      deadline: `${index < cutoff ? "18" : "19"}/${monthCode}/${year}`,
      file: index % 2 === 0 ? "" : `Template_FC_KD01_T${monthCode}_${year}.xlsx`,
      tone: row.tone,
    };
  });
}

function buildTemplateFileName(row, monthCode, year) {
  const channelCode = row.channel
    .replace(/^Kênh\s+/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "_")
    .toUpperCase();
  return `Template_FC_KD01_${channelCode}_T${monthCode}_${year}.xlsx`;
}

function CreateForecastStepTwo({ onBack, onFinish, draft, channelRows: rows = channelRows, users = adminUsers }) {
  const forecastPeriod = parseForecastMonth(draft?.month);
  const monthCode = String(forecastPeriod.month).padStart(2, "0");
  const forecastYear = forecastPeriod.year;
  const frameworkAsmCandidates = buildFrameworkAsmCandidates(rows, users);
  const [assignmentRows, setAssignmentRows] = useState(() => buildAssignmentRows(monthCode, forecastYear, rows, frameworkAsmCandidates));
  const [asmModalRowId, setAsmModalRowId] = useState(null);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const activeAsmRow = assignmentRows.find((row) => row.id === asmModalRowId);
  const materializeAssignmentRows = () => assignmentRows.map((row) => ({
    ...row,
    asmNames: row.asms
      .map((asmId) => frameworkAsmCandidates.find((candidate) => candidate.id === asmId)?.name)
      .filter(Boolean),
  }));

  const updateRow = (rowId, patch) => {
    setAssignmentRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
  };

  const handleAddChannel = (form) => {
    const channelName = form.channel.trim() || "Kênh mới";
    setAssignmentRows((rows) => [
      ...rows,
      {
        id: `channel-${Date.now()}`,
        channel: channelName,
        region: form.region,
        director: form.director.trim() || "Nguyễn Văn Nam",
        directorBadge: getUserInitials(form.director || "Nguyễn Văn Nam").slice(0, 1),
        rsm: form.rsm.trim() || "Lê Thị Thảo",
        rsmBadge: getUserInitials(form.rsm || "Lê Thị Thảo").slice(0, 1),
        asms: [],
        deadline: form.deadline || `20/${monthCode}/${forecastYear}`,
        file: form.file.trim(),
      },
    ]);
    setAddChannelOpen(false);
  };

  return (
    <section className="page-flow create-page channel-setup-page">
      <div className="page-heading with-actions channel-heading">
        <div>
          <h2>Giao việc Forecast theo Kênh Bán Hàng</h2>
          <p>Phân bổ deadline nộp file, người phụ trách và template Forecast theo khung kênh đã cấu hình.</p>
        </div>
        <button className="secondary-blue-button" type="button" onClick={() => setAddChannelOpen(true)}>
          <Plus size={18} />
          Thêm Kênh mới
        </button>
      </div>

      <StepTabs active={confirmOpen ? 3 : 2} />

      <section className="panel assignment-panel">
        <div className="assignment-table">
          <div className="assignment-head">
            <span>Kênh</span>
            <span>Miền</span>
            <span>GĐKD</span>
            <span>RSM</span>
            <span>ASM</span>
            <span>Deadline</span>
          <span>File mẫu</span>
          </div>
          {assignmentRows.map((row) => (
            <article className="assignment-row" key={row.id}>
              <div data-label="Kênh">{row.channel && <span className="channel-pill">{row.channel}</span>}</div>
              <span data-label="Miền">{row.region}</span>
              <div data-label="GĐKD">
                <Person name={row.director} badge={row.directorBadge} tone="blue" />
              </div>
              <div data-label="RSM">
                <Person name={row.rsm} badge={row.rsmBadge} tone="slate" />
              </div>
              <button className="asm-count-pill" type="button" onClick={() => setAsmModalRowId(row.id)} data-label="ASM">
                <Users size={16} />
                {row.asms.length} ASM
              </button>
              <label className="date-input-chip" data-label="Deadline">
                <Calendar size={20} />
                <input
                  className="assignment-date-input"
                  type="date"
                  value={toDateInputValue(row.deadline)}
                  onChange={(event) => updateRow(row.id, { deadline: toDisplayDate(event.target.value) })}
                  aria-label={`Deadline ${row.channel}`}
                />
              </label>
              <div data-label="File mẫu">
                {row.file ? (
                  <button className="file-pill" type="button" onClick={() => updateRow(row.id, { file: "" })} title="Bấm để bỏ file mẫu">
                    <FileText size={15} />
                    <span>{row.file}</span>
                  </button>
                ) : (
                  <button className="attach-template" type="button" onClick={() => updateRow(row.id, { file: buildTemplateFileName(row, monthCode, forecastYear) })}>
                    <Upload size={15} />
                    Đính kèm mẫu
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="system-note">
          <Info size={22} />
          <div>
            <strong>Lưu ý hệ thống</strong>
            <p>Task sẽ được sinh theo khung kênh hiện tại: ASM nộp file, RSM duyệt cấp kênh, sau đó GĐKD duyệt trước khi chuyển về Kế hoạch.</p>
          </div>
        </div>
      </section>

      <div className="create-step-actions">
        <button className="secondary-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Quay lại Bước 1
        </button>
        <div>
          <button className="link-button">Lưu bản nháp</button>
          <button className="primary-button" onClick={() => setConfirmOpen(true)}>
            Lưu và Hoàn tất
            <CheckCircle2 size={18} />
          </button>
        </div>
      </div>

      {addChannelOpen && (
        <AddChannelModal monthCode={monthCode} year={forecastYear} onClose={() => setAddChannelOpen(false)} onSave={handleAddChannel} />
      )}

      {activeAsmRow && (
        <AsmModal
          row={activeAsmRow}
          candidates={frameworkAsmCandidates}
          onClose={() => setAsmModalRowId(null)}
          onSave={(asms) => {
            updateRow(activeAsmRow.id, { asms });
            setAsmModalRowId(null);
          }}
        />
      )}

      {confirmOpen && (
        <ConfirmForecastModal
          draft={draft}
          rows={assignmentRows}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => onFinish(materializeAssignmentRows())}
        />
      )}
    </section>
  );
}

function ConfirmForecastModal({ draft, rows, onCancel, onConfirm }) {
  const totalAsm = rows.reduce((sum, row) => sum + row.asms.length, 0);
  const missingTemplates = rows.filter((row) => !row.file).length;

  return (
    <div className="modal-backdrop">
      <section className="admin-modal confirm-forecast-modal">
        <header className="admin-modal-header">
          <div>
            <h3>Xác nhận & Kích hoạt Forecast</h3>
            <p>Kiểm tra lại kỳ Forecast, khung kênh và luồng duyệt trước khi hệ thống sinh task.</p>
          </div>
          <button className="modal-close-button" type="button" onClick={onCancel} title="Đóng">
            <X size={20} />
          </button>
        </header>
        <div className="admin-modal-body">
          <div className="confirm-summary-grid">
            <article>
              <span>Kỳ Forecast</span>
              <strong>{draft?.month || "Tháng 08/2026"}</strong>
            </article>
            <article>
              <span>Deadline tổng</span>
              <strong>{draft?.deadline || "22/08/2026"} • {draft?.time || "17:00"}</strong>
            </article>
            <article>
              <span>Task theo kênh</span>
              <strong>{rows.length} kênh</strong>
            </article>
            <article>
              <span>ASM được gán</span>
              <strong>{totalAsm} người</strong>
            </article>
          </div>
          <div className="confirm-flow-box">
            <strong>Luồng duyệt sau khi kích hoạt</strong>
            <p>Mỗi kênh sẽ tạo task cho ASM phụ trách. File sau khi nộp đi qua RSM của kênh, tiếp tục sang GĐKD, rồi mới chuyển về Phòng Kế hoạch để tổng hợp.</p>
          </div>
          {missingTemplates > 0 && (
            <div className="warning-box compact">
              <AlertTriangle size={18} />
              Còn {missingTemplates} kênh chưa đính file mẫu. Bạn vẫn có thể kích hoạt và bổ sung file mẫu sau.
            </div>
          )}
        </div>
        <footer className="admin-modal-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>Quay lại chỉnh sửa</button>
          <button className="primary-button" type="button" onClick={onConfirm}>
            Xác nhận lưu
            <CheckCircle2 size={18} />
          </button>
        </footer>
      </section>
    </div>
  );
}

function AddChannelModal({ monthCode, year, onClose, onSave }) {
  const [form, setForm] = useState({
    channel: "",
    region: "Toàn Quốc",
    director: "Nguyễn Văn Nam",
    rsm: "Lê Thị Thảo",
    deadline: `20/${monthCode}/${year}`,
    file: "",
  });
  const updateForm = (patch) => setForm((current) => ({ ...current, ...patch }));

  return (
    <div className="modal-backdrop">
      <section className="admin-modal channel-modal-card">
        <header className="admin-modal-header">
          <div>
            <h3>Thêm kênh Forecast</h3>
            <p>Cấu hình kênh, người duyệt và deadline để hệ thống sinh task đúng phạm vi.</p>
          </div>
          <button className="modal-close-button" type="button" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </header>
        <div className="admin-modal-body">
          <div className="modal-grid two-cols">
            <label>
              Tên kênh
              <input value={form.channel} onChange={(event) => updateForm({ channel: event.target.value })} placeholder="Ví dụ: Kênh B2B" />
            </label>
            <label>
              Miền/vùng
              <CustomSelect
                value={form.region}
                options={["Toàn Quốc", "Miền Bắc", "Miền Trung", "Miền Nam", "Miền Tây"]}
                onChange={(region) => updateForm({ region })}
              />
            </label>
            <label>
              GĐKD
              <input value={form.director} onChange={(event) => updateForm({ director: event.target.value })} placeholder="Người duyệt cấp GĐKD" />
            </label>
            <label>
              RSM
              <input value={form.rsm} onChange={(event) => updateForm({ rsm: event.target.value })} placeholder="Người duyệt cấp RSM" />
            </label>
            <label>
              Deadline nộp file
              <input
                type="date"
                value={toDateInputValue(form.deadline)}
                onChange={(event) => updateForm({ deadline: toDisplayDate(event.target.value) })}
              />
            </label>
            <label>
              File mẫu
              <input value={form.file} onChange={(event) => updateForm({ file: event.target.value })} placeholder={`Template_FC_KD01_T${monthCode}_${year}.xlsx`} />
            </label>
          </div>
        </div>
        <footer className="admin-modal-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Hủy</button>
          <button className="primary-button" type="button" onClick={() => onSave(form)}>Thêm kênh</button>
        </footer>
      </section>
    </div>
  );
}

function AsmModal({ row, candidates, onClose, onSave }) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(row.asms);
  const selectedAsms = candidates.filter((candidate) => selectedIds.includes(candidate.id));
  const filteredCandidates = candidates.filter((candidate) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return [candidate.name, candidate.email, candidate.region].some((value) => value.toLowerCase().includes(keyword));
  });
  const toggleAsm = (asmId) => {
    setSelectedIds((current) => (current.includes(asmId) ? current.filter((id) => id !== asmId) : [...current, asmId]));
  };

  return (
    <div className="modal-backdrop">
      <section className="asm-modal">
        <div className="modal-title-row">
          <div>
            <h3>Quản lý Đội ngũ ASM</h3>
            <span>Kênh: {row.channel} • {row.region}</span>
          </div>
          <button className="icon-button" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className="modal-section">
          <span className="modal-label">Danh sách ASM hiện tại</span>
          <div className="asm-current-list">
            {selectedAsms.length ? selectedAsms.map((asm) => (
              <article className="asm-person-row" key={asm.id}>
                <span className={`mini-avatar ${asm.tone}`}>{asm.initials}</span>
                <div>
                  <strong>{asm.name}</strong>
                  <small>{asm.region}</small>
                </div>
                <button className="icon-button" type="button" onClick={() => toggleAsm(asm.id)} title="Xóa ASM khỏi kênh">
                  <X size={15} />
                </button>
              </article>
            )) : (
              <div className="asm-empty-state">Chưa gán ASM cho kênh này.</div>
            )}
          </div>
        </div>

        <div className="modal-section add-asm-section">
          <span className="modal-label">Thêm ASM mới</span>
          <label className="asm-search-field">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên ASM, email hoặc khu vực..." />
          </label>
          <div className="asm-candidate-list">
            {filteredCandidates.map((asm) => {
              const checked = selectedIds.includes(asm.id);
              return (
                <button
                  className={`asm-candidate-row ${checked ? "selected" : ""}`}
                  key={asm.id}
                  type="button"
                  onClick={() => toggleAsm(asm.id)}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleAsm(asm.id)} onClick={(event) => event.stopPropagation()} />
                  <span className={`mini-avatar ${asm.tone}`}>{asm.initials}</span>
                  <div>
                    <strong>{asm.name}</strong>
                    <small>{asm.email}</small>
                  </div>
                  <span>{asm.region}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="modal-actions">
          <span className="modal-selection-count">Đã chọn {selectedIds.length} ASM</span>
          <button className="secondary-button" type="button" onClick={onClose}>Hủy</button>
          <button className="primary-button" type="button" onClick={() => onSave(selectedIds)}>Lưu thay đổi</button>
        </div>
      </section>
    </div>
  );
}

function Breadcrumb({ current }) {
  return (
    <div className="breadcrumb">
      <button>Lịch Forecast</button>
      <ChevronRight size={15} />
      <strong>{current}</strong>
    </div>
  );
}

function StepTabs({ active }) {
  const steps = ["Thông tin chung", "Thiết lập cho các Kênh", "Xác nhận & Kích hoạt"];
  return (
    <div className="step-tabs">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        return (
          <div className={`step-tab ${active === stepNumber ? "active" : ""}`} key={step}>
            <span>{stepNumber}</span>
            <strong>{step}</strong>
          </div>
        );
      })}
    </div>
  );
}

function WideStepper() {
  return (
    <div className="wide-stepper">
      <div className="wide-step complete">
        <span><Check size={22} /></span>
        <strong>Thiết lập chung</strong>
      </div>
      <i />
      <div className="wide-step active">
        <span>2</span>
        <strong>Giao việc cho Kênh</strong>
      </div>
      <i />
      <div className="wide-step muted">
        <span>3</span>
        <strong>Xác nhận</strong>
      </div>
    </div>
  );
}

function Person({ name, badge, tone }) {
  return (
    <div className="person-cell">
      <span className={`person-badge ${tone}`}>{badge}</span>
      <span>{name}</span>
    </div>
  );
}

function Badge({ children, tone }) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}

function SimplePagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button className="ghost-page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <button key={item} className={item === page ? "current" : ""} onClick={() => onPageChange(item)}>
          {item}
        </button>
      ))}
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>›</button>
    </div>
  );
}

export default App;
