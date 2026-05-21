import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


interface ExportDataSources {
  salesByPayment: any[];
  topServices: any[];
  vehiclesByType: any[];
  topProducts: any[];
  topEmployeesCommission: any[];
  topEmployeesVehicles: any[];
  operationalClosure: any[];
}


const toTitleCase = (str: string) => {
  if (!str) return "Sin datos";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


const mapSelectedReports = (
  selectedIds: string[],
  metrics: ExportDataSources,
) => {
  const sheets: {
    name: string;
    headers: string[];
    dataKeyRow: any[];
    rawRows: any[];
  } = [] as any;

  const registry: Record<
    string,
    { name: string; headers: string[]; mapper: (data: any[]) => any[] }
  > = {
    ventas_metodo: {
      name: "Ventas por Método de Pago",
      headers: ["Método de Pago", "Total Recaudado ($)"],
      mapper: (data) =>
        data.map((item) => ({
          "Método de Pago": toTitleCase(item.name),
          "Total Recaudado ($)": Number(item.total.toFixed(2)),
        })),
    },
    servicios_solicitados: {
      name: "Servicios más Solicitados",
      headers: ["Servicio", "Cantidad de Usos"],
      mapper: (data) =>
        data.map((item) => ({
          Servicio: toTitleCase(item.name),
          "Cantidad de Usos": item.count,
        })),
    },
    metricas_dinamicas: {
      name: "Resumen Productos Utilizados",
      headers: ["Producto", "Total Utilizado (Unidades/Litros)"],
      mapper: (data) =>
        data.map((item) => ({
          Producto: toTitleCase(item.name),
          "Total Utilizado (Unidades/Litros)": Number(
            item.totalUsed.toFixed(2),
          ),
        })),
    },
    vehiculos_lavados: {
      name: "Total Vehículos Lavados",
      headers: ["Tipo de Vehículo", "Cantidad Atendida", "Porcentaje (%)"],
      mapper: (data) =>
        data.map((item) => ({
          "Tipo de Vehículo": toTitleCase(item.name),
          "Cantidad Atendida": item.count,
          "Porcentaje (%)": `${item.percentage}%`,
        })),
    },
    top_empleados: {
      name: "Rendimiento de Empleados",
      headers: ["Empleado", "Vehículos Lavados"],
      mapper: (data) =>
        data.map((item) => ({
          Empleado: toTitleCase(item.fullName),
          "Vehículos Lavados": item.vehiclesWashed,
        })),
    },
    cierre_operativo: {
      name: "Cierre Operativo Diario",
      headers: [
        "Fecha",
        "Ingreso Bruto ($)",
        "Comisiones Pagadas ($)",
        "Gastos ($)",
        "Ingreso Neto ($)",
      ],
      mapper: (data) =>
        data.map((item) => ({
          Fecha: item.date,
          "Ingreso Bruto ($)": Number(item.grossIncome.toFixed(2)),
          "Comisiones Pagadas ($)": Number(item.commissionsPaid.toFixed(2)),
          "Gastos ($)": Number(item.expenses.toFixed(2)),
          "Ingreso Neto ($)": Number(item.netIncome.toFixed(2)),
        })),
    },
  };

  return selectedIds
    .filter((id) => registry[id])
    .map((id) => {
      const config = registry[id];
      // Determinar qué arreglo usar de la métrica según el reporte
      let rawData: any[] = [];
      if (id === "ventas_metodo") rawData = metrics.salesByPayment;
      if (id === "servicios_solicitados") rawData = metrics.topServices;
      if (id === "metricas_dinamicas") rawData = metrics.topProducts;
      if (id === "vehiculos_lavados") rawData = metrics.vehiclesByType;
      if (id === "top_empleados") rawData = metrics.topEmployeesVehicles;
      if (id === "cierre_operativo") rawData = metrics.operationalClosure;

      return {
        title: config.name,
        headers: config.headers,
        rows: config.mapper(rawData),
      };
    });
};

// 1. EXPORTACIÓN GENERAL A EXCEL (Libro Multi-hoja)
export const exportReportsToExcel = (
  selectedReportIds: string[],
  metrics: ExportDataSources,
  titleTab: string,
) => {
  const mappedReports = mapSelectedReports(selectedReportIds, metrics);
  if (mappedReports.length === 0) return;

  const workbook = XLSX.utils.book_new();

  mappedReports.forEach((report) => {
    // Convierte el JSON mapeado directamente en filas de Excel con sus cabeceras
    const worksheet = XLSX.utils.json_to_sheet(report.rows);

    // Ajuste automático de ancho de columnas
    const maxProps = report.headers.map((h) => ({ wch: h.length + 5 }));
    worksheet["!cols"] = maxProps;

    // Limitar el nombre de la pestaña a 30 caracteres debido a restricciones de Excel
    const sheetName = report.title.substring(0, 30);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `Reportes_${titleTab}_${dateStr}.xlsx`);
};

// 2. EXPORTACIÓN GENERAL A PDF (Documento Ejecutivo Continuo)
export const exportReportsToPDF = (
  selectedReportIds: string[],
  metrics: ExportDataSources,
  titleTab: string,
) => {
  const mappedReports = mapSelectedReports(selectedReportIds, metrics);
  if (mappedReports.length === 0) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = 20;

  // Encabezado del PDF Profesional
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SISTEMA DE ADMINISTRACIÓN DE AUTOLAVADO", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Reportes del Módulo: ${titleTab.toUpperCase()}`, 15, 26);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleString()}`, 15, 33);

  currentY = 50;

  // Imprimir cada tabla seleccionada de forma secuencial
  mappedReports.forEach((report, index) => {
    // Título de la sección del reporte
    doc.setTextColor(51, 65, 85); // Slate 700
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(report.title, 14, currentY);

    currentY += 4;

    // Generar la tabla usando jspdf-autotable
    autoTable(doc, {
      startY: currentY,
      head: [report.headers],
      body: report.rows.map((row) => Object.values(row)),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246], fontStyle: "bold" }, // Blue 500
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    // Calcular la posición final de la tabla para posicionar el siguiente reporte abajo
    currentY = (doc as any).lastAutoTable.finalY + 15;
  });

  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`Reporte_${titleTab}_${dateStr}.pdf`);
};
