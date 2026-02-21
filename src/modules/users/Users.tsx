type User = {
  name: string;
  role: string;
};

const users: User[] = [
  { name: "Carlos Pérez", role: "Admin" },
  { name: "Ana Gómez", role: "Cajero" },
  { name: "Luis Torres", role: "Supervisor" },
];

export default function Users() {
  return (
    <section>
      <h2>Usuarios</h2>
      <ul>
        {users.map((u) => (
          <li key={u.name}>
            {u.name} - Rol: {u.role}
          </li>
        ))}
      </ul>
    </section>
  );
}
