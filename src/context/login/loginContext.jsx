import { useState, createContext, useMemo, useCallback } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
const ContextControl = createContext();

const LoginProvider = ({ children }) => {
  const [vistaLog, setVistaLog] = useState(1);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [jsonlogin, setJsonlogin] = useState({});
  const [jsonusuarios, setJsonusuarios] = useState({});
  const [usuario, setUsuario] = useState("");
  const [admin, setAdmin] = useState(false);
  const [dataadicional, setdataadicional] = useState({});
  const [token, setToken] = useState("");
  const [refresh_token, setrefresh_Token] = useState("");
  const [contraseñanueva, setcontraseñanueva] = useState(null);
  const [visibleProfile, setVisibleProfile] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingRegistro, setloadingRegistro] = useState(false);
  const [loadingEdicion, setloadingEdicion] = useState(false);
  const [loadingLogin, setloadingLogin] = useState(false);
  const [loadingListaUsuario, setloadingListaUsuario] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [UsuarioDialog, setUsuarioDialog] = useState(false);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [user, setUser] = useState(null);

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
  const login = useCallback(async (correo, contraseña) => {
    try {
      setloadingLogin(true);
      const response = await clienteAxios.post("users/token/", {
        username: correo,
        password: contraseña,
      });
      const dataLogin = response.data;

      if (response.status !== 200) {
        return Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
        });
      } else {
        console.log("login", response);
        setJsonlogin(response.data);
        ///LOCAL STORAGE
        setItemWithExpiration("jsonlogin", response.data, 1);
        /* Poner en local storage los token */
        setItemWithExpiration("accessToken", dataLogin.access, 1);
        setItemWithExpiration("refreshToken", dataLogin.refresh, 1);
        /* poner el nombre del usuario */
        setItemWithExpiration(
          "user",
          `${dataLogin.first_name} ${dataLogin.last_name}`.trim()
            ? `${dataLogin.first_name} ${dataLogin.last_name}`
            : "usuario",
          1
        );
        /* Administrar si es o no admin */
        setItemWithExpiration("is_superuser", dataLogin.is_superuser, 1);
        setAdmin(dataLogin.is_superuser);

        /// VARIABLES
        /* Poner que ya esta logueado */
        setLoggedIn(true);
        /* Nombre de usuarios */
        setUsuario(
          `${dataLogin?.first_name} ${dataLogin?.last_name}`.trim()
            ? `${dataLogin.first_name} ${dataLogin.last_name}`
            : "usuario"
        );
        setloadingLogin(false);
        /* tokens */
        setToken(dataLogin.access);
        setrefresh_Token(dataLogin.refresh);
        /* dialog login */
        setVisibleProfile(false);
      }

      showSuccess(
        `¡Bienvenido, ${dataLogin.first_name} ${dataLogin.last_name}!`
      );
    } catch (error) {
      setloadingLogin(false);
      console.log(error);
      console.log(error.request.response);

      if (error.message === "Network Error") {
        return Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor",
          text: error.message,
        });
      }

      if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error en autenticacion o servidor ",
          text: error?.response?.data?.detail,
        });
      } else if (error.response) {
        Swal.fire({
          icon: "error",
          title: "No se recibió respuesta del servidor",
          text: error.response.data.error,
        });
        console.error(
          "No se recibió respuesta del servidor" + error.response.data
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor",
          text: error.message.error,
        });
      }
    }
  }, []);
  const registro = useCallback(
    async (usuario) => {
      try {
        setloadingRegistro(true);

        const response = await clienteAxios.post(
          "users/register/",
          {
            username: usuario.correo,
            password: usuario.contrasena,
            password2: usuario.confirmarContrasena,
            first_name: usuario.nombres,
            last_name: usuario.apellidos,
            address: usuario.direccion,
            phone: usuario.telefono,
            city: usuario.ciudad,
            department: usuario.department,
            email: usuario.correo,
            number_document: usuario.numeroIdentificacion,
            type_document: usuario.tipoIdentificacion,
            terms_accepted: usuario.terms_accepted,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          // El código de estado 201 generalmente indica que algo ha sido creado exitosamente
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: `Has sido registrado con exito ${usuario.nombres} ${usuario.apellidos}`,
          });
          setVisibleProfile(false);

          // Si también deseas iniciar sesión automáticamente después del registro, puedes hacer una solicitud de inicio de sesión aquí.
          // Por ejemplo:
          login(usuario.correo, usuario.contrasena);
          setloadingRegistro(false);
        }
      } catch (error) {
        setloadingRegistro(false);
        console.log(error);
        // Manejo de errores
        if (error.message === "Network Error") {
          return Swal.fire({
            icon: "error",
            title: "Error de red",
            text: "No se puede conectar al servidor. Por favor, verifica tu conexión.",
          });
        }

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
            title: "Error de registro",
            text: mensajeError || "Hubo un error en el registro.",
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
      }
    },
    [login]
  );
  /* Funcion para almacenar el token por tiempo */
  const setItemWithExpiration = (key, value, expirationInDays) => {
    const now = new Date();
    now.setDate(now.getDate() + expirationInDays); // Sumar los días a la fecha actual
    const item = {
      value: value,
      expiration: now.toISOString(), // Guardar como string ISO
    };
    localStorage.setItem(key, JSON.stringify(item)); // Guardar en localStorage
  };

  const logout = useCallback(
    async (id) => {
      setLoggedIn(false);
      setToken(null);
      setAdmin(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("is_superuser");
      window.location.reload();
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const datos = {
          refresh: refresh_token,
        };
        const respuesta = await clienteAxios.post(
          "users/logout/",
          datos,
          { headers } // Pasar headers dentro de un objeto { headers }
        );
        if (respuesta.status !== 205) {
          // Cambiado a 205 porque es el código que esperas en la respuesta
          return Swal.fire({
            icon: "error",
            title: "Error al cerrar sesión",
          });
        }

        setLoggedIn(false);
        setToken(null);
        setAdmin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("is_superuser");

        window.location.reload();
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("is_superuser");

        console.error(error);
      }
    },
    [refresh_token, token]
  );

  const cities = useCallback(
    async (id) => {
      try {
        const respuesta = await clienteAxios.get(
          `users/info/cities/?department_id=${id}`
        );
        if (respuesta.status !== 200) {
          // Cambiado a 205 porque es el código que esperas en la respuesta
          return Swal.fire({
            icon: "error",
            title: "Error obteniendo las ciudades",
          });
        } else {
          setCiudades(respuesta.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );
  const departments = useCallback(async () => {
    try {
      const respuesta = await clienteAxios.get(`users/info/departments/`);
      console.log(respuesta);
      if (respuesta.status !== 200) {
        // Cambiado a 205 porque es el código que esperas en la respuesta
        return Swal.fire({
          icon: "error",
          title: "Error obteniendo los departamentos",
        });
      } else {
        setDepartamentos(respuesta.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const obtenerUsuarios = useCallback(async () => {
    try {
      setloadingListaUsuario(true);
      const response = await clienteAxios.get(
        `users/info/users/`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setListaUsuarios(response.data);
      setloadingListaUsuario(false);
    } catch (error) {
      setloadingListaUsuario(false);
      console.error("Error obteniendo los usuarios:", error);

      if (error.response) {
        const mensajeError =
          error.response.data?.detail ||
          "Hubo un error obteniendo los usuarios.";
        Swal.fire({
          icon: "error",
          title: "Error obteniendo los usuarios",
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
  }, [token]);
  const eliminarUsuario = useCallback(
    async (usuarioId) => {
      try {
        // Petición DELETE para eliminar el producto
        await clienteAxios.delete(`users/info/users/${usuarioId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Si la petición fue exitosa, muestra un mensaje de éxito
        showSuccess(`Usuario eliminado con éxito.`);
        obtenerUsuarios();
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
            title: "Error al eliminar el usuario",
            text:
              mensajeError || "Hubo un error al intentar eliminar el usuario.",
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

        console.error("Error al intentar eliminar el usuario:", error);
      }
    },
    [token]
  );

  const EditarUsuario = useCallback(
    async (usuario) => {
      try {
        setloadingEdicion(true);
  
        // Construir dinámicamente el payload solo con los campos que han cambiado
        const payload = {
          ...(usuario.correo !== user.email && { email: usuario.correo }),
          ...(usuario.nombres !== user.first_name && { first_name: usuario.nombres }),
          ...(usuario.apellidos !== user.last_name && { last_name: usuario.apellidos }),
          ...(usuario.is_active !== user.is_active && { is_active: usuario.is_active }),
          ...(usuario.is_superuser !== user.is_superuser && { is_superuser: usuario.is_superuser }),
          profile: {
            ...(usuario.direccion !== user.profile.address && { address: usuario.direccion }),
            ...(usuario.telefono !== user.profile.phone && { phone: usuario.telefono }),
            ...(usuario.ciudad !== user.profile.city && { city: usuario.ciudad }),
            ...(usuario.department !== user.profile.department && { department: usuario.department }),
            ...(usuario.numeroIdentificacion !== user.profile.number_document && { number_document: usuario.numeroIdentificacion }),
            ...(usuario.tipoIdentificacion !== user.profile.type_document && { type_document: usuario.tipoIdentificacion }),
            ...(usuario.terms_accepted !== user.profile.terms_accepted && { terms_accepted: usuario.terms_accepted }),
          },
        };
  
        const response = await clienteAxios.patch(`users/info/users/${user.id}/`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 201) {
          showSuccess(`${usuario.nombres} ${usuario.apellidos}, se editó con éxito.`);
          setVisibleProfile(false);
          obtenerUsuarios();
        }
      } catch (error) {
        setloadingEdicion(false);
        console.log(error);
        // Manejo de errores
        if (error.message === "Network Error") {
          return Swal.fire({
            icon: "error",
            title: "Error de red",
            text: "No se puede conectar al servidor. Por favor, verifica tu conexión.",
          });
        }

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
            title: "Error de registro",
            text: mensajeError || "Hubo un error en la edicion del usuario.",
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
      }
    },
    [user, token]
  );
  const contextValue = useMemo(() => {
    return {
      // ... tus valores de contexto
      setAdmin,
      login,
      logout,
      setVistaLog,
      registro,
      setVisibleProfile,
      setLoggedIn,
      setToken,
      setUsuario,
      setJsonlogin,
      cities,
      setCiudades,
      setDepartamentos,
      departments,
      setloadingLogin,
      obtenerUsuarios,
      setListaUsuarios,
      setloadingListaUsuario,
      setUser,
      setDeleteUserDialog,
      eliminarUsuario,
      setUsuarioDialog,
      EditarUsuario,
      setloadingEdicion,
      loadingEdicion,
      loadingRegistro,
      UsuarioDialog,
      deleteUserDialog,
      user,
      loadingListaUsuario,
      listaUsuarios,
      loadingLogin,
      admin,
      departamentos,
      ciudades,
      isLoggedIn,
      visibleProfile,
      vistaLog,
      usuario,
      contraseñanueva,
      jsonlogin,
      jsonusuarios,
      token,
      dataadicional,
    };
  }, [
    setAdmin,
    login,
    logout,
    setVistaLog,
    registro,
    setVisibleProfile,
    setLoggedIn,
    setToken,
    setUsuario,
    setJsonlogin,
    cities,
    setCiudades,
    setDepartamentos,
    departments,
    setloadingLogin,
    obtenerUsuarios,
    setListaUsuarios,
    setloadingListaUsuario,
    setUser,
    setDeleteUserDialog,
    eliminarUsuario,
    setUsuarioDialog,
    EditarUsuario,
    setloadingEdicion,
    loadingEdicion,
    loadingRegistro,
    UsuarioDialog,
    deleteUserDialog,
    user,
    loadingListaUsuario,
    listaUsuarios,
    loadingLogin,
    admin,
    departamentos,
    ciudades,
    visibleProfile,
    isLoggedIn,
    usuario,
    contraseñanueva,
    jsonlogin,
    jsonusuarios,
    token,
    dataadicional,
    vistaLog,
  ]);

  return (
    <ContextControl.Provider value={contextValue}>
      {children}
    </ContextControl.Provider>
  );
};
export { ContextControl, LoginProvider };
