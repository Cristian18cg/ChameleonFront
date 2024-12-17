import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox"; // Agregamos Checkbox para opciones adicionales de envío
import { InputTextarea } from "primereact/inputtextarea";
import useControl from "../../../hooks/useControl";
import useControlPedidos from "../../../hooks/useControlPedidos";
import { Toast } from "primereact/toast";

export const FormularioUsuario = () => {
  const toast = useRef(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { departments, cities, departamentos, ciudades,jsonlogin} =
    useControl();
  const { usuario, setUsuario, handleSubmit, errores } = useControlPedidos();
  useEffect(() => {
    // Obtener departamentos al cargar el componente
    if (departamentos.length === 0) {
      departments();
    }
  }, []);

  useEffect(() => {
    // Obtener departamentos al cargar el componente
  }, [usuario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (e) => {
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      envioDiferente: e.checked,
    }));
  };
  const handleDepartmentChange = (e) => {
    const departmentId = e.value;
    setSelectedDepartment(departmentId);
    handleInputChange({
      target: { name: "departamentoEnvio", value: departmentId },
    });
    cities(departmentId);
    // Obtener ciudades para el departamento seleccionado
  };

  const handleCityChange = (e) => {
    handleInputChange({
      target: { name: "ciudadEnvio", value: e.value },
    });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center p-4 rounded-lg">
      <Toast ref={toast} />

      <div>
        <h1 className="font-bold text-xl mb-6 "> Datos de facturación y envio</h1>
      </div>

      <div className=" flex flex-col  ">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 w-full ">
          {/* Campos principales */}
          <div  className=" col-span-2 md:col-span-1">
            <FloatLabel>
              <InputText
                id="nombres"
                name="nombres"
                disabled
                value={usuario.nombres}
                onChange={handleInputChange}
                keyfilter={/[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+/}
                style={{ width: "100%" }}
              />
              <label htmlFor="nombres">Nombres</label>
            </FloatLabel>
          </div>
          <div  className=" col-span-2 md:col-span-1">

            <FloatLabel>
              <InputText
                id="apellidos"
                name="apellidos"
                disabled
                value={usuario.apellidos}
                onChange={handleInputChange}
                keyfilter={/[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+/}
                style={{ width: "100%" }}
              />
              <label htmlFor="apellidos">Apellidos</label>
            </FloatLabel>
          </div>
          <div  className=" col-span-2 md:col-span-1">

            <InputMask
              disabled
              id="telefono"
              name="telefono"
              value={usuario.telefono}
              onChange={handleInputChange}
              mask="(+99) 999-999-9999"
              style={{ width: "100%" }}
            />
          </div>
          <div  className=" col-span-2 md:col-span-1">

            <FloatLabel>
              <InputText
                disabled
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
          </div>
          <div  className=" col-span-2 md:col-span-1">

            <FloatLabel>
              <InputText
                disabled
                id="department"
                name="department"
                value={usuario.department}
                style={{ width: "100%" }}
              />
              <label htmlFor="ciudad">Departamento</label>
            </FloatLabel>
          </div>
          <div  className=" col-span-2 md:col-span-1">

            <FloatLabel>
              <InputText
                disabled
                id="ciudad"
                name="ciudad"
                value={usuario.ciudad}
                style={{ width: "100%" }}
              />
              <label htmlFor="ciudad">Ciudad</label>
            </FloatLabel>
          </div>
          <div  className=" col-span-2 md:col-span-1">

            <FloatLabel>
              <InputText
                id="direccion"
                name="direccion"
                value={usuario.direccion}
                onChange={handleInputChange}
                disabled
                style={{ width: "100%" }}
              />

              <label htmlFor="direccion">Dirección</label>
            </FloatLabel>
          </div>
          {/* Checkbox para dirección de envío diferente */}
          <div  className=" col-span-2 md:col-span-1">

            <Checkbox
              inputId="envioDiferente"
              name="envioDiferente"
              checked={usuario.envioDiferente}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="envioDiferente" className="ml-2">
              Dirección de envío diferente
            </label>
          </div>
          {/* Campos adicionales para dirección de envío */}
          {usuario.envioDiferente && (
            <>
              <div>
                <FloatLabel>
                  <InputMask
                    id="telefonoEnvio"
                    name="telefonoEnvio"
                    value={usuario.telefonoEnvio}
                    onChange={handleInputChange}
                    mask="(+99) 999-999-9999"
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="telefonoEnvio">Teléfono Auxiliar</label>
                </FloatLabel>
                {errores.telefonoEnvio && (
                  <small className="p-error">{errores.telefonoEnvio}</small>
                )}
              </div>
              <div>
                <FloatLabel>
                  <InputText
                    id="direccionEnvio"
                    name="direccionEnvio"
                    value={usuario.direccionEnvio}
                    onChange={handleInputChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="direccionEnvio">Dirección de Envío</label>
                </FloatLabel>
                {errores.direccionEnvio && (
                  <small className="p-error">{errores.direccionEnvio}</small>
                )}
              </div>
              <div>
                <FloatLabel>
                  <Dropdown
                    id="departamentoEnvio"
                    name="departamentoEnvio"
                    optionLabel="name"
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    options={departamentos}
                    optionValue="id"
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="ciudadEnvio">Departamento de Envío</label>
                </FloatLabel>
                {errores.departamentoEnvio && (
                  <small className="p-error">{errores.departamentoEnvio}</small>
                )}
              </div>
              <div>
                <FloatLabel>
                  <Dropdown
                    id="ciudadEnvio"
                    name="ciudadEnvio"
                    optionLabel="name"
                    optionValue="id"
                    value={usuario.ciudadEnvio}
                    onChange={handleCityChange}
                    disabled={!selectedDepartment || ciudades.length === 0}
                    options={ciudades}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="ciudadEnvio">Ciudad de Envío</label>
                </FloatLabel>
                {errores.ciudadEnvio && (
                  <small className="p-error">{errores.ciudadEnvio}</small>
                )}
              </div>

              <div>
                <FloatLabel>
                  <InputText
                    id="infoAdicionalEnvio"
                    name="infoAdicionalEnvio"
                    value={usuario.infoAdicionalEnvio}
                    onChange={handleInputChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="infoAdicionalEnvio">
                    Info Adicional Ej: apto 201
                  </label>
                </FloatLabel>
              </div>
            </>
          )}
          {/* Descripción */}
          <div className="col-span-2">
            <label htmlFor="description" className="font-bold">
              Indicaciones adicionales de entrega
            </label>
            <InputTextarea
              id="description"
              name="description"
              value={usuario?.description}
              onChange={handleInputChange}
              required
              rows={3}
              cols={20}
              placeholder="Escribe las indicaciones necesarias para la entrega de tu pedido."
              className="input-productos border-gre"
              style={{ width: "100%" }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
