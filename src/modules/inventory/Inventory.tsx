type Item = {
  name: string;
  stock: number;
};

const items: Item[] = [
  { name: "Champú", stock: 10 },
  { name: "Desengrasante", stock: 3 },
  { name: "Silicona", stock: 0 },
  { name: "Cera líquida", stock: 5 },
];

export default function Inventory() {
  return (
    <section>
      <h2>Inventario</h2>
      <ul>
        {items.map((item) => (
          <li key={item.name}>
            {item.name} - Stock: {item.stock}
            {item.stock === 0 && (
              <span style={{ color: "red", marginLeft: "8px" }}>
                ⚠️ Agotado
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
