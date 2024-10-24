import { useContext } from "react";
import { PedidosContextControl  } from "../context/Pedidos/pedidosContext";

const useControlPedidos = () => {
    return useContext(PedidosContextControl)
}

export default useControlPedidos