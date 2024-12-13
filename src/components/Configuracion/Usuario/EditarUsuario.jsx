import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { InputMask } from "primereact/inputmask";
import useControl from "../../../hooks/useControl";
import { json } from "react-router-dom";
import { InputSwitch } from "primereact/inputswitch";

export const EditarUsuario = () => {
  const {
    departments,
    cities,
    departamentos,
    ciudades,
    loadingEdicion,
    user,
    EditarUsuario: editar,
  } = useControl();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const toast = useRef(null);
  const [usuario, setUsuario] = useState({
    nombres: user.first_name || "",
    apellidos: user.last_name || "",
    direccion: user.profile.address || "",
    telefono: user.profile.phone || "",
    correo: user.email || "",
    is_active: user.is_active ,
    is_superuser: user.is_superuser || false,
    ciudad: null,
    department: null,
    contrasena: "",
    confirmarContrasena: "",
    terms_accepted: user.profile?.terms_accepted || false,
    tipoIdentificacion: user.profile.type_document || "", // Nuevo campo para tipo de identificación
    numeroIdentificacion: user.profile.number_document || "", // Nuevo campo para número de identificación
  });
  useEffect(() => {
    console.log(user)
    // Cargar departamentos y ciudades basados en la información del usuario
    if (departamentos.length === 0) {
      departments();
    } else {
      const userDepartment = departamentos.find(
        (d) => d.id === user.profile?.department.id
      );
      handleInputChange({
        target: { name: "department", value: userDepartment.id },
      });
      setSelectedDepartment(userDepartment.id);
      if (userDepartment) {
        cities(userDepartment.id);
      }
    }
  }, [departamentos, user, ]);
  useEffect(() => {
    // Cargar departamentos y ciudades basados en la información del usuario
    if (departamentos.length === 0) {
      departments();
    } else {
      const userDepartment = departamentos.find(
        (d) => d.id === user.profile?.department.id
      );
      handleInputChange({
        target: { name: "department", value: userDepartment.id },
      });
      setSelectedDepartment(userDepartment.id);
      if (userDepartment) {
        cities(userDepartment.id);
      }
    }
  }, [departamentos, user, ]);
  useEffect(() => {
   console.log(usuario)
  }, [usuario]);
  useEffect(() => {
    // Sincronizar ciudad basada en la información del usuario
    const userCity = ciudades.find((c) => c.id === user.profile?.city.id);
    handleInputChange({
      target: { name: "ciudad", value: userCity?.id },
    });
  }, [ciudades]);

  const handleDepartmentChange = (e) => {
    const departmentId = e.value;
    setSelectedDepartment(departmentId);
    handleInputChange({
      target: { name: "department", value: departmentId },
    });
    cities(departmentId);
    // Obtener ciudades para el departamento seleccionado
  };

  const handleCityChange = (e) => {
    handleInputChange({
      target: { name: "ciudad", value: e.value },
    });
  };

  const [errores, setErrores] = useState({
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    correo: "",
    ciudad: "",
    department: "",
    contrasena: "",
    terms_accepted: "",
    confirmarContrasena: "",
    tipoIdentificacion: "", // Error para tipo de identificación
    numeroIdentificacion: "", // Error para número de identificación
  });

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
    editar(usuario);
  };

  const validarCampo = (campo, valor) => {
    const errores = {};
    const regex = {
      nombres: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
      telefono: /^\(\+\d{2}\)\s\d{3}-\d{3}-\d{4}$/,
      correo: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      numeroIdentificacion: /^\d+$/,
    };

    // Omitir validación si el campo es contraseña y está vacío
    if (campo === "contrasena" || campo === "confirmarContrasena" ||  campo === "is_superuser" ||campo === "is_active") {
      return errores;
    }
    if (!valor) errores[campo] = "Este campo es obligatorio.";
    else if (regex[campo] && !regex[campo].test(valor)) {
      errores[campo] = `El valor de ${campo} es inválido.`;
    }

    return errores;
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let valid = true;

    Object.entries(usuario).forEach(([campo, valor]) => {
      const error = validarCampo(campo, valor);
      if (Object.keys(error).length) {
        valid = false;
        nuevosErrores[campo] = error[campo];
      }
    });

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
        <div>
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
        <div>
          <FloatLabel>
            <InputText
              readonly
              onfocus="this.removeAttribute('readonly');"
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
        <div>
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
        <div>
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
        {/* Departamento */}
        <div>
          <FloatLabel>
            <Dropdown
              id="department"
              name="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              options={departamentos}
              optionLabel="name"
              optionValue="id"
              style={{ width: "100%" }}
            />
            <label htmlFor="department">Departamento</label>
          </FloatLabel>
          {errores.department && (
            <small className="p-error">{errores.department}</small>
          )}
        </div>
        {/* Ciudad */}
        <div>
          <FloatLabel>
            <Dropdown
              id="ciudad"
              name="ciudad"
              value={usuario.ciudad}
              onChange={handleCityChange}
              options={ciudades}
              optionLabel="name"
              optionValue="id"
              style={{ width: "100%" }}
              disabled={!selectedDepartment || ciudades.length === 0}
            />
            <label htmlFor="ciudad">Ciudad</label>
          </FloatLabel>
          {errores.ciudad && (
            <small className="p-error">{errores.ciudad}</small>
          )}
        </div>
        {/* Dirección */}
        <div className="md:col-span-2">
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
              readonly
              onfocus="this.removeAttribute('readonly');"
              autoComplete="new-password"
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
        <div className="  flex flex-col  min-w-full ">
          <FloatLabel>
            <Password
              readonly
              onfocus="this.removeAttribute('readonly');"
              autoComplete="new-password"
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
            <small className="p-error min-w-full">
              {errores.confirmarContrasena}
            </small>
          )}
        </div>
        <div className="card md:col-span-2 flex justify-content-center">
          <div className="flex items-center gap-2">
            <InputSwitch
              id="is_active"
              name="is_active"
              checked={usuario.is_active}
              onChange={handleInputChange}
            />

            <label htmlFor="is_active">Usuario activo</label>
          </div>
          {errores.is_active && (
            <small className="p-error min-w-full">
              {errores.is_active}
            </small>
          )}
        </div>
        <div className="card md:col-span-2 flex justify-content-center">
          <div className="flex items-center gap-2">
            <InputSwitch
              id="is_superuser"
              name="is_superuser"
              checked={usuario.is_superuser}
              onChange={handleInputChange}
            />

            <label htmlFor="is_superuser">Es usuario administrador</label>
         
          </div>
          {errores.is_superuser && (
            <small className="p-error min-w-full">
              {errores.is_superuser}
            </small>
          )}
        </div>
        <div className="card md:col-span-2 flex justify-content-center">
          <div className="flex items-center gap-2">
            <InputSwitch
              id="terms_accepted"
              name="terms_accepted"
              checked={usuario.terms_accepted}
              onChange={handleInputChange}
            />

            <label htmlFor="terms_accepted">
              Acepto los
              <a
                href="/ruta-a-terminos"
                rel="noopener noreferrer"
                className="text-purple-500 mx-1"
              >
                términos y condiciones
              </a>
            </label>
          </div>
        </div>
        {errores.terms_accepted && (
          <small className="p-error min-w-full">{errores.terms_accepted}</small>
        )}
        {/* Botón de Registro */}
        <div className=" md:col-span-2 flex justify-center mt-4">
          <Button
            loading={loadingEdicion}
            type="submit"
            label="Editar"
            className="w-56 bg-purple-500 border-purple-400 hover:bg-purple-800  "
          />
        </div>
      </form>
    </div>
  );
};
