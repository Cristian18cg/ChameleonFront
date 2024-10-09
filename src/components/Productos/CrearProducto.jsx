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
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { Galleria } from "primereact/galleria";

export const CrearProducto = ({ producto }) => {

  const {
    categorias,
    listarCategorias,
    setvistaCrearCat,
    vistaCrearCat,
    crearProducto,
    editarProducto,
  } = useControlProductos();
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);

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

      // Si estamos editando un producto, mapear sus categorías a un objeto
      if (producto && producto.categories) {
        console.log("entro");

        // Crear un objeto con los IDs de categorías como clave y true como valor
        const selectedCategories = product.categories.reduce(
          (acc, categoryName) => {
            const categoriaEncontrada = categorias.find(
              (cat) => cat.name === categoryName
            );
            if (categoriaEncontrada) {
              acc[categoriaEncontrada.id] = true;
            }
            return acc;
          },
          {}
        );

        console.log(selectedCategories); // Esto imprimirá el objeto con categorías en el formato {1: true, 2: true}

        // Asignar el objeto de categorías seleccionadas al producto
        setProduct((prevProduct) => ({
          ...prevProduct,
          categories: selectedCategories,
        }));
      }

      // Setear el árbol de categorías para el TreeSelect
      setnodeCategoria(cate);
    }
  }, [categorias, producto]);

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
    if (field === "stock" && value >= 0) {
      console.log("entro");
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
  const [imageFiles, setImageFiles] = useState([]); // Para almacenar múltiples imágenes

  const onImageSelect = (e) => {
    const selectedFiles = Array.from(e.files); // Obtener las nuevas imágenes seleccionadas

    // Filtrar las imágenes que no están ya en imageFiles
    const filteredFiles = selectedFiles.filter((newFile) => {
      return !imageFiles.some(
        (existingFile) => existingFile.name === newFile.name
      ); // Verificar que no se repitan
    });

    if (filteredFiles.length > 0) {
      setImageFiles([...imageFiles, ...filteredFiles]); // Agregar solo las imágenes no repetidas
      setProduct({ ...product, images: [...imageFiles, ...filteredFiles] }); // Actualizar el estado del producto
    } else {
      console.log("Las imágenes ya están seleccionadas.");
    }
  };
  const onSaveProduct = () => {
    setSubmitted(true);
    if (product.name && product.price && product.code && product.categories) {
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

  /* Subir imagenes*/
  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });
    onImageSelect(e);
    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };
  const chooseOptions = {
    icon: "pi pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  const cancelOptions = {
    icon: "pi  pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";
    return (
      <div
        className={`${className} border-gray-300 border border-b-0`}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file?.name}
            role="presentation"
            src={file?.objectURL}
            width={50}
          />
          <span className="flex flex-column text-left ml-3 mx-2<">
            {file?.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props?.formatSize}
          severity="warning"
          className="px-3 py-2 mx-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props?.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-2"
        >
          Arrastra y suelta la imagen aca
        </span>
      </div>
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={item.objectURL}
        alt={item.name}
        style={{
          width: "80px", // Ajusta el tamaño de la miniatura
          height: "80px", // Asegura que las miniaturas tengan dimensiones adecuadas
          display: "block",
          objectFit: "cover", // Esto mantendrá la proporción de la imagen
        }}
      />
    );
  };
  const itemTemplateImg = (item) => {
    return (
      <img
        alt={item?.name}
        src={item?.objectURL}
        style={{ width: "300px", display: "block" }}
        className="rounded"
      />
    );
  };

  const responsiveOptions = [
    {
      breakpoint: "1200px",
      numVisible: 4,
    },
    {
      breakpoint: "991px",
      numVisible: 3,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];

  return (
    <div className=" ">
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
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
      {product?.images && (
        <div className="card ">
          <Galleria
            value={producto.images ? producto.images : product?.images}
            responsiveOptions={responsiveOptions}
            numVisible={4}
            item={itemTemplateImg}
            showThumbnails={false}
             showIndicators 
             indicatorsPosition="bottom"
          />
        </div>
      )}
      <FileUpload
        ref={fileUploadRef}
        name="demo[]"
        multiple
        accept="image/*"
        maxFileSize={10000000}
        onUpload={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        cancelOptions={cancelOptions}
      />
      {/* Organizar el formulario en dos columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3">
   
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
        className="rounded-full mt-2 input-productos"
      />
    </div>
  );
};
