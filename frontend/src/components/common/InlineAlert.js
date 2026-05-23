import React from 'react';

export default function InlineAlert({ variant = 'danger', title, message }) {
  if (!title && !message) return null;

  return (
    <div className={`alert alert-${variant} mb-0`} role="alert">
      {title ? <div className="fw-semibold">{title}</div> : null}
      {message ? <div className={title ? 'mt-1' : ''}>{message}</div> : null}
    </div>
  );
}

