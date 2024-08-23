import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import chameleonLargo from "../../img/chameleonlargo.png";
import icono_color from "../../img/icono-color.png";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Formulario_Login } from "../Login/Formularios/Formulario_Login";
export const NavBar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
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
          setVisible(true);
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
        <h3>INICIAR SESIÓN</h3>
      </div>
    );
  };
  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} className="rounded-none" />
      <Dialog
        header={headerDialog}
        modal
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        position="center"
        style={{ width: "30vw", }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        className="custom-dialog"
      >
        <Formulario_Login />
      </Dialog>
    </div>
  );
};
