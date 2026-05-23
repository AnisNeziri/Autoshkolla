import React, { useMemo } from 'react';

/**
 * Lightweight bar chart (no extra dependencies). `data`: [{ label, value }].
 */
export default function SimpleBarChart({ data, title, height = 220 }) {
  const max = useMemo(() => {
    if (!data?.length) return 1;
    return Math.max(1, ...data.map((d) => Number(d.value) || 0));
  }, [data]);

  if (!data?.length) {
    return <div className="text-secondary small">No data for this range.</div>;
  }

  return (
    <div>
      {title ? <div className="fw-semibold mb-2">{title}</div> : null}
      <div
        className="d-flex align-items-end gap-1"
        style={{ height, overflowX: 'auto', paddingBottom: 4 }}
      >
        {data.map((d) => {
          const v = Number(d.value) || 0;
          const h = `${Math.max(4, (v / max) * (height - 36))}px`;
          return (
            <div key={d.label} className="text-center" style={{ minWidth: 36 }}>
              <div
                className="mx-auto rounded-top bg-primary"
                style={{ width: 28, height: h, opacity: 0.85 }}
                title={`${d.label}: ${v}`}
              />
              <div className="small text-secondary text-truncate mt-1" style={{ maxWidth: 56 }}>
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
