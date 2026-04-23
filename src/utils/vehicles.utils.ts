import type { VehicleApi } from "../types/vehicles.types";

const capitalizeFull = (text: string) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const transformData = (data: VehicleApi[]) => {
  return data.map((vehicle) => {
    return {
      id: vehicle.vehicleId,
      plate: vehicle.plate,
      typeVehicleName: vehicle.typeVehicle.name,
      typeVehicleId: vehicle.typeVehicle.typeVehicleId,
      ownerName: capitalizeFull(vehicle.owner.names),
      ownerLastName: capitalizeFull(vehicle.owner.lastnames),
      ownerNumberPhone: vehicle.owner.numberPhone,
      ownerCi: vehicle.owner.ci,
      ownerId: vehicle.owner.clientId,
    };
  });
};
