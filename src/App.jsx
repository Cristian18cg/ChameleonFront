/* import 'primevue/resources/themes/aura-light-green/theme.css' */
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Router_Home } from "./components/Home/Router_Home";
import { LoginProvider } from "./context/login/loginContext";
import { ProductosProvider } from "./context/Productos/productosContext";
import { PedidosProvider } from "./context/Pedidos/pedidosContext";
import { PrimeReactProvider } from "primereact/api";
import { addLocale } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { twMerge } from "tailwind-merge";

import "./styles/styles.css";

function App() {
  /*   const value = {
    ripple: true,
    zIndex: {
      modal: 1100, // dialog, sidebar
      overlay: 1000, // dropdown, overlaypanel
      menu: 1000, // overlay menus
      tooltip: 1100, // tooltip
      toast: 1200, // toast
    },
    autoZIndex: true,
    locale: "es",
    pt: Tailwind,
  }; */
  addLocale("es", {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
    monthNamesShort: [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ],
    today: "Hoy",
    clear: "Limpiar",
    startsWith: "Inicia con",
    contains: "Contiene",
    notContains: "No contiene",
    endsWith: "Finaliza con",
    equals: "Igual",
    notEquals: "No igual",
    noFilter: "Quitar filtro",
    greaterThan: "Mayor que",
    lessThan: "Menor que",
    greaterThanOrEqual: "Mayor o igual",
    lessThanOrEqual: "Menor o igual",
    accept: "Aceptar",
    weak: "Leve",
    medium: "Medio",
    strong: "Fuerte",
    passwordPrompt: "Ingrese la contraseña",
    //...
  });
  return (
    <PrimeReactProvider
      value={{
        pt: { Tailwind },
        ptOptions: {
          mergeSections: true,
          mergeProps: true,
          classNameMergeFunction: twMerge,
        },

        ripple: true,
        zIndex: {
          modal: 1100, // dialog, sidebar
          overlay: 1000, // dropdown, overlaypanel
          menu: 1000, // overlay menus
          tooltip: 1100, // tooltip
          toast: 1200, // toast
        },
        autoZIndex: true,
        locale: "es",
      }}
    >
      <LoginProvider>
        <ProductosProvider>
          <PedidosProvider>
            <Router_Home />
          </PedidosProvider>
        </ProductosProvider>
      </LoginProvider>
    </PrimeReactProvider>
  );
}

export default App;
