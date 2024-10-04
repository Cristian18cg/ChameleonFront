import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";
import { TreeSelect } from "primereact/treeselect";
import { CrearCategoria } from "./CrearCategoria";
import { Dialog } from "primereact/dialog";
import useControlProductos from "../../hooks/useControlProductos";
export const CrearProducto = ({ producto }) => {
  const {
    categorias,
    listarCategorias,
    setvistaCrearCat,
    vistaCrearCat,
    crearProducto,
    editarProducto,
  } = useControlProductos();
  const [product, setProduct] = useState(producto || { is_active: true });
  const [submitted, setSubmitted] = useState(false);
  const [nodeCategoria, setnodeCategoria] = useState("");
  const [disableDiscountPrice, setDisableDiscountPrice] = useState(true);
  const [disableDiscountPercentage, setDisableDiscountPercentage] =
    useState(true);
  const [imageFile, setImageFile] = useState(null);
  const fileUploadRef = useRef(null);
  // Cuando se carga el producto existente, inicializar el estado
  useEffect(() => {
    if (producto) {
      setProduct(producto);
      setDisableDiscountPrice(!!producto.discount_percentage);
      setDisableDiscountPercentage(!!producto.discount_price);
    }
  }, [producto]);
  useEffect(() => {
    if (categorias?.length === 0) {
      listarCategorias();
    } else {
      // Construir el árbol de categorías cuando estén disponibles
      const cate = buildCategoryTree(categorias);
  
      // Si estamos editando un producto, mapear sus categorías a IDs
      if (product && product.categories) {
        console.log('entro')
        const selectedCategoryIds = product.categories.map((categoryName) => {
          const categoriaEncontrada = categorias.find(
            (cat) => cat.name === categoryName
          );
          return categoriaEncontrada ? categoriaEncontrada.id : null;
        }).filter(id => id !== null);  // Filtrar IDs nulos
        console.log(selectedCategoryIds)
        // Asignar los IDs de las categorías seleccionadas al producto
        setProduct((prevProduct) => ({
          ...prevProduct,
          categories: selectedCategoryIds,
        }));
      }
  
      // Setear el árbol de categorías para el TreeSelect
      setnodeCategoria(cate);
    }
  }, [categorias, product, ]);

  useEffect(() => {
    console.log(product);
  }, [product]);

  const onInputChange = (e, field) => {
    const value = e.target.value;
    setProduct((prevProduct) => ({ ...prevProduct, [field]: value }));
  };

  const onInputNumberChange = (e, field) => {
    const value = e.value;
    if (field === "discount_percentage" && !value) {
      setDisableDiscountPrice(false); // Habilitar precio con descuento
      setDisableDiscountPercentage(false);
    } else if (field === "discount_price" && !value) {
      setDisableDiscountPrice(false); // Habilitar precio con descuento
      setDisableDiscountPercentage(false);
    }
    // Si cambia el porcentaje de descuento, calcular el precio con descuento y desactivar ese campo
    if (field === "discount_percentage" && value) {
      setProduct({
        ...product,
        discount_price: product.price * (1 - value / 100),
      });
      setDisableDiscountPrice(true);
      setDisableDiscountPercentage(false); // Habilitar porcentaje
    } else if (field === "discount_price" && value) {
      // Si cambia el precio con descuento, calcular el porcentaje de descuento y desactivar ese campo
      setProduct({
        ...product,
        discount_percentage: ((product.price - value) / product.price) * 100,
      });

      setDisableDiscountPrice(false); // Habilitar precio con descuento
      setDisableDiscountPercentage(true);
    }
    if (field === "stock" && value) {
      setProduct({ ...product, [field]: value });
    }
    if (field === "price" && value > 100) {
      setDisableDiscountPrice(false); // Habilitar precio con descuento
      setDisableDiscountPercentage(false);
      setProduct({ ...product, [field]: value });
    } else if (field === "price" && !value) {
      setDisableDiscountPrice(true); // Habilitar precio con descuento
      setDisableDiscountPercentage(true);
      setProduct({
        ...product,
        discount_percentage: 0,
        discount_price: 0,
      });
    }
  };
  const onImageSelect = (e) => {
    const file = e.files[0];
    setImageFile(file); // Guardamos la imagen seleccionada
    setProduct({ ...product, ["image"]: file });
  };
  const onSaveProduct = () => {
    setSubmitted(true);
    if (
      product.name &&
      product.price &&
      product.stock &&
      product.code &&
      product.categories
    ) {
      // Si el producto ya tiene un id, actualiza el producto, de lo contrario crea uno nuevo
      if (product.id) {
        editarProducto(product);
      } else {
        crearProducto(product);
      }
      // Callback para cerrar el modal o hacer cualquier acción extra al guardar
    }
  };

  const categoriaCrear = () => {
    return (
      <Button
        onClick={() => {
          setvistaCrearCat(true);
        }}
        label="Crear categoria"
        className=" bg-gray-700 h-3 border-black rounded-none hover:bg-slate-50 hover:text-black input-productos w-full"
      />
    );
  };
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
  return (
    <div className="p-fluid">
      <Dialog
        visible={vistaCrearCat}
        style={{ width: "30rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Crear categoria"
        headerClassName="custom-header2"
        modal
        className="p-fluid custom-dialog"
        onHide={() => {
          setvistaCrearCat(false);
        }}
      >
        <CrearCategoria />
      </Dialog>
      {/* Imagen centrada arriba */}
      {product?.image && (
        <div className="text-center">
          <img
            src={`${
              producto.image ? producto.image : product?.image.objectURL
            }`}
            alt={product?.image}
            className="product-image block m-auto pb-3 rounded-md  w-48 h-3/5"
          />
        </div>
      )}

      {/* Organizar el formulario en dos columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
        {/* Subir Imagen */}
        <div className="field text-center">
          <FileUpload
            ref={fileUploadRef}
            name="image"
            customUpload
            uploadHandler={(e) => {
              onImageSelect(e); // Guardar la imagen seleccionada
            }}
            auto
            accept="image/*"
            maxFileSize={1000000}
            mode="basic"
            chooseLabel="Seleccionar Imagen"
            className="input-productos"
          />
        </div>

        {/* Botón para borrar imagen */}
        <div className="field text-center">
          <Button
            disabled={!imageFile}
            label="Borrar Imagen"
            onClick={() => {
              setProduct({ ...product, ["image"]: "" });
              setImageFile("");
              if (fileUploadRef.current) {
                fileUploadRef.current.clear(); // Limpiar el input
              }
            }}
            severity="danger"
            className="mt-4 "
          />
        </div>
        <div className="field col-6">
          <label htmlFor="code" className="font-bold">
            Código del Producto
          </label>
          <InputText
            id="code"
            value={product?.code}
            onChange={(e) => onInputChange(e, "code")}
            required
            className="input-productos"
          />
          {submitted && !product.code && (
            <small className="p-error">El código es obligatorio.</small>
          )}
        </div>
        {/* Nombre del producto */}
        <div className="field col-6">
          <label htmlFor="name" className="font-bold">
            Nombre
          </label>
          <InputText
            id="name"
            value={product?.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className="input-productos"
          />
          {submitted && !product.name && (
            <small className="p-error">El nombre es obligatorio.</small>
          )}
        </div>
        {/* Categorías (puedes modificar esto según cómo manejes las categorías) */}
        <div className="field col-6">
          <label className="font-bold">Categoría</label>
          <div className="formgrid grid">
            <div className=" col-6">
              <TreeSelect
                value={product.categories}
                onChange={(e) => {
                  // Aquí asume que e.value ya es un array de IDs seleccionados
                  const selectedCategories = e.value;

                  onInputChange(
                    { target: { value: selectedCategories } },
                    "categories"
                  );
                }}
                options={nodeCategoria}
                className="w-full input-productos"
                placeholder="Selecciona una categoria"
                emptyMessage="No hay categorias"
                panelFooterTemplate={categoriaCrear}
                selectionMode="multiple"
              />

              {submitted && !product.categories && (
                <small className="p-error"> La categoria es obligatoria.</small>
              )}
            </div>

            {/* Otras categorías aquí */}
          </div>
        </div>
        {/* Precio */}
        <div className="field col-6">
          <label htmlFor="price" className="font-bold">
            Precio
          </label>
          <InputNumber
            id="price"
            value={product?.price}
            onChange={(e) => onInputNumberChange(e, "price")}
            mode="currency"
            currency="COP"
            locale="es-CO"
            className="input-productos"
          />
          {submitted && !product.price && (
            <small className="p-error">El precio es obligatorio.</small>
          )}
        </div>
        {/* Precio con descuento */}
        <div className="field col-6">
          <label htmlFor="discount_price" className="font-bold">
            Precio con Descuento
          </label>
          <InputNumber
            id="discount_price"
            value={product?.discount_price}
            onChange={(e) => onInputNumberChange(e, "discount_price")}
            mode="currency"
            currency="COP"
            locale="es-CO"
            max={product?.price}
            disabled={disableDiscountPrice}
            className="input-productos"
          />
        </div>

        {/* Porcentaje de Descuento */}
        <div className="field col-6">
          <label htmlFor="discount_percentage" className="font-bold">
            Porcentaje de Descuento
          </label>
          <InputNumber
            id="discount_percentage"
            value={product?.discount_percentage}
            onChange={(e) => onInputNumberChange(e, "discount_percentage")}
            suffix="%"
            minFractionDigits={0} // Permitir mínimo 0 decimales
            maxFractionDigits={2} // Permitir máximo 2 decimales
            min={0}
            max={100}
            disabled={disableDiscountPercentage}
            className="input-productos"
          />
        </div>

        {/* Descripción */}
        <div className="field col-12">
          <label htmlFor="description" className="font-bold">
            Descripción del producto
          </label>
          <InputTextarea
            id="description"
            value={product?.description}
            onChange={(e) => onInputChange(e, "description")}
            required
            rows={3}
            cols={20}
            className="input-productos"
          />
        </div>

        {/* Stock */}
        <div className="field col-6">
          <label htmlFor="stock" className="font-bold">
            Stock
          </label>
          <InputNumber
            id="stock"
            value={product?.stock}
            onChange={(e) => onInputNumberChange(e, "stock")}
            className="input-productos"
          />
          {submitted && !product.stock && (
            <small className="p-error">El stock es obligatorio.</small>
          )}
        </div>

        {/* Activo/Inactivo */}
        <div className="field-checkbox col-6 mb-3">
          <Checkbox
            inputId="is_active"
            checked={product?.is_active ? false : true}
            onChange={(e) => onInputChange(e, "is_active")}
            className="input-productos"
          />
          <label htmlFor="is_active">¿Producto activo?</label>
        </div>
      </div>

      {/* Botón para guardar */}
      <Button
        label="Guardar Producto"
        icon="pi pi-check"
        onClick={onSaveProduct}
        className=" mt-2 input-productos"
      />
    </div>
  );
};
