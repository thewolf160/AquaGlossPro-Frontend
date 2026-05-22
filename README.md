# Front-Proyecto-5 🚀

Este es el cliente frontend de la aplicación **Proyecto 5**, un sistema de gestión empresarial diseñado especialmente para la administración de talleres automotrices, catálogos de servicios, ventas, inventarios, y seguimiento de tareas a través de tableros Kanban.

Construido utilizando tecnologías modernas y de alto rendimiento como **React 19**, **Vite**, **TypeScript**, y **Tailwind CSS v4**.

---

## 🛠️ Tecnologías y Librerías Utilizadas

El proyecto utiliza las siguientes herramientas principales:

- **Core**: [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/) para una interfaz moderna, responsiva y con soporte de temas.
- **Enrutamiento**: [React Router DOM v7](https://reactrouter.com/) para navegación fluida de página única (SPA).
- **Cliente HTTP**: [Axios](https://axios-http.com/) para peticiones a la API del backend.
- **Gráficos**: [Chart.js](https://www.chartjs.org/) + [React-ChartJS-2](https://react-chartjs-2.js.org/) para reportes visuales dinámicos.
- **Exportación**: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) para exportación a PDF, y [SheetJS (xlsx)](https://sheetjs.com/) para exportación a Excel.
- **Iconografía**: [Lucide React](https://lucide.dev/) + [Bootstrap Icons](https://icons.getbootstrap.com/).
- **Notificaciones**: [React Hot Toast](https://react-hot-toast.com/) para feedback visual en tiempo real.

---

## 📋 Módulos Principales del Sistema

El frontend cuenta con las siguientes vistas y flujos de trabajo implementados:

1. **Dashboard y Reportes (`Home` / `Reports`)**: Visualización de métricas clave, gráficos de rendimiento y exportación de reportes a PDF o Excel.
2. **Tablero Kanban (`KanbanBoard`)**: Seguimiento ágil del estado de los vehículos en reparación o servicios en curso.
3. **Gestión de Ventas y Compras (`Sales` / `Purchases`)**: Registro, facturación y visualización de transacciones comerciales.
4. **Catálogo y Registro de Servicios (`ServiceCatalog` / `ServiceHistory`)**: Administración de servicios ofrecidos, precios y el histórico de servicios por cliente.
5. **Control de Inventario (`Inventory`)**: Gestión de stock, repuestos, insumos y proveedores (`Suppliers`).
6. **Administración de Personal (`Employees` / `Commisions`)**: Registro de empleados, asignación de puestos de trabajo (`Jobs`) y cálculo de comisiones.
7. **Control de Clientes y Vehículos (`Client` / `Vehicles`)**: Gestión de datos de contacto de clientes, historial de visitas y control de vehículos asociados.
8. **Seguridad y Acceso (`Login` / `Users` / `Roles`)**: Inicio de sesión seguro, administración de usuarios y configuración de permisos mediante roles.

---

## 💻 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

- **Node.js** (Versión 18 o superior recomendada)
- **npm** (Viene integrado con Node.js) o cualquier otro gestor de paquetes de tu preferencia (yarn, pnpm).

---

## 🚀 Instalación y Configuración

Sigue estos pasos para configurar el proyecto en tu entorno local:

### 1. Clonar el repositorio

Si aún no has clonado el proyecto, ejecútalo en tu terminal:

```bash
git clone https://github.com/thewolf160/AquaGlossPro-Frontend.git
cd Front-Proyecto-5
```

### 2. Instalar dependencias

Instala todas las librerías requeridas utilizando npm:

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

- En Windows (PowerShell):
  ```powershell
  Copy-Item .env.example .env
  ```
- En Linux / macOS / Git Bash:
  ```bash
  cp .env.example .env
  ```

Abre el archivo `.env` recién creado y define la URL de la API del backend:

```env
VITE_BACK_URL=http://localhost:3000
```

_(Reemplaza `http://localhost:3000` con la dirección real de tu servidor backend en desarrollo)._

---

## 🏃 Ejecución del Proyecto

### Desarrollo

Para iniciar el servidor de desarrollo local con recarga rápida (HMR):

```bash
npm run dev
```

Una vez iniciado, abre tu navegador en la dirección indicada por la consola (generalmente `http://localhost:5173`).

### Construcción para Producción

Para compilar y optimizar la aplicación para su despliegue en producción:

```bash
npm run build
```

Esto generará los archivos listos para producción dentro de la carpeta `dist/`.

### Previsualizar la versión de Producción

Si quieres probar localmente la versión compilada de producción:

```bash
npm run preview
```

### Linting

Para verificar que el código cumple con las reglas de estilo y buenas prácticas de ESLint:

```bash
npm run lint
```
