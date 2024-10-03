import { useContext } from "react";
import { ProductosContextControl  } from "../context/Productos/productosContext";

const useControlProductos = () => {
    return useContext(ProductosContextControl)
}

export default useControlProductos