import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

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
import useControl from "../../hooks/useControl";
import useControlProductos from "../../hooks/useControlProductos";
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
  } = useControl();
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
  useEffect(() => {
    if (productos.length === 0) {
      obtenerProductos();
    } else {
      console.log(productos);
      setProducts(productos);
    }
    console.log(productos);
  }, [productos]);
  useEffect(() => {
    const accessToken = getItemWithExpiration("accessToken");
    const usuarioo = getItemWithExpiration("user");
    console.log(accessToken);
    // Llama a la función asincrónica para obtener los datos
    if (accessToken && token === "" && usuario === "" && isLoggedIn === false) {
      setToken(accessToken);
      setUsuario(usuarioo);
      setLoggedIn(true);
      console.log(getItemWithExpiration("is_superuser"));
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
    } /* ,
    {
      label: "Projects",
      icon: "pi pi-search",
      items: [
        {
          label: "Core",
          icon: "pi pi-bolt",
          shortcut: "⌘+S",
          template: itemRenderer,
        },
        {
          label: "Blocks",
          icon: "pi pi-server",
          shortcut: "⌘+B",
          template: itemRenderer,
        },
        {
          label: "UI Kit",
          icon: "pi pi-pencil",
          shortcut: "⌘+U",
          template: itemRenderer,
        },
        {
          separator: true,
        },
        {
          label: "Templates",
          icon: "pi pi-palette",
          items: [
            {
              label: "Apollo",
              icon: "pi pi-palette",
              badge: 2,
              template: itemRenderer,
            },
            {
              label: "Ultima",
              icon: "pi pi-palette",
              badge: 3,
              template: itemRenderer,
            },
          ],
        },
      ],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      badge: 3,
      template: itemRenderer,
    },
   */,
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
      icon: "pi pi-shop",
      command: () => {
        navigate("/productos");
      },
    },
    {
      label: "Projects",
      icon: "pi pi-search",
      items: [
        {
          label: "Core",
          icon: "pi pi-bolt",
          shortcut: "⌘+S",
          template: itemRenderer,
        },
        {
          label: "Blocks",
          icon: "pi pi-server",
          shortcut: "⌘+B",
          template: itemRenderer,
        },
        {
          label: "UI Kit",
          icon: "pi pi-pencil",
          shortcut: "⌘+U",
          template: itemRenderer,
        },
        {
          separator: true,
        },
        {
          label: "Templates",
          icon: "pi pi-palette",
          items: [
            {
              label: "Apollo",
              icon: "pi pi-palette",
              badge: 2,
              template: itemRenderer,
            },
            {
              label: "Ultima",
              icon: "pi pi-palette",
              badge: 3,
              template: itemRenderer,
            },
          ],
        },
      ],
    } /*
    {
      label: "Contact",
      icon: "pi pi-envelope",
      badge: 3,
      template: itemRenderer,
    },
   */,
  ];
  const start = (
    <img
      alt="logo"
      src={chameleonLargo}
      className="mr-2 w-48 h-14 md:w-64 md:h-20"
    ></img>
  );
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
    <div className="flex align-items-center gap-3">
      <AutoComplete
        placeholder="Buscar producto"
        field="name"
        value={selectedProduct}
        suggestions={filteredProducts}
        completeMethod={search}
        onChange={handleProductSelect}
        itemTemplate={itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="  m-2.5 hidden md:block w-auto"
      />
      {isLoggedIn ? (
        <>
          <div className="p-menuitem-content">
            <a
              className="flex align-items-center p-menuitem p-3 mt-4"
              onClick={() => {
                logout();
              }}
            >
              <span className="pi pi-sign-out p-menuitem-icon" />
              <span className="p-menuitem-text mx-2">Cerrar Sesion</span>
            </a>
          </div>
          <Avatar
            shape="circle"
            size="large"
            label={usuario ? usuario.charAt(0).toUpperCase() : ""}
            className="ml-2 mt-2 transition duration-300 ease-in-out cursor-pointer bg-green-400 bg-opacity-55 text-white"
          />
        </>
      ) : (
        <>
          <Avatar
            icon="pi pi-user"
            shape="circle"
            size="large"
            className="ml-2 mt-2 transition duration-300 ease-in-out cursor-pointer"
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
  return (
    <div className="sticky top-0  z-50">
      <div className="sticky top-0">
      <Menubar
    
        model={admin ? itemsAdmin : items}
        start={start}
        end={end}
        className="rounded-none h-auto  "
      />
      </div>
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
      <div className="fixed bottom-5 right-10 bg-transparent p-4 rounded-lg z-50">
        <div className=" bg-transparent flex items-center justify-between">
          <Button  icon="pi pi-shopping-cart" className="rounded-full" />
        </div>
        {/* Aquí puedes añadir el contenido del carrito */}
      </div>
    </div>
  );
};
