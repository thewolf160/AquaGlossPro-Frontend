import { useState } from "react";
import { useServiceHistory } from "../hooks/useServiceHistory";
import Table from "../components/Table/Table";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import type { Item } from "../types/models";
import type { SaleItem } from "../types/kanban.types";
import ConfirmSalesModal from "../components/sales/ConfirmSalesModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { hasPermission } from "../utils/checkPermissions.utils";

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

export default function ServiceHistory() {
  const {
    sales,
    isLoading,
    isSubmitting,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParam,
    setSearchParam,
    setDateFilter,
    changeStatus
  } = useServiceHistory();

  const [textSearch, setTextSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setLocalDateRange] = useState({ start: "", end: "" });
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ show: false, id: 0, status: "" });

  const onTextChange = (val: string) => {
    setTextSearch(val);
    setSearchParam(val.trim() !== "" ? val : statusFilter);
  };

  const onStatusChange = (val: string) => {
    setStatusFilter(val);
    if (textSearch.trim() === "") {
      setSearchParam(val);
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

  const handlePrintInvoice = (sale: SaleItem) => {
    const doc = new jsPDF();
    const primaryBlue: [number, number, number] = [14, 165, 233]; // sky-500
    const darkSlate: [number, number, number] = [30, 41, 59];
    const lightGray: [number, number, number] = [248, 250, 252];
    const textGray: [number, number, number] = [71, 85, 105];

    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("AQUAGLOSS PRO", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Rif: J-12345678-9 | Telf: 0412-1234567", 14, 27);
    doc.text("Av. Principal, Ciudad, País", 14, 33);

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURA", 196, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`NRO: #${String(sale.sale.saleId).padStart(6, '0')}`, 196, 27, { align: "right" });
    doc.text(`FECHA: ${sale.sale.saleDate.replace('T', ' ')}`, 196, 33, { align: "right" });

    // Client and Employee Section
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE:", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text(`Cliente: ${sale.client.names} ${sale.client.lastnames}`, 14, 62);
    doc.text(`Vehículo: ${sale.vehicle.plate} - ${sale.vehicle.typeVehicle}`, 14, 68);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text("PERSONAL ASIGNADO:", 110, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);

    const uniqueEmployees = new Set<string>();
    const allServices = [...(sale.details.comboServices || []), ...(sale.details.independentServices || [])];
    allServices.forEach(srv => {
      if (srv.employee) uniqueEmployees.add(`${srv.employee.names} ${srv.employee.lastnames}`);
    });
    const employeesList = Array.from(uniqueEmployees).join(', ') || 'Sin asignar';

    const empLines = doc.splitTextToSize(`Empleados: ${employeesList}`, 85);
    doc.text(empLines, 110, 62);

    // Table
    const tableData: any[] = [];
    allServices.forEach(srv => {
      const isCombo = sale.details.comboServices?.includes(srv);
      const desc = isCombo ? `Combo: ${srv.serviceName}` : `Servicio: ${srv.serviceName}`;
      const price = Number(srv.basePrice || srv.salePrice || 0);
      const discount = Number(srv.discount || 0);
      const subtotal = Number(srv.salePrice || (price - discount));
      tableData.push([desc, `$${price.toFixed(2)}`, `$${discount.toFixed(2)}`, `$${subtotal.toFixed(2)}`]);
    });

    autoTable(doc, {
      startY: 85,
      head: [['Descripción del Servicio', 'Precio Unit.', 'Descuento', 'Subtotal']],
      body: tableData.length > 0 ? tableData : [['Sin servicios registrados', '-', '-', '-']],
      headStyles: { fillColor: primaryBlue, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      alternateRowStyles: { fillColor: lightGray },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
      columnStyles: {
        0: { halign: 'left', cellWidth: 'auto' },
        1: { halign: 'right', cellWidth: 30 },
        2: { halign: 'right', cellWidth: 30 },
        3: { halign: 'right', cellWidth: 30 }
      }
    });

    const docWithPlugin = doc as jsPDFWithPlugin;
    const finalY = docWithPlugin.lastAutoTable.finalY + 15;

    // Totals section
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(120, finalY, 76, 25, 'F');

    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 125, finalY + 8);

    const calculatedSubtotal = tableData.reduce((acc, row) => {
      const val = typeof row[3] === 'string' ? Number(row[3].replace('$', '')) : 0;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    doc.text(`$${calculatedSubtotal.toFixed(2)}`, 190, finalY + 8, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", 125, finalY + 18);
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.text(`$${Number(sale.details.totalAmount).toFixed(2)}`, 190, finalY + 18, { align: "right" });

    // Footer
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("¡Gracias por su preferencia! Su vehículo en las mejores manos.", 105, 280, { align: "center" });

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

  const columns = [
    {
      header: "ID",
      key: "id",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return <span className="font-bold">#{sale.sale.saleId}</span>;
      },
    },
    {
      header: "Cliente / Vehículo",
      key: "client",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return (
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">{sale.client.names} {sale.client.lastnames}</p>
            <p className="text-xs text-slate-500">{sale.vehicle.plate} - {sale.vehicle.typeVehicle}</p>
          </div>
        );
      },
    },
    {
      header: "Fecha",
      key: "date",
      mobile: false,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return <span className="text-sm text-slate-600">{sale.sale.saleDate.split('T')[0]}</span>;
      },
    },
    {
      header: "Total",
      key: "total",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return <span className="font-bold text-green-700">${sale.details.totalAmount}</span>;
      },
    },
    {
      header: "Estado",
      key: "status",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        const statusMap: Record<string, { label: string; color: string }> = {
          W: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
          P: { label: "Pagado", color: "bg-green-100 text-green-700 border-green-200" },
          C: { label: "Cancelado", color: "bg-red-100 text-red-700 border-red-200" },
        };
        // @ts-expect-error - Dependiendo de cómo lo mapees, asumimos que llega statusSale
        const statusValue = sale.sale.statusSale || 'W';
        const config = statusMap[statusValue] || statusMap.W;
        return (
          <span className={`px-2 py-1 border rounded-full text-[10px] font-bold uppercase ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      header: "Acciones",
      key: "actions",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        // @ts-expect-error - statusSale
        if (sale.sale.statusSale === "W") {
          return (
            <div className="flex justify-center items-center gap-2">
              {hasPermission("SALES", "U") && (
                <button
                  onClick={() => handleOpenConfirm(sale.sale.saleId, "P")}
                  className="bg-green-50 rounded-md text-green-600 hover:bg-green-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                  title="Confirmar Pago"
                >
                  <i className="bi bi-check-lg"></i>
                </button>
              )}
              {hasPermission("SALES", "D") && (
                <button
                  onClick={() => handleOpenConfirm(sale.sale.saleId, "C")}
                  className="bg-red-50 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                  title="Anular Venta"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          );
        }
        return (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePrintInvoice(sale)}
              className="bg-sky-50 rounded-md text-sky-600 hover:bg-blue-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
              title="Imprimir Factura"
            >
              <i className="bi bi-printer"></i>
            </button>
          </div>
        );
      }
    },
  ];

  return (
    <>
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar por cedula del cliente..."
          searchTerm={textSearch}
          onSearchChange={onTextChange}
        />
      </HeaderPortal>

      <div className="flex flex-col gap-6">
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 space-y-4 overflow-hidden">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">

            <div className="flex flex-col gap-1.5 w-full md:w-1/3">
              <label className="text-sm font-medium text-slate-700">Estado de Pago:</label>
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
                  className="w-full sm:flex-1 p-2.5 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none"
                />
                <span className="hidden sm:inline text-slate-400 font-bold">-</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => handleDateChange('end', e.target.value)}
                  min={dateRange.start}
                  className="w-full sm:flex-1 p-2.5 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none"
                />
              </div>
              {(dateRange.start || dateRange.end) && (
                <button onClick={clearDates} className="text-xs font-medium text-red-500 hover:text-red-700 mt-1 self-start cursor-pointer">
                  Limpiar Fechas
                </button>
              )}
            </div>

          </div>

          <section className="shadow-sm rounded-xl overflow-hidden border border-slate-200">
            <div className="bg-white px-6 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-xl tracking-tight">Historial de Servicios</h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-10">
                <span className="loading loading-spinner loading-xl text-blue-600"></span>
              </div>
            ) : (
              <Table
                columns={columns}
                data={sales as unknown as Item[]}
                emptyMessage={
                  textSearch || statusFilter || dateRange.start
                    ? "No se encontraron ventas."
                    : "No se encontraron servicios registrados."
                }
              />
            )}

            <div className="bg-slate-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 gap-3">
              <p className="text-sm text-slate-500">Página {currentPage} de {totalPages || 1}</p>
              <div className="join gap-2">
                <button
                  className="join-item py-1.5 px-3 text-xs md:text-sm cursor-pointer border border-slate-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >Anterior</button>
                <button
                  className="join-item py-1.5 px-3 text-xs md:text-sm cursor-pointer border border-slate-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >Siguiente</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmSalesModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: 0, status: "" })}
        onConfirm={handleExecuteStatusChange}
        status={confirmModal.status}
        isSubmitting={isSubmitting}
      />
    </>
  );
}