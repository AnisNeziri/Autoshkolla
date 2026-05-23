export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserDisplayNameFromClaims(claims) {
  if (!claims || typeof claims !== 'object') return '';
  return (
    claims.name ||
    claims.fullName ||
    claims.full_name ||
    claims.username ||
    claims.email ||
    ''
  );
}

export function getRoleFromClaims(claims) {
  if (!claims || typeof claims !== 'object') return null;

  const role =
    claims.role ||
    claims.Role ||
    claims.userRole ||
    claims.user_role ||
    null;

  if (role) return String(role).toUpperCase();

  const roles = claims.roles || claims.Roles || claims.authorities || null;
  if (Array.isArray(roles) && roles.length > 0) return String(roles[0]).toUpperCase();

  return null;
}

