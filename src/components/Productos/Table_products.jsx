import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { CrearProducto } from "./CrearProducto";
import useControlProductos from "../../hooks/useControlProductos";
import { EliminarProducto } from "./EliminarProducto";
export default function ProductsDemo() {
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
  const {
    productos,
    obtenerProductos,
    productDialog,
    setProductDialog,
    deleteProductDialog,
    setDeleteProductDialog,
    product,
    setProduct,
  } = useControlProductos();
  const [products, setProducts] = useState(null);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    if (productos.length === 0) {
      obtenerProductos();
    } else {
      setProducts(productos);
    }
    console.log(productos);
  }, [productos]);

  const formatCurrency = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        _product.image = "product-placeholder.svg";
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nuevo producto"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Exportar"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`${rowData.image}`}
        alt={rowData.name}
        className="shadow-md shadow-slate-200 rounded"
        style={{ width: "64px" }}
      />
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={getMessage(rowData)} severity={getSeverity(rowData)}></Tag>
    );
  };
  /* BOTONES DE ACCION */
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };
  const getSeverity = (product) => {
    if (product.stock === 0) {
      return `danger`;
    } else if (product.stock > 0 && product.stock <= 5) {
      return `warning`;
    } else if (product.stock > 5) {
      return `success`;
    }

    return null;
  };

  const getMessage = (product) => {
    const stock = product.stock;

    if (stock === 0) {
      return `SIN STOCK -> ${stock}u`;
    } else if (stock > 0 && stock <= 5) {
      return `POCO STOCK -> ${stock}u`;
    } else if (stock > 5) {
      return `EN STOCK -> ${stock}u`;
    }

    return null;
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-3">Administrar Productos</h3>
      <IconField iconPosition="right">
        <InputIcon className="pi pi-search " />
        <InputText
          type="search"
          unstyled
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className=""
        />
      </IconField>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
      />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} productos"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="code"
            header="Code"
            sortable
            style={{ minWidth: "6rem" }}
          ></Column>
          <Column
            field="name"
            header="Nombre"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="image"
            header="Imagen"
            body={imageBodyTemplate}
          ></Column>
          <Column
            field="price"
            header="Precio"
            body={(rowData) =>
              new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(rowData.price)
            }
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="discount_price"
            header="Precio con Descuento "
            body={(rowData) =>
              new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(rowData.discount_price)
            }
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="discount_percentage"
            header="Porcentaje Descuento "
            body={(rowData) => <span>{rowData.discount_percentage} %</span>}
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="categories"
            header="Categoría"
            sortable
            style={{ minWidth: "10rem" }}
            body={(rowData) => {
              // rowData.categories es un array de nombres de categorías
              return rowData.categories && rowData.categories.length > 0
                ? rowData.categories.join(", ") // Unir las categorías con comas
                : "Sin categoría"; // Si no hay categorías, mostrar algún texto por defecto
            }}
          ></Column>

          <Column
            field="rating"
            header="Reviews"
            body={ratingBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>

          <Column
            field="stock"
            header="Stock"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: "50rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Crear producto"
        headerClassName="custom-header2"
        modal
        className="p-fluid custom-dialog"
        /*  footer={productDialogFooter} */ onHide={hideDialog}
      >
        <CrearProducto producto={product} />
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
      <Dialog
        headerClassName="custom-header2"
        className="p-fluid custom-dialog"
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        onHide={() => {
          setDeleteProductDialog(false);
        }}
      >
        <EliminarProducto product={product} />
      </Dialog>
    </div>
  );
}
