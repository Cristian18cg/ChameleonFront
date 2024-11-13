import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import useControlProductos from "../../hooks/useControlProductos";
import useControlPedidos from "../../hooks/useControlPedidos";
import { Tree } from "primereact/tree";
import { useNavigate } from "react-router-dom";
import { InputNumber } from "primereact/inputnumber";
import { Skeleton } from "primereact/skeleton";
export const Tienda = () => {
  const navigate = useNavigate();

  // Función para actualizar las unidades por producto

  const {
    carrito,
    agregarAlCarrito,
    handleUnitChange,
    setCarrito,
    unidades,
    setUnidades,
    isProductoEnCarrito,
  } = useControlPedidos();
  const {
    productos,
    obtenerProductos,
    listarCategorias,
    categorias,
    filtrarCategoria,
    btndelCate,
    setbtndelCate,
  } = useControlProductos();
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [nodeCategoria, setnodeCategoria] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [disabledFiltroCate, setdisabledFiltroCate] = useState(true);
  const [hoverStates, setHoverStates] = useState({});

  const handleMouseEnter = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };
  const sortOptions = [
    { label: "Precio Mayor a Menor", value: "!price" },
    { label: "Precio Menor a Mayor", value: "price" },
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
  // List Item View
  const listItem = (product, index) => {
    return (
      <div className="  w-full" key={product.id}>
        <div
          className={classNames(
            "flex flex-row xl:flex-row xl:items-start p-4 gap-4",
            { "border-t border-gray-200": index !== 0 }
          )}
        >
          {/* Imagen del producto */}
          <img
            className="w-52 sm:w-64 xl:w-40 shadow-lg mx-auto rounded-lg "
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
               
              </div>
              <Tag value={getMessage(product)} severity={getSeverity(product)} />
            </div>

            {/* Precio */}
            <div className="flex  flex-col justify-center lg:mx-24 mb-3">
              <div
                className={`grid ${
                  product.discount_percentage && product.discount_percentage > 0
                    ? "grid-cols-1 md:grid-cols-2  lg:gap-5"
                    : "grid-cols-1"
                }`}
              >
                {product.discount_percentage &&
                  product.discount_percentage > 0 && (
                    <div className="flex justify-center">
                      <span className="text-lg md:text-xl font-semibold text-red-400 line-through md:mt-1 lg:mx-2  ">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(product.price)}
                      </span>
                    </div>
                  )}

                <div
                  className={`flex ${
                    product.discount_percentage &&
                    product.discount_percentage > 0
                      ? "justify-start"
                      : "justify-center"
                  }`}
                >
                  <span className=" text-2xl md:text-3xl font-semibold text-gray-900">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(
                      product.discount_percentage &&
                        product.discount_percentage > 0
                        ? product.discount_price
                        : product.price
                    )}
                  </span>
                </div>
              </div>
            </div>
            {/* Unidades y botón de agregar al carrito */}
            <div className="mt-1 flex flex-col justify-center items-center w-full">
              <InputNumber
                inputId="horizontal-buttons"
                value={unidades[product.id] || 0}
                onValueChange={(e) => handleUnitChange(product.id, e.value)}
                showButtons
                min={1}
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                className="input-number-cart"
              />

              <Button
                label={
                  isProductoEnCarrito(product.id)
                    ? "Agregado"
                    : "Agregar al Carrito"
                }
                icon={
                  isProductoEnCarrito(product.id)
                    ? "pi pi-check"
                    : "pi pi-shopping-cart"
                }
                className={`p-button mt-2 ${
                  isProductoEnCarrito(product.id)
                    ? "p-button-success"
                    : "p-button-primary"
                }`}
                disabled={isProductoEnCarrito(product.id) ? true : false}
                onClick={() =>
                  agregarAlCarrito(product, unidades[product.id] || 1)
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Grid Item View
  const gridItem = (product) => {
    const isHovering = hoverStates[product.id] || false;

    return (
      <div className=" p-1" key={product.id}>
        <div className="p-2 md:p-4 border border-gray-200 rounded-lg shadow-md">
          {/* Categoría y estado de inventario */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="pi pi-tag text-gray-500"></i>
              <span
                className="font-semibold text-gray-700"
                onClick={() => {
                  console.log("categoria", product.categories);
                }}
              >
                {product.categories && product.categories.length > 0
                  ? product.categories.join(", ")
                  : "Sin categoría"}
              </span>
            </div>
            <Tag value={getMessage(product)} severity={getSeverity(product)} />
          </div>

          {/* Imagen y nombre del producto */}
          <div className="flex flex-col items-center  py-5">
            {/* Imagen y nombre del producto */}
            <div className="flex flex-col items-center  ">
              <div
                onClick={() => {
                  navigate(`/tienda/${product.id}`);
                }}
                className="hover:cursor-pointer relative w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={() => handleMouseLeave(product.id)}
              >
                <img
                  className={`w-full h-auto max-h-screen shadow-lg rounded-lg transition-opacity duration-300 ${
                    isHovering ? "opacity-0" : "opacity-100"
                  }`}
                  src={product?.images[0]?.image_url}
                  alt={product.name}
                />
                {product?.images[1] && (
                  <img
                    className={`w-full h-auto absolute inset-0 shadow-lg rounded-lg transition-opacity duration-400 ${
                      isHovering ? "opacity-100" : "opacity-0"
                    }`}
                    src={product?.images[1]?.image_url}
                    alt={`${product.name} hover`}
                  />
                )}
              </div>

              <div className="text-xl xl:text-2xl font-bold text-gray-900">
                {product.name}
              </div>
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

          {/* Precio */}
          <div className="flex justify-center mb-3">
            <div
              className={`grid ${
                product.discount_percentage && product.discount_percentage > 0
                  ? "grid-cols-1 md:grid-cols-2 "
                  : "grid-cols-1"
              }`}
            >
              {product.discount_percentage &&
                product.discount_percentage > 0 && (
                  <div className="flex justify-center">
                    <span className="text-lg md:text-xl font-semibold text-red-400 line-through md:mt-1  ">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(product.price)}
                    </span>
                  </div>
                )}

              <div
                className={`flex ${
                  product.discount_percentage && product.discount_percentage > 0
                    ? "justify-start"
                    : "justify-center"
                }`}
              >
                <span className=" text-2xl md:text-3xl font-semibold text-gray-900">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(
                    product.discount_percentage &&
                      product.discount_percentage > 0
                      ? product.discount_price
                      : product.price
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Unidades y botón de agregar al carrito */}
          <div className="mt-1 flex flex-col justify-center items-center w-full">
            <InputNumber
              inputId="horizontal-buttons"
              value={unidades[product.id] || 0}
              onValueChange={(e) => handleUnitChange(product.id, e.value)}
              showButtons
              min={1}
              buttonLayout="horizontal"
              decrementButtonClassName="p-button-danger"
              incrementButtonClassName="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              className="input-number-cart"
            />

            <Button
              label={
                isProductoEnCarrito(product.id)
                  ? "Agregado"
                  : "Agregar al Carrito"
              }
              icon={
                isProductoEnCarrito(product.id)
                  ? "pi pi-check"
                  : "pi pi-shopping-cart"
              }
              className={`p-button mt-2 ${
                isProductoEnCarrito(product.id)
                  ? "p-button-success"
                  : "p-button-primary"
              }`}
              disabled={isProductoEnCarrito(product.id) ? true : false}
              onClick={() =>
                agregarAlCarrito(product, unidades[product.id] || 1)
              }
            />
          </div>
        </div>
      </div>
    );
  };
  const listItemSkeleton = (product, index) => {
    return (
      <div className="col-12" key={product.id}>
        <div
          className={classNames(
            "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
            { "border-top-1 surface-border": index !== 0 }
          )}
        >
          <Skeleton className="w-9 sm:w-16rem xl:w-10rem shadow-2 h-6rem block xl:block mx-auto border-round" />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <Skeleton className="w-8rem border-round h-2rem" />
              <Skeleton className="w-6rem border-round h-1rem" />
              <div className="flex align-items-center gap-3">
                <Skeleton className="w-6rem border-round h-1rem" />
                <Skeleton className="w-3rem border-round h-1rem" />
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <Skeleton className="w-4rem border-round h-2rem" />
              <Skeleton shape="circle" className="w-3rem h-3rem" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItemSkeleton = (product) => {
    return (
      <div className=" col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product}>
        <div className="p-4 border-1 card border-gray-100 border-2 rounded-md">
          <div className="flex  align-items-center justify-content-between gap-2">
            <Skeleton className="w-24 border-round h-4" />
            <Skeleton className="w-12 border-round h-4" />
          </div>
          <div className="flex flex-col align-items-center gap-3 py-5">
            <Skeleton className="w-9 shadow-2 border-round min-h-40" />
            <Skeleton className="w-32 border-round min-h-8" />
            <Skeleton className="w-12 border-round min-h-4" />
          </div>
          <div className="flex align-items-center justify-center">
            <Skeleton className="max-w-32 border-round min-h-2rem" />
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
  const loadingSkeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const itemTemplate2 = (product, layout, index) => {
    if (!product) {
      return;
    }

    if (layout === "list") return listItemSkeleton(product, index);
    else if (layout === "grid") return gridItemSkeleton(index);
  };
  const listTemplate2 = (products, layout) => {
    console.log(products);
    return (
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4 "
            : "grid grid-cols-1"
        }
      >
        {products.map((product, index) =>
          itemTemplate2(product, layout, index)
        )}
      </div>
    );
  };
  const listTemplate = (products, layout) => {
    return (
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4 "
            : "grid grid-cols-1"
        }
      >
        {products.map((product, index) => itemTemplate(product, layout, index))}
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex justify-between  bg-transparent unded-lg ">
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
          <div className="grid md:grid-cols-2 grid-cols-1">
            <Button
              label="Filtrar Categoria"
              className="bg-green-500 border-green-600 hover:bg-green-400 hover:border-green-500"
              onClick={() => {
                filtrarCategoria(selectedKey);
              }}
            />
            <Button
              disabled={btndelCate}
              label="Borrar Filtro"
              severity="danger"
              onClick={() => {
                obtenerProductos();
                setdisabledFiltroCate(true);
                setSelectedKey(null);
              }}
              className="md:mx-2"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="mt-20 md:mt-24 min-w-full flex justify-center overflow-hidden">
      <div className="  md:w-5/6 grid grid-cols-2  sm:grid-cols-12 md:grid-cols-12 ">
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
          {products && products.length > 0 ? (
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
          ) : (
            <>
              <DataView
                value={loadingSkeletons}
                listTemplate={listTemplate2}
                layout={layout}
                header={header()}
                sortField={sortField}
                sortOrder={sortOrder}
                paginator
                rows={12}
                className="data-view-custom"
                emptyMessage="No se encontraron productos"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
