import React from "react";

export default function AdminMetric({ label, value, hint, icon: Icon, tone }) {
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
