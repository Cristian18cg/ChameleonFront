import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "primereact/sidebar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import chameleonLargo from "../../img/chameleonlargo.png";
import icono_color from "../../img/icono-color.png";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Formulario_Login } from "../Login/Formularios/Formulario_Login";
import { FormularioRegistro } from "../Login/Formularios/Formulario_registro";
import { FooterLogin } from "../Login/Formularios/FooterLogin";
import { AutoComplete } from "primereact/autocomplete";
import { Carritocompras } from "../Tienda/CarritoCompras";
import useControl from "../../hooks/useControl";
import useControlProductos from "../../hooks/useControlProductos";
import useControlPedidos from "../../hooks/useControlPedidos";
export const NavBar = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const {
    vistaLog,
    setVistaLog,
    setVisibleProfile,
    visibleProfile,
    token,
    logout,
    setToken,
    isLoggedIn,
    usuario,
    setUsuario,
    setLoggedIn,
    admin,
    setAdmin,
    setJsonlogin,
  } = useControl();
  const {
    visibleCarrito,
    setVisibleCarrito,
    carrito,
    setCarrito,
    setUnidades,
    cantidadCarrito,
    setCantidadCarrito,
  } = useControlPedidos();
  const { productos, obtenerProductos } = useControlProductos();
  /* Funcion para verificar que no se ha vencido el token */
  const getItemWithExpiration = (key) => {
    const itemStr = localStorage.getItem(key);

    // Si el ítem no existe
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();
    const expirationDate = new Date(item.expiration); // Convertir la cadena ISO de nuevo a un objeto Date

    // Si la fecha actual es mayor a la fecha de expiración
    if (now > expirationDate) {
      localStorage.removeItem(key); // Eliminar el ítem expirado
      return null;
    }

    return item.value; // Retorna el valor si no ha expirado
  };
  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    if (carrito.length > 0) {
      // Sumar todas las cantidades en el carrito
      const totalUnidades = carrito.reduce(
        (acc, item) => acc + item.cantidad,
        0
      );
      setCantidadCarrito(totalUnidades);
    }
  }, [carrito]);

  useEffect(() => {
    if (productos.length === 0) {
      obtenerProductos();
    } else {
      setProducts(productos);
    }
  }, [productos]);

  useEffect(() => {
    const accessToken = getItemWithExpiration("accessToken");
    const usuarioo = getItemWithExpiration("user");
    const datos = getItemWithExpiration("jsonlogin");
    // Llama a la función asincrónica para obtener los datos
    if (accessToken && token === "" && usuario === "" && isLoggedIn === false) {
      setToken(accessToken);
      setUsuario(usuarioo);
      setLoggedIn(true);
      setJsonlogin(datos);
      if (getItemWithExpiration("is_superuser") === false) {
        setAdmin(false);
      } else if (getItemWithExpiration("is_superuser") === true) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    }
  }, [isLoggedIn, setAdmin, setLoggedIn, setToken, setUsuario, token, usuario]);

  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link p-2">
      <span className={item.icon} />
      <span className="mx-4">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Tienda",
      icon: "pi pi-shop",
      command: () => {
        navigate("/tienda");
      },
    },
    // Solo incluir "Projects" si isLogged es true
    ...(isLoggedIn
      ? [
          {
            label: "Mi perfil",
            icon: "pi pi-search",
            items: [
              {
                label: "Mis pedidos",
                icon: "pi pi-truck",
                template: itemRenderer,
                command: () => {
                  navigate("/lista_pedidos");
                },
              },
              {
                label: "MiPerfil",
                icon: "pi pi-user",
                template: itemRenderer,
                command: () => {
                  navigate("/perfil");
                },
              },
            ],
          },
        ]
      : []),
  ];
  const itemsAdmin = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Tienda",
      icon: "pi pi-shop",
      command: () => {
        navigate("/tienda");
      },
    },
    {
      label: "Productos",
      icon: "pi pi-shopping-bag",
      command: () => {
        navigate("/productos");
      },
    },
    {
      label: "Pedidos",
      icon: "pi pi-server",
      command: () => {
        navigate("/pedidos/lista_pedidos");
      },
    },
    {
      label: "Administración",
      icon: "pi pi-user",
      items: [
        {
          label: "Usuarios",
          icon: "pi pi-users",
          shortcut: "⌘+S",
          template: itemRenderer,
          command: () => {
            navigate("/configuracion/usuarios");
          },
        },

        {
          label: "Imagenes",
          icon: "pi pi-image",
          shortcut: "⌘+U",
          template: itemRenderer,
          command: () => {
            navigate("/configuracion/imagenes");
          },
        },
        {
          label: "Domicilio",
          icon: "pi pi-car",
          shortcut: "⌘+U",
          command: () => {
            navigate("/configuracion/domicilio");
          },
          template: itemRenderer,
        },
      ],
    },
  ];
  const start = () => {
  
    return (
      <div>
      <img
        alt="logo"
        src={chameleonLargo}
        className="hidden md:block mr-2 w-48 h-14 md:w-64 md:h-20 object-contain"
        onClick={() => navigate("/")} // Pasa la función como un callback
      />
      <img
        alt="logo"
        src={icono_color}
        className="md:hidden mr-2 w-14 h-14 md:w-64 md:h-20"
        onClick={() => navigate("/")} // Pasa la función como un callback
      />
      </div>
    );
  }
  const panelFooterTemplate = () => {
    const isProductSelected = (filteredProducts || []).some(
      (product) => product["name"] === selectedProduct
    );
    return (
      <div className="py-2 px-3">
        {isProductSelected ? (
          <span>
            <b>{selectedProduct}</b> Selecciondo.
          </span>
        ) : (
          "Producto no seleccionado."
        )}
      </div>
    );
  };

  const itemTemplate = (item) => {
    // Formatear el precio en pesos colombianos
    const formattedPrice = item.price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });

    return (
      <div className="flex items-center">
        {/* Imagen del producto */}
        <img
          alt={item.name}
          src={item.images[0].image_url}
          className="rounded-md mr-3"
          style={{ width: "40px" }}
        />

        {/* Nombre del producto y precio */}
        <div>
          <div className="font-bold">{item.name}</div> {/* Nombre */}
          <div className="text-sm text-gray-500">{formattedPrice}</div>{" "}
          {/* Precio formateado */}
        </div>
      </div>
    );
  };

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredProducts;

      if (!event.query.trim().length) {
        _filteredProducts = [...products];
      } else {
        _filteredProducts = products.filter((country) => {
          return country.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredProducts(_filteredProducts);
    }, 250);
  };
  // Cuando se selecciona un producto
  const handleProductSelect = (e) => {
    const selected = e.value;
    setSelectedProduct(selected);

    // Redirigir a la ruta del producto con el id
    if (selected && selected.id) {
      navigate(`/tienda/${selected.id}`);
    }
  };
  const end = (
    <div className="flex   align-items-center gap-3">
       
      <AutoComplete
        placeholder="Buscar producto"
        field="name"
        value={selectedProduct}
        suggestions={filteredProducts}
        completeMethod={search}
        onChange={handleProductSelect}
        itemTemplate={itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="  m-2.5  md:block w-auto"
        
      />
      {isLoggedIn ? (
        <>
          <div className="p-menuitem-content">
            <a
              className="flex align-items-center p-menuitem md:p-3 mt-6 md:mt-3"
              onClick={() => {
                navigate("/");
                logout();
              }}
            >
              <span className="pi pi-sign-out p-menuitem-icon " style={{fontSize:"1rem"}} />
              <span className="p-menuitem-text mx-2 hidden md:block">Cerrar Sesion</span>
            </a>
          </div>
          <Avatar
            shape="circle"
            size="large"
            label={usuario ? usuario.charAt(0).toUpperCase() : ""}
            className=" mt-2 transition duration-300 ease-in-out cursor-pointer bg-green-400 bg-opacity-55 text-white"
          />
        </>
      ) : (
        <>
          <Avatar
            icon="pi pi-user"
            shape="circle"
            size="large"
            className="ml-2 mt-2 transition duration-300 ease-in-out cursor-pointer bg-purple-400 text-gray-100"
            onClick={() => {
              setVisibleProfile(true);
            }}
          />
        </>
      )}
    </div>
  );
  const headerDialog = () => {
    return (
      <div className="flex items-center h-3 justify-center bg-gray-500 bg-opacity-10 custom-header">
        <img alt="logo" src={icono_color} className="mr-1 sm:w-1rem w-14"></img>

        {vistaLog === 1 ? (
          <>
            <h3>INICIAR SESIÓN</h3>
          </>
        ) : (
          <>
            <h3>REGISTRO</h3>
          </>
        )}
      </div>
    );
  };
  const headerCarrito = () => {
    return (
      <div className=" flex justify-center">
        <h1 className="font-bold">CARRITO DE COMPRAS</h1>
      </div>
    );
  };
  return (
    <div className="w-full fixed top-0 z-50">
      <Menubar
        model={admin ? itemsAdmin : items}
        start={start}
        end={end}
        className="rounded-none h-auto z-50 border-none"
      />
     
      <Dialog
        header={headerDialog}
        modal
        visible={visibleProfile}
        onHide={() => {
          setVisibleProfile(false);
        }}
        position="center"
        className={`custom-dialog shadow-lg ${
          vistaLog === 1
            ? "w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
            : "w-full md:w-5/6 lg:w-6/12 xl:w-5/12"
        } ${
          vistaLog === 1
            ? "sm:h-auto md:h-auto lg:h-auto xl:h-auto"
            : "sm:h-96 md:h-5/6 lg:h-auto"
        }`}
      >
        {vistaLog === 1 ? (
          <>
            <Formulario_Login />
            <FooterLogin />
          </>
        ) : (
          <>
            <FormularioRegistro />
            <FooterLogin />
          </>
        )}
      </Dialog>

      <Sidebar
        visible={visibleCarrito}
        position="right"
        className="w-11/12 md:w-1/3 carrito-compras"
        onHide={() => setVisibleCarrito(false)}
        header={headerCarrito}
      >
        <Carritocompras />
      </Sidebar>

      <div className="fixed bottom-5 right-10 bg-transparent p-5 rounded-lg z-50">
        <div className=" bg-transparent flex items-center justify-between">
          <i
            className=" hover:cursor-pointer p-3 text-md ml-1  p-overlay-badge font-medium bg-green-600 text-gray-50 border-green-300 w-full rounded-full pi pi-shopping-cart p-overlay-badge"
            style={{ fontSize: "1.5rem" }}
            onClick={() => {
              setVisibleCarrito(!visibleCarrito);
            }}
          >
            <Badge
              value={cantidadCarrito}
              className="bg-green-500  mr-2 top-1"
            ></Badge>
          </i>
        </div>
        {/* Aquí puedes añadir el contenido del carrito */}
      </div>
    </div>
  );
};
