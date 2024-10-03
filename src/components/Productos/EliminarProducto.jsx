import React, { useRef } from "react";
import useControlProductos from "../../hooks/useControlProductos";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export const EliminarProducto = () => {
  let emptyProduct = {
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
  const toast = useRef(null);

  const {
    eliminarProducto,
    productos,
    setProductos,
    setDeleteProductDialog,
    product,
    setProduct,
  } = useControlProductos();

  const deleteProduct = () => {
    eliminarProducto(product.id);
    let _products = productos.filter((val) => val.id !== product.id);

    setProductos(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Producto Eliminado",
      life: 3000,
    });
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {product && (
          <span>
            Estas seguro de eliminar <b>{product.name}</b>?
          </span>
        )}
      </div>
      <div className="gap-1 grid grid-cols-2 mt-5">
        <React.Fragment>
          <Button
            label="No"
            icon="pi pi-times"
            onClick={hideDeleteProductDialog}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            onClick={deleteProduct}
          />
        </React.Fragment>
        <div />
      </div>
    </div>
  );
};
