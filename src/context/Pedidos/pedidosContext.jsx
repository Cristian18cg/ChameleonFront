import { useState, createContext, useMemo, useCallback } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";

const PedidosContextControl = createContext();

const PedidosProvider = ({ children }) => {
  const { token } = useControl();
  const [unidades, setUnidades] = useState({});
  const [carrito, setCarrito] = useState([]);

  const handleUnitChange = useCallback((productId, value) => {
    // Actualiza las unidades locales
    setUnidades((prevUnidades) => ({
      ...prevUnidades,
      [productId]: value,
    }));

    // Si el producto ya está en el carrito, actualiza su cantidad
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === productId ? { ...item, cantidad: value } : item
      )
    );
  }, []);

  // Añadir al carrito solo cuando se haga clic en "Agregar"
  const agregarAlCarrito = useCallback(
    async (producto, cantidad) => {
      console.log(producto);
      if (cantidad > 0) {
        // Verifica si el producto ya está en el carrito
        const productoEnCarrito = carrito.find(
          (item) => item.id === producto.id
        );

        if (productoEnCarrito) {
          // Si el producto ya está en el carrito, actualiza la cantidad
          setCarrito(
            carrito.map((item) =>
              item.id === producto.id
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            )
          );
        } else {
          // Si el producto no está en el carrito, lo agrega
          setCarrito([...carrito, { ...producto, cantidad }]);
        }

        // Muestra un mensaje de éxito
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

  const contextValue = useMemo(() => {
    return {
      unidades,
      carrito,
      isProductoEnCarrito,
      handleUnitChange,
      agregarAlCarrito,
      setCarrito,
      setUnidades,
    };
  }, [
    unidades,
    carrito,
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
