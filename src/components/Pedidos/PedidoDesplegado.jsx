import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
export const PedidoDesplegado = (data) => {
  console.log(data);
  const formatCurrency = (value) => {
    return value?.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };
  const amountBodyTemplate = (rowData) => {
    return formatCurrency(rowData.unit_price);
  };

  const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />;
  };
  const imageBodyTemplate = (rowData) => {
    console.log('image',rowData)
    return (
      <img
        src={rowData.images[0]?.image_url}
        alt={rowData.image}
        width="64px"
        className="shadow-4 rounde"
      />
    );
  };
  return (
    <div className="p-3">
      <h5>Productos del pedido {data.id}</h5>
      <DataTable value={data.products}>
        <Column header="Imagen"  field="images" body={imageBodyTemplate} />

        <Column field="product_name" header="Nombre" sortable></Column>

        <Column field="quantity" header="Cantidad" sortable></Column>
        <Column field="date" header="Date" sortable></Column>
        <Column
          field="unit_price"
          header="Precio Unitario"
          body={amountBodyTemplate}
          sortable
        ></Column>

        <Column
          body={searchBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};
