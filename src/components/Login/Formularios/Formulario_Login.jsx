import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { IconField } from "primereact/iconfield";
export const Formulario_Login = () => {
  const [usuario, setUsuario] = useState("");
  const [Contraseña, setContraseña] = useState("");
  return (
    <div className="card flex flex-col justify-center items-center space-y-4 mt-6 w-full p-4 rounded-lg">
    <div className="mb-3">
      <FloatLabel>
        <InputText
          id="username"
          className="input-login"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          unstyled={true}
          style={{width:"15rem"}}
        />
          <label  htmlFor="username" 
          >Correo electronico</label>
      </FloatLabel>
    </div>
    <div className="mt-3 ">
      <FloatLabel>
        <Password
          inputId="password"
          value={Contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          feedback={false}
          className="input-login"
        />
        <label htmlFor="password">Contraseña</label>
      </FloatLabel>
    </div>
  
    <Button label="Entrar" severity="success" className="mt-3" />
  </div>
      );
};
