import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./NavBar";
import HomePage from "./Landing_home";
import Table_products from "../Productos/Table_products";
import useControl from "../../hooks/useControl";
import { Tienda } from "../Tienda/Tienda";
import { ProductoDetallado } from "../Tienda/ProductoDetallado";
import { ConfigDomicilio } from "../Configuracion/Domicilio/ConfigDomicilio";
import { ListaPedidos } from "../Pedidos/ListaPedidos";
import OrderDashboard from "../Pedidos/usuarios/PedidosUsuario";
import UserProfile from "../Configuracion/Usuario/InfoUsuario";
import RequestPasswordReset from "../Configuracion/Usuario/EnviarRecuperacion";
import ResetPassword from "../Configuracion/Usuario/CambiarContraseña";
import { ListUsers } from "../Configuracion/Usuario/ListUsers";
import Terminos from "../Terminos/Terminos";
import Footer from "../Home/Footer";
import PoliticaPrivacidad from "../Terminos/PoliticaPrivacidad";
import Imagenes from "../Configuracion/Imagenes/Home/Imagenes_home";
export const Router_Home = () => {
  const { admin, isLoggedIn } = useControl();
  const [Manager, setManager] = useState(false);
  useEffect(() => {
    setManager(admin);
  }, [admin]);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navegación */}
        <NavBar />

        {/* Contenido principal */}
        <main className="flex-grow">
          <Routes>
            {Manager ? (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<Table_products />} />
                <Route path="/tienda/:id" element={<ProductoDetallado />} />
                <Route path="/tienda" element={<Tienda />} />
                <Route
                  path="/configuracion/domicilio"
                  element={<ConfigDomicilio />}
                />
                <Route path="/configuracion/usuarios" element={<ListUsers />} />
                <Route path="/configuracion/imagenes" element={<Imagenes />} />
                <Route
                  path="/pedidos/lista_pedidos"
                  element={<ListaPedidos />}
                />
                <Route path="/terminos_y_condiciones" element={<Terminos />} />
                <Route
                  path="/politicas_y_privacidad"
                  element={<PoliticaPrivacidad />}
                />
                <Route
                  path="/recuperar_contraseña"
                  element={<RequestPasswordReset />}
                />
                <Route
                  path="/reset-password"
                  element={<ResetPassword />} // Nueva ruta para restablecer contraseña
                />
              </>
            ) : (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/tienda" element={<Tienda />} />
                <Route path="/tienda/:id" element={<ProductoDetallado />} />
                {isLoggedIn && (
                  <>
                    <Route path="/lista_pedidos" element={<OrderDashboard />} />
                    <Route path="/perfil" element={<UserProfile />} />
                  </>
                )}
                <Route path="/terminos_y_condiciones" element={<Terminos />} />
                <Route
                  path="/politicas_y_privacidad"
                  element={<PoliticaPrivacidad />}
                />
                <Route
                  path="/recuperar_contraseña"
                  element={<RequestPasswordReset />}
                />
                <Route
                  path="/reset-password"
                  element={<ResetPassword />} // Nueva ruta para restablecer contraseña
                />
              </>
            )}
          </Routes>
        </main>

        {/* Footer siempre visible */}
        <Footer />
      </div>
    </Router>
  );
};
