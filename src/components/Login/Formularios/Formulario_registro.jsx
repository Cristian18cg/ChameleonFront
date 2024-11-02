import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { InputMask } from "primereact/inputmask";
import useControl from "../../../hooks/useControl";

export const FormularioRegistro = () => {
  const { registro } = useControl();
  const toast = useRef(null);
  const [usuario, setUsuario] = useState({
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    correo: "",
    ciudad: "",
    contrasena: "",
    confirmarContrasena: "",
    tipoIdentificacion: "", // Nuevo campo para tipo de identificación
    numeroIdentificacion: "", // Nuevo campo para número de identificación
  });

  const [errores, setErrores] = useState({
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    correo: "",
    ciudad: "",
    contrasena: "",
    confirmarContrasena: "",
    tipoIdentificacion: "", // Error para tipo de identificación
    numeroIdentificacion: "", // Error para número de identificación
  });

  const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];
  const tiposIdentificacion = [
    { label: "Cédula de Ciudadanía", value: "CC" },
    { label: "Cédula de Extranjería", value: "CE" },
    { label: "Permiso Especial de Permanencia (PEP)", value: "PEP" },
    { label: "Permiso por Protección Temporal (PPT)", value: "PPT" },
    { label: "Pasaporte", value: "PAS" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));
    setErrores((prevErrores) => ({
      ...prevErrores,
      [name]: "", // Limpiar el error al cambiar el valor del campo
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    registro(usuario);
  };

  const validarFormulario = () => {
    let valid = true;
    let nuevosErrores = {};

    // Validar nombres y apellidos solo con letras y tildes
    const regexNombres = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    if (!regexNombres.test(usuario.nombres)) {
      nuevosErrores.nombres = "Los nombres solo deben contener letras.";
      valid = false;
    }
    if (!regexNombres.test(usuario.apellidos)) {
      nuevosErrores.apellidos = "Los apellidos solo deben contener letras.";
      valid = false;
    }

    // Validar teléfono (solo números, máximo 10 dígitos)
    const regexTelefono = /^\(\+\d{2}\)\s\d{3}-\d{3}-\d{4}$/;
    if (!regexTelefono.test(usuario.telefono)) {
      nuevosErrores.telefono =
        "El teléfono debe estar en el formato (+XX) XXX-XXX-XXXX.";
      valid = false;
    }

    // Validar formato de correo electrónico
    const regexCorreo = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regexCorreo.test(usuario.correo)) {
      nuevosErrores.correo = "Por favor, ingrese un correo electrónico válido.";
      valid = false;
    }

    // Validar que las contraseñas coincidan
    if (usuario.contrasena !== usuario.confirmarContrasena) {
      nuevosErrores.contrasena = "Las contraseñas no coinciden.";
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden.";
      valid = false;
    }

    // Validar campos vacíos
    Object.keys(usuario).forEach((campo) => {
      if (!usuario[campo]) {
        nuevosErrores[campo] = "Este campo es obligatorio.";
        valid = false;
      }
    });

    // Validar caracteres especiales peligrosos
    const regexCaracteresPeligrosos = /[$<>{}()'"`;%]/;
    if (
      regexCaracteresPeligrosos.test(usuario.nombres) ||
      regexCaracteresPeligrosos.test(usuario.apellidos) ||
      regexCaracteresPeligrosos.test(usuario.direccion)
    ) {
      showError(
        `No se permiten caracteres especiales como: <>{}()'";% en ningun campo.`
      );
      return false;
    }

    // Validar número de identificación (sin caracteres especiales y solo números)
    const regexNumeroIdentificacion = /^\d+$/;
    if (!regexNumeroIdentificacion.test(usuario.numeroIdentificacion)) {
      nuevosErrores.numeroIdentificacion =
        "El número de identificación solo debe contener números.";
      valid = false;
    }

    setErrores(nuevosErrores);
    return valid;
  };

  const showError = (mensaje) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: mensaje,
      life: 3000,
    });
  };

  return (
    <div className="card flex flex-col justify-center items-center  w-full p-4 rounded-lg">
      <Toast ref={toast} />
      <form
        onSubmit={handleSubmit}
        className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-lg"
      >
        {/* Nombres */}
        <div >
          <FloatLabel>
            <InputText
              id="nombres"
              name="nombres"
              value={usuario.nombres}
              onChange={handleInputChange}
              keyfilter={/[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+/}
              style={{ width: "100%" }}
            />
            <label htmlFor="nombres">Nombres</label>
          </FloatLabel>
          {errores.nombres && (
            <small className="p-error">{errores.nombres}</small>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <FloatLabel>
            <InputText
              id="apellidos"
              name="apellidos"
              value={usuario.apellidos}
              onChange={handleInputChange}
              keyfilter={/[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+/}
              style={{ width: "100%" }}
            />
            <label htmlFor="apellidos">Apellidos</label>
          </FloatLabel>
          {errores.apellidos && (
            <small className="p-error">{errores.apellidos}</small>
          )}
        </div>

        {/* Correo Electrónico */}
        <div >
          <FloatLabel>
            <InputText
               readonly onfocus="this.removeAttribute('readonly');"
                        autoComplete="off"

              type="email"
              id="correo"
              name="correo"
              value={usuario.correo}
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <label htmlFor="email">Correo Electrónico</label>
          </FloatLabel>
          {errores.correo && (
            <small className="p-error">{errores.correo}</small>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <FloatLabel>
            <InputMask
              name="telefono"
              id="telefono"
              value={usuario.telefono}
              onChange={handleInputChange}
              mask="(+99) 999-999-9999"
              style={{ width: "100%" }}
            />
            <label htmlFor="telefono">Teléfono</label>
          </FloatLabel>
          {errores.telefono && (
            <small className="p-error">{errores.telefono}</small>
          )}
        </div>

        {/* Tipo de Identificación */}
        <div >
          <FloatLabel>
            <Dropdown
              id="tipoIdentificacion"
              name="tipoIdentificacion"
              value={usuario.tipoIdentificacion}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "tipoIdentificacion", value: e.value },
                })
              }
              options={tiposIdentificacion}
              optionLabel="label"
              optionValue="value"
              style={{ width: "100%" }}
              placeholder="Seleccione tipo de identificación"
            />
            <label htmlFor="tipoIdentificacion">Tipo de Identificación</label>
          </FloatLabel>
          {errores.tipoIdentificacion && (
            <small className="p-error">{errores.tipoIdentificacion}</small>
          )}
        </div>

        {/* Número de Identificación */}
        <div >
          <FloatLabel>
            <InputText
              id="numeroIdentificacion"
              name="numeroIdentificacion"
              value={usuario.numeroIdentificacion}
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <label htmlFor="numeroIdentificacion">
              Número de Identificación
            </label>
          </FloatLabel>
          {errores.numeroIdentificacion && (
            <small className="p-error">{errores.numeroIdentificacion}</small>
          )}
        </div>
        {/* Ciudad */}
        <div>
          <FloatLabel>
            <Dropdown
              id="ciudad"
              name="ciudad"
              value={usuario.ciudad}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "ciudad", value: e.value },
                })
              }
              options={ciudades}
              style={{ width: "100%" }}
            />
            <label htmlFor="ciudad">Ciudad</label>
          </FloatLabel>
          {errores.ciudad && (
            <small className="p-error">{errores.ciudad}</small>
          )}
        </div>
        {/* Dirección */}
        <div>
          <FloatLabel>
            <InputText
              id="direccion"
              name="direccion"
              value={usuario.direccion}
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <label htmlFor="direccion">Dirección</label>
          </FloatLabel>
          {errores.direccion && (
            <small className="p-error">{errores.direccion}</small>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <FloatLabel>
            <Password
             readonly onfocus="this.removeAttribute('readonly');"
                        autoComplete="off"

              inputId="contrasena"
              name="contrasena"
              value={usuario.contrasena}
              onChange={handleInputChange}
              className="input-login min-w-full"
              toggleMask
            />
            <label htmlFor="contrasena">Contraseña</label>
          </FloatLabel>
          {errores.contrasena && (
            <small className="p-error">{errores.contrasena}</small>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div  className=" flex flex-col  min-w-full ">
          <FloatLabel>
            
            <Password
              readonly onfocus="this.removeAttribute('readonly');"
              autoComplete="off"
              inputId="confirmarContrasena"
              name="confirmarContrasena"
              value={usuario.confirmarContrasena}
              onChange={handleInputChange}
              className="input-login w-full "
              toggleMask
            />
            <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
          </FloatLabel>
          {errores.confirmarContrasena && (
            <small className="p-error min-w-full">{errores.confirmarContrasena}</small>
          )}
        </div>

        {/* Botón de Registro */}
        <div className=" md:col-span-2 flex justify-center mt-4">
          <Button
            type="submit"
            label="Registrarse"
            severity="success"
            className="w-full"
          />
        </div>
      </form>
    </div>
  );
};
