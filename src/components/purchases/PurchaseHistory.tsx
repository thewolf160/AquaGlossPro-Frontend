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
      mobile: false, 
      render: (item: Item) => ((item as PurchaseApi).purchaseDate.split(' ')[0]),
    },
    {
      key: "invoiceNumber",
      header: "Factura",
      mobile: false, 
    },
    {
      key: "supplierName",
      header: "Proveedor",
      mobile: true,
      render: (item: Item) => {
        const p = item as PurchaseApi;
        const config = getStatusConfig(p.purchaseStatus);
        const supplierName = typeof p.supplier === 'object' ? p.supplier?.companyName : p.supplier;
        
        return (
          <div className="text-left flex flex-col min-w-[120px]">
            <span className="font-bold text-gray-800 leading-tight">{supplierName || 'Desconocido'}</span>
            
            <span className="text-[10px] text-gray-500 sm:hidden mt-0.5">Factura: {p.invoiceNumber}</span>
            <span className="text-[10px] text-gray-500 sm:hidden">Fecha: {p.purchaseDate.split(' ')[0]}</span>
            <span className="text-xs font-bold text-blue-600 sm:hidden mt-0.5">${Number(p.totalAmount).toFixed(2)}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border w-fit mt-1 sm:hidden ${config.className}`}>
              {config.label}
            </span>
          </div>
        );
      }
    },
    {
      key: "totalAmount",
      header: "Total",
      mobile: false, 
      render: (item: Item) => (`$${Number((item as PurchaseApi).totalAmount).toFixed(2)}`),
    },
    {
      key: "purchaseStatus",
      header: "Estado",
      mobile: false, // Oculto en móvil
      render: (item: Item) => {
        const config = getStatusConfig((item as PurchaseApi).purchaseStatus);
        return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>{config.label}</span>;
      }
    },
    {
      key: "actions",
      header: "Acciones",
      mobile: true,
      render: (item: Item) => {
        const p = item as PurchaseApi;
        return (
          <div className="flex justify-center items-center gap-1.5 md:gap-2">
            {p.purchaseStatus === "W" ? (
              <>
                <button
                  onClick={() => handleOpenConfirm(p.purchaseId, "P")}
                  className="bg-green-50 rounded-md text-green-600 hover:bg-green-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                  title="Confirmar Pedido"
                >
                  <i className="bi bi-check-lg"></i>
                </button>
                <button
                  onClick={() => handleOpenConfirm(p.purchaseId, "C")}
                  className="bg-red-50 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                  title="Anular Pedido"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </>
            ) : (
              <button
                onClick={() => handlePrintInvoice(p)}
                className="bg-sky-50 rounded-md text-sky-600 hover:bg-blue-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                title="Imprimir Factura"
              >
                <i className="bi bi-printer"></i>
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar proveedor o factura..."
          searchTerm={textSearch}
          onSearchChange={onTextChange}
        />
      </HeaderPortal>

      <div className="flex flex-col gap-6">
        
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 space-y-4 overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
            
            <div className="flex flex-col gap-1.5 w-full md:w-1/3">
              <label className="text-sm font-medium text-slate-700">Estado:</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="P">Pagados / Confirmados</option>
                <option value="W">En Espera / Pendientes</option>
                <option value="C">Anulados</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5 w-full md:w-2/3">
              <label className="text-sm font-medium text-slate-700">Rango de Fechas:</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <input 
                  type="date" 
                  value={dateRange.start} 
                  onChange={e => handleDateChange('start', e.target.value)} 
                  className="w-full sm:flex-1 p-2.5 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
                />
                <span className="hidden sm:inline text-slate-400 font-bold">-</span>
                <input 
                  type="date" 
                  value={dateRange.end} 
                  onChange={e => handleDateChange('end', e.target.value)} 
                  min={dateRange.start} 
                  className="w-full sm:flex-1 p-2.5 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
                />
              </div>
              {(dateRange.start || dateRange.end) && (
                <button onClick={clearDates} className="text-xs font-medium text-red-500 hover:text-red-700 mt-1 self-start">
                  Limpiar Fechas
                </button>
              )}
            </div>

          </div>
          
          <section className="shadow-sm rounded-xl overflow-hidden border border-slate-200 w-full">
            <div className="bg-white px-4 md:px-6 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-lg md:text-xl tracking-tight">
                Historial de Compras
              </h2>
            </div>
            <div className="w-full">
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
                      ? "No se encontraron compras." 
                      : "No hay compras registradas."
                  }
                />
              )}
            </div>
            
            <div className="bg-slate-50 p-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 gap-3 w-full">
              <p className="text-xs md:text-sm text-slate-500 text-center sm:text-left">
                Página <span className="font-bold text-slate-900">{currentPage}</span> de{" "}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </p>
              <div className="join gap-2 w-full sm:w-auto flex justify-center">
                <button
                  className="join-item py-1.5 px-3 text-xs md:text-sm cursor-pointer border border-slate-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50 flex-1 sm:flex-none"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoadingData}
                >
                  <i className="bi bi-arrow-left-short text-lg md:text-xl" />
                  Anterior
                </button>
                <button
                  className="join-item py-1.5 px-3 text-xs md:text-sm cursor-pointer border border-slate-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50 flex-1 sm:flex-none"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoadingData}
                >
                  Siguiente
                  <i className="bi bi-arrow-right-short text-lg md:text-xl" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmPurchasesModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: 0, status: "" })}
        onConfirm={handleExecuteStatusChange}
        status={confirmModal.status}
        isSubmitting={isSubmitting}
      />
    </>
  );
}