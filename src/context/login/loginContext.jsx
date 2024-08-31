import { useState, createContext, useMemo } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
const ContextControl = createContext();

const LoginProvider = ({ children }) => {
  const [vistaLog, setVistaLog] = useState(1);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [jsonlogin, setJsonlogin] = useState({});
  const [jsonusuarios, setJsonusuarios] = useState({});
  const [usuario, setUsuario] = useState("");
  const [dataadicional, setdataadicional] = useState({});
  const [token, setToken] = useState("");
  const [refresh_token, setrefresh_Token] = useState("");
  const [contraseñanueva, setcontraseñanueva] = useState(null);
  const [visibleProfile, setVisibleProfile] = useState(false);

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
  const registro = async (usuario) => {
    try {
      console.log(usuario.telefono);
      // Asegúrate de que estás utilizando la URL correcta para el registro de usuarios
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
          email: usuario.correo,
          number_document: usuario.numeroIdentificacion,
          type_document: usuario.tipoIdentificacion,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const dataRegistro = response.data;

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
        const loginResponse = await clienteAxios.post("users/token/", {
          username: usuario.correo, // Usa el correo para el inicio de sesión
          password: usuario.contrasena,
        });

        const dataLogin = loginResponse.data;
        console.log(dataLogin);
        // Actualizar el estado de la aplicación con los datos del usuario y tokens
        setLoggedIn(true);
        setUsuario(
          `${dataLogin.first_name} ${dataLogin.last_name}`.trim()
            ? `${dataLogin.first_name} ${dataLogin.last_name}`
            : "usuario"
        );
        localStorage.setItem(
          "user",
          `${dataLogin.first_name} ${dataLogin.last_name}`.trim()
            ? `${dataLogin.first_name} ${dataLogin.last_name}`
            : "usuario"
        );
        localStorage.setItem("accessToken", dataLogin.access);
        localStorage.setItem("refreshToken", dataLogin.refresh);
        setToken(dataLogin.access);
        setrefresh_Token(dataLogin.refresh);
      }
    } catch (error) {
      console.log(error);
      // Manejo de errores
      if (error.message === "Network Error") {
        return Swal.fire({
          icon: "error",
          title: "Error de red",
          text:
            "No se puede conectar al servidor. Por favor, verifica tu conexión.",
        });
      }

      if (error.response) {
        console.log(error.response);

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
  };

  const login = async (correo, contraseña) => {
    try {
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
        localStorage.setItem("accessToken", dataLogin.access);
        localStorage.setItem("refreshToken", dataLogin.refresh);
        localStorage.setItem(
          "user",
          `${dataLogin.first_name} ${dataLogin.last_name}`.trim()
            ? `${dataLogin.first_name} ${dataLogin.last_name}`
            : "usuario"
        );
        setLoggedIn(true);
        setUsuario(
          `${dataLogin?.first_name} ${dataLogin?.last_name}`.trim()
            ? `${dataLogin.first_name} ${dataLogin.last_name}`
            : "usuario"
        );
        setToken(dataLogin.access);
        setrefresh_Token(dataLogin.refresh);
      }
      /*    if (infoAdicional()) {
        setTimeout(() => {
          setUsuario(dataLogin.data.nombre);
          setJsonlogin(dataLogin.data);
          setToken(response.data.access);
          setcontraseñanueva(dataLogin.data.nuevo_usuario)
          return true;
        }, 2000);
      } */
    } catch (error) {
      if (error.message === "Network Error") {
        return Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor",
          text: error.message,
        });
      }

      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor " + error.response.status,
          text: error.response.data.error,
        });
        console.error(
          "Error de respuesta del servidor:",
          error.response.data.error
        );
      } else if (error.request) {
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
  };
  const logout = async (id) => {
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
        headers
      );
      if (respuesta.status !== 200) {
        return Swal.fire({
          icon: "error",
          title: "Error al cerrar sesion",
        });
      }

      setLoggedIn(false);
      setToken(null);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.reload();
    } catch (error) {}
  };

  const infoAdicional = async () => {
    const response = await clienteAxios.get("ne/data/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return false;
    } else {
      setdataadicional(response.data);
      return true;
    }
  };
  const listarUsuarios = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await clienteAxios.get("ne/sistemas/", {
        headers,
      });
      const data = response.data;
      if (response.status !== 200) {
        return Swal.fire({
          icon: "error",
        });
      }
      setJsonusuarios(data);
    } catch (error) {
      // Si hay un error en la petición
      console.error("Error:", error.response.data);
    }
  };

  const contextValue = useMemo(() => {
    return {
      // ... tus valores de contexto
      login,
      logout,
      listarUsuarios,
      setVistaLog,
      registro,
      setVisibleProfile,
      setLoggedIn,
      setToken,
      setUsuario,
      isLoggedIn,
      visibleProfile,
      vistaLog,
      isLoggedIn,
      usuario,
      contraseñanueva,
      jsonlogin,
      jsonusuarios,
      token,
      dataadicional,
    };
  }, [
    login,
    logout,
    listarUsuarios,
    setVistaLog,
    registro,
    setVisibleProfile,
    setLoggedIn,
    setToken,
    setUsuario,
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
