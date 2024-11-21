import React, { useRef, useState } from "react";
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
  const [visibleRows, setVisibleRows] = useState({}); // Objeto para manejar visibilidad de cada fila
  /* BOTONES DE ACCION */

  const toggleVisibility = (id) => {
    setVisibleRows((prev) => ({ ...prev, [id]: !prev[id] })); // Cambiar visibilidad solo para esta fila
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <ConfirmPopup
          target={buttonRefs.current[rowData.id]} // Vincular al botón específico
          visible={visibleRows[rowData.id] || false} // Solo visible para la fila correspondiente
          onHide={() =>
            setVisibleRows((prev) => ({ ...prev, [rowData.id]: false }))
          } // Ocultar cuando se cierre
          message="¿Está seguro de eliminar?"
          icon="pi pi-exclamation-triangle"
          accept={accept}
          reject={reject}
        />
        <Button
          ref={(el) => (buttonRefs.current[rowData.id] = el)} // Vincular referencia al botón de esta fila
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger" 
          onClick={() => {
            setEliminar(rowData.id);
            toggleVisibility(rowData.id);
          }} // Cambiar visibilidad de esta fila
        />
      </React.Fragment>
    );
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
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };

  const priceEditor = (options) => {
    return (
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
        value={data.products}
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
