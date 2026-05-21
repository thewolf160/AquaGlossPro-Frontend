export type ModuleName =
  | "CATEGORIES"
  | "CLIENTS"
  | "COMBOS"
  | "COMISSIONS"
  | "EMPLOYEES"
  | "JOBS"
  | "PAYMENT_METHODS"
  | "PRODUCTS"
  | "PURCHASES"
  | "SALES"
  | "SERVICES"
  | "SERVICES_TYPE_VEHICLE"
  | "SUPPLIERS"
  | "TYPE_VEHICLES"
  | "USERS"
  | "VEHICLES"
  | "REPORTS";

export type ActionType = "C" | "R" | "U" | "D" | "ANY";

interface ModulePermission {
  name_module: string;
  permissions: ("C" | "R" | "U" | "D")[];
}

export const hasPermission = (
  moduleName: ModuleName,
  action: ActionType,
): boolean => {
  const storedPermissions = localStorage.getItem("user_permissions");
  if (!storedPermissions) return false;

  try {
    const permissions: ModulePermission[] = JSON.parse(storedPermissions);

    const targetModule = permissions.find((p) => p.name_module === moduleName);
    if (!targetModule) return false;

    if (action === "ANY") {
      return targetModule.permissions.length > 0;
    }

    return targetModule.permissions.includes(action as "C" | "R" | "U" | "D");
  } catch (error) {
    console.error("Error al parsear permisos", error);
    return false;
  }
};
