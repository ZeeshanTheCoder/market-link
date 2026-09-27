import { ROLES } from "./constants";

export const dashboardPathFor = (role) =>
  ({
    [ROLES.CUSTOMER]: "/customer/dashboard",
    [ROLES.FARMER]: "/farmer/dashboard",
    [ROLES.ADMIN]: "/admin/dashboard",
  })[role] || "/";
