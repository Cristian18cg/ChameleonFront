import React from "react";
import "primeicons/primeicons.css";
const Footer = () => {
  return (
    <footer className="bg-purple-700 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-bold">Chameleon</h2>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Chameleon. Todos los derechos
            reservados.
          </p>
        </div>

        <div className="flex space-x-6 mb-4 md:mb-0">
          <a
            href="/politicas_y_privacidad"
            className="text-sm hover:underline"
          >
            Políticas de Privacidad
          </a>
          <a href="/terminos_y_condiciones" className="text-sm hover:underline">
            Términos y Condiciones
          </a>
          <a href="https://wa.me/3202153327" className="text-sm hover:underline ">
         
          <i className="pi pi-whatsapp"  > Contacto</i> 
          </a>
          
        </div>

        <div className="flex  flex-col space-x-4">
            <h1 className="font-semibold">Siguenos en nuestras redes sociales</h1>
            <div className="flex gap-2 mt-2">
          <a
            href="https://www.facebook.com/chameleonecologico?mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="pi pi-facebook" style={{ fontSize: '1.5rem' }} ></i>
          </a>

          <a
            href="https://www.instagram.com/chameleon_ecologico?igsh=MWs3YWtiZ3EyeGJrYQ=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="pi pi-instagram" style={{ fontSize: '1.5rem' }} ></i>
          </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
