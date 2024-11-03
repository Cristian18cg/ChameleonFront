import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox"; // Agregamos Checkbox para opciones adicionales de envío
import useControl from "../../../hooks/useControl";

export const FormularioUsuario = () => {
  const { jsonlogin } = useControl();

  const [usuario, setUsuario] = useState({
    nombres: jsonlogin?.first_name || "",
    apellidos: jsonlogin?.last_name || "",
    direccion: jsonlogin?.address || "",
    telefono: jsonlogin?.phone || "",
    correo: jsonlogin?.email || "",
    ciudad: jsonlogin?.city || "",
    tipoIdentificacion: jsonlogin?.type_document || "",
    numeroIdentificacion: jsonlogin?.number_document || "",
    contrasena: "",
    confirmarContrasena: "",
    envioDiferente: false,
    direccionEnvio: "", // Dirección de envío adicional
    ciudadEnvio: "", // Ciudad de envío adicional
    telefonoEnvio: "", // Teléfono auxiliar para la dirección de envío
    infoAdicionalEnvio: "", // Información adicional para la dirección de envío
  });

  const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];

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

  return (
    <div className="card flex flex-col justify-center items-center w-full p-4 rounded-lg">
      <div>
        <h1 className="font-bold tex"> Datos de facturación y envio</h1>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-lg">
        {/* Campos principales */}
        <div>
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
        <div>
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
        <div>
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
        <div>
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
        <div>
          <FloatLabel>
            <Dropdown
              disabled
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
        </div>
        <div>
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
        <div className="col-span-2">
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
                <InputText
                  id="direccionEnvio"
                  name="direccionEnvio"
                  value={usuario.direccionEnvio}
                  onChange={handleInputChange}
                  style={{ width: "100%" }}
                />
                <label htmlFor="direccionEnvio">Dirección de Envío</label>
              </FloatLabel>
            </div>
            <div>
              <FloatLabel>
                <Dropdown
                  id="ciudadEnvio"
                  name="ciudadEnvio"
                  value={usuario.ciudadEnvio}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: "ciudadEnvio", value: e.value },
                    })
                  }
                  options={ciudades}
                  style={{ width: "100%" }}
                />
                <label htmlFor="ciudadEnvio">Ciudad de Envío</label>
              </FloatLabel>
            </div>
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
      </div>
    </div>
  );
};
