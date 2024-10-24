import { useState, createContext, useMemo, useCallback } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";
import useControl from "../../hooks/useControl";

const PedidosContextControl = createContext();

const PedidosProvider = ({ children }) => {
  const { token } = useControl();
  const [unidades, setUnidades] = useState({});

  const contextValue = useMemo(() => {
    return {
      unidades,
      setUnidades,
    };
  }, [unidades, setUnidades]);

  return (
    <PedidosContextControl.Provider value={contextValue}>
      {children}
    </PedidosContextControl.Provider>
  );
};
export { PedidosContextControl, PedidosProvider };
