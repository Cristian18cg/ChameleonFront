import { useState, createContext, useMemo, useCallback } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";

const ProductosContextControl = createContext();

const ProductosProvider = ({ children }) => {
  const [vistaCrearCat, setvistaCrearCat] = useState(false);
  const [categorias, setCategorias] = useState("");
  const [productos, setProductos] = useState("");
  const categoriapadre = [{ name: "Sin categoria", id: null }];
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };
  const [product, setProduct] = useState(emptyProduct);

  /* Funcion para verificar que no se ha vencido el token */
  const getItemWithExpiration = (key) => {
    const itemStr = localStorage.getItem(key);

    // Si el ítem no existe
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Si el ítem ha expirado
    if (now.getTime() > item.expiration) {
      localStorage.removeItem(key); // Eliminar el ítem expirado
      return null;
    }

    return item.value;
  };
  const token = getItemWithExpiration("accessToken");

  const FuncionErrorToken = useCallback((error) => {
    if (error?.response?.status === 401) {
      window.location.reload();
      showError("Tu token se vencio, por favor vuelve a iniciar sesión.");
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      showError(error?.response?.data.error);
    } else {
      showError("Ha ocurrido un error!");
    }
  }, []);
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

  const crearCategoria = useCallback(
    async (categoriaNombre, categoriaPadre) => {
      try {
        const response = await clienteAxios.post(
          "products/categories/",
          {
            name: categoriaNombre, // Nombre de la categoría
            parent: categoriaPadre, // ID de la categoría padre (si existe)
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        showSuccess(`Se creó la categoría ${categoriaNombre}`);
        setvistaCrearCat(false);
      } catch (error) {
        FuncionErrorToken(error);
        console.log(error);
        console.error("Error en la creación de la categoría: ", error);
      }
    },
    [FuncionErrorToken, token]
  );
  const listarCategorias = useCallback(async () => {
    try {
      const response = await clienteAxios.get(
        "products/categories/",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultado = categoriapadre.concat(response.data);
      setCategorias(resultado);
    } catch (error) {
      FuncionErrorToken(error);
      console.log(error);
      console.error("Error en la creación de la categoría: ", error);
    }
  }, [categoriapadre, token, FuncionErrorToken]);
  const obtenerProductos = useCallback(async () => {
    try {
      const response = await clienteAxios.get("products/products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productos = response.data;

      setProductos(productos); // Guardar productos en el estado
    } catch (error) {
      if (error.response) {
        // Inicializa una variable para el mensaje de error consolidado
        let mensajeError = "";
        // Recorre todos los errores del objeto error.response.data
        for (const campo in error.response.data) {
          if (error.response.data.hasOwnProperty(campo)) {
            // Si el valor del campo es un array, únelos en una cadena
            const erroresCampo = error.response.data[campo];
            if (Array.isArray(erroresCampo)) {
              mensajeError += erroresCampo.join(", ") + "\n";
            } else {
              mensajeError += erroresCampo + "\n";
            }
          }
        }

        // Mostrar el mensaje de error consolidado en SweetAlert
        Swal.fire({
          icon: "error",
          title: "Error de creacion",
          text: mensajeError || "Hubo un error en la creacion del producto.",
        });

        console.error("Error de respuesta del servidor:", error.response);
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "No se recibió respuesta del servidor",
          text: "Por favor, inténtelo de nuevo más tarde.",
        });
        console.error("No se recibió respuesta del servidor", error.request);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: error.message || "Ocurrió un error inesperado.",
        });
      }
      console.error("Error al obtener los productos:", error);
    }
  }, [token]);
  const crearProducto = useCallback(
    async (producto) => {
      try {
        const formData = new FormData();
        formData.append("name", producto.name);
        formData.append("code", producto.code);
        formData.append("description", producto.description);
        formData.append("price", producto.price);
        formData.append("stock", producto.stock);
        formData.append(
          "discount_price",
          producto.discount_price
            ? parseFloat(producto.discount_price).toFixed(2)
            : 0
        );
        formData.append(
          "discount_percentage",
          producto.discount_percentage
            ? parseFloat(producto.discount_percentage).toFixed(2)
            : 0
        );
        formData.append("categories", JSON.stringify(producto.categories)); // Enviar categorías como array
        if (producto.image) {
          formData.append("image", producto.image); // Si estás subiendo una imagen
        }

        const response = await clienteAxios.post(
          "products/products/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Porque estás enviando una imagen
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSuccess(`Producto ${producto.name} creado con éxito`);
        obtenerProductos();
      } catch (error) {
        console.log(error);
        if (error.response) {
          // Inicializa una variable para el mensaje de error consolidado
          let mensajeError = "";
          // Recorre todos los errores del objeto error.response.data
          for (const campo in error.response.data) {
            if (error.response.data.hasOwnProperty(campo)) {
              // Si el valor del campo es un array, únelos en una cadena
              const erroresCampo = error.response.data[campo];
              if (Array.isArray(erroresCampo)) {
                mensajeError += erroresCampo.join(", ") + "\n";
              } else {
                mensajeError += erroresCampo + "\n";
              }
            }
          }

          // Mostrar el mensaje de error consolidado en SweetAlert
          Swal.fire({
            icon: "error",
            title: "Error de creacion",
            text: mensajeError
              ? mensajeError
              : "Hubo un error en la creacion del producto.",
          });

          console.error("Error de respuesta del servidor:", error.response);
        } else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "No se recibió respuesta del servidor",
            text: "Por favor, inténtelo de nuevo más tarde.",
          });
          console.error("No se recibió respuesta del servidor", error.request);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: error.message || "Ocurrió un error inesperado.",
          });
        }
        console.error("Error en la creación del producto:", error);
      }
    },
    [obtenerProductos, token]
  );

  const eliminarProducto = useCallback(
    async (productoId) => {
      try {
        // Petición DELETE para eliminar el producto
        const response = await clienteAxios.delete(
          `products/products/${productoId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Si la petición fue exitosa, muestra un mensaje de éxito
        showSuccess(`Producto eliminado con éxito`);
      } catch (error) {
        // Manejo de errores
        if (error.response) {
          // Inicializa una variable para el mensaje de error consolidado
          let mensajeError = "";

          // Recorre todos los errores del objeto error.response.data
          for (const campo in error.response.data) {
            if (error.response.data.hasOwnProperty(campo)) {
              const erroresCampo = error.response.data[campo];
              if (Array.isArray(erroresCampo)) {
                mensajeError += erroresCampo.join(", ") + "\n";
              } else {
                mensajeError += erroresCampo + "\n";
              }
            }
          }

          // Mostrar el mensaje de error consolidado en SweetAlert
          Swal.fire({
            icon: "error",
            title: "Error al eliminar el producto",
            text:
              mensajeError || "Hubo un error al intentar eliminar el producto.",
          });

          console.error("Error de respuesta del servidor:", error.response);
        } else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "No se recibió respuesta del servidor",
            text: "Por favor, inténtelo de nuevo más tarde.",
          });
          console.error("No se recibió respuesta del servidor", error.request);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: error.message || "Ocurrió un error inesperado.",
          });
        }

        console.error("Error al intentar eliminar el producto:", error);
      }
    },
    [ token]
  );

  const contextValue = useMemo(() => {
    return {
      crearCategoria,
      listarCategorias,
      setCategorias,
      setvistaCrearCat,
      crearProducto,
      setProductos,
      setProductDialog,
      obtenerProductos,
      eliminarProducto,
      setDeleteProductDialog,
      setProduct,
      product,
      deleteProductDialog,
      productDialog,
      productos,
      vistaCrearCat,
      categorias,
    };
  }, [
    crearCategoria,
    listarCategorias,
    setCategorias,
    setvistaCrearCat,
    crearProducto,
    setProductos,
    obtenerProductos,
    setProductDialog,
    eliminarProducto,
    setDeleteProductDialog,
    setProduct,
    product,
    deleteProductDialog,
    productDialog,
    productos,
    vistaCrearCat,
    categorias,
  ]);

  return (
    <ProductosContextControl.Provider value={contextValue}>
      {children}
    </ProductosContextControl.Provider>
  );
};
export { ProductosContextControl, ProductosProvider };
