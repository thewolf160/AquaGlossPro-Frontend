import { useState } from "react";
import { usePurchases } from "../../hooks/usePurchases";
import Table from "../Table/Table";
import ConfirmPurchasesModal from "./ConfirmPurchasesModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Item } from "../../types/models";
import type { PurchaseApi } from "../../types/purchases.types";
import type { ColumnsProps } from "../Table/Table.types";
import HeaderPortal from "../HeaderPortal";
import HeaderSearch from "../HeaderSearch";

interface ConfirmModalState {
  show: boolean;
  id: number;
  status: "P" | "C" | "";
}

interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export default function PurchaseHistory() {
  const {
    purchasesHistory, 
    changeStatus, 
    isSubmitting,
    isLoadingData, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    handleSearchChange, 
    setDateFilter 
  } = usePurchases();

  const [textSearch, setTextSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setLocalDateRange] = useState({ start: "", end: "" });

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ show: false, id: 0, status: "" });

  const onTextChange = (val: string) => {
    setTextSearch(val);
    handleSearchChange(val.trim() !== "" ? val : statusFilter);
  };

  const onStatusChange = (val: string) => {
    setStatusFilter(val);
    if (textSearch.trim() === "") {
      handleSearchChange(val);
    }
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newDates = { ...dateRange, [field]: value };
    setLocalDateRange(newDates);
    
    if ((newDates.start && newDates.end) || (!newDates.start && !newDates.end)) {
      setDateFilter({ startDate: newDates.start, endDate: newDates.end });
      setCurrentPage(1);
    }
  };

  const clearDates = () => {
    setLocalDateRange({ start: "", end: "" });
    setDateFilter({ startDate: "", endDate: "" });
    setCurrentPage(1);
  };

  const handleOpenConfirm = (id: number, status: "P" | "C") => {
    setConfirmModal({ show: true, id, status });
  };

  const handleExecuteStatusChange = async () => {
    if (confirmModal.status === "P" || confirmModal.status === "C") {
      const success = await changeStatus(confirmModal.id, confirmModal.status);
      if (success) setConfirmModal({ show: false, id: 0, status: "" });
    }
  };

  const handlePrintInvoice = (purchase: PurchaseApi) => {
    const doc = new jsPDF();
    const primaryBlue: [number, number, number] = [14, 165, 233];
    const darkSlate: [number, number, number] = [30, 41, 59];
    const lightGray: [number, number, number] = [248, 250, 252];

    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("AQUAGLOSS PRO", 14, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("SISTEMA DE GESTIÓN DE COMPRAS", 14, 32);
    doc.setFontSize(12);
    doc.text(`FACTURA NRO: ${purchase.invoiceNumber}`, 140, 25);
    doc.text(`FECHA: ${purchase.purchaseDate.split(' ')[0]}`, 140, 32);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PROVEEDOR", 14, 50);
    doc.line(14, 52, 100, 52);
    doc.setFont("helvetica", "normal");
    
    const supplierName = typeof purchase.supplier === 'object' ? purchase.supplier?.companyName : purchase.supplier;
    const supplierRif = typeof purchase.supplier === 'object' ? purchase.supplier?.rif : "N/A";
    
    doc.text(`Nombre: ${supplierName || 'N/A'}`, 14, 58);
    doc.text(`RIF: ${supplierRif}`, 14, 64);
    doc.setFont("helvetica", "bold");
    doc.text("MÉTODO DE PAGO", 120, 50);
    doc.line(120, 52, 180, 52);
    doc.setFont("helvetica", "normal");
    
    const pmName = typeof purchase.paymentMethod === 'object' ? purchase.paymentMethod?.name : purchase.paymentMethod;
    doc.text(`${pmName || 'N/A'}`, 120, 58);
    
    const tableData = purchase.items?.map(item => [
      item.product?.name || "Producto General",
      item.quantity.toString(),
      `$${Number(item.unitPrice).toFixed(2)}`,
      `$${Number(item.subtotal).toFixed(2)}`
    ]) || [];
    
    autoTable(doc, {
      startY: 75,
      head: [['Descripción del Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      headStyles: { fillColor: primaryBlue, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      alternateRowStyles: { fillColor: lightGray },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
    });
    
    // 2. Le indicamos a TypeScript que trate a 'doc' como nuestro documento extendido
    const docWithPlugin = doc as jsPDFWithPlugin;
    const finalY = docWithPlugin.lastAutoTable.finalY + 10;

    doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.rect(130, finalY, 65, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${Number(purchase.totalAmount).toFixed(2)}`, 135, finalY + 8);
    
    doc.autoPrint();
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(blobUrl);
    }, 10000);
  };

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    const configs: Record<string, { label: string; className: string }> = {
      "P": { label: "PAGADO", className: "bg-green-100 text-green-700 border-green-200" },
      "W": { label: "PENDIENTE", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      "C": { label: "ANULADO", className: "bg-red-100 text-red-700 border-red-200" },
    };
    return configs[normalizedStatus] || { label: status || "DESCONOCIDO", className: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  const columns: ColumnsProps[] = [
    {
      key: "purchaseDate",
      header: "Fecha",
      mobile: true,
      render: (item: Item) => <span className="text-gray-600 font-medium">{(item as PurchaseApi).purchaseDate.split(' ')[0]}</span>,
    },
    {
      key: "invoiceNumber",
      header: "Factura",
      mobile: true,
      render: (item: Item) => <span className="font-bold text-gray-900">{(item as PurchaseApi).invoiceNumber}</span>,
    },
    {
      key: "details",
      header: "Proveedor / Pago",
      mobile: true,
      render: (item: Item) => {
        const p = item as PurchaseApi;
        return (
          <div className="text-left text-xs">
            <span className="block font-bold text-gray-800">
              {typeof p.supplier === 'object' ? p.supplier?.companyName : p.supplier}
            </span>
            <span className="text-gray-500">
              {typeof p.paymentMethod === 'object' ? p.paymentMethod?.name : p.paymentMethod}
            </span>
          </div>
        );
      }
    },
    {
      key: "totalAmount",
      header: "Total",
      mobile: false,
      render: (item: Item) => <span className="font-black text-blue-600">${Number((item as PurchaseApi).totalAmount).toFixed(2)}</span>,
    },
    {
      key: "purchaseStatus",
      header: "Estado",
      mobile: true,
      render: (item: Item) => {
        const config = getStatusConfig((item as PurchaseApi).purchaseStatus);
        return <span className={`px-3 py-1 text-xs font-bold rounded-full border ${config.className}`}>{config.label}</span>;
      }
    },
    {
      key: "actions",
      header: "Acciones",
      mobile: true,
      render: (item: Item) => {
        const p = item as PurchaseApi;
        return (
          <div className="flex justify-center items-center gap-2">
            {p.purchaseStatus === "W" ? (
              <>
                <button
                  onClick={() => handleOpenConfirm(p.purchaseId, "P")}
                  className="bg-green-100 rounded-md text-green-600 hover:bg-green-200 transition-all cursor-pointer px-2.5 py-2 flex items-center justify-center shadow-sm"
                  title="Confirmar Pedido"
                >
                  <i className="bi bi-check-lg text-lg"></i>
                </button>
                <button
                  onClick={() => handleOpenConfirm(p.purchaseId, "C")}
                  className="bg-red-50 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer px-2.5 py-2 flex items-center justify-center shadow-sm"
                  title="Anular Pedido"
                >
                  <i className="bi bi-x-lg text-lg"></i>
                </button>
              </>
            ) : (
              <button
                onClick={() => handlePrintInvoice(p)}
                className="bg-sky-50 rounded-md text-sky-600 hover:bg-blue-100 cursor-pointer transition-all px-2.5 py-2 flex items-center justify-center shadow-sm"
                title="Imprimir Factura"
              >
                <i className="bi bi-printer text-lg"></i>
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar por proveedor o factura..."
          searchTerm={textSearch}
          onSearchChange={onTextChange}
        />
      </HeaderPortal>

      <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-slate-700">Estado:</label>
          <select 
            className="p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 cursor-pointer"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="P">Pagados / Confirmados</option>
            <option value="W">En Espera / Pendientes</option>
            <option value="C">Anulados</option>
          </select>
        </div>
        
        <div className="w-px bg-slate-200 hidden md:block"></div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-bold text-slate-700">Rango de Fechas:</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={dateRange.start} 
              onChange={e => handleDateChange('start', e.target.value)} 
              className="p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 cursor-pointer"
            />
            <span className="text-slate-400 font-bold">-</span>
            <input 
              type="date" 
              value={dateRange.end} 
              onChange={e => handleDateChange('end', e.target.value)} 
              min={dateRange.start} 
              className="p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 cursor-pointer"
            />
          </div>
          
          {(dateRange.start || dateRange.end) && (
            <button 
              onClick={clearDates}
              className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors md:ml-2 cursor-pointer"
            >
              <i className="bi bi-eraser-fill mr-1"></i> Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoadingData ? (
          <div className="flex items-center justify-center p-10">
            <span className="loading loading-spinner loading-xl text-blue-600"></span>
          </div>
        ) : (
          <Table
            columns={columns}
            data={purchasesHistory as Item[]}
            emptyMessage={
              textSearch || statusFilter || dateRange.start
                ? "No se encontraron compras con los criterios seleccionados." 
                : "No hay compras registradas en el sistema."
            }
          />
        )}

        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <p className="text-sm font-medium text-slate-500">
            Página <span className="text-slate-900 font-bold">{currentPage}</span> de <span className="text-slate-900 font-bold">{totalPages}</span>
          </p>
          <div className="join gap-2">
            <button
              className="join-item py-1.5 px-3 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoadingData}
            >
              <i className="bi bi-arrow-left-short text-xl" /> Anterior
            </button>
            <button
              className="join-item py-1.5 px-3 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoadingData}
            >
              Siguiente <i className="bi bi-arrow-right-short text-xl" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmPurchasesModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: 0, status: "" })}
        onConfirm={handleExecuteStatusChange}
        status={confirmModal.status}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
