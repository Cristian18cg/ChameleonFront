import { useState, createContext, useMemo, useCallback } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";

const ProductosContextControl = createContext();

const ProductosProvider = ({ children }) => {
  const { token } = useControl();
  const [vistaCrearCat, setvistaCrearCat] = useState(false);
  const [categorias, setCategorias] = useState("");
  const [productos, setProductos] = useState("");
  const [producto, setProducto] = useState("");
  const [btndelCate, setbtndelCate] = useState(true);
  const [loadingProducts, setloadingProducts] = useState(true);
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

  // Solo una vez al montar el componente

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
  const listarCategorias = useCallback(async () => {
    try {
      const response = await clienteAxios.get("products/categories/");
      const resultado = categoriapadre.concat(response.data);
      setCategorias(resultado);
    } catch (error) {
      FuncionErrorToken(error);
      console.log(error);
      console.error("Error obteniendo categorías: ", error);
    }
  }, [categoriapadre, FuncionErrorToken]);
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
        showSuccess(`Se creó la categoría ${categoriaNombre}`);
        setvistaCrearCat(false);
        listarCategorias();
      } catch (error) {
        FuncionErrorToken(error);
        console.log(error);
        console.error("Error en la creación de la categoría: ", error);
      }
    },
    [FuncionErrorToken, listarCategorias, token]
  );

  const obtenerProductos = useCallback(async () => {
    try {
      setloadingProducts(true);
      const response = await clienteAxios.get("products/products/", {});
      const productos = response.data;
      setbtndelCate(true);
      setProductos(productos); // Guardar productos en el estado
      setloadingProducts(false);
    } catch (error) {
      setloadingProducts(false);

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
  }, []);

  const filtrarCategoria = useCallback(async (idcategoria) => {
    try {
      const response = await clienteAxios.get(
        `products/products/category/${idcategoria}/`
      );
      const productos = response.data;
      setbtndelCate(false);
      setProductos(productos); // Guardar productos en el estado
    } catch (error) {
      if (error.response) {
        // Mostrar el mensaje de error consolidado en SweetAlert
        Swal.fire({
          icon: "error",
          title: "Error obteniendo productos",
          text: "Hubo un problema filtrando los productos.",
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
  }, []);
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

        // Extraer los IDs de las categorías seleccionadas y añadirlas como un array sin índices
        const selectedCategoryIds = Object.keys(producto.categories).filter(
          (key) => producto.categories[key]
        );

        selectedCategoryIds.forEach((categoryId) => {
          console.log(categoryId);
          formData.append("category_ids", categoryId); // Sin índice, para que el backend lo trate como array
        });

        const uniqueImages = new Set();
        producto.images.forEach((file) => {
          if (!uniqueImages.has(file.name)) {
            // Validar si la imagen ya fue agregada
            formData.append("images", file);
            uniqueImages.add(file.name); // Agregar el nombre de la imagen al Set
          }
        });

        console.log([...formData.entries()]); // Depuración para ver qué se está enviando

        await clienteAxios.post("products/products/", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Porque estás enviando una imagen
            Authorization: `Bearer ${token}`,
          },
        });

        showSuccess(`Producto ${producto.name} creado con éxito`);
        setProductDialog(false);
        obtenerProductos();
      } catch (error) {
        console.log(error);
        if (error.response) {
          let mensajeError = "";
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

          Swal.fire({
            icon: "error",
            title: "Error de creación",
            text: mensajeError
              ? mensajeError
              : "Hubo un error en la creación del producto.",
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
  const obtenerProducto = useCallback(
    async (producto) => {
      if (!producto) {
        Swal.fire({
          icon: "error",
          title: "Producto no válido",
          text: "El producto seleccionado no es válido.",
        });
        return;
      }

      try {
        const response = await clienteAxios.get(
          `products/products/${producto}/`
        );

        setProducto(response.data);
      } catch (error) {
        console.error("Error obteniendo el producto:", error);

        if (error.response) {
          const mensajeError =
            error.response.data?.detail ||
            "Hubo un error obteniendo el producto.";
          Swal.fire({
            icon: "error",
            title: "Error obteniendo producto",
            text: mensajeError,
          });
        } else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "No se recibió respuesta del servidor",
            text: "Por favor, inténtelo de nuevo más tarde.",
          });
          console.error("No se recibió respuesta del servidor:", error.request);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: error.message || "Ocurrió un error inesperado.",
          });
        }
      }
    },
    [token]
  );
  const editarProducto = useCallback(
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

        // Extraer los IDs de las categorías seleccionadas y añadirlas como un array sin índices
        const selectedCategoryIds = Object.keys(producto.categories).filter(
          (key) => producto.categories[key]
        );

        selectedCategoryIds.forEach((categoryId) => {
          console.log(categoryId);
          formData.append("category_ids", categoryId); // Sin índice, para que el backend lo trate como array
        });

        const uniqueImages = new Set();
        producto.images.forEach((file) => {
          if (!uniqueImages.has(file.name)) {
            // Validar si la imagen ya fue agregada
            formData.append("images", file);
            uniqueImages.add(file.name); // Agregar el nombre de la imagen al Set
          }
        });

        await clienteAxios.put(`products/products/${producto.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Porque estás enviando una imagen
            Authorization: `Bearer ${token}`,
          },
        });

        showSuccess(`Producto ${producto.name} editado con éxito`);
        obtenerProductos();
        setProductDialog(false);
      } catch (error) {
        console.log(error);
        if (error.response) {
          let mensajeError = "";
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

          Swal.fire({
            icon: "error",
            title: "Error de creación",
            text: mensajeError
              ? mensajeError
              : "Hubo un error en la creación del producto.",
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
        console.error("Error editando el producto:", error);
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
        obtenerProductos();
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
    [token]
  );
  const eliminarImagenProducto = useCallback(
    async (productId, imageId) => {
      try {
        // Petición DELETE para eliminar el producto
        await clienteAxios.delete(
          `products/products/${productId}/images/${imageId}/delete/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Si la petición fue exitosa, muestra un mensaje de éxito
        showSuccess(`Imagen eliminada con éxito`);
        obtenerProductos();
      } catch (error) {
        // Manejo de errores
        if (error.response) {
          // Mostrar el mensaje de error consolidado en SweetAlert
          Swal.fire({
            icon: "error",
            title: "Error al eliminar imagen del producto",
            text:
              error.response?.data?.detail ||
              "Hubo un error al intentar eliminar imagen del producto.",
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
    [token, obtenerProductos]
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
      editarProducto,
      obtenerProducto,
      filtrarCategoria,
      eliminarImagenProducto,
      setProducto,
      setbtndelCate,
      setloadingProducts,
      loadingProducts,
      btndelCate,
      producto,
      product,
      deleteProductDialog,
      productDialog,
      productos,
      vistaCrearCat,
      categorias,
    };
  }, [
    crearCategoria,
    eliminarImagenProducto,
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
    obtenerProducto,
    filtrarCategoria,
    setProducto,
    editarProducto,
    setbtndelCate,
    setloadingProducts,
    loadingProducts,
    btndelCate,
    producto,
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
