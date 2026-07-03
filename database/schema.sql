create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  employee_code text unique,
  full_name text not null,
  email text not null unique,
  phone text,
  department text,
  title text,
  status text not null default 'active' check (status in ('active', 'inactive', 'locked')),
  initials text,
  tone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users add column if not exists auth_provider text not null default 'manual';
alter table users add column if not exists lark_open_id text;
alter table users add column if not exists lark_union_id text;
alter table users add column if not exists lark_user_id text;
alter table users add column if not exists avatar_url text;
alter table users add column if not exists last_login_at timestamptz;
create unique index if not exists uq_users_lark_open_id on users(lark_open_id) where lark_open_id is not null;
create unique index if not exists uq_users_lark_union_id on users(lark_union_id) where lark_union_id is not null;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  scope_type text not null default 'custom',
  scope_label text,
  risk text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete restrict,
  scope_note text,
  created_at timestamptz not null default now(),
  unique (user_id, role_id)
);

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  data_label text,
  sort_order int not null default 0
);

create table if not exists role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references roles(id) on delete cascade,
  module_id uuid not null references modules(id) on delete cascade,
  permission_level text not null check (permission_level in ('full', 'scoped', 'view', 'locked')),
  data_scope text not null default 'assigned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (role_id, module_id)
);

create table if not exists sales_channels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  short_name text,
  region text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  icon_key text,
  icon_tone text,
  marker text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists channel_assignments (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references sales_channels(id) on delete cascade,
  user_id uuid not null references users(id) on delete restrict,
  role_code text not null,
  effective_from date not null default current_date,
  effective_to date,
  created_at timestamptz not null default now(),
  unique (channel_id, user_id, role_code, effective_from)
);

create table if not exists forecast_cycles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  month int not null check (month between 1 and 12),
  year int not null,
  title text not null,
  total_deadline_at timestamptz not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'appraisal', 'approval', 'published', 'rejected')),
  tone text,
  note text,
  template_file_name text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists forecast_tasks (
  id uuid primary key default gen_random_uuid(),
  forecast_cycle_id uuid not null references forecast_cycles(id) on delete cascade,
  channel_id uuid not null references sales_channels(id) on delete restrict,
  owner_id uuid references users(id) on delete set null,
  rsm_id uuid references users(id) on delete set null,
  director_id uuid references users(id) on delete set null,
  deadline_at timestamptz not null,
  status text not null default 'assigned',
  status_tone text,
  due_text text,
  progress int not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (forecast_cycle_id, channel_id)
);

alter table forecast_tasks add column if not exists current_file_version int;
alter table forecast_tasks add column if not exists assignment_snapshot jsonb not null default '{}'::jsonb;
alter table forecast_tasks add column if not exists channel_config_snapshot jsonb not null default '{}'::jsonb;

create table if not exists task_assignments (
  id uuid primary key default gen_random_uuid(),
  forecast_task_id uuid not null references forecast_tasks(id) on delete cascade,
  user_id uuid not null references users(id) on delete restrict,
  role_code text not null default 'ASM',
  status text not null default 'active' check (status in ('active', 'inactive')),
  assigned_by uuid references users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (forecast_task_id, user_id, role_code)
);

create table if not exists forecast_files (
  id uuid primary key default gen_random_uuid(),
  forecast_task_id uuid not null references forecast_tasks(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size text,
  version int not null default 1,
  uploaded_by uuid references users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  note text,
  unique (forecast_task_id, version)
);

alter table forecast_files add column if not exists channel_id uuid references sales_channels(id) on delete set null;
alter table forecast_files add column if not exists asm_user_id uuid references users(id) on delete set null;
alter table forecast_files add column if not exists storage_path text;
alter table forecast_files add column if not exists mime_type text;
alter table forecast_files add column if not exists status text not null default 'draft';
alter table forecast_files add column if not exists locked_at timestamptz;
alter table forecast_files add column if not exists replaced_by uuid references forecast_files(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'forecast_files_status_check'
  ) then
    alter table forecast_files
      add constraint forecast_files_status_check
      check (status in ('draft', 'submitted', 'locked', 'rejected', 'approved', 'replaced'));
  end if;
end $$;

create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  forecast_cycle_id uuid not null references forecast_cycles(id) on delete cascade,
  forecast_task_id uuid not null references forecast_tasks(id) on delete cascade,
  channel_id uuid references sales_channels(id) on delete set null,
  requester_id uuid references users(id) on delete set null,
  submitted_by uuid references users(id) on delete set null,
  lark_approval_code text,
  lark_instance_code text,
  external_approval_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'canceled', 'failed_sync')),
  approver_snapshot jsonb not null default '{}'::jsonb,
  channel_config_snapshot jsonb not null default '{}'::jsonb,
  approval_payload jsonb not null default '{}'::jsonb,
  sync_error text,
  submitted_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table forecast_tasks add column if not exists current_approval_request_id uuid references approval_requests(id) on delete set null;

create table if not exists approval_request_files (
  id uuid primary key default gen_random_uuid(),
  approval_request_id uuid not null references approval_requests(id) on delete cascade,
  forecast_file_id uuid not null references forecast_files(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (approval_request_id, forecast_file_id)
);

create table if not exists approval_events (
  id uuid primary key default gen_random_uuid(),
  approval_request_id uuid not null references approval_requests(id) on delete cascade,
  event_key text,
  event_type text not null,
  status text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists appraisal_reviews (
  id uuid primary key default gen_random_uuid(),
  forecast_cycle_id uuid not null references forecast_cycles(id) on delete cascade,
  forecast_task_id uuid references forecast_tasks(id) on delete cascade,
  department text not null,
  reviewer_id uuid references users(id) on delete set null,
  decision text not null default 'pending' check (decision in ('pending', 'approved', 'rejected')),
  comment text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  forecast_cycle_id uuid not null references forecast_cycles(id) on delete cascade,
  approver_id uuid references users(id) on delete set null,
  decision text not null default 'pending' check (decision in ('pending', 'approved', 'rejected')),
  comment text,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_roles_user on user_roles(user_id);
delete from user_roles
where id in (
  select id
  from (
    select id, row_number() over (partition by user_id order by created_at desc) as row_number
    from user_roles
  ) ranked_user_roles
  where row_number > 1
);
create unique index if not exists uq_user_roles_primary_user on user_roles(user_id);
create index if not exists idx_role_permissions_role on role_permissions(role_id);
create index if not exists idx_channel_assignments_channel on channel_assignments(channel_id);
create index if not exists idx_forecast_tasks_cycle on forecast_tasks(forecast_cycle_id);
create index if not exists idx_forecast_tasks_owner on forecast_tasks(owner_id);
create index if not exists idx_task_assignments_task on task_assignments(forecast_task_id);
create index if not exists idx_task_assignments_user on task_assignments(user_id);
create index if not exists idx_forecast_files_task on forecast_files(forecast_task_id);
create index if not exists idx_forecast_files_status on forecast_files(status);
create index if not exists idx_approval_requests_task on approval_requests(forecast_task_id);
create index if not exists idx_approval_requests_status on approval_requests(status);
create index if not exists idx_approval_events_request on approval_events(approval_request_id);
create unique index if not exists uq_approval_events_event_key on approval_events(event_key) where event_key is not null;
create index if not exists idx_activity_logs_entity on activity_logs(entity_type, entity_id);
create index if not exists idx_activity_logs_created_at on activity_logs(created_at desc);

insert into task_assignments (forecast_task_id, user_id, role_code, status, assigned_at)
select id, owner_id, 'ASM', 'active', created_at
from forecast_tasks
where owner_id is not null
on conflict (forecast_task_id, user_id, role_code) do nothing;

update role_permissions rp
set permission_level = 'scoped',
    data_scope = coalesce(nullif(rp.data_scope, ''), 'Theo kênh')
from roles r, modules m
where rp.role_id = r.id
  and rp.module_id = m.id
  and r.code = 'rsm'
  and m.code = 'task_assignment'
  and rp.permission_level <> 'scoped';

update forecast_files ff
set channel_id = ft.channel_id,
    asm_user_id = coalesce(ff.asm_user_id, ff.uploaded_by),
    storage_path = coalesce(ff.storage_path, ff.file_url),
    status = case
      when ff.status in ('draft', 'submitted', 'locked', 'rejected', 'approved', 'replaced') then ff.status
      else 'approved'
    end
from forecast_tasks ft
where ff.forecast_task_id = ft.id;

update forecast_tasks ft
set current_file_version = latest.version
from (
  select forecast_task_id, max(version) as version
  from forecast_files
  group by forecast_task_id
) latest
where ft.id = latest.forecast_task_id
  and ft.current_file_version is null;
