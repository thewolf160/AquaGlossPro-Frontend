type Purchase = {
  item: string;
  quantity: number;
  price: number;
  status: string;
};

const purchases: Purchase[] = [
  { item: "Shampoo para autos", quantity: 10, price: 50, status: "Recibido" },
  { item: "Cera líquida", quantity: 5, price: 120, status: "Pendiente" },
  { item: "Guantes de limpieza", quantity: 20, price: 15, status: "Recibido" },
  {
    item: "Toallas de microfibra",
    quantity: 30,
    price: 25,
    status: "Pendiente",
  },
];

export default function Purchases() {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>Compras</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {purchases.map((p, index) => (
          <li key={index}>
            {p.item} - Cantidad: {p.quantity}, Precio: ${p.price}, Estado:{" "}
            {p.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
