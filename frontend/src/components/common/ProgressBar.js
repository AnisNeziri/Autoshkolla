import React from 'react';

export default function ProgressBar({ value }) {
  const pct = Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * 100);
  const variant = pct >= 85 ? 'bg-success' : pct >= 50 ? 'bg-primary' : 'bg-warning';

  return (
    <div className="progress" style={{ height: 10, borderRadius: 999 }}>
      <div
        className={`progress-bar ${variant}`}
        role="progressbar"
        style={{ width: `${pct}%`, borderRadius: 999 }}
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  );
}

