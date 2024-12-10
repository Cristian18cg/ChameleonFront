import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import useControlPedidos from "../../hooks/useControlPedidos";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";

export const PedidoDesplegado = () => {
  const {
    listaPedidos,
    setlistaPedidos,
    EditarPedido,
    DialogPedido,
    loadingEditar,
  } = useControlPedidos();
  const toast = useRef(null);
  const [idEliminar, setIdEliminar] = useState(null);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

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
  const accept = (id) => {
    const productId = id;
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
    setisModalOpen(false);
  };

  const reject = () => {
    setisModalOpen(false);
  };

  const confirm2 = (id) => {
    setIdEliminar(id);
    confirmDialog({
      message: `Estas seguro de eliminar el producto #${id}`,
      header: " Confirmación",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => accept(id), // Pasar el ID directamente
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
  //CANTIDAD PARA SKELETON
  const items = Array.from({ length: 8 }, (v, i) => i);

  return (
    <div className=" w-full">
      {isModalOpen && <ConfirmDialog />}
      <Toast ref={toast} />
      {loadingEditar ? (
        <div className="card">
          <DataTable value={items} className="p-datatable-striped">
            <Column header="Id" body={<Skeleton />}></Column>
            <Column header="Imagen" body={<Skeleton />}></Column>
            <Column header="Nombre" body={<Skeleton />}></Column>
            <Column header="Cantidad" body={<Skeleton />}></Column>
            <Column header="Precio unitario" body={<Skeleton />}></Column>
            <Column header="Sub-Total" body={<Skeleton />}></Column>
          </DataTable>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              className="w-full"
              value={products}
              editMode="row"
              onRowEditComplete={onRowEditComplete}
              emptyMessage="No se encontraron productos del pedido"
              footer={footer}
            >
              <Column field="id" header="Id" sortable></Column>

              <Column header="Imagen" field="images" body={imageBodyTemplate} />

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
                        setisModalOpen(true);
                      }}
                    />
                  );
                }}
              ></Column>
            </DataTable>
          </div>
          <div className="block md:hidden">
            <div className="grid gap-6 grid-cols-1sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div className="flex">
                    {/* Imagen del producto */}
                    <div className="w-1/3 relative">
                      <img
                        src={product.images[0]?.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1606161290889-77950cfb67d3";
                        }}
                      />
                    </div>
                    {/* Detalles del producto */}
                    <div className="w-2/3 p-3">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {product.name}
                      </h2>

                      {/* Campo editable de cantidad solo si está en modo de edición */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">Cantidad:</span>
                          {editingProductId === product.id ? (
                            <InputNumber
                              value={product.quantity}
                              onValueChange={(e) => {
                                const updatedProducts = [...products];
                                updatedProducts[index].quantity = e.value;
                                setlistaPedidos((prevPedidos) =>
                                  prevPedidos.map((pedido) =>
                                    pedido.id === DialogPedido
                                      ? { ...pedido, products: updatedProducts }
                                      : pedido
                                  )
                                );
                              }}
                              min={1}
                              className="max-w-8"
                            />
                          ) : (
                            <span>{product.quantity}</span>
                          )}
                        </div>
                      </div>

                      {/* Campo editable de precio unitario solo si está en modo de edición */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-gray-600">
                            Precio Unitario:
                          </span>
                          {editingProductId === product.id ? (
                            <InputNumber
                              value={product.unit_price}
                              onValueChange={(e) => {
                                const updatedProducts = [...products];
                                updatedProducts[index].unit_price = e.value;
                                updatedProducts[index].subtotal =
                                  e.value * updatedProducts[index].quantity; // Actualiza subtotal
                                setlistaPedidos((prevPedidos) =>
                                  prevPedidos.map((pedido) =>
                                    pedido.id === DialogPedido
                                      ? { ...pedido, products: updatedProducts }
                                      : pedido
                                  )
                                );
                              }}
                              mode="currency"
                              currency="COP"
                              locale="es-CO"
                              className="max-w-10 mx-2"
                            />
                          ) : (
                            <span className="mx-2">
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }).format(product.unit_price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtotal (no editable) */}
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-gray-800">
                          Subtotal:
                        </span>
                        <span>
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }).format(product.subtotal)}
                        </span>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex justify-end space-x-2 mt-4">
                        {editingProductId === product.id ? (
                          <Button
                            onClick={() => {
                              // Guardar cambios
                              setEditingProductId(null); // Desactivar el modo de edición
                              EditarPedido(pedidoActual); // Aquí se debería actualizar el pedido si es necesario
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Guardar
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setEditingProductId(product.id)}
                            rounded
                            outlined
                            icon="pi pi-pencil"
                          ></Button>
                        )}
                        <Button
                          icon="pi pi-trash"
                          rounded
                          outlined
                          severity="danger"
                          onClick={() => confirm2(product.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
