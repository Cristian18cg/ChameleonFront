import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { InputNumber } from "primereact/inputnumber";
import { Steps } from "primereact/steps";
import { classNames } from "primereact/utils";
import useControlProductos from "../../hooks/useControlProductos";
import useControl from "../../hooks/useControl";
import useControlPedidos from "../../hooks/useControlPedidos";
import {FormularioUsuario} from './Formularios/FormularioUsuario'
export const Carritocompras = () => {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { unidades, setUnidades } = useControlPedidos();
  const { productos } = useControlProductos();
  const { isLoggedIn,setVisibleProfile } = useControl();

  const {
    carrito,
    setCarrito,
    handleUnitChange,
    eliminarDelCarrito,
    setVisibleCarrito,
    handleSubmit
  } = useControlPedidos();
  useEffect(() => {
    if (productos.length > 0) {
      setProducts(carrito);
    }
  }, [carrito]);

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const precio = item.discount_price ? item.discount_price : item.price;
      return total + precio * item.cantidad;
    }, 0);
  };
  const itemTemplate = (product, index) => {
    return (
      <div className="col-12 w-full" key={product.id}>
        <div
          className={classNames(
            "flex flex-row items-start p-3 border-b border-gray-300 dark:border-gray-700",
            { "border-t-0": index === 0 }
          )}
        >
          <img
            className="w-20 sm:w-20 xl:w-20 shadow-lg block mx-auto rounded-xl mr-2"
            src={product?.images[0]?.image_url}
            alt={product.name}
          />
          <div className="flex flex-row justify-between items-center w-full max-w-full">
            <div className="flex flex-col ">
              <div className="text-lg  2xl:text-2xl  font-semibold ml-4 text-gray-700 dark:text-gray-100 min-w-20 max-w-20">
                {product.name}
              </div>
            </div>
            <div className="flex flex-col justify-center items-end md:gap-3">
              <div className="grid grid-cols-1">
                {product.discount_percentage &&
                  product.discount_percentage > 0 && (
                    <div className="flex justify-center">
                      <span className="text-lg lg:text-md 2xl:text-xl font-semibold text-red-400 line-through">
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
                  <span className="text-2xl md:text-lg lg:text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(
                      product.discount_percentage &&
                        product.discount_percentage > 0
                        ? product.discount_price
                        : product.price
                    )}
                  </span>
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
                  className="input-number-cart max-w-4rem mt-2 w-40 "
                />
              </div>
            </div>
            <i
              className="pi pi-trash text-red-600 text-md ml-2 mt-2 cursor-pointer flex  justify-center"
              onClick={() => eliminarDelCarrito(product.id)}
            />
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
  const itemRenderer = (item, itemIndex) => {
    const isActiveItem = activeIndex === itemIndex;
    const backgroundColor = isActiveItem
      ? "var(--primary-color)"
      : "var(--surface-b)";
    const textColor = isActiveItem
      ? "var(--surface-b)"
      : "var(--text-color-secondary)";

    return (
      <span
        className="inline-flex   align-items-center justify-content-center align-items-center border-green-200 rounded-full h-8 w-8 z-50 cursor-pointer"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          marginTop: "-25px",
        }}
        onClick={() => setActiveIndex(itemIndex)}
      >
        <i className={`${item.icon} text-md ml-2 mt-2`} />
      </span>
    );
  };

  const items = [
    {
      icon: "pi pi-shopping-cart",
      template: (item) => itemRenderer(item, 0),
    },
    {
      icon: "pi pi-user",
      template: (item) => itemRenderer(item, 1),
    },
    {
      icon: "pi pi-truck",
      template: (item) => itemRenderer(item, 2),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col ">
      <div className="card">
        <Steps
          model={items}
          activeIndex={activeIndex}
          readOnly={true}
          className="m-2 mt-10 mb-5"
        />{" "}
      </div>
      {activeIndex === 0 ? (
        <>
          {/* Si hay productos o no en el carrito */}
          {carrito.length > 0 ? (
            <DataView
              value={products}
              listTemplate={listTemplate}
              className="flex-grow overflow-auto"
            />
          ) : (
            <div className="flex-grow  flex flex-col justify-center items-center">
              <i className="pi pi-info-circle text-7xl mb-3"></i>
              <h3 className="font-semibold text-xl">
                No hay productos en el carrito
              </h3>
            </div>
          )}
          <div className="w-full p-2 border-t-2">
            <div className="mb-2">
              {/* Resumen de la compra */}
              <h3 className="text-lg font-bold">Resumen de la compra</h3>
            </div>
            <div className="flex justify-between">
              {/* Total */}
              <div className="font-semibold text-lg mb-4">
                <span>Sub-total: </span>
                <span>
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(calcularTotal())}
                </span>
              </div>
              {/* Botón de continuar */}
              <Button
                label="Continuar"
                icon={"pi pi-chevron-right"}
                iconPos="right"
                disabled={carrito.length > 0 ? false : true}
                onClick={() => {
                  setActiveIndex(1);
                }}
              />
            </div>
          </div>
        </>
      ) : activeIndex === 1 ? (
        // Contenido para datos de envio
        <>
          {isLoggedIn ? (
            <div className="flex-grow w-full  overflow-auto">
             <FormularioUsuario/>
            </div>
          ) : (
            /* no registrado */
            <div className=" flex-grow flex flex-col justify-center items-center">
              <i className="pi pi-user text-7xl mb-3"></i>
              <h3 className="font-semibold text-lg">
                Para continuar necesitas iniciar sesion o registrarte
              </h3>
              <i
                onClick={() => {
                  setVisibleCarrito(false);
                  setVisibleProfile(true)
                }}
                className="text-purple-700 hover:cursor-pointer"
              >
                Iniciar sesión o registrarme
              </i>
            </div>
          )}

          {/* footer */}
          <div className="w-full p-2 border-t-2">
            <div className="flex justify-between">
              {/* Botón de Volver */}
              <Button
                label="Volver"
                icon={"pi pi-chevron-left"}
                iconPos="left"
                disabled={carrito.length > 0 ? false : true}
                onClick={() => {
                  setActiveIndex(0);
                }}
                severity="danger"
              />
               <form onSubmit={handleSubmit}>
              {/* Botón de continuar */}
              <Button
              type="submit"
                label="Continuar"
                icon={"pi pi-chevron-right"}
                iconPos="right"
                disabled={carrito.length > 0 ? false : true}
               
              />
              </form>
            </div>
          </div>
          {/* Agrega aquí el contenido que quieres mostrar cuando activeIndex sea 2 */}
        </>
      ) : null}
    </div>
  );
};
