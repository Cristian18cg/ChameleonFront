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
import useControlProductos from "../../hooks/useControlProductos";

const AdministracionContextControl = createContext();

const AdministracionProvider = ({ children }) => {
  const { token, jsonlogin } = useControl();
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
  const CrearImagenesHome = useCallback(
    async (imagenes) => {
      try {
        await clienteAxios.post(`administration/config/address/`, imagenes, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        // Mostrar éxito
        showSuccess(`La imagen se ha subido exitosamente`);
      } catch (error) {
        console.error("Error subiendo imagen:", error);

        if (error.response) {
          console.error("Detalle del error:", error.response.data);

          // Capturar errores específicos del backend
          const backendErrors = error.response.data.errors || {};

          // Manejar errores de productos
          if (backendErrors.errors) {
            const productErrors = backendErrors.errors.join(", ");
            showError(`Errores al crear el pedido: ${productErrors}`);
          } else if (backendErrors.products) {
            const productErrors = backendErrors.products.join(", ");
            showError(`Problemas con los productos: ${productErrors}`);
            showError(`Intenta volver a llenar tu carrito.`);
          } else {
            // Error genérico del backend
            const errorMessage =
              error.response.data.error ||
              "Ha ocurrido un error creando el pedido. Intente nuevamente.";
            showError(errorMessage);
          }
        } else {
          // Error de red o sin respuesta del backend
          showError(
            "No se pudo conectar al servidor. Verifique su conexión a internet e intente nuevamente."
          );
        }
      }
    },
    [token]
  );

  const contextValue = useMemo(() => {
    return {
      CrearImagenesHome,
    };
  }, [CrearImagenesHome]);

  return (
    <AdministracionContextControl.Provider value={contextValue}>
      {children}
    </AdministracionContextControl.Provider>
  );
};
export { AdministracionContextControl, AdministracionProvider };
