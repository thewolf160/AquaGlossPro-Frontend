import DashboardLayout from "../components/DashboardLayout";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const location = useLocation();
  const isAuth = localStorage.getItem("token");



  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default ProtectedRoute;