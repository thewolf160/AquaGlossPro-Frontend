type Vehicle = {
  plate: string;
  status: "En Espera" | "En Lavado" | "Listo";
};

const vehicles: Vehicle[] = [
  { plate: "ABC123", status: "En Espera" },
  { plate: "XYZ789", status: "En Lavado" },
  { plate: "LMN456", status: "Listo" },
];

export default function Vehicles() {
  return (
    <section>
      <h2>Vehículos</h2>
      <ul>
        {vehicles.map((v) => (
          <li key={v.plate}>
            {v.plate} - {v.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
