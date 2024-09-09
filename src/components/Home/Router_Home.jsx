import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Landing_home } from "./Landing_home";
import Table_products from "../Productos/Table_products";
import useControl from "../../hooks/useControl";

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
    console.log('aadddmin',admin);
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
          </Routes>
        </Router>
      ) : (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Landing_home />} />
          </Routes>
        </Router>
      )}
    </>
  );
};
