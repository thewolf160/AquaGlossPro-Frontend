import { useEffect, useState } from "react";

interface WsMessage {
  type: string;
  payload: any;
}

interface ActiveToast {
  id: number;
  title: string;
  message: string;
  alertClass: string;
}

export const NotificationListener = () => {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    let isMounted = true;
    const rawRole = (localStorage.getItem("user_role") || "").toLowerCase().trim();
    let userRole = "supervisor"; // fallback seguro
    if (rawRole.includes("admin")) {
      userRole = "admin";
    } else if (rawRole.includes("superv")) {
      userRole = "supervisor";
    } else if (rawRole.includes("cajer") || rawRole.includes("cashier")) {
      userRole = "cajero";
    } else if (rawRole.includes("client")) {
      userRole = "cliente";
    }

    let reconnectTimeout: number;
    if (!localStorage.getItem("user_role")) return;

    const wsUrl = `ws://127.0.0.1:8080/ws?role=${userRole}`;

    const connectWebSocket = () => {
       const ws = new WebSocket(wsUrl);

         ws.onopen = () => console.log(`Conectado al ws como: ${userRole}`);

         ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WsMessage;

        if (data.type === "PING") return;

        let title = data.type.replace(/_/g, " ");
        let message = JSON.stringify(data.payload);
        let alertClass = "alert-info";

        if (data.type === "WASH_STATUS_UPDATE") {
          title = `🚗 Vehículo: ${data.payload.placa}`;
          message = `Estado: ${data.payload.nuevo_estado}`;
        } else if (
          data.type === "STOCK_ALERT" ||
          data.type === "UNPAID_SALES_ALERT"
        ) {
          alertClass = "alert-error";
        } else if (
          data.type === "PAYMENT_RECEIVED" ||
          data.type === "VEHICLE_READY"
        ) {
          alertClass = "alert-success";
        }

        const newToast: ActiveToast = {
          id: Date.now(),
          title,
          message,
          alertClass,
        };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 5000);
      } catch (error) {
        console.error("Error al procesar notifacion: ", error);
      }
    };

       ws.onerror = (error) => {
      console.error("Error: ", error);
    };

    ws.onclose = () => {
      if(!isMounted) return;
      console.log("Conexion perdida, reintentando...");
      reconnectTimeout = setTimeout(() => {
        connectWebSocket()
      }, 3000)
    };

    return ws
    }
  
    const activeWs = connectWebSocket()
   
    return () => {
      console.log("Limpiando web anterior");
      isMounted = false
      clearTimeout(reconnectTimeout)
      if(activeWs) activeWs.close()
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-top toast-end z-[9999] p-4 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`alert ${t.alertClass} shadow-lg max-w-sm text-xs dynamic-toast`}
        >
          <div>
            <span className="font-bold block uppercase">{t.title}</span>
            <span className="text-gray-700">{t.message}</span>
          </div>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() =>
              setToasts((prev) => prev.filter((notif) => notif.id !== t.id))
            }
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
