import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { InputNumber } from "primereact/inputnumber";

import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import useControlProductos from "../../hooks/useControlProductos";
import useControlPedidos from "../../hooks/useControlPedidos";
export const Carritocompras = () => {
  const [products, setProducts] = useState([]);
  const { unidades, setUnidades } = useControlPedidos();
  const { productos } = useControlProductos();

  const { carrito, setCarrito, handleUnitChange } = useControlPedidos();
  useEffect(() => {
    console.log("carrito", carrito);
    if (productos.length > 0) {
      setProducts(carrito);
    }
  }, [carrito]);

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const itemTemplate = (product, index) => {
    return (
      <div className="col-12" key={product.id}>
        <div
          className={classNames(
            "flex flex-row items-start p-4 gap-4 border-b border-gray-300 dark:border-gray-700", 
            { "border-t-0": index === 0 }
          )}
        >
          <img
            className="w-20 sm:w-20 xl:w-20 shadow-lg block mx-auto rounded-xl"
            src={product?.images[0]?.image_url}
            alt={product.name}
          />
          <div className="flex flex-row justify-between items-start flex-1 md:gap-4">
            <div className="flex flex-col items-center sm:items-start md:gap-3">
              <div className="text-lg xl:text-2xl font-semibold text-gray-700 dark:text-gray-100">
                {product.name}
              </div>
            </div>
            <div className="flex flex-col items-center  md:gap-3 justify-center">
              <div className="">
                <div className="grid grid-cols-1">
                  {product.discount_percentage && product.discount_percentage > 0 && (
                    <div className="flex justify-center">
                      <span className="text-lg md:text-xl font-semibold text-red-400 line-through">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(product.price)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <span className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(
                        product.discount_percentage && product.discount_percentage > 0
                          ? product.discount_price
                          : product.price
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <InputNumber
                inputId="horizontal-buttons"
                value={unidades[product.id] || 0}
                onValueChange={(e) => handleUnitChange(product.id, e.value)}
                showButtons
                min={1}
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                className="input-number-cart max-w-5rem "
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return itemTemplate(product, index);
    });

    return <div className="grid grid-nogutter">{list}</div>;
  };

  return (
    <div className="card">
      <DataView value={products} listTemplate={listTemplate} />
    </div>
  );
};
