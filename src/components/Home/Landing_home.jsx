import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "primereact/button";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaLeaf,
  FaRecycle,
  FaHeart,
  FaStar,
  FaArrowRight,
  FaWater,
  FaTree,
  FaBaby,
} from "react-icons/fa";
import useControlProductos from "../../hooks/useControlProductos";
import useControlPedidos from "../../hooks/useControlPedidos";
const HomePage = () => {
  const {
    productos,
    setProductos,
    agregarProducto,
    eliminarProducto,
    obtenerProductos,
  } = useControlProductos();
  const {
    carrito,
    agregarAlCarrito,
    handleUnitChange,
    setCarrito,
    unidades,
    setUnidades,
    isProductoEnCarrito,
  } = useControlPedidos();
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (productos.length === 0) {
      obtenerProductos();
    } else {
      // Filtrar productos en oferta
      let filteredSaleProducts = productos.filter(
        (product) => product.stock > 0 && product.discount_price !== null
      );

      // Si hay menos de 6 productos en oferta, rellenar con productos que tengan descuento pero sin stock
      if (filteredSaleProducts.length < 6) {
        const additionalSaleProducts = productos
          .filter((product) => product.discount_price !== null)
          .slice(0, 6 - filteredSaleProducts.length); // Tomar solo los necesarios
        filteredSaleProducts = [
          ...filteredSaleProducts,
          ...additionalSaleProducts,
        ];
      }
      setSaleProducts(filteredSaleProducts.slice(0, 6)); // Asegurar un máximo de 6

      // Filtrar nuevos productos (considerar los creados en los últimos 7 días)
      const NEW_PRODUCT_THRESHOLD_DAYS = 7;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - NEW_PRODUCT_THRESHOLD_DAYS);

      let filteredNewArrivals = productos.filter(
        (product) => new Date(product.created_at) >= oneWeekAgo
      );

      // Si hay menos de 6 productos nuevos, rellenar con otros productos
      if (filteredNewArrivals.length < 6) {
        const additionalNewArrivals = productos
          .filter((product) => !filteredNewArrivals.includes(product)) // Evitar duplicados
          .slice(0, 6 - filteredNewArrivals.length); // Tomar solo los necesarios
        filteredNewArrivals = [
          ...filteredNewArrivals,
          ...additionalNewArrivals,
        ];
      }
      setNewArrivals(filteredNewArrivals.slice(0, 6)); // Asegurar un máximo de 6
    }
  }, [productos]);

  const [saleProducts, setSaleProducts] = useState([]);

  const [newArrivals, setNewArrivals] = useState([]);

  const benefits = [
    {
      icon: <FaLeaf />,
      title: "100% Biodegradable",
      description:
        "Hecho de materiales sostenibles que se descomponen de forma natural",
    },
    {
      icon: <FaHeart />,
      title: "Suave con la Piel",
      description: "Hipoalergénico y perfecto para pieles sensibles",
    },
    {
      icon: <FaRecycle />,
      title: "Eco-Certificado",
      description: "Certificado por las principales organizaciones ambientales",
    },
    {
      icon: <FaWater />,
      title: "Súper Absorbente",
      description: "Absorción superior mientras cuida el medio ambiente",
    },
    {
      icon: <FaTree />,
      title: "Materiales Sostenibles",
      description:
        "Fabricado con recursos renovables y materiales de origen vegetal",
    },
    {
      icon: <FaBaby />,
      title: "Ajuste Perfecto",
      description: "Diseñado para máximo confort y movilidad",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Banner Section */}
      <div className="relative h-[600px] w-full">
        <img
          src="https://images.unsplash.com/photo-1544829832-c8047d6b6457"
          alt="Eco-friendly diapers banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Suave para el Bebé, Amable con la Tierra
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Pañales Premium Ecológicos para tu Pequeño
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg transition duration-300">
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Sale Products Slider */}
      <div className="py-16 px-4 md:px-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Ofertas Especiales
        </h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {saleProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={product.images[0].image_url}
                    alt={product.name}
                    className="w-60 sm:w-64 xl:w-80 shadow-lg mx-auto "
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(product.discount_price)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
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
                      isProductoEnCarrito(product.id) || product.stock === 0
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

      {/* Beneficios Seccion */}
      <div className="bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Beneficios de nuestros pañales ecologicos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-lg"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-500 text-2xl">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Slider */}
      <div className="py-10 px-4 md:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nuevos Productos
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
            1024: { slidesPerView: 3 },
          }}
        >
          {newArrivals.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={product.images[0].image_url}
                  alt={product.name}
                  className="w-60 sm:w-64 xl:w-80 shadow-lg mx-auto "
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.price}</p>
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
                      isProductoEnCarrito(product.id) || product.stock === 0
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

      {/* CTA Section */}
      <div className="bg-green-500 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Entra en el Movimiento Eco-Friendly{" "}
          </h2>
          <p className="text-xl mb-8">
            Subscribe y obtén actualizacion y precios especiales
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full text-gray-800 w-full md:w-96"
            />
            <button className="bg-white text-green-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center">
              Suscribete <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
