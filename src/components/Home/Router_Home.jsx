import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Landing_home } from "./Landing_home";
import Table_products from "../Productos/Table_products";
import useControl from "../../hooks/useControl";
import { Tienda } from "../Tienda/Tienda";
import { ProductoDetallado } from "../Tienda/ProductoDetallado";

export const Router_Home = () => {
  const {
    token,
    setToken,
    isLoggedIn,
    usuario,
    setUsuario,
    setLoggedIn,
    admin,
    setAdmin,
  } = useControl();
  const [Manager, setManager] = useState(false);
  useEffect(() => {
    setManager(admin);
  }, [admin]);
  return (
    <>
      {Manager ? (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Landing_home />} />
            <Route path="/productos" element={<Table_products />} />
            {/* Ruta dinámica */}
            <Route path="/tienda/:id" element={<ProductoDetallado />} />{" "}
            <Route path="/tienda" element={<Tienda />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Landing_home />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/tienda/:id" element={<ProductoDetallado />} />{" "}
            {/* Ruta dinámica */}
          </Routes>
        </Router>
      )}
    </>
  );
};
