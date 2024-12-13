import React, { useEffect, useState, useRef } from "react";
import useControlPedidos from "../../hooks/useControlPedidos";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { PedidoDesplegado } from "./PedidoDesplegado";
import { Skeleton } from "primereact/skeleton";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { FiEye } from "react-icons/fi";

import { ProgressSpinner } from "primereact/progressspinner";

export const ListaPedidos = () => {
  const {
    listarPedidos,
    listaPedidos,
    setlistaPedidos,
    loadingPedidosLista,
    EliminarPedido,
    EditarPedido,
    setDialogPedido,
    DialogPedido,
  } = useControlPedidos();
  const [expandedRows, setExpandedRows] = useState(null);
  const [pedidoEliminar, setpedidoEliminar] = useState(null);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const toast = useRef(null);
  const [pedidoEnEdicion, setPedidoEnEdicion] = useState(null);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [statuses] = useState([
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
  ]);

  useEffect(() => {
    if (listaPedidos.length === 0) {
      listarPedidos(); // Llama solo si la lista está vacía
    }
  }, [listarPedidos]); // Dependencia solo de listarPedidos
  useEffect(() => {
    const pedidosOrdenados = [...listaPedidos].sort((a, b) => b.id - a.id);
    if (JSON.stringify(listaPedidos) !== JSON.stringify(pedidosOrdenados)) {
      setlistaPedidos(pedidosOrdenados);
    }
  }, [listaPedidos, setlistaPedidos]);

  const onRowExpand = (event) => {};

  const onRowCollapse = (event) => {};
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const header = () => {
    return (
      <div className="flex justify-between">
        <div>
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Buscar"
            />
          </IconField>
        </div>
        <div>
          <Button
            loading={loadingPedidosLista}
            icon="pi pi-replay"
            onClick={() => {
              listarPedidos();
            }}
            z
            className="bg-purple-600 border-purple-400 hover:bg-purple-800 "
          ></Button>
        </div>
      </div>
    );
  };

  const getOrderSeverity = (order, editor) => {
    let pedido;
    if (editor) {
      pedido = order;
    } else {
      pedido = order.status;
    }
    switch (pedido) {
      case "COMPLETED":
        return "success";

      case "CANCELLED":
        return "danger";

      case "PENDING":
        return "warning";

      case "PROCESSING":
        return "info";

      default:
        return null;
    }
  };
  const getOrderMessage = (order, editor) => {
    let pedido;
    if (editor) {
      pedido = order;
    } else {
      pedido = order.status;
    }
    switch (pedido) {
      case "COMPLETED":
        return "ENTREGADO";

      case "CANCELLED":
        return "CANCELADO";

      case "PENDING":
        return "PENDIENTE";

      case "PROCESSING":
        return "PROCESANDO";

      default:
        return null;
    }
  };
  const statusOrderBodyTemplate = (rowData) => {
    return (
      <Tag
        value={getOrderMessage(rowData)}
        severity={getOrderSeverity(rowData)}
      ></Tag>
    );
  };

  const accept = () => {
    EliminarPedido(pedidoEliminar);
  };

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
      message: `Estas seguro de eliminar el pedido #${pedidoEliminar}`,
      header: " Confirmación",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  /* Edicion del pedido */
  const onRowEditComplete = (e) => {
    let _pedido = [...listaPedidos];
    let { newData, index } = e;

    _pedido[index] = newData;
    EditarPedido(newData);
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
  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return (
            <Tag
              value={getOrderMessage(option, true)}
              severity={getOrderSeverity(option, true)}
            ></Tag>
          );
        }}
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
  const botonEliminar = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => {
          setpedidoEliminar(rowData.id);
          setisModalOpen(true);
          confirm1();
        }}
      />
    );
  };
  //CANTIDAD PARA SKELETON
  const items = Array.from({ length: 15 }, (v, i) => i);

  return (
    <div className="md:mt-24">
      {isModalOpen && <ConfirmDialog />}
      <Toast ref={toast} />
      <Dialog
        header={`Productos pedido ${DialogPedido}`}
        visible={visibleDialog}
        style={{ width: "80vw", height: "50hv" }}
        className="h-auto p-0 dialog-products"
        maximizable
        breakpoints={{ "960px": "90vw", "641px": "90vw", "430px": "99vw" }}
        onHide={() => {
          if (!visibleDialog) return;
          setVisibleDialog(false);
        }}
      >
        <PedidoDesplegado />
      </Dialog>
      {loadingPedidosLista ? (
        <>
          <div className="  hidden md:block card">
            <DataTable
              value={items}
              header={header()}
              className="p-datatable-striped"
            >
              <Column header="Id" body={<Skeleton />}></Column>
              <Column header="Responsable" body={<Skeleton />}></Column>
              <Column header="Direccion" body={<Skeleton />}></Column>
              <Column
                field="quantity"
                header="Ciudad"
                body={<Skeleton />}
              ></Column>
              <Column header="Valor Domicilio" body={<Skeleton />}></Column>
              <Column header="Valor Pedido" body={<Skeleton />}></Column>
              <Column header="Fecha " body={<Skeleton />}></Column>
              <Column
                field="status"
                header="Estado"
                sortable
                body={<Skeleton />}
              />
            </DataTable>
          </div>
          <div className="card mt-96 flex justify-center items-center md:hidden">
            <ProgressSpinner
              style={{ width: "80px", height: "80px" }}
              strokeWidth="10"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        </>
      ) : (
        <>
          <div className=" hidden md:block card">
            <DataTable
              value={listaPedidos}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              onRowExpand={onRowExpand}
              onRowCollapse={onRowCollapse}
              dataKey="id"
              filters={filters}
              header={header()}
              tableStyle={{ minWidth: "60rem" }}
              emptyMessage={"No se encontraron pedidos"}
              editMode="row"
              onRowEditComplete={onRowEditComplete}
            >
              <Column
                body={(rowData) => {
                  return (
                    <Button
                      unstyled={true}
                      icon="pi pi-external-link"
                      className="bg-transparent flex justify-center items-center text-gray-500  border-none hover:text-gray-800 "
                      onClick={() => {
                        setDialogPedido(rowData.id);
                        setVisibleDialog(true);
                      }}
                    />
                  );
                }}
              />
              <Column field="id" header="Id" sortable />
              <Column
                field="user.first_name"
                header="Responsable"
                body={(rowData) => {
                  return `${rowData.user.first_name} ${rowData.user.last_name}`;
                }}
                sortable
              />
              <Column
                field="shipping_address"
                header="Direccion"
                body={(rowData) => {
                  if (rowData.different_shipping) {
                    return `${rowData.shipping_address} `;
                  } else {
                    return `${rowData.user.profile.address} `;
                  }
                }}
                sortable
              />
              <Column
                field="shipping_city"
                header="Ciudad "
                body={(rowData) => {
                  if (rowData.different_shipping) {
                    return `${rowData.shipping_city} `;
                  } else {
                    return `${rowData.user.profile.city.name} `;
                  }
                }}
                sortable
              />
              <Column
                field="delivery_cost"
                header="Valor Domicilio"
                sortable
                editor={(options) => priceEditor(options)}
                body={(rowData) =>
                  new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(rowData.delivery_cost)
                }
              />
              <Column
                field="order_value"
                editor={(options) => priceEditor(options)}
                header="Valor Pedido"
                sortable
                body={(rowData) =>
                  new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(rowData.order_value)
                }
              />
              <Column
                field="created_at"
                header="Fecha"
                body={(rowData) => {
                  const formattedDate = new Date(
                    rowData.created_at
                  ).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false, // Usa formato de 24 horas
                  });
                  return formattedDate;
                }}
                sortable
              />
              <Column
                field="status"
                header="Estado"
                sortable
                editor={(options) => statusEditor(options)}
                body={statusOrderBodyTemplate}
              />
              <Column
                rowEditor={allowEdit}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
              <Column body={botonEliminar}></Column>
            </DataTable>
          </div>
          {/* Mobile view (cards) */}
          <div className="block md:hidden mt-24">
            {/* Header for filtering and refreshing */}
            <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mt-4">
              <div className="flex items-center space-x-2 w-full">
                <InputText
                  placeholder="Buscar..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Button
                  icon="pi pi-search"
                  onClick={() => {
                    const pedidosFiltrados = listaPedidos.filter((pedido) => {
                      const searchText = filtro.trim().toLowerCase();
                      return (
                        pedido.id
                          .toString()
                          .toLowerCase()
                          .includes(searchText) ||
                        `${pedido.user.first_name} ${pedido.user.last_name}`
                          .toLowerCase()
                          .includes(searchText) ||
                        (pedido.different_shipping &&
                          pedido.shipping_address
                            ?.toLowerCase()
                            .includes(searchText)) ||
                        pedido.user.profile.address
                          ?.toLowerCase()
                          .includes(searchText) ||
                        pedido.user.profile.city.name
                          ?.toLowerCase()
                          .includes(searchText) ||
                        pedido.status.toLowerCase().includes(searchText)
                      );
                    });
                    setlistaPedidos(pedidosFiltrados);
                  }}
                  severity="primary"
                />
              </div>
              <Button
                icon="pi pi-refresh"
                onClick={() => {
                  listarPedidos();
                }}
                className="mx-2"
                severity="help"
              />
            </div>
            {listaPedidos?.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 m-3 rounded-lg shadow-md"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-lg">{order.id}</p>
                    <p className="text-gray-600">
                      Comprador: {order.user.first_name} {order.user.last_name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs`}>
                    {statusOrderBodyTemplate(order)}
                  </span>
                </div>

                {/* Editable Content */}
                {pedidoEnEdicion === order.id ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-gray-600">Dirección Envío:</label>
                      <InputText
                        value={
                          order.different_shipping
                            ? order.shipping_address
                            : order.user.profile.address
                        }
                        onChange={(e) => {
                          const newPedidos = listaPedidos.map((pedido) =>
                            pedido.id === order.id
                              ? { ...pedido, shipping_address: e.target.value }
                              : pedido
                          );
                          setlistaPedidos(newPedidos);
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">Ciudad:</label>
                      <p>
                        {order.different_shipping
                          ? order.shipping_city
                          : order.user.profile.city.name}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">Valor Domicilio:</label>
                      <InputNumber
                        value={order.delivery_cost}
                        mode="currency"
                        currency="COP"
                        locale="es-CO"
                        onValueChange={(e) => {
                          const newPedidos = listaPedidos.map((pedido) =>
                            pedido.id === order.id
                              ? { ...pedido, delivery_cost: e.value }
                              : pedido
                          );
                          setlistaPedidos(newPedidos);
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">Valor Pedido:</label>
                      <InputNumber
                        value={order.order_value}
                        mode="currency"
                        currency="COP"
                        locale="es-CO"
                        onValueChange={(e) => {
                          const newPedidos = listaPedidos.map((pedido) =>
                            pedido.id === order.id
                              ? { ...pedido, order_value: e.value }
                              : pedido
                          );
                          setlistaPedidos(newPedidos);
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">Estado:</label>
                      <Dropdown
                        value={order.status}
                        options={statuses}
                        onChange={(e) => {
                          const newPedidos = listaPedidos.map((pedido) =>
                            pedido.id === order.id
                              ? { ...pedido, status: e.value }
                              : pedido
                          );
                          setlistaPedidos(newPedidos);
                        }}
                        itemTemplate={(option) => (
                          <Tag
                            value={getOrderMessage(option, true)}
                            severity={getOrderSeverity(option, true)}
                          />
                        )}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        EditarPedido(order); // Guarda los cambios en el backend
                        setPedidoEnEdicion(null); // Sal del modo edición
                      }}
                      className="w-full mt-4 inline-flex items-center justify-center px-4 py-2"
                      severity="success"
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                ) : (
                  // Static View
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Fecha Creación:</p>
                      <p>
                        {new Intl.DateTimeFormat("es-CO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(order.created_at))}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Dirección Envío:</p>
                      <p>
                        {order.different_shipping && order.shipping_address
                          ? order.shipping_address
                          : order.user.profile.address}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Ciudad:</p>
                      <p>
                        {order.different_shipping
                          ? order.shipping_city
                          : order.user.profile.city.name}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Valor Domicilio:</p>
                      <p>
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(order.delivery_cost)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Valor Pedido:</p>
                      <p>
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(order.order_value)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => setPedidoEnEdicion(order.id)}
                        className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 "
                        severity="help"
                        icon="pi pi-pencil"
                        label="Editar "
                      />

                      <Button
                        onClick={() => {
                          setDialogPedido(order.id);
                          setVisibleDialog(true);
                        }}
                        className="w-full mt-4 inline-flex items-center justify-center px-4 py-2"
                        aria-label="View order details"
                        severity="primary"
                      >
                        <FiEye className="mr-2" />
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
