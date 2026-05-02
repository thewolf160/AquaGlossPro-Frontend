import { useState, useEffect } from "react";
import { usePurchases } from "../../hooks/usePurchases";
import Table from "../Table/Table";
import ConfirmPurchasesModal from "./ConfirmPurchasesModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Item } from "../../types/models";
import type { PurchaseApi } from "../../types/purchases.types";

interface ConfirmModalState {
  show: boolean;
  id: number;
  status: "P" | "C" | "";
}

export default function PurchaseHistory() {
  const {
    purchasesHistory, changeStatus, isSubmitting,
    isLoadingData, currentPage, setCurrentPage, totalPages,
    searchParameter, handleSearchChange
  } = usePurchases();

  const [inputValue, setInputValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    show: false,
    id: 0,
    status: ""
  });

  useEffect(() => {
    if (["P", "W", "C"].includes(searchParameter)) {
      setStatusValue(searchParameter);
    } else {
      setInputValue(searchParameter);
    }
  }, []);

  const onInputChange = (val: string) => {
    setInputValue(val);
    setStatusValue(""); 
    handleSearchChange(val);
  };

  const onStatusChange = (val: string) => {
    setStatusValue(val);
    setInputValue(""); 
    handleSearchChange(val);
  };

  const handleOpenConfirm = (id: number, status: "P" | "C") => {
    setConfirmModal({ show: true, id, status });
  };

  const handleExecuteStatusChange = async () => {
    if (confirmModal.status === "P" || confirmModal.status === "C") {
      const success = await changeStatus(confirmModal.id, confirmModal.status);
      if (success) {
        setConfirmModal({ show: false, id: 0, status: "" });
      }
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
      headStyles: {
        fillColor: primaryBlue,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: lightGray
      },
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });
  
    const finalY = (doc as any).lastAutoTable.finalY + 10;
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

  const columns = [
    {
      header: "Fecha",
      key: "purchaseDate",
      mobile: true,
      render: (item: Item) => <span className="text-gray-600">{(item as unknown as PurchaseApi).purchaseDate.split(' ')[0]}</span>,
    },
    {
      header: "Factura",
      key: "invoiceNumber",
      mobile: true,
      render: (item: Item) => <span className="font-bold text-gray-900">{(item as unknown as PurchaseApi).invoiceNumber}</span>,
    },
    {
      header: "Proveedor / Pago",
      key: "details",
      mobile: true,
      render: (item: Item) => {
        const p = item as unknown as PurchaseApi;
        return (
          <div className="text-xs">
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
      header: "Total",
      key: "totalAmount",
      mobile: false,
      render: (item: Item) => <span className="font-black text-gray-900">${Number((item as unknown as PurchaseApi).totalAmount).toFixed(2)}</span>,
    },
    {
      header: "Estado",
      key: "purchaseStatus",
      mobile: true,
      render: (item: Item) => {
        const config = getStatusConfig((item as unknown as PurchaseApi).purchaseStatus);
        return <span className={`px-3 py-1 text-xs font-bold rounded-full border ${config.className}`}>{config.label}</span>;
      }
    },
    {
      header: "Acciones",
      key: "actions",
      mobile: true,
      render: (item: Item) => {
        const p = item as unknown as PurchaseApi;
        return (
          <div className="flex justify-center items-center gap-2">
            {p.purchaseStatus === "W" ? (
              <>
                <button
                  onClick={() => handleOpenConfirm(p.purchaseId, "P")}
                  className="bg-green-100 rounded-md text-green-600 hover:bg-green-200 transition-all cursor-pointer px-2.5 py-2.5 flex items-center justify-center"
                  title="Confirmar Pedido"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleOpenConfirm(p.purchaseId, "C")}
                  className="bg-red-50 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer px-2.5 py-2.5 flex items-center justify-center"
                  title="Anular Pedido"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                  </svg>
                </button>
              </>
            ) : (
              <button 
                onClick={() => handlePrintInvoice(p)}
                className="bg-sky-50 rounded-md text-sky-600 hover:bg-blue-100 cursor-pointer transition-all px-2.5 py-2.5 flex items-center justify-center" 
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 gap-3">
        <div className="relative w-full max-w-md">
          <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Buscar por factura o proveedor..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <i className="bi bi-funnel text-slate-500"></i>
          <select 
            className="px-4 py-2 w-full sm:w-auto text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onStatusChange(e.target.value)}
            value={statusValue}
          >
            <option value="">Todos los Estados</option>
            <option value="W">Pendientes</option>
            <option value="P">Pagados</option>
            <option value="C">Anulados</option>
          </select>
        </div>
      </div>

      <div className="shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-white">
        {isLoadingData ? (
          <div className="flex items-center justify-center p-10">
            <span className="loading loading-spinner loading-xl text-blue-600"></span>
          </div>
        ) : (
          <Table
            columns={columns}
            data={purchasesHistory as unknown as Item[]}
            emptyMessage={searchParameter ? "No se encontraron resultados para tu búsqueda." : "No se encontraron compras en el historial."}
          />
        )}

        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <p className="text-sm text-slate-500">Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages || 1}</span></p>
          <div className="join gap-2">
            <button
              className="join-item py-1 px-2 text-sm border border-gray-300 rounded hover:bg-slate-100 disabled:opacity-50 cursor-pointer flex items-center gap-1"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1 || isLoadingData}
            >
              <i className="bi bi-arrow-left-short text-xl"></i> Anterior
            </button>
            <button
              className="join-item py-1 px-2 text-sm border border-gray-300 rounded hover:bg-slate-100 disabled:opacity-50 cursor-pointer flex items-center gap-1"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoadingData}
            >
              Siguiente <i className="bi bi-arrow-right-short text-xl"></i>
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