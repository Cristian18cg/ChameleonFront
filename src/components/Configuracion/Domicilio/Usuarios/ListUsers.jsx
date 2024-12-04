import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import useControl from "../../../../hooks/useControl";
import { EliminarUsuario } from "./EliminarUsuario";
import { EditarUsuario } from "./EditarUsuario";
export const ListUsers = () => {
  const dt = useRef(null);
  const {
    listaUsuarios,
    loadingListaUsuario,
    setUsuarioDialog,
    setUser,
    obtenerUsuarios,
    setDeleteUserDialog,
    user,
    UsuarioDialog,
    deleteUserDialog,
  } = useControl();
  const [globalFilter, setGlobalFilter] = useState(null);
  useEffect(() => {
    if (listaUsuarios.length === 0) {
      obtenerUsuarios();
    }
  }, [listaUsuarios]);
  let emptyUser = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };
  console.log(listaUsuarios);
  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const openNew = () => {
    setUser(emptyUser);
    setUsuarioDialog(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nuevo usuario"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div>
        <Button
          loading={loadingListaUsuario}
          icon="pi pi-replay"
          label="Recargar"
          onClick={() => {
            obtenerUsuarios();
          }}
          className="p-button-help mx-2"
        ></Button>
        <Button
          label="Exportar"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </div>
    );
  };
  const getSeverity = (user) => {
    if (user.is_active) {
      return `sucess`;
    } else {
      return `danger`;
    }
  };

  const getMessage = (user) => {
    if (user.is_active) {
      return `ACTIVO`;
    } else {
      return `INACTIVO`;
    }
  };
  const statusBodyTemplate = (rowData) => {
    console.log(rowData)
    return (
  
      <Tag value={getMessage(rowData)} severity={getSeverity(rowData)}></Tag>
    );
  };
  const editUser = (user) => {
    setUser({ ...user });
    setUsuarioDialog(true);
  };
  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };
  /* BOTONES DE ACCION */
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </React.Fragment>
    );
  };
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-3">Administrar usuarios</h3>
      <IconField iconPosition="right">
        <InputIcon className="pi pi-search " />
        <InputText
          type="search"
          unstyled
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="input-productos p-inputtext p-component p-input "
        />
      </IconField>
    </div>
  );
  const items = Array.from({ length: 15 }, (v, i) => i);

  return (
    <div>
      <Dialog
        headerClassName="custom-header2"
        className="p-fluid custom-dialog"
        visible={deleteUserDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar eliminacion"
        modal
        onHide={() => {
          setDeleteUserDialog(false);
        }}
      >
        <EliminarUsuario user={user} />
      </Dialog>
      <Dialog
        headerClassName="custom-header2"
        className=" custom-dialog  w-full md:w-10/12 lg:w-1/2 "
        visible={UsuarioDialog}
        header="Editar Usuario"
        modal
        onHide={() => {
          setUsuarioDialog(false);
        }}
      >
        <EditarUsuario/>
      </Dialog>
      {!loadingListaUsuario ? (
        <div className="card">
          <Toolbar
            className="mt-24"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={listaUsuarios}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} usuarios"
            globalFilter={globalFilter}
            header={header}
            emptyMessage="No se encontraron usuarios en el sistema."
          >
            <Column field="id" header="Id" sortable></Column>
            <Column
              field="name"
              header="Nombre"
              sortable
              body={(rowData) => {
                return (
                  <div>
                    {rowData.first_name} {rowData.last_name}
                  </div>
                );
              }}
            ></Column>
            <Column field="username" header="Correo" sortable></Column>
            <Column
              field="profile"
              header="Telefono"
              sortable
              body={(rowData) => {
                return <div>{rowData.profile.phone}</div>;
              }}
            ></Column>
            <Column
              field="profile"
              header="Direccion"
              sortable
              body={(rowData) => {
                return <div>{rowData.profile.address}</div>;
              }}
            ></Column>
            <Column
              field="profile"
              header="Ciudad"
              sortable
              body={(rowData) => {
                return <div>{rowData.profile.city.name}</div>;
              }}
            ></Column>

            <Column
              field="is_active"
              header="Estado"
              body={statusBodyTemplate}
              sortable
            ></Column>
            <Column body={actionBodyTemplate} exportable={false}></Column>
          </DataTable>
        </div>
      ) : (
        <div className="card">
          <Toolbar
            className="mt-24"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            value={items}
            header={header}
            className="p-datatable-striped"
          >
            <Column header="Id" body={<Skeleton />}></Column>
            <Column header="Nombre" body={<Skeleton />}></Column>
            <Column header="Correo" body={<Skeleton />}></Column>
            <Column header="Telefono" body={<Skeleton />}></Column>
            <Column header="Direccion" body={<Skeleton />}></Column>
            <Column header="Ciudad" body={<Skeleton />}></Column>
            <Column header="Estado" body={<Skeleton />}></Column>
          </DataTable>
        </div>
      )}
    </div>
  );
};
