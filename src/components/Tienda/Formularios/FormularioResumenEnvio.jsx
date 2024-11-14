import React, { useEffect, useState } from "react";
import useControlPedidos from "../../../hooks/useControlPedidos";
import useControl from "../../../hooks/useControl";

export const FormularioResumenEnvio = () => {
  const { usuario, carrito, valoresdomicilio, ValorDomicilio, setvalordomicilio,setvalorPedido } =
    useControlPedidos();
  const [valorDomicilio, setValorDomicilio] = useState(0);
  // Calcular y establecer el valor de domicilio cuando `valoresdomicilio` esté cargado
  useEffect(() => {
    const calcularValorDomicilio = () => {
      const valoresActivos = valoresdomicilio.filter(
        (valor) => valor.is_active
      );
      if (valoresActivos.length === 0) return 0;
      setvalordomicilio(Math.max(...valoresActivos.map((valor) => valor.address_cost)))
      return Math.max(...valoresActivos.map((valor) => valor.address_cost));

    };

    if (valoresdomicilio.length > 0) {
      setValorDomicilio(calcularValorDomicilio());
    } else {
      ValorDomicilio();
    }
  }, [valoresdomicilio]);

  const calcularTotal = () => {
    const total = carrito.reduce((acc, item) => {
      const precio = item.discount_price ? item.discount_price : item.price;
      return acc + precio * item.cantidad;
    }, 0);

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(total);
  };

  const TotalPedido = () => {
    const totalcarrito = carrito.reduce((acc, item) => {
      const precio = item.discount_price ? item.discount_price : item.price;
      return acc + precio * item.cantidad;
    }, 0);
    const total = valorDomicilio + totalcarrito;
    setvalorPedido(total)
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(total);
  };
  return (
    <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg  shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Resumen de Compra</h1>

      {/* Información del usuario */}
      <div className="mb-4">
        <p>
          <strong>Nombres:</strong> {usuario.nombres} {usuario.apellidos}
        </p>
        <p>
          <strong>Teléfono principal:</strong> {usuario.telefono}
        </p>
        <p>
          <strong>Correo:</strong> {usuario.correo}
        </p>
        <p>
          <strong>Identificación:</strong> {usuario.tipoIdentificacion}{" "}
          {usuario.numeroIdentificacion}
        </p>
        <p>
          <strong>Ciudad:</strong> {usuario.ciudad}
        </p>
        <p>
          <strong>Departamento:</strong> {usuario.department}
        </p>
        <p>
          <strong>Dirección de envío:</strong>{" "}
          {usuario.envioDiferente ? usuario.direccionEnvio : usuario.direccion}
        </p>
        {usuario.envioDiferente && (
          <>
            <p>
              <strong>Ciudad de envío:</strong> {usuario.ciudadEnvio}
            </p>
            <p>
              <strong>Teléfono de envío:</strong> {usuario.telefonoEnvio}
            </p>
          </>
        )}
        <p>
          <strong>Información adicional:</strong> {usuario.infoAdicionalEnvio}
        </p>
        <p>
          <strong>Descripción del envío:</strong> {usuario.description}
        </p>
      </div>

      {/* Resumen de productos en el carrito */}
      <div className="w-full mb-4">
        <h2 className="text-lg font-semibold mb-2">Productos en tu carrito:</h2>
        <ul className="w-full">
          {carrito.map((item, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>
                {item.name} x {item.cantidad}
              </span>
              <div className="grid grid-cols-1 mx-7 md:mx-0 ">
                <span>
                  $
                  {item.discount_price
                    ? Math.round(item.discount_price)
                    : Math.round(item.price)}
                  {item.discount_price &&
                    item.discount_price !== item.price && (
                      <span className="text-red-500 mx-2 line-through">
                        ${Math.round(item.price)}
                      </span>
                    )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Total de la compra */}
      <div className="w-full border-t pt-2 mt-2">
        <div className="flex">
          <h2 className="text-lg font-bold">Subtotal:</h2>
          <h2 className="mx-2 text-lg font-semibold"> {calcularTotal()}</h2>
        </div>

        <div className="flex">
          <h2 className="text-lg font-bold">Valor Domicilio:</h2>
          <h2 className="mx-2 text-lg font-semibold">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(valorDomicilio)}
          </h2>
        </div>

        <div className="flex">
          <h2 className="text-lg font-bold">Total:</h2>
          <h2 className="text-lg font-semibold mx-2">{TotalPedido()}</h2>
        </div>
      </div>
    </div>
  );
};
