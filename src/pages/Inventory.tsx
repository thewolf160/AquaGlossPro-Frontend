import {useState, useMemo} from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";


interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
}

const initialInventory: InventoryItem[] = [
  { id: 1, name: "Champú Meguiar's Gold", category: "Químicos", stock: 12, minStock: 5, unit: "Galones", price: 25.00 },
  { id: 2, name: "Cera Líquida Rápida", category: "Químicos", stock: 3, minStock: 4, unit: "Litros", price: 15.00 },
  { id: 3, name: "Ambientador Pino", category: "Venta", stock: 50, minStock: 20, unit: "Unidades", price: 2.50 },
  { id: 4, name: "Paños de Microfibra", category: "Herramientas", stock: 8, minStock: 15, unit: "Paquetes", price: 10.00 },
  { id: 5, name: "Desengrasante Motor", category: "Químicos", stock: 0, minStock: 3, unit: "Galones", price: 18.00 },
  { id: 6, name: "Silicona para Tableros", category: "Químicos", stock: 7, minStock: 5, unit: "Litros", price: 12.00 },
  { id: 7, name: "Abrillantador de Llantas", category: "Químicos", stock: 2, minStock: 4, unit: "Galones", price: 22.00 },
];

export default function Inventory() {
    const [items,setItems] = useState<InventoryItem[]>(initialInventory);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<"TODOS" | "CRITICOS" | "AGOTADOS">("TODOS");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const stats = useMemo(() => {
      const totalValue = items.reduce((acc,item) => acc + (item.stock * item.price), 0);
      const lowStock = items.filter(i => i.stock > 0 && i.stock <= i.minStock).length;
      const outOfStock = items.filter(i => i.stock === 0).length;
      return { totalValue, lowStock, outOfStock, totalItems: items.length};
    }, [items]);
    

    const filteredItems = useMemo(() => {
      let result = items.filter(i =>
        i.name.toLocaleLowerCase().includes(searchTerm.toLowerCase()) || 
        i.category.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );

      if (activeFilter === "CRITICOS") {
        result = result.filter(i => i.stock > 0 && i.stock <= i.minStock)
      } else if (activeFilter === "AGOTADOS") {
        result = result.filter(i => i.stock === 0);
      }

      return result;
    }, [items, searchTerm, activeFilter]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    const paginatedItems = filteredItems.slice(
      ((currentPage -1) * itemsPerPage),
      currentPage * itemsPerPage
    );

   const columns = [
      {
        Headers: "Producto",
        key: "name",
        render: (item: Item) => {
          const inItem = item as unknown as InventoryItem;
          return (
            <div className="text-left">
              <div className="font-bold text-gray-800">{inItem.name}</div>
              <div className="text-xs text-gray-500">{inItem.category}</div>
            </div>
          );
        }
      },
      {
        header: "Stock",
        key: "stock",
        render: (item: Item) => {
          const inItem = item as unknown as InventoryItem;
          const isOutOfStock = inItem.stock === 0;
          const isLow = inItem.stock > 0 && inItem.stock <= inItem.minStock;

          let colorClass = "bg-green-600";
          if(isOutOfStock) colorClass = "bg-red-500";
          else if (isLow) colorClass = "bg-yellow-500";

          const fillPercentage = isOutOfStock ? 0 : Math.min(100, (inItem.stock / (inItem.minStock * 2)) * 100);

          return (
             <div className="w-full max-w-[140px] mx-auto flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <span className={`font-black text-lg leading-none ${isOutOfStock ? 'text-red-600' : 'text-gray-800'}`}>
                  {inItem.stock}
                </span>
                <span className="text-xs font-medium text-gray-500">{inItem.unit}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${colorClass} transition-all duration-500 ease-out rounded-full`}
                  style={{ width: `${fillPercentage}%` }}>
                </div>
              </div>
                 {isLow && <span className="text-[10px] font-bold text-yellow-600 text-left uppercase">Reordenar Pronto</span>}
                 {isOutOfStock && <span className="text-[10px] font-bold text-red-600 text-left uppercase">Agotado</span>}
             </div>
          );
        }
      },
      {
      }
   ]
  
  return (
    <>
      <h1>Inventario</h1>
    </>
  );
}


