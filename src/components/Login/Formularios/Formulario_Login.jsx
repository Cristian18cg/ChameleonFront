import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

export const Formulario_Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errores, setErrores] = useState({ correo: "", contraseña: "" });

  const validarCorreo = (email) => {
    const regexCorreo = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regexCorreo.test(email);
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setUsuario(value);

    if (!validarCorreo(value)) {
      setErrores((prev) => ({ ...prev, correo: "Ingrese un correo electrónico válido." }));
    } else {
      setErrores((prev) => ({ ...prev, correo: "" }));
    }
  };

  const handleContraseñaChange = (e) => {
    const value = e.target.value;
    setContraseña(value);

    // Validación de caracteres especiales en la contraseña
    const regexCaracteresEspeciales = /[$<>{}()'"`;%]/;
    if (regexCaracteresEspeciales.test(value)) {
      setErrores((prev) => ({
        ...prev,
        contraseña: "La contraseña no puede contener caracteres especiales.",
      }));
    } else {
      setErrores((prev) => ({ ...prev, contraseña: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación adicional antes de enviar el formulario
    if (!usuario || !validarCorreo(usuario)) {
      setErrores((prev) => ({ ...prev, correo: "Ingrese un correo electrónico válido." }));
      return;
    }

    if (errores.correo || errores.contraseña) {
      return; // No enviar el formulario si hay errores
    }

    // Aquí puedes manejar el envío del formulario (login)
    console.log("Correo:", usuario);
    console.log("Contraseña:", contraseña);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full  rounded-lg">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Campo de Correo Electrónico */}
        <div className=" flex flex-col items-center">
          <FloatLabel >
            <InputText
              id="username"
              className="input-login "
              value={usuario}
              onChange={handleCorreoChange}
              style={{width:"15rem"}}
            />
            <label className="w-full" htmlFor="username">Correo electrónico</label>
          </FloatLabel>
          {errores.correo && <small className="p-error mb-5">{errores.correo}</small>}
        </div>
  
        {/* Campo de Contraseña */}
        <div className=" flex flex-col items-center">
          <FloatLabel>
            <Password
              inputId="password"
              value={contraseña}
              onChange={handleContraseñaChange}
              feedback={false}
              className="input-login"
              keyfilter={/[^$<>{}()'"`;%]/} // No permite caracteres especiales
            />
            <label htmlFor="password">Contraseña</label>
          </FloatLabel>
          {errores.contraseña && <small className="p-error">{errores.contraseña}</small>}
        </div>
  
        {/* Botón de Enviar */}
        <div className="flex justify-center">
          <Button label="Entrar" severity="success" className="mt-3" type="submit" />
        </div>
      </form>
    </div>
  );
  
};
