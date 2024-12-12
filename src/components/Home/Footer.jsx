import React from "react";
import "primeicons/primeicons.css";

const Footer = () => {
  return (
    <footer className="bg-purple-700 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Chameleon</h2>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Chameleon. Todos los derechos
            reservados.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <a href="/politicas_y_privacidad" className="text-sm hover:underline">
            Políticas de Privacidad
          </a>
          <a href="/terminos_y_condiciones" className="text-sm hover:underline">
            Términos y Condiciones
          </a>
          <a
            href="https://wa.me/3202153327"
            className="text-sm hover:underline flex items-center"
          >
            <i className="pi pi-whatsapp mr-2"></i> Contacto
          </a>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h1 className="font-semibold text-center md:text-left">
            Síguenos en nuestras redes sociales
          </h1>
          <div className="flex gap-4 mt-2 justify-center md:justify-start">
            <a
              href="https://www.facebook.com/chameleonecologico?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <i className="pi pi-facebook" style={{ fontSize: "1.5rem" }}></i>
            </a>

            <a
              href="https://www.instagram.com/chameleon_ecologico?igsh=MWs3YWtiZ3EyeGJrYQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <i className="pi pi-instagram" style={{ fontSize: "1.5rem" }}></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
