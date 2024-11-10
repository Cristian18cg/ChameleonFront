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

  const [usuario, setUsuario] = useState({
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
if (jsonlogin){
  setUsuario ({
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
  })
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
      console.log('eli',domicilioInfo)
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
        ValorDomicilio()
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
