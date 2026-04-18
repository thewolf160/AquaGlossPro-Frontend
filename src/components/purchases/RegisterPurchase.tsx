import { useState } from "react";

interface PurchaseItemState {
  productId: number | "";
  quantity: number;
  unitPrice: number;
}

interface PurchaseFormState {
  supplierId: number | "";
  paymentMethodId: number | "";
  invoiceNumber: string;
}

export default function RegisterPurchase() {
  const [formData, setFormData] = useState<PurchaseFormState>({
    supplierId: "",
    paymentMethodId: "",
    invoiceNumber: "",
  });

  const [items, setItems] = useState<PurchaseItemState[]>([
    { productId: "", quantity: 1, unitPrice: 0 },
  ]);

  const suppliers = [{ id: 1, name: "Distribuidora de Químicos C.A." }, { id: 2, name: "AutoRepuestos El Freno" }];
  const paymentMethods = [{ id: 1, name: "Transferencia Bancaria" }, { id: 2, name: "Efectivo USD" }];
  const products = [{ id: 1, name: "Jabón Espumoso 5L" }, { id: 2, name: "Cera Carnauba" }, { id: 3, name: "Paños Microfibra" }];

  const totalAmount = items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "invoiceNumber" ? value : Number(value),
    }));
  };

  const handleItemChange = (index: number, field: keyof PurchaseItemState, value: number | string) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [field]: value === "" ? "" : Number(value) } : item
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, { productId: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (indexToRemove: number) => setItems((prev) => prev.filter((_, index) => index !== indexToRemove));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      items: items.map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }))
    };
    console.log("Enviando al backend:", payload);
  };

  const inputWithIconClass = "w-full bg-white border border-gray-300 text-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm";
  const standardInputClass = "w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <i className="bi bi-file-earmark-text text-blue-600 text-lg"></i>
          <h2 className="text-lg font-bold text-slate-800">Datos de la Factura</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Proveedor</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-shop text-gray-400"></i>
              </div>
              <select name="supplierId" value={formData.supplierId} onChange={handleFormChange} required className={inputWithIconClass}>
                <option value="">Seleccione un proveedor...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Método de Pago</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-credit-card text-gray-400"></i>
              </div>
              <select name="paymentMethodId" value={formData.paymentMethodId} onChange={handleFormChange} required className={inputWithIconClass}>
                <option value="">Seleccione un método...</option>
                {paymentMethods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">N° de Factura</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-receipt text-gray-400"></i>
              </div>
              <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleFormChange} required placeholder="Ej: FAC-2024-001" className={inputWithIconClass} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-2">
            <i className="bi bi-box-seam text-blue-600 text-lg"></i>
            <h2 className="text-lg font-bold text-slate-800">Detalle de Productos</h2>
          </div>
          <button type="button" onClick={addItem} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold transition-colors flex items-center gap-2 text-sm shadow-sm cursor-pointer">
            <i className="bi bi-plus-circle-fill"></i> Agregar Producto
          </button>
        </div>

        <div className="space-y-3">
          <div className="hidden md:flex gap-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex-1">Producto</div>
            <div className="w-28 text-center">Cantidad</div>
            <div className="w-32 text-center">Costo Unit.</div>
            <div className="w-32 text-right">Subtotal</div>
            <div className="w-10"></div>
          </div>

          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
              <div className="flex-1 w-full">
                <label className="block md:hidden text-xs font-semibold text-slate-600 mb-1">Producto</label>
                <select value={item.productId} onChange={(e) => handleItemChange(index, "productId", e.target.value)} required className={standardInputClass}>
                  <option value="">Seleccione...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div className="w-full md:w-28">
                <label className="block md:hidden text-xs font-semibold text-slate-600 mb-1">Cantidad</label>
                <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} required className={`${standardInputClass} text-center`} />
              </div>

              <div className="w-full md:w-32 relative">
                <label className="block md:hidden text-xs font-semibold text-slate-600 mb-1">Precio Unit. ($)</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none md:top-0 top-6">
                  <span className="text-gray-500 font-medium">$</span>
                </div>
                <input type="number" step="0.01" min="0" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)} required className={`${standardInputClass} pl-7 text-right`} />
              </div>

              <div className="w-full md:w-32">
                <label className="block md:hidden text-xs font-semibold text-slate-600 mb-1">Subtotal</label>
                <div className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-lg px-4 py-2.5 text-sm text-right cursor-not-allowed">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>

              <div className="w-full md:w-auto flex justify-end">
                <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  <i className="bi bi-trash text-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-end items-center gap-6">
        <div className="flex items-center gap-4 bg-blue-50 px-6 py-4 rounded-xl border border-blue-100 w-full md:w-auto shadow-inner">
          <span className="text-blue-800 font-bold uppercase text-sm tracking-wider">Total a Pagar</span>
          <span className="text-3xl font-black text-blue-900">${totalAmount.toFixed(2)}</span>
        </div>
        
        <button type="submit" className="w-full md:w-64 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg cursor-pointer flex justify-center items-center gap-2">
          <i className="bi bi-check2-circle text-lg"></i>
          Procesar Compra
        </button>
      </div>
    </form>
  );
}