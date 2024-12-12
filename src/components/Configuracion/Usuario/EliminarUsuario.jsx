import React, { useRef } from "react";
import useControl from "../../../hooks/useControl";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export const EliminarUsuario = () => {
  let emptyUser = {
    id: null,
    first_name: "",
    is_active: true,
    is_superuser: false,
    last_name: "",
    username: "",
    profile: {
      address:"",
      city:null,
      department:null,
      number_document:"",
      phone:"",
      terms_accepted:true,
      terms_accepted_date:null,
      type_document:null,
    }
  };

  const toast = useRef(null);

  const {
    eliminarUsuario,
    listaUsuarios,
    setListaUsuarios,
    setDeleteUserDialog,
    user,
    setUser,
  } = useControl();

  const deleteUser = () => {
    eliminarUsuario(user.id);
    let _users = listaUsuarios.filter((val) => val.id !== user.id);

    setListaUsuarios(_users);
    setDeleteUserDialog(false);
    setUser(emptyUser);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Usuario eliminado con exito.",
      life: 3000,
    });
  };
  const hideDeleteProductDialog = () => {
    setDeleteUserDialog(false);
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3 "
          style={{ fontSize: "2rem" }}
        />
        {user && (
          <span>
            Estas seguro de eliminar a <b>{user.first_name} {user.last_name}</b>?
          </span>
        )}
      </div>
      <div className="gap-1 grid grid-cols-2 mt-5">
        <React.Fragment>
          <Button
            label="No"
            icon="pi pi-times"
            onClick={hideDeleteProductDialog}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            onClick={deleteUser}
          />
        </React.Fragment>
        <div />
      </div>
    </div>
  );
};
