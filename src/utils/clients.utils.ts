import type { ClientApi } from "../types/clients.types";

const capitalizeFull = (text: string) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const transformData = (data: ClientApi[]) => {
  return data.map((client) => {
    return {
      id: client.clientId,
      ci: client.ci,
      names: capitalizeFull(client.names),
      lastnames: capitalizeFull(client.lastnames),
      numberPhone: client.numberPhone,
      vehicles: client.vehicles || [],
    };
  });
};