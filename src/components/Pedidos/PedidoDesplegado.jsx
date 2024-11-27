import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import useControlPedidos from "../../hooks/useControlPedidos";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const PedidoDesplegado = () => {
  const { listaPedidos, setlistaPedidos, EditarPedido, DialogPedido } =
    useControlPedidos();
  const toast = useRef(null);
  const [idEliminar, setIdEliminar] = useState(null);

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.images[0]?.image_url}
        alt={rowData.image}
        className="shadow-4 rounded-md"
        style={{ width: "64px" }}
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
  const accept = () => {
    const productId = idEliminar;
    if (productId) {
      const pedidoId = DialogPedido; // ID del pedido actual
      const _listaPedidos = [...listaPedidos]; // Copia de la lista de pedidos

      // Encontrar el índice del pedido correspondiente por ID
      const pedidoIndex = _listaPedidos.findIndex(
        (pedido) => pedido.id === pedidoId
      );

      if (pedidoIndex !== -1) {
        // Filtrar la lista de productos del pedido para eliminar el producto con el ID
        const updatedProducts = _listaPedidos[pedidoIndex].products.filter(
          (product) => product.id !== productId
        );

        // Actualizar la lista de productos del pedido
        _listaPedidos[pedidoIndex].products = updatedProducts;

        console.log("prod", _listaPedidos[pedidoIndex].products);
        // Llamar a `EditarPedido` con el pedido actualizado
        EditarPedido(_listaPedidos[pedidoIndex]);
      }
    }
  };

  const reject = () => {};

  const confirm2 = (id) => {
    setIdEliminar(id);
    confirmDialog({
      message: `Estas seguro de eliminar el producto #${id}`,
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
    const pedidoId = DialogPedido; // ID del pedido actual
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

      // Llamar a `EditarPedido` con el pedido actualizado
      EditarPedido(_listaPedidos[pedidoIndex]);
    }
  };

  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };
  const footer = () => {
    const pedidoTotal = products.reduce((total, product) => {
      const subtotal = parseFloat(product.subtotal) || 0; // Convertir a número o usar 0 si es NaN
      return total + subtotal;
    }, 0);

    return (
      <h3>
        Subtotal del pedido:{" "}
        {new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(pedidoTotal)}
      </h3>
    );
  };
  const pedidoActual = listaPedidos.find(
    (pedido) => pedido.id === DialogPedido
  );
  const products = pedidoActual?.products || []; // Si no encuentra, devuelve un array vacío

  return (
    <div className=" w-full">
      <ConfirmDialog />
      <Toast ref={toast} />

      <DataTable
        className="w-full"
        value={products}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        emptyMessage="No se encontraron productos del pedido"
        footer={footer}
      >
        <Column field="id" header="Id" sortable></Column>

        <Column header="imagen" field="images" body={imageBodyTemplate} />

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
          body={(rowData) => {
            return (
              <Button
                icon="pi pi-trash"
                rounded
                outlined
                disabled={products.length === 1}
                severity="danger"
                onClick={() => {
                  confirm2(rowData.id);
                }}
              />
            );
          }}
        ></Column>
      </DataTable>
    </div>
  );
};
