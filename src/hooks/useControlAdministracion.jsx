import { useContext } from "react";
import { AdministracionContextControl  } from "../context/Administracion/AdministracionContext";

const useControlAdministracion = () => {
    return useContext(AdministracionContextControl)
}

export default useControlAdministracion