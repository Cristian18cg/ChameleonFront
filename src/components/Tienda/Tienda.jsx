import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import useControlProductos from "../../hooks/useControlProductos";
import { Tree } from "primereact/tree";
import { useNavigate } from "react-router-dom";

export const Tienda = () => {
  const navigate = useNavigate();

  const {
    productos,
    obtenerProductos,
    listarCategorias,
    categorias,
    filtrarCategoria,
  } = useControlProductos();
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [nodeCategoria, setnodeCategoria] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [disabledFiltroCate, setdisabledFiltroCate] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
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
  useEffect(() => {
    if (selectedKey) {
      console.log(selectedKey);
      setdisabledFiltroCate(false);
    } else {
      setdisabledFiltroCate(true);
    }
  }, [selectedKey]);
  useEffect(() => {
    if (categorias?.length === 0) {
      listarCategorias();
    } else {
      // Construir el árbol de categorías cuando estén disponibles
      const cate = buildCategoryTree(categorias);

      // Setear el árbol de categorías para el TreeSelect
      setnodeCategoria(cate);
    }
  }, [categorias]);
  const buildCategoryTree = (categories) => {
    const categoryMap = {};
    // Crear un map para acceder rápidamente a las categorías por su ID
    if (Array.isArray(categories)) {
      categories.forEach((categoria) => {
        categoryMap[categoria.id] = {
          label: categoria.name,
          key: categoria.id,
          children: [],
        };
      });
    } else {
      console.log("categories no es un array");
    }

    const tree = [];

    // Iterar sobre las categorías y asignarlas a sus padres o a la raíz
    categories.forEach((categoria) => {
      if (categoria.parent === null) {
        tree.push(categoryMap[categoria.id]);
      } else if (categoryMap[categoria.parent]) {
        categoryMap[categoria.parent].children.push(categoryMap[categoria.id]);
      }
    });

    return tree;
  };

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
            src={`${product?.images[0].image_url}`}
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
      <div className="p-2 " key={product.id}>
        <div className="p-4 border border-gray-200 rounded-lg shadow-md">
          {/* Categoría y estado de inventario */}
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <i className="pi pi-tag text-gray-500"></i>
              <span
                className="font-semibold text-gray-700"
                onClick={() => {
                  console.log("categoria", product.categories);
                }}
              >
                {product.categories && product.categories.length > 0
                  ? product.categories.join(", ") // Unir las categorías con comas
                  : "Sin categoría"}
              </span>
            </div>
            <Tag value={getMessage(product)} severity={getSeverity(product)} />
          </div>

          {/* Imagen y nombre del producto */}
          <div className="flex flex-col items-center gap-1 py-5">
            <div
              className="relative hover:cursor-pointer"
              onClick={() => {
                navigate(`/tienda/${product.id}`);
              }}
            >
              <img
                className={` shadow-lg rounded-lg transition-opacity duration-300 ${
                  isHovering ? "opacity-0" : "opacity-100"
                }`}
                src={product?.images[0]?.image_url}
                alt={product.name}
                onMouseEnter={handleMouseEnter} // Maneja el evento mouse enter
                onMouseLeave={handleMouseLeave} // Maneja el evento mouse leave
                style={{ width: "200px", height: "250px" }}
              />
              {product?.images[1] && (
                <img
                  className={`absolute inset-0 shadow-lg rounded-lg transition-opacity duration-300 ${
                    isHovering ? "opacity-100" : "opacity-0"
                  }`}
                  src={product?.images[1]?.image}
                  alt={`${product.name} hover`}
                  style={{ width: "200px", height: "250px" }}
                />
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {product.name}
            </div>
            {product?.rating > 0 && (
              <>
                <Rating
                  value={product.rating}
                  cancel={false}
                  readOnly
                  className="text-yellow-500 "
                />
                <p>({product.rating})</p>
              </>
            )}
          </div>

          {/* Precio  */}
          <div className="flex justify-center">
            <div className="grid  grid-cols-1 md:grid-cols-2">
              <div className="flex justify-center">
              {product.discount_percentage &&
                  product.discount_percentage > 0 && (
                    <span className=" text-2xl font-semibold text-red-600 line-through">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(product.price)}
                    </span>
                  )}
                   {product.discount_percentage &&
                  product.discount_percentage > 0 && (
                <span className="text-lg font-semibold text-red-600 line-through mt-1">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(product.price)}
                </span>
                  )}

              </div>
              <div className="flex justify-start">
                <span className="text-2xl font-semibold text-gray-900 ">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(product.discount_price)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              label="Agregar al carrito"
              iconPos="right"
              icon="pi pi-shopping-cart"
              className=" mt-2 first-line:rounded-full bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 p-5"
              disabled={product.stock === 0}
            />
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
      <div className="flex justify-between  bg-transparent unded-lg">
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
          className="text-gray-600 botones-tienda"
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };
  const headertree = () => {
    return (
      <div>
        <h3 className="font-bold">Categorias</h3>
      </div>
    );
  };
  const footertree = () => {
    return (
      <div>
        {!disabledFiltroCate && (
          <Button
            label="Filtrar Categoria"
            className="bg-green-500 border-green-600 hover:bg-green-400 hover:border-green-500"
            onClick={() => {
              filtrarCategoria(selectedKey);
            }}
          />
        )}
      </div>
    );
  };
  return (
    <div className="w-full flex justify-center">
      <div className=" sm:w-11/12 md:w-5/6 grid grid-cols-2  sm:grid-cols-12 md:grid-cols-12 ">
        <div className=" hidden sm:block col-span-12 sm:col-span-12 md:col-span-3 ">
          <div className="flex justify-center ">
            <h1 className="font-extrabold text-2xl p-2 rounded-sm">FILTROS</h1>
          </div>
          <Tree
            value={nodeCategoria}
            selectionMode="single"
            selectionKeys={selectedKey}
            onSelectionChange={(e) => setSelectedKey(e.value)}
            className="w-full md:w-30rem mt-1 "
            header={headertree}
            footer={footertree}
          />
        </div>
        <div className="card col-span-12  sm:col-span-12 md:col-span-9">
          <DataView
            value={products}
            listTemplate={listTemplate}
            layout={layout}
            header={header()}
            sortField={sortField}
            sortOrder={sortOrder}
            paginator
            rows={12}
            className="data-view-custom"
            emptyMessage="No se encontraron productos"
          />
        </div>
      </div>
    </div>
  );
};
