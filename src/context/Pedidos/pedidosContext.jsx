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
  const { token, jsonlogin } = useControl();
  const [activeIndex, setActiveIndex] = useState(0);
  const [valoresdomicilio, setvaloresdomicilio] = useState([]);
  const [listaPedidos, setlistaPedidos] = useState([]);
  const [valordomicilio, setvalordomicilio] = useState(0);
  const [valorPedido, setvalorPedido] = useState(0);
  const [loadingPedidosLista, setloadingPedidosLista] = useState(false);
  const [cupon, setcupon] = useState(0);

  const [usuario, setUsuario] = useState({
    id: jsonlogin?.id || "",
    nombres: jsonlogin?.first_name || "",
    apellidos: jsonlogin?.last_name || "",
    direccion: jsonlogin?.address || "",
    telefono: jsonlogin?.phone || "",
    correo: jsonlogin?.email || "",
    ciudad: jsonlogin?.city || "",
    department: jsonlogin?.department || "",
    tipoIdentificacion: jsonlogin?.type_document || "",
    numeroIdentificacion: jsonlogin?.number_document || "",

    envioDiferente: false,
    direccionEnvio: "", // Dirección de envío adicional
    ciudadEnvio: "", // Ciudad de envío adicional
    telefonoEnvio: "", // Teléfono auxiliar para la dirección de envío
    infoAdicionalEnvio: "", // Información adicional para la dirección de envío
    description: "", //Descripcion adicional del envio
  });
  const [errores, setErrores] = useState({
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    correo: "",
    ciudad: "",
    department: "",
    contrasena: "",
    terms_accepted: "",
    confirmarContrasena: "",
    tipoIdentificacion: "", // Error para tipo de identificación
    numeroIdentificacion: "", // Error para número de identificación

    departamentoEnvio: "",
    envioDiferente: "",
    direccionEnvio: "", // Dirección de envío adicional
    ciudadEnvio: "", // Ciudad de envío adicional
    telefonoEnvio: "", // Teléfono auxiliar para la dirección de envío
    infoAdicionalEnvio: "", // Información adicional para la dirección de envío
    description: "", //Descripcion adicional del envio
  });

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
  /* Mensaje de peticion Erronea */
  const showError = (error) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      background: "#f3f2e8f1",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: error ? error : "¡Ha ocurrido un error!",
      buttonsStyling: false,
    });
  };
  /* Mensaje de peticion exitosa */
  const showSuccess = (mensaje) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#f3f2e8",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: mensaje ? mensaje : "",
      buttonsStyling: false,
    });
  };
  // Guardar el carrito y las unidades en localStorage cuando cambien
  useEffect(() => {
    const infoguardada = localStorage.getItem("info_add");
    if (jsonlogin) {
      setUsuario({
        id: jsonlogin?.id || "",

        nombres: jsonlogin?.first_name || "",
        apellidos: jsonlogin?.last_name || "",
        direccion: jsonlogin?.address || "",
        telefono: jsonlogin?.phone || "",
        correo: jsonlogin?.email || "",
        ciudad: jsonlogin?.city || "",
        department: jsonlogin?.department || "",
        tipoIdentificacion: jsonlogin?.type_document || "",
        numeroIdentificacion: jsonlogin?.number_document || "",

        envioDiferente:  infoguardada?.envioDiferente || false,
        direccionEnvio: infoguardada?.direccionEnvio || "", // Dirección de envío adicional
        ciudadEnvio: infoguardada?.ciudadEnvio || "", // Ciudad de envío adicional
        telefonoEnvio: infoguardada?.telefonoEnvio || "", // Teléfono auxiliar para la dirección de envío
        infoAdicionalEnvio: infoguardada?.infoAdicionalEnvio || "", // Información adicional para la dirección de envío
        description: infoguardada?.description || "", //Descripcion adicional del envio
      });
    }
  }, [jsonlogin]);
  // Guardar el carrito y las unidades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("unidades", JSON.stringify(unidades));

    // Sumar todas las cantidades de productos en el carrito
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    setCantidadCarrito(totalUnidades);
  }, [carrito, unidades]);
  // Guardar el carrito y las unidades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("info_add", JSON.stringify(usuario));
  }, [usuario]);

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
  /* Validar datos de envio adicional  */
  const validarFormularioEnvio = useCallback(() => {
    let valid = true;
    let nuevosErrores = {};

    // Validar teléfono (solo números, máximo 10 dígitos)
    const regexTelefono = /^\(\+\d{2}\)\s\d{3}-\d{3}-\d{4}$/;

    // Validar campos vacíos principales
    if (usuario.envioDiferente) {
      Object.keys(usuario).forEach((campo) => {
        if (
          !usuario[campo] &&
          campo !== "direccionEnvio" &&
          campo !== "ciudadEnvio" &&
          campo !== "telefonoEnvio" &&
          campo !== "infoAdicionalEnvio"
        ) {
          nuevosErrores[campo] = "Este campo es obligatorio.";
          valid = false;
        }
      });
    }
    // Validar caracteres especiales peligrosos
    const regexCaracteresPeligrosos = /[$<>{}()'"`;%]/;
    if (
      regexCaracteresPeligrosos.test(usuario.infoAdicionalEnvio) ||
      regexCaracteresPeligrosos.test(usuario.description) ||
      regexCaracteresPeligrosos.test(usuario.direccionEnvio)
    ) {
      showError(
        `No se permiten caracteres especiales como: <>{}()'";% en ningun campo.`
      );
      return false;
    }
    // Validación de campos adicionales si `envioDiferente` está activado
    if (usuario.envioDiferente) {
      if (!regexTelefono.test(usuario.telefonoEnvio)) {
        nuevosErrores.telefonoEnvio =
          "El teléfono auxiliar debe estar en el formato (+XX) XXX-XXX-XXXX.";
        valid = false;
      }
      if (!usuario.direccionEnvio) {
        nuevosErrores.direccionEnvio = "La dirección de envío es obligatoria.";
        valid = false;
      }
      if (!usuario.ciudadEnvio) {
        nuevosErrores.ciudadEnvio = "La ciudad de envío es obligatoria.";
        valid = false;
      }
      if (!usuario.departamentoEnvio) {
        nuevosErrores.departamentoEnvio =
          "El departamento de envío es obligatoria.";
        valid = false;
      }
    }

    setErrores(nuevosErrores);
    return valid;
  }, [usuario]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!validarFormularioEnvio()) return;
      setActiveIndex(2);
      // Aquí puedes agregar la lógica para enviar el formulario si todo es válido.
    },
    [validarFormularioEnvio]
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

  const crearvalorDomicilio = useCallback(
    async (valorDomicilio) => {
      try {
        await clienteAxios.post(
          `administration/config/address`,
          {
            address_cost: valorDomicilio,
            is_active: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showSuccess(
          `Valor del domicilio creado exitosamente -> ${valorDomicilio}`
        );
        ValorDomicilio();
      } catch (error) {
        console.error(error);
        showError("Ha ocurrido un error creando el valor del domicilio");
      }
    },
    [token]
  );

  const editarvalorDomicilio = useCallback(
    async (domicilioInfo) => {
      try {
        await clienteAxios.put(
          `administration/config/address/${domicilioInfo.id}`,
          {
            address_cost: domicilioInfo.address_cost,
            is_active: domicilioInfo.isac,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showSuccess(
          `Valor del domicilio editado exitosamente -> ${domicilioInfo.id}`
        );
      } catch (error) {
        console.error(error);
        if (error.response.data.detail) {
          showError(`ha ocurrido un error: ${error.response.data.detail}`);
        } else {
          showError("Ha ocurrido un error creando el valor del domicilio");
        }
      }
    },
    [token]
  );

  const eliminarvalorDomicilio = useCallback(
    async (domicilioInfo) => {
      console.log("eli", domicilioInfo);
      try {
        await clienteAxios.delete(
          `administration/config/address/${domicilioInfo.id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showSuccess(
          `Valor del domicilio eliminado exitosamente -> ${domicilioInfo.address_cost}`
        );
        ValorDomicilio();
      } catch (error) {
        console.error(error);
        if (error.response.data.detail) {
          showError(`ha ocurrido un error: ${error.response.data.detail}`);
        } else {
          showError("Ha ocurrido un error eliminando el valor del domicilio");
        }
      }
    },
    [token]
  );

  const ValorDomicilio = useCallback(async () => {
    try {
      const response = await clienteAxios.get(`administration/config/address/`);

      setvaloresdomicilio(response.data);
    } catch (error) {
      console.error(error);
      showError("Ha ocurrido un error obteniendo el valor del domicilio");
    }
  }, []);
  const crearPedido = useCallback(async () => {
    try {
      const data = {
        different_shipping: usuario.envioDiferente,
        coupon: cupon,
        delivery_cost: valordomicilio,
        order_value: valorPedido,
        products: carrito.map((product) => ({
          product_name: product.name,
          description: product.description || "", // Ajustar descripción si está disponible
          unit_price: product.discount_price, // Cambia "price" según el campo correspondiente
          quantity: product.cantidad || 1, // Define una cantidad predeterminada si no está disponible
          subtotal: product.discount_price * (product.cantidad || 1), // Asegura el subtotal
        })),
      };

      // Agregar campos de envío solo si el usuario selecciona envío diferente
      if (usuario.envioDiferente) {
        data.shipping_address = usuario.direccionEnvio || "";
        data.shipping_city = usuario.ciudadEnvio || "";
        data.shipping_phone = usuario.telefonoEnvio || "";
        data.additional_info = usuario.infoAdicionalEnvio || "";
        data.description = usuario.description || "";
      }

      await clienteAxios.post(`orders/create_order/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Vaciar el carrito en el estado
      setCarrito([]);
      setVisibleCarrito(false)
      setUnidades([]);
      setActiveIndex(1);
      // Eliminar los datos del carrito y las unidades del localStorage
      localStorage.removeItem("carrito");
      localStorage.removeItem("unidades");

      // Reiniciar la cantidad total del carrito
      setCantidadCarrito(0);
      setvalorPedido(0)
      showSuccess(`El pedido ha sido creado exitosamente`);
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      if (error.response) {
        console.error("Detalle del error:", error.response.data);
        showError(
          `Ha ocurrido un error creando el pedido: ${
            error.response.data.error || "Error de validación"
          }`
        );
      } else {
        showError(
          "Ha ocurrido un error creando el pedido. Intente nuevamente."
        );
      }
    }
  }, [token, usuario, carrito, cupon, valordomicilio, valorPedido]);

  const listarPedidos = useCallback(async () => {
    try {
      setloadingPedidosLista(true)
      const response = await clienteAxios.get(
        `orders/orders/`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setlistaPedidos(response.data);
      setloadingPedidosLista(false)
    } catch (error) {
      setloadingPedidosLista(false)

      console.error("Error obteniendo pedidos:", error);
      if (error.response) {
        console.error("Detalle del error:", error.response.data);
        showError(
          `Ha ocurrido un error obteniendo los pedidos: ${
            error.response.data.error || "Error de validación"
          }`
        );
      } else {
        showError(
          "Ha ocurrido un error obteniendo los pedido. Intente nuevamente."
        );
      }
    }
  }, [token]);

  const contextValue = useMemo(() => {
    return {
      unidades,
      carrito,
      cantidadCarrito,
      visibleCarrito,
      usuario,
      errores,
      activeIndex,
      valoresdomicilio,
      valordomicilio,
      valorPedido,
      listaPedidos,
     
      loadingPedidosLista, 
      setloadingPedidosLista,
      setlistaPedidos,
      listarPedidos,
      setvalorPedido,
      setvalordomicilio,
      crearPedido,
      eliminarvalorDomicilio,
      editarvalorDomicilio,
      setvaloresdomicilio,
      ValorDomicilio,
      crearvalorDomicilio,
      setActiveIndex,
      handleSubmit,
      setErrores,
      setUsuario,
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
    usuario,
    errores,
    activeIndex,
    valoresdomicilio,
    valordomicilio,
    valorPedido,
    listaPedidos,
    setlistaPedidos,
    listarPedidos,
    setvalorPedido,
    setvalordomicilio,
    crearPedido,
    eliminarvalorDomicilio,
    editarvalorDomicilio,
    setvaloresdomicilio,
    ValorDomicilio,
    crearvalorDomicilio,
    setActiveIndex,
    handleSubmit,
    setErrores,
    setUsuario,
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
