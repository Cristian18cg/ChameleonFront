import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
export const PedidoDesplegado = (data) => {

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
  return (
    <div className="p-3">
      <h5>Productos del pedido #{data.id}</h5>
      <DataTable value={data.products}>
        <Column  field="images" body={imageBodyTemplate} />

        <Column field="product_name" header="Nombre" sortable></Column>

        <Column field="quantity" header="Cantidad" sortable></Column>
        <Column
          field="unit_price"
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
     

      </DataTable>
    </div>
  );
};
