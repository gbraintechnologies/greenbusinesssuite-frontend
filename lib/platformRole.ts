type SessionLike = {
  roleName?: string;
  role_name?: string;
} | null | undefined;

const PLATFORM_ADMIN_ROLES = new Set(["SUPERADMIN", "APEX"]);

export function sessionRole(session: SessionLike) {
  return String(session?.roleName ?? session?.role_name ?? "")
    .trim()
    .toUpperCase();
}

export function isPlatformAdmin(session: SessionLike) {
  return PLATFORM_ADMIN_ROLES.has(sessionRole(session));
}
