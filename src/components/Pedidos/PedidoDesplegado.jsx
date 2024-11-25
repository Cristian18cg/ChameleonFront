import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import useControlPedidos from "../../hooks/useControlPedidos";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const PedidoDesplegado = (data) => {
  const {
    listarPedidos,
    listaPedidos,
    setlistaPedidos,
    loadingPedidosLista,
    EliminarPedido,
    EditarPedido,
  } = useControlPedidos();
  const [productoEliminar, setproductoEliminar] = useState(null);
  const toast = useRef(null);

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

  const numEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        min={1}
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

  const confirm1 = () => {
    confirmDialog({
      message: `Estas seguro de eliminar el producto #${productoEliminar}`,
      header: " Confirmación",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };
  /* Edicion del pedido */
  const onRowEditComplete = (e) => {
    const { newData, index } = e; // Datos editados y su índice en la tabla
    const pedidoId = data.id; // ID del pedido actual
    const _listaPedidos = [...listaPedidos]; // Copia de la lista de pedidos

    // Encontrar el pedido correspondiente por ID
    const pedidoIndex = _listaPedidos.findIndex(
      (pedido) => pedido.id === pedidoId
    );

    if (pedidoIndex !== -1) {
      // Actualizar el producto en la lista de productos del pedido
      const _products = [..._listaPedidos[pedidoIndex].products];
      _products[index] = newData;

      // Actualizar la lista de productos del pedido
      _listaPedidos[pedidoIndex].products = _products;

      // Actualizar el estado local de `listaPedidos`
      setlistaPedidos(_listaPedidos);

      // Llamar a `EditarPedido` con el pedido actualizado
      EditarPedido(_listaPedidos[pedidoIndex]);
    }
  };

  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };
  const BotonEliminar = ({ rowData, productsLength, onEliminar }) => {
    // Mostrar el botón solo si hay más de un producto
    if (productsLength <= 1) return null;

    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => onEliminar(rowData.id)}
      />
    );
  };
  const onEliminar = (id) => {
    setproductoEliminar(id);
    confirm1();
  };

  return (
    <div className="p-3">
      <h5>Productos del pedido #{data?.id}</h5>
      <ConfirmDialog />
      <Toast ref={toast} />

      <DataTable
        value={data.products}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        emptyMessage="No se encontraron productos del pedido"
      >
        <Column field="id" header="Id" sortable></Column>

        <Column field="images" body={imageBodyTemplate} />

        <Column field="product_name" header="Nombre" sortable></Column>

        <Column
          field="quantity"
          editor={(options) => numEditor(options)}
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
        <Column
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              rounded
              outlined
              severity="danger"
              onClick={() => onEliminar(rowData.id)}
            />
          )}
        ></Column>
      </DataTable>
    </div>
  );
};
