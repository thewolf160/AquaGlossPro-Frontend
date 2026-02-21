type Service = {
  name: string;
  price: number;
};

const services: Service[] = [
  { name: "Lavado Sencillo", price: 5 },
  { name: "Lavado Premium", price: 10 },
  { name: "Combo Lavado + Aspirado", price: 12 },
];

export default function Services() {
  return (
    <section>
      <h2>Servicios y Lavados</h2>
      <ul>
        {services.map((s) => (
          <li key={s.name}>
            {s.name} - ${s.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
