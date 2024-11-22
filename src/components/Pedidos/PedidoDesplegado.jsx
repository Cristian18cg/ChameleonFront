import React, { useRef, useState,useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import useControlPedidos from "../../hooks/useControlPedidos";
import { Toast } from "primereact/toast";

export const PedidoDesplegado = (data) => {
  const {
    listarPedidos,
    listaPedidos,
    setlistaPedidos,
    loadingPedidosLista,
    EliminarPedido,
    EditarPedido,
  } = useControlPedidos();
  const buttonRefs = useRef({}); // Guarda referencias de todos los botones
  const [visible, setVisible] = useState(false);
  const [Eliminar, setEliminar] = useState(null);
  const products = useMemo(() => data.products || [], [data.products]);
  const toast = useRef(null);

  const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />;
  };
  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.images[0]?.image_url}
        alt={rowData.image}
        width="64px"
        className="shadow-4 rounded-md"
      />
    );
  };
  const accept = () => {};

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Has cancelado el proceso",
      life: 3000,
    });
  };


  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => {
            setEliminar(rowData.id);
          }}
        />
      </React.Fragment>
    );e
  };

  
  /* Edicion del pedido */
  const onRowEditComplete = (e) => {
    let _pedido = [...listaPedidos];
    let { newData, index } = e;

    console.log("nueva", newData);
    _pedido[index] = newData;
    EditarPedido(newData);
    setlistaPedidos(_pedido);
  };

  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };

  const priceEditor = (e
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="COP"
        locale="es-CO"
      />
    );
  };
  return (
    <div className="p-3">
      <Toast ref={toast} />

      <h5>Productos del pedido #{data.id}</h5>
      <DataTable
        value={products}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
      >
        <Column field="images" body={imageBodyTemplate} />

        <Column field="product_name" header="Nombre" sortable></Column>

        <Column
          field="quantity"
          editor={(options) => priceEditor(options)}
          header="Cantidad"
          sortable
        ></Column>
        <Column
          field="unit_price"
          editor={(options) => priceEditor(options)}
          header="Precio unitario"
          body={(rowData) =>
            new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(rowData.unit_price)
          }
          sortable
        ></Column>
        <Column
          field="subtotal"
          header="Sub-Total"
          body={(rowData) =>
            new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(rowData.subtotal)
          }
          sortable
        ></Column>

        <Column
          rowEditor={allowEdit}
          bodyStyle={{ textAlign: "center" }}
        ></Column>
        <Column body={actionBodyTemplate} exportable={false}></Column>
      </DataTable>
    </div>
  );
};
