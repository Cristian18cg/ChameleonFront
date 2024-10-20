import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useControlProductos from "../../hooks/useControlProductos";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";
import { TreeSelect } from "primereact/treeselect";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { Galleria } from "primereact/galleria";

export const ProductoDetallado = () => {
  const { producto, obtenerProducto } = useControlProductos();
  const [unidades, setunidades] = useState(1);
  const { id } = useParams(); // Captura el id de la URL

  useEffect(() => {
    if (id) {
      console.log("id", id);
      obtenerProducto(id);
    }
    console.log(producto);
  }, [producto, id]);

  const itemTemplateImg = (item) => {
    return (
      <img
        alt={producto.images ? producto.name : item?.name}
        src={producto.images ? item.image_url : item?.objectURL}
        style={{ width: "300px" }}
        className="rounded imagen-galeria"
      />
    );
  };
  const thumbnailTemplate = (item) => {
    return (
      <img
        alt={producto.images ? producto.name : item?.name}
        src={producto.images ? item.image_url : item?.objectURL}
        style={{ width: "80px" }}
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
      numVisible: 2,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];
  return (
    <div className="flex justify-center">
      <div className="card border-2 w-3/4 rounded-md border-gray-200 mt-5 shadow-lg">
        {/* Grid con dos columnas */}
        <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {/* Imagen del producto */}
          {producto?.images && (
            <div className="card  col-span-1 flex-col
             ">
              <Galleria
                value={producto?.images}
                responsiveOptions={responsiveOptions}
                numVisible={6}
                item={itemTemplateImg}
                className="w-full custom-galleria relative" // Ajustar el ancho de la galería
                thumbnail={thumbnailTemplate}
                thumbnailsPosition="left"
                autoPlay
                circular
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
              <div className="flex  justify-center items-center mt-1 space-x-4">
                {producto.discount_percentage &&
                  producto.discount_percentage > 0 && (
                    <span className="text-2xl font-semibold text-red-600 line-through">
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
              value={unidades}
              onValueChange={(e) => setunidades(e.value)}
              showButtons
              min={0}
              buttonLayout="horizontal"
              decrementButtonClassName="p-button-danger"
              incrementButtonClassName="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              className="input-number-cart mb-2"
            />
            <div className="flex justify-center items-center align-middle"></div>
            {/* Botón Agregar al carrito */}
            <div className="mb-4">
              <Button
                label="Agregar al carrito"
                iconPos="right"
                icon="pi pi-shopping-cart"
                className=" button-green rounded-full bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 p-3"
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
