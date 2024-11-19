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
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
import { Toast } from "primereact/toast";

export const ListaPedidos = () => {
  const {
    listarPedidos,
    listaPedidos,
    setlistaPedidos,
    loadingPedidosLista,
    EliminarPedido,
  } = useControlPedidos();
  const [expandedRows, setExpandedRows] = useState(null);
  const [pedidoEliminar, setpedidoEliminar] = useState(null);
  const buttonRefs = useRef({}); // Guarda referencias de todos los botones
  const [visible, setVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const toast = useRef(null);
  useEffect(() => {
    if (listaPedidos.length === 0) {
      listarPedidos();
    }
    console.log(listaPedidos);
  }, [listaPedidos]);
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
      <div className="flex justify-between bg-gray-100">
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
            className="bg-purple-600 border-purple-400 hover:bg-purple-800 "
          ></Button>
        </div>
      </div>
    );
  };
  const allowExpansion = (rowData) => {
    return rowData.products.length > 0;
  };

  const getOrderSeverity = (order) => {
    console.log("order", order);
    switch (order.status) {
      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "danger";

      case "PENDING":
        return "warning";

      case "RETURNED":
        return "info";

      default:
        return null;
    }
  };
  const getOrderMessage = (order) => {
    console.log("order", order);
    switch (order.status) {
      case "DELIVERED":
        return "ENTREGADO";

      case "CANCELLED":
        return "CANCELADO";

      case "PENDING":
        return "PENDIENTE";

      case "RETURNED":
        return "DEVUELTO";

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
  //CANTIDAD PARA SKELETON
  const items = Array.from({ length: 10 }, (v, i) => i);

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
            setpedidoEliminar(rowData.id);
            toggleVisibility(rowData.id);
          }} // Cambiar visibilidad de esta fila
        />
      </React.Fragment>
    );
  };
  return (
    <div className="md:mt-24">
      <Toast ref={toast} />
      {loadingPedidosLista ? (
        <div className="card">
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
      ) : (
        <div className="card">
          <DataTable
            value={listaPedidos}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            onRowExpand={onRowExpand}
            onRowCollapse={onRowCollapse}
            rowExpansionTemplate={PedidoDesplegado}
            dataKey="id"
            filters={filters}
            sortField="id"
            sortOrder={-1}
            header={header()}
            tableStyle={{ minWidth: "60rem" }}
            emptyMessage={"No se encontraron pedidos"}
          >
            <Column expander={allowExpansion} style={{ width: "5rem" }} />
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
                  return `${rowData.user.profile.city} `;
                }
              }}
              sortable
            />
            <Column
              field="delivery_cost"
              header="Valor Domicilio"
              sortable
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
              body={statusOrderBodyTemplate}
            />
            <Column body={actionBodyTemplate} exportable={false}></Column>
          </DataTable>
        </div>
      )}
    </div>
  );
};
