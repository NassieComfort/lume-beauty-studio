import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem(
    "lume_admin_token"
  );

  const userString = localStorage.getItem(
    "lume_admin_user"
  );

  if (!token || !userString) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const user = JSON.parse(userString);

    if (user.role !== "admin") {
      localStorage.removeItem("lume_admin_token");
      localStorage.removeItem("lume_admin_user");

      return (
        <Navigate
          to="/admin/login"
          replace
        />
      );
    }
  } catch {
    localStorage.removeItem("lume_admin_token");
    localStorage.removeItem("lume_admin_user");

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}