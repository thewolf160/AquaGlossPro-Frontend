type Role = {
  name: string;
  permissions: string[];
};

const roles: Role[] = [
  { name: "Admin", permissions: ["Inventario", "Ventas", "Usuarios"] },
  { name: "Cajero", permissions: ["Ventas"] },
  { name: "Supervisor", permissions: ["Vehículos", "Empleados"] },
];

export default function Roles() {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>Roles y Acceso</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {roles.map((r) => (
          <li key={r.name}>
            {r.name} - Permisos: {r.permissions.join(", ")}
          </li>
        ))}
      </ul>
    </section>
  );
}
