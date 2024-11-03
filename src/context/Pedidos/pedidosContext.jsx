import {
  useState,
  useEffect,
  createContext,
  useMemo,
  useCallback,
} from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";

const PedidosContextControl = createContext();

const PedidosProvider = ({ children }) => {
  const { token } = useControl();

  const [unidades, setUnidades] = useState(() => {
    const unidadesGuardadas = localStorage.getItem("unidades");
    return unidadesGuardadas ? JSON.parse(unidadesGuardadas) : {};
  });
  const [visibleCarrito, setVisibleCarrito] = useState(false);

  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  // Guardar el carrito y las unidades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("unidades", JSON.stringify(unidades));

    // Sumar todas las cantidades de productos en el carrito
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    setCantidadCarrito(totalUnidades);
  }, [carrito, unidades]);

  // Sincronizar entre pestañas
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "carrito" && event.newValue) {
        setCarrito(JSON.parse(event.newValue));
      }
      if (event.key === "unidades" && event.newValue) {
        setUnidades(JSON.parse(event.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleUnitChange = useCallback((productId, value) => {
    setUnidades((prevUnidades) => ({
      ...prevUnidades,
      [productId]: value,
    }));

    setCarrito((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === productId ? { ...item, cantidad: value } : item
      )
    );
  }, []);

  const agregarAlCarrito = useCallback(
    (producto, cantidad) => {
      if (cantidad > 0) {
        const productoEnCarrito = carrito.find(
          (item) => item.id === producto.id
        );

        if (productoEnCarrito) {
          setCarrito(
            carrito.map((item) =>
              item.id === producto.id
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            )
          );
        } else {
          setCarrito([...carrito, { ...producto, cantidad }]);
        }
      }
    },
    [carrito]
  );

  const isProductoEnCarrito = useCallback(
    (productId) => {
      return carrito.some((item) => item.id === productId);
    },
    [carrito]
  );

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = useCallback(
    (productId) => {
      setCarrito(carrito.filter((item) => item.id !== productId));
      setUnidades((prevUnidades) => {
        const nuevasUnidades = { ...prevUnidades };
        delete nuevasUnidades[productId];
        return nuevasUnidades;
      });
    },
    [carrito]
  );
  const contextValue = useMemo(() => {
    return {
      unidades,
      carrito,
      cantidadCarrito,
      visibleCarrito,
      setVisibleCarrito,
      eliminarDelCarrito,
      setCantidadCarrito,
      isProductoEnCarrito,
      handleUnitChange,
      agregarAlCarrito,
      setCarrito,
      setUnidades,
    };
  }, [
    unidades,
    carrito,
    cantidadCarrito,
    visibleCarrito,
    setVisibleCarrito,
    eliminarDelCarrito,
    setCantidadCarrito,
    isProductoEnCarrito,
    handleUnitChange,
    agregarAlCarrito,
    setCarrito,
    setUnidades,
  ]);

  return (
    <PedidosContextControl.Provider value={contextValue}>
      {children}
    </PedidosContextControl.Provider>
  );
};
export { PedidosContextControl, PedidosProvider };
