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
import useControlAdministracion from "../../hooks/useControlAdministracion";
import { motion } from "framer-motion";
import useControlProductos from "../../hooks/useControlProductos";
import useControlPedidos from "../../hooks/useControlPedidos";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { listaImagenes, ListarImagenesHome } = useControlAdministracion();
  const { productos, obtenerProductos } = useControlProductos();
  const { agregarAlCarrito, unidades, isProductoEnCarrito } =
    useControlPedidos();
  const [bannerImage, setBannerImage] = useState(null);
  const variants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.5 } },
  };
  useEffect(() => {
    // Cargar las imágenes si la lista está vacía
    if (listaImagenes.length === 0) {
      ListarImagenesHome();
    } else {
      // Filtrar las imágenes activas y seleccionar según el dispositivo
      const isMobile = window.innerWidth <= 768; // Definir límite para móviles
      const filteredImages = listaImagenes.filter(
        (img) => img.is_active && img.is_mobil === isMobile
      );

      // Seleccionar la primera imagen activa según el dispositivo
      if (filteredImages.length > 0) {
        setBannerImage(filteredImages[0]);
      } else {
        // Si no hay imágenes específicas para el dispositivo, usar cualquiera activa
        const fallbackImages = listaImagenes.filter((img) => img.is_active);
        if (fallbackImages.length > 0) {
          setBannerImage(fallbackImages[0]);
        }
      }
    }
  }, [listaImagenes]);

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
      <motion.div
        className="relative h-[600px] w-full"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants} // Variantes aplicadas al contenedor
      >
        <img
          src={bannerImage?.image_url}
          alt={bannerImage?.title || "Banner"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            className="text-center text-white px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {bannerImage?.title || "Título del Banner"}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {bannerImage?.description || ""}
            </p>
            {bannerImage?.show_button && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (bannerImage.button_url) {
                    window.location.href = bannerImage.button_url;
                  } else {
                    navigate(`/tienda/`);
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg transition duration-300"
              >
                {bannerImage?.button_text || "Comprar Ahora"}
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>

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
          style={{ height: "auto" }} // Ajustar altura al contenido
        >
          {saleProducts.map((product) => (
            <SwiperSlide
              className="mb-6"
              key={product.id}
              style={{ height: "auto" }} // Ajustar altura al contenido
            >
              <div
                onClick={() => {
                  navigate(`/tienda/${product.id}`);
                }}
                className="hover:cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.images[0].image_url}
                    alt={product.name}
                    className="w-60 sm:w-64 xl:w-80 shadow-lg mx-auto rounded  object-contain"
                  />
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full font-semibold text-xl">
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
                  <p className="text-gray-600 line-through mb-4">
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
                <div className="bg-green-100 w-16 h-16 2xl:w-48 2xl:h-48 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-500 text-2xl 2xl:text-6xl">
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
            <SwiperSlide className="mb-8" key={product.id}>
              <div
                onClick={() => {
                  navigate(`/tienda/${product.id}`);
                }}
                className="hover:cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden mb-2"
              >
                <img
                  src={product.images[0].image_url}
                  alt={product.name}
                  className="w-60 sm:w-64 xl:w-80 shadow-lg mx-auto  rounded object-contain"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      NUEVO
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {" "}
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
