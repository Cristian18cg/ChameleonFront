import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import useControlProductos from "../../hooks/useControlProductos";
import { Dropdown } from "primereact/dropdown";
export const Tienda = () => {
  const { productos, obtenerProductos } = useControlProductos();
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortKey, setSortKey] = useState("");
  const sortOptions = [
    { label: "Precio Mayor a Menor", value: "!price" },
    { label: "Precio Menos a Mayor", value: "price" },
  ];
  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };
  useEffect(() => {
    if (productos.length === 0) {
      obtenerProductos();
    } else {
      setProducts(productos);
    }
    console.log(productos);
  }, [productos]);

  // List Item View
  const listItem = (product, index) => {
    return (
      <div className="w-full" key={product.id}>
        <div
          className={classNames(
            "flex flex-col xl:flex-row xl:items-start p-4 gap-4",
            { "border-t border-gray-200": index !== 0 }
          )}
        >
          {/* Imagen del producto */}
          <img
            className="w-full sm:w-64 xl:w-40 shadow-lg mx-auto rounded-lg"
            src={`${product.image}`}
            alt={product.name}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
            {/* Información del producto */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="text-2xl font-bold text-gray-900">
                {product.name}
              </div>
              <Rating
                value={product.rating}
                readOnly
                cancel={false}
                className="text-yellow-500"
              ></Rating>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">{product.categories}</span>
                </span>
                <Tag
                  value={product.stock}
                  severity={getSeverity(product)}
                ></Tag>
              </div>
            </div>

            {/* Precio y botón */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3">
              <span className="text-2xl font-semibold text-gray-900">
                ${product.price}
              </span>
              <Button
                icon="pi pi-shopping-cart"
                className="rounded-full bg-green-500 hover:bg-green-600 text-white p-3"
                disabled={product.inventoryStatus === "OUTOFSTOCK"}
              ></Button>
            </div>
          </div>
        </div>
      </div>
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
      return `SIN STOCK`;
    } else if (stock > 0 && stock <= 5) {
      return `POCO STOCK `;
    } else if (stock > 5) {
      return `EN STOCK `;
    }

    return null;
  };
  // Grid Item View
  const gridItem = (product) => {
    return (
      <div className="p-2" key={product.id}>
        <div className="p-4 border border-gray-200 rounded-lg shadow-md">
          {/* Categoría y estado de inventario */}
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <i className="pi pi-tag text-gray-500"></i>
              <span className="font-semibold text-gray-700">
                {product.categories && product.categories.length > 0
                  ? product.categories.join(", ") // Unir las categorías con comas
                  : "Sin categoría"}
              </span>
            </div>
            <Tag
              value={getMessage(product)}
              severity={getSeverity(product)}
            ></Tag>
          </div>

          {/* Imagen y nombre del producto */}
          <div className="flex flex-col items-center gap-1 py-5">
            <img
              className="shadow-lg rounded-lg"
              src={`${product.image}`}
              alt={product.name}
              style={{ width: "200px", height: "200px" }}
            />
            <div className="text-2xl font-bold text-gray-900">
              {product.name}
            </div>
            <Rating
              value={product.rating}
              readOnly
              cancel={false}
              className="text-yellow-500"
            ></Rating>
          </div>

          {/* Precio y botón */}
          <div className="grid grid-cols-3 ">
            <div className="flex justify-center ">
              <span className="text-lg font-semibold text-red-600 line-through mt-2 ">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(product.price)}
              </span>
            </div>
            <div className="flex justify-center">
              <span className="text-2xl font-semibold text-gray-900 mt-1 ">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(product.discount_price)}
              </span>
            </div>
            <div className="flex justify-end">
              <Button
                icon="pi pi-shopping-cart"
                className="rounded-full bg-green-500 hover:bg-green-600 text-white  border-green-500  hover:border-green-600 p-5"
                disabled={product.stock === 0}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product, layout, index) => {
    if (!product) return;

    if (layout === "list") return listItem(product, index);
    else if (layout === "grid") return gridItem(product);
  };

  const listTemplate = (products, layout) => {
    return (
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            : "grid grid-cols-1"
        }
      >
        {products.map((product, index) => itemTemplate(product, layout, index))}
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex justify-between">
        <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel="label"
          placeholder="Ordenar por precio"
          onChange={onSortChange}
          className=" max-w-52 w-auto p-0 md:w-14rem h-auto sm:w-14rem mx-5"
        />

        <DataViewLayoutOptions
          layout={layout}
          className="text-gray-600"
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <DataView
        value={products}
        listTemplate={listTemplate}
        layout={layout}
        header={header()}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </div>
  );
};
