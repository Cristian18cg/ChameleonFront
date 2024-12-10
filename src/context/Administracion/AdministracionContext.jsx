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
  const [listaImagenes, setListaImagenes] = useState([]);
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
        for (const image of imagenes) {
          const formData = new FormData();
          formData.append("images", image.file); // Archivo de la imagen
          formData.append("title", image.title || ""); // Título del banner
          formData.append("is_active", image.is_active || true); // Estado activo
          formData.append("is_mobil", image.is_mobil || false); // Imagen móvil

          const response = await clienteAxios.post(
            `administration/config/banners/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 201) {
            showSuccess(`Imagen ${image.title} subida exitosamente.`);
          } else {
            console.error("Error al subir la imagen:", response.data);
          }
        }
      } catch (error) {
        console.error("Error al subir las imágenes:", error);
        showError("Error al subir las imágenes. Intente nuevamente.");
      }
    },
    [token]
  );
  const EditarImagen = useCallback(
    async (imagen) => {
      try {
        const response = await clienteAxios.put(
          `administration/config/banners/${imagen.id}`,
          imagen,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListaImagenes((prevLista) =>
          prevLista.map((img) => (img.id === imagen.id ? response.data : img))
        );
        console.log(response.data);
        showSuccess(`Imagen ${imagen.title} editada exitosamente.`);
      } catch (error) {
        console.error("Error al subir las imágenes:", error);
        showError("Error al subir las imágenes. Intente nuevamente.");
      }
    },
    [token]
  );
  const EliminarImagen = useCallback(
    async (imagenid) => {
      try {
        await clienteAxios.delete(
          `administration/config/banners/${imagenid}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Actualiza la lista eliminando la imagen correspondiente
        setListaImagenes((prevLista) =>
          prevLista.filter((img) => img.id !== imagenid)
        );
        showSuccess(`Imagen  eliminada exitosamente.`);
      } catch (error) {
        console.error("Error al eliminar las imágenes:", error);
        showError("Error al eliminar la imagen. Intente nuevamente.");
      }
    },
    [token]
  );
  const ListarImagenesHome = useCallback(async () => {
    try {
      const response = await clienteAxios.get(
        `administration/config/banners/`,

        {
          headers: {
            "Content-Type": "multipart/form-data",
           
          },
        }
      );
      setListaImagenes(response.data);
    } catch (error) {
      console.error("Error listando imagen:", error);

      if (error.response) {
        console.error("Detalle del error:", error.response.data);

        // Capturar errores específicos del backend
        const backendErrors = error.response.data.errors || {};

        // Manejar errores de productos
        if (backendErrors.errors) {
          const productErrors = backendErrors.errors.join(", ");
          showError(`Errores al listar imagenes: ${productErrors}`);
        } else if (backendErrors.products) {
          const productErrors = backendErrors.products.join(", ");
          showError(`Problemas con las imagenes: ${productErrors}`);
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
  }, [token]);

  const contextValue = useMemo(() => {
    return {
      listaImagenes,
      EliminarImagen,
      EditarImagen,
      ListarImagenesHome,
      CrearImagenesHome,
      setListaImagenes,
    };
  }, [
    listaImagenes,
    EliminarImagen,
    EditarImagen,
    ListarImagenesHome,
    CrearImagenesHome,
    setListaImagenes,
  ]);

  return (
    <AdministracionContextControl.Provider value={contextValue}>
      {children}
    </AdministracionContextControl.Provider>
  );
};
export { AdministracionContextControl, AdministracionProvider };
