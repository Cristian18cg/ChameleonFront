import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Landing_home } from "./Landing_home";
import Table_products from "../Productos/Table_products";
import useControl from "../../hooks/useControl";
import { Tienda } from "../Tienda/Tienda";
import { ProductoDetallado } from "../Tienda/ProductoDetallado";
import { ConfigDomicilio } from "../Configuracion/Domicilio/ConfigDomicilio";
import { ListaPedidos } from "../Pedidos/ListaPedidos";

export const Router_Home = () => {
  const {
    admin,
  } = useControl();
  const [Manager, setManager] = useState(false);
  useEffect(() => {
    setManager(admin);
  }, [admin]);
  return (
    <div className="w-full">
      {Manager ? (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Landing_home />} />
            <Route path="/productos" element={<Table_products />} />
            <Route path="/tienda/:id" element={<ProductoDetallado />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/configuracion/domicilio" element={<ConfigDomicilio />} />
            <Route path="/pedidos/lista_pedidos" element={<ListaPedidos />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Landing_home />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/tienda/:id" element={<ProductoDetallado />} />{" "}

          </Routes>
        </Router>
      )}
    </div>
  );
};
