export const ROLES = {
  ADMIN: "Admin",
  GENERAL: "General",
  ODECA: "ODECA",
};

export const ROUTE_PERMISSIONS = {
  "/odeca-dashboard/collectors": [ROLES.ADMIN],
  "/odeca-dashboard/societies": [ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA],
  "/odeca-dashboard/payments": [ROLES.ADMIN],
};
