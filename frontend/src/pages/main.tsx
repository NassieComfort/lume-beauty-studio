import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "../routes/AppRouters";
import "../../index.css";
import "../styles/admin.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
