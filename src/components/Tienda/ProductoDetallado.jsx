import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useControlProductos from "../../hooks/useControlProductos";
import useControlPedidos from "../../hooks/useControlPedidos";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

export const ProductoDetallado = () => {
  const {
    producto,
    obtenerProducto,
    productos,
    loadingProducto,
    obtenerProductos,
  } = useControlProductos();
  const { id } = useParams(); // Captura el id de la URL
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const {
    unidades,
    setUnidades,
    isProductoEnCarrito,
    agregarAlCarrito,
    handleUnitChange,
  } = useControlPedidos();

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
    if (productos.length > 0 && producto) {
      // Filtrar productos relacionados basados en categorías
      const relacionados = productos.filter(
        (prod) =>
          prod.id !== producto.id && // Excluir el producto actual
          prod.categories.some((cat) => producto.categories.includes(cat)) // Coincidencia en categorías
      );

      // Si hay menos de 6 productos relacionados, rellenar con otros
      const adicionales = productos
        .filter(
          (prod) => prod.id !== producto.id && !relacionados.includes(prod)
        )
        .slice(0, Math.max(0, 6 - relacionados.length));

      setNewArrivals([...relacionados, ...adicionales].slice(0, 6)); // Limitar a 6 productos
    }
  }, [productos, producto]);

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    if (id) {
      obtenerProducto(id);
    }
  }, [id]);

  const itemTemplateImg = (item) => {
    return (
      <img
        alt={producto.images ? producto.name : item?.name}
        src={producto.images ? item.image_url : item?.objectURL}
        className=" rounded-t-lg  xl:rounded-tl-none xl:rounded-r-xl   md:w-full lg:w-full xl:w-full"
      />
    );
  };
  const thumbnailTemplate = (item) => {
    return (
      <img
        alt={producto.images ? item.name : item?.name}
        src={producto.images ? item.image_url : item?.objectURL}
        className="w-12  md:w-12 lg:w-14 xl:w-24"
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
    <div className=" mt-20  flex justify-center">
      <Dialog
        header=" METODOS DE PAGO"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        className="w-11/12 md:w-1/3 bg-gray-300"
      >
        {/* Contenedor de las imágenes */}
        <div className="flex  w-full mt-1 bg-gray-100  justify-center items-center gap-4">
          <img
            src="/metodos-de-pago/NEQUI.webp"
            alt="Nequi"
            className="w-24 h-auto object-contain"
          />
          <img
            src="/metodos-de-pago/daviplata.jpeg"
            alt="daviplata"
            className="w-24 h-auto object-contain"
          />
          <div className="flex flex-col items-center">
            <img
              src="/metodos-de-pago/efectivo.png"
              alt="Efectivo"
              className="w-24 h-auto object-contain"
            />
            <span className="mt-2 text-sm font-medium">Efectivo</span>
          </div>
        </div>

        {/* Texto descriptivo (opcional) */}
        <p className=" mt-4 text-sm text-gray-600">
          Puedes realizar tus pagos con cualquiera de estos métodos disponibles.
        </p>
      </Dialog>
      {!loadingProducto ? (
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
                  thumbnail={thumbnailTemplate}
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
                min={producto.stock === 0 ? 0 : 1}
                max={producto.stock}
                disabled={producto.stock === 0}
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                className="input-number-cart2 mb-1"
              />
              <div className="flex justify-center items-center align-middle"></div>
              {/* Botón Agregar al carrito */}
              <div className="mb-4">
                <Button
                  label={
                    isProductoEnCarrito(producto.id)
                      ? "Agregado"
                      : "Agregar al Carrito"
                  }
                  icon={
                    isProductoEnCarrito(producto.id)
                      ? "pi pi-check"
                      : "pi pi-shopping-cart"
                  }
                  className={`p-button mt-2 ${
                    isProductoEnCarrito(producto.id)
                      ? "p-button-success"
                      : "p-button-primary"
                  }`}
                  disabled={
                    isProductoEnCarrito(producto.id) || producto.stock === 0
                  }
                  onClick={() =>
                    agregarAlCarrito(producto, unidades[producto.id] || 1)
                  }
                />
              </div>

              {/* Descripción del producto */}
              {producto.description ? (
                <p className="text-gray-700 mb-3 xl:text-lg">
                  {producto.description}
                </p>
              ) : (
                <p className="text-gray-500 italic mb-3">
                  Sin descripción disponible
                </p>
              )}

              {/* Detalles adicionales */}
              <div className="mt-5 flex flex-col justify-center items-center">
                <p className="text-gray-600 xl:text-xl">
                  <strong>Categoría:</strong>{" "}
                  {producto.categories?.join(", ") || "N/A"}
                </p>
                <p className="text-gray-600 xl:text-xl">
                  <strong>Stock disponible:</strong> {producto.stock} unidades
                </p>
                <div className="flex flex-row">
                  <Rating
                    value={producto.rating}
                    readOnly
                    cancel={false}
                    className="mx-2 text-yellow-500"
                  ></Rating>{" "}
                </div>
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
                  }).format(producto.discount_price * unidades[producto.id])}
                </p>
                <Button
                  label="Ver métodos de pago"
                  icon="pi pi-credit-card"
                  className="mt-3 border-blue-600 bg-blue-500 hover:bg-blue-600 text-white p-3"
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-5">
            {" "}
            <div className="py-2 px-2 md:px-4 ">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Productos relacionados
              </h2>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500 }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 5 },
                }}
              >
                {newArrivals.map((product) => (
                  <SwiperSlide className="mb-8" key={product.id}>
                    <div
                      onClick={() => {
                        navigate(`/tienda/${product.id}`);
                      }}
                      className="hover:cursor-pointer bg-white rounded-lg shadow-xl  overflow-hidden mb-2 p-8"
                    >
                      <img
                        src={product.images[0].image_url}
                        alt={product.name}
                        className="w-40 sm:w-52 xl:w-52 shadow-lg mx-auto rounded  "
                      />
                      <div className="p-6  md:p-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }).format(product.price)}
                        </p>
                        <Button
                          label={
                            isProductoEnCarrito(product.id)
                              ? "Agregado"
                              : "Agregar al Carrito"
                          }
                          icon={
                            isProductoEnCarrito(product.id)
                              ? "pi pi-check"
                              : "pi pi-shopping-cart"
                          }
                          className={`p-button mt-2 ${
                            isProductoEnCarrito(product.id)
                              ? "p-button-success"
                              : "p-button-primary"
                          }`}
                          disabled={
                            isProductoEnCarrito(product.id) ||
                            product.stock === 0
                          }
                          onClick={() =>
                            agregarAlCarrito(product, unidades[product.id] || 1)
                          }
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-52 card flex flex-col justify-center items-center">
            <ProgressSpinner
              style={{ width: "80px", height: "80px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        </>
      )}
    </div>
  );
};
