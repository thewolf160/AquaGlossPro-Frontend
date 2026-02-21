type Sale = {
  id: number;
  total: number;
  method: string;
};

const sales: Sale[] = [
  { id: 1, total: 15, method: "Efectivo" },
  { id: 2, total: 20, method: "Transferencia" },
];

export default function Sales() {
  return (
    <section>
      <h2>Ventas</h2>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            Factura #{sale.id} - ${sale.total} ({sale.method})
          </li>
        ))}
      </ul>
    </section>
  );
}
