import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useControlProductos from "../../hooks/useControlProductos";
import useControlPedidos from "../../hooks/useControlPedidos";

import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import { Galleria } from "primereact/galleria";

export const ProductoDetallado = () => {
  const { producto, obtenerProducto } = useControlProductos();
  const { id } = useParams(); // Captura el id de la URL
  const [isMobile, setIsMobile] = useState(false);
  const handleUnitChange = (productId, value) => {
    setUnidades((prevUnidades) => ({
      ...prevUnidades,
      [productId]: value, // Actualiza la cantidad solo del producto específico
    }));
  };
  const {unidades, setUnidades } = useControlPedidos();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 936); // Definir 768px como límite para pantallas móviles
    };

    // Ejecutar cuando el componente se monta y cuando la ventana cambia de tamaño
    window.addEventListener("resize", handleResize);
    handleResize(); // Inicializar al cargar

    return () => {
      window.removeEventListener("resize", handleResize); // Limpiar cuando el componente se desmonta
    };
  }, []);

  useEffect(() => {
    if (id) {
      console.log("id", id);
      obtenerProducto(id);
    }
    console.log(producto);
  }, [id]);

  const itemTemplateImg = (item) => {
    return (
      <img
        alt={producto.images ? producto.name : item?.name}
        src={producto.images ? item.image_url : item?.objectURL}
        className="rounded-r-xl  block md:w-44 lg:w-64 xl:w-full"
      />
    );
  };
  const thumbnailTemplate = (item) => {
    return (
      <img
        alt={producto.images ? producto.name : item?.name}
        src={producto.images ? item.image_url : item?.objectURL}
        className="w-12 block md:w-12 lg:w-14 xl:w-24"
      />
    );
  };

  const responsiveOptions = [
    {
      breakpoint: "1200px",
      numVisible: 4,
    },
    {
      breakpoint: "991px",
      numVisible: 3,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 3,
    },
  ];
  return (
    <div className="flex justify-center">
      <div className="card border-2 w-full md:w-3/4 rounded-md border-gray-200 mt-5 shadow-lg">
        {/* Grid con dos columnas */}
        <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {/* Imagen del producto */}
          {producto?.images && (
            <div
              className=" card  col-span-1 flex-col justify-center items-center
             "
            >
              <Galleria
                value={producto?.images}
                responsiveOptions={responsiveOptions}
                numVisible={6}
                item={itemTemplateImg}
                className={isMobile ? "" : "gallery-thumbnail-custom  "} // Ajustar el ancho de la galería
                thumbnail={ thumbnailTemplate}
                thumbnailsPosition={isMobile ? "bottom" : "left"}
              />
            </div>
          )}

          {/* Detalles del producto */}
          <div className="col-span-1 flex-col items-center justify-center text-center">
            {/* Nombre del producto */}
            <h1 className="font-bold text-4xl text-gray-900 mb-3 ">
              {producto.name}
            </h1>

            {/* Precio con y sin descuento */}
            <div className="mb-3">
              {producto.discount_percentage &&
                producto.discount_percentage > 0 && (
                  <span className="text-lg text-red-500 font-semibold">
                    {producto.discount_percentage}% de descuento
                  </span>
                )}
              <div className="flex justify-center items-center mt-1 space-x-4">
                {producto.discount_percentage &&
                  producto.discount_percentage > 0 && (
                    <span className=" text-2xl font-semibold text-red-600 line-through">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(producto.discount_price)}
                    </span>
                  )}
                <span className="text-4xl font-semibold text-gray-900">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(producto.price)}
                </span>
              </div>
            </div>
            <InputNumber
              inputId="horizontal-buttons"
              value={unidades[producto.id] || 0}
              onValueChange={(e) => handleUnitChange(producto.id, e.value)}
              showButtons
              min={1}
              buttonLayout="horizontal"
              decrementButtonClassName="p-button-danger"
              incrementButtonClassName="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              className="input-number-cart mb-1"
            />
            <div className="flex justify-center items-center align-middle"></div>
            {/* Botón Agregar al carrito */}
            <div className="mb-4">
              <Button
                label="Agregar"
                iconPos="right"
                icon="pi pi-shopping-cart"
                className=" button-green rounded-md bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 p-3"
                disabled={producto.stock === 0}
              />
            </div>

            {/* Descripción del producto */}
            {producto.description ? (
              <p className="text-gray-700 mb-3">{producto.description}</p>
            ) : (
              <p className="text-gray-500 italic mb-3">
                Sin descripción disponible
              </p>
            )}

            {/* Detalles adicionales */}
            <div className="mt-5">
              <p className="text-gray-600">
                <strong>Categoría:</strong>{" "}
                {producto.categories?.join(", ") || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Stock disponible:</strong> {producto.stock} unidades
              </p>
              <p className="text-gray-600">
                <strong>Calificación:</strong>{" "}
                {producto.rating || "Sin calificaciones"}
              </p>
            </div>

            {/* Detalle de Pago */}
            <div className="mt-8 border-t pt-5">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Detalle de Pago
              </h2>
              <p className="text-gray-700">
                <strong>Total a pagar por este producto:</strong>{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(producto.discount_price * unidades)}
              </p>
              <Button
                label="Ver métodos de pago"
                icon="pi pi-credit-card"
                className="mt-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white p-3"
                onClick={() =>
                  alert("Aquí mostrarías los métodos de pago disponibles.")
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
