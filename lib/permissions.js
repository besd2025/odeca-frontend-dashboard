export const ROLES = {
  ADMIN: "Admin",
  GENERAL: "General",
  ODECA: "Cafe_ODECA",
  RESPONSABLE: "Cafe_Responsable",
  SOCIETE: "Cafe_Chef_societe",
  SUPERVISEUR_REGIONAL: "Superviseur_Regional",
};

export const ROUTE_PERMISSIONS = {
  "/odeca-dashboard/collectors": [ROLES.ADMIN],
  "/odeca-dashboard/societies": [ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA],
  "/odeca-dashboard/payments": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
  ],
  "/odeca-dashboard/home": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
    ROLES.SUPERVISEUR_REGIONAL,
  ],

  "/odeca-dashboard/cultivators": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
    ROLES.SUPERVISEUR_REGIONAL,
  ],
  "/odeca-dashboard/ct": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
    ROLES.SUPERVISEUR_REGIONAL,
  ],
  "/odeca-dashboard/usine": [ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA],
  "/odeca-dashboard/stocks": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
    ROLES.SUPERVISEUR_REGIONAL,
  ],
  "/odeca-dashboard/stocks/achats": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
    ROLES.SUPERVISEUR_REGIONAL,
  ],

  "/odeca-dashboard/stocks/transfers": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
    ROLES.SUPERVISEUR_REGIONAL,
  ],
  "/odeca-dashboard/maps": [
    ROLES.ADMIN,
    ROLES.GENERAL,
    ROLES.ODECA,
    ROLES.SOCIETE,
    ROLES.SUPERVISEUR_REGIONAL,
  ],
};
