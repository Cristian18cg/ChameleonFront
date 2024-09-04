import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import chameleonLargo from "../../img/chameleonlargo.png";
import icono_color from "../../img/icono-color.png";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Formulario_Login } from "../Login/Formularios/Formulario_Login";
import { FormularioRegistro } from "../Login/Formularios/Formulario_registro";
import { FooterLogin } from "../Login/Formularios/FooterLogin";
import { PanelMenu } from "primereact/panelmenu";

import useControl from "../../hooks/useControl";
export const NavBar = () => {
  const navigate = useNavigate();
  const {
    vistaLog,
    setVistaLog,
    setVisibleProfile,
    visibleProfile,
    token,
    setToken,
    isLoggedIn,
    usuario,
    setUsuario,
    setLoggedIn,
  } = useControl();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const usuarioo = localStorage.getItem("user");

    // Llama a la función asincrónica para obtener los datos
    if (accessToken && token === "" && usuario === "" && isLoggedIn===false) {
      console.log('oooooooo')
      setToken(accessToken);
      setUsuario(usuarioo);
      setLoggedIn(true);
    }
  }, []);
  const avatarTemplate = ()=>{
    return <Avatar label={usuario.charAt(0).toUpperCase()} size="large" className="mt-2" style={{ backgroundColor: '#0bc75cb9', color: '#ffffff' }} shape="circle" />
 
   }
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
  
  ];

  const start = (
    <img
      alt="logo"
      src={chameleonLargo}
      height="10"
      width="300"
      className="mr-2 sm:w-1rem"
    ></img>
  );
  const end = (
    <div className="flex align-items-center gap-3">
      <InputText
        placeholder="Buscar"
        type="text"
        className="  m-2.5 md:w-auto max-w-screen-sm"
      />
      
        <Avatar
          icon="pi pi-user"
          shape="circle"
          size="large"
          className="ml-2 mt-1 transition duration-300 ease-in-out cursor-pointer"
          onClick={() => {
            setVisibleProfile(true);
          }}
        />
      
    </div>
  );
  const headerDialog = () => {
    return (
      <div className="flex items-center h-3 justify-center bg-gray-500 bg-opacity-10 custom-header">
        <img
          alt="logo"
          src={icono_color}
          height="10"
          width="50"
          className="mr-1 sm:w-1rem"
        ></img>

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
    <div className="card">
      <Menubar model={items} start={start} end={end} className="rounded-none" />
      <Dialog
        header={headerDialog}
        modal
        visible={visibleProfile}
        onHide={() => {
          
          setVisibleProfile(false);
        }}
        position="center"
       
        className={`custom-dialog shadow-lg ${
    vistaLog === 1 ? "w-full md:w-1/3 lg:w-1/4 xl:w-1/5" : "w-full md:w-5/6 lg:w-6/12 xl:w-5/12"
  } ${vistaLog === 1 ? "sm:h-80 md:h-90 lg:h-2/3 xl:h-3/6" : "sm:h-96 md:h-5/6 lg:h-auto"}`}
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
    </div>
  );
};
