type Employee = {
  name: string;
  washed: number;
};

const employees: Employee[] = [
  { name: "Pedro", washed: 5 },
  { name: "María", washed: 8 },
  { name: "José", washed: 3 },
];

export default function Employees() {
  return (
    <section>
      <h2>Empleados</h2>
      <ul>
        {employees.map((e) => (
          <li key={e.name}>
            {e.name} - Vehículos lavados: {e.washed}
          </li>
        ))}
      </ul>
    </section>
  );
}
