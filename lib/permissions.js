export const ROLES = {
  ADMIN: "Admin",
  GENERAL: "General",
  ODECA: "Cafe_ODECA",
  RESPONSABLE: "Cafe_Responsable",
  SOCIETE: "Cafe_Chef_societe",
};

export const ROUTE_PERMISSIONS = {
  "/odeca-dashboard/collectors": [ROLES.ADMIN],
  "/odeca-dashboard/societies": [ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA],
  "/odeca-dashboard/payments": [ROLES.ADMIN],
};
