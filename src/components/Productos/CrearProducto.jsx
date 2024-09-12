import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";
import { TreeSelect } from "primereact/treeselect";

export const CrearProducto = ({ productoExistente, onSave }) => {
  const [product, setProduct] = useState(productoExistente || {});
  const [submitted, setSubmitted] = useState(false);
  const [disableDiscountPrice, setDisableDiscountPrice] = useState(false);
  const [disableDiscountPercentage, setDisableDiscountPercentage] = useState(
    false
  );
  const [imageFile, setImageFile] = useState(null);
  // Cuando se carga el producto existente, inicializar el estado
  useEffect(() => {
    if (productoExistente) {
      setProduct(productoExistente);
      setDisableDiscountPrice(!!productoExistente.discount_percentage);
      setDisableDiscountPercentage(!!productoExistente.discount_price);
    }
  }, [productoExistente]);

  const onInputChange = (e, field) => {
    const value = e?.target?.value || e?.File?.objectUrl;
    setProduct({ ...product, [field]: value });
  };

  const onInputNumberChange = (e, field) => {
    const value = e.value;
    setProduct({ ...product, [field]: value });

    // Si cambia el porcentaje de descuento, calcular el precio con descuento y desactivar ese campo
    if (field === "discount_percentage" && value) {
      setProduct({
        ...product,
        discount_price: product.price * (1 - value / 100),
      });
      setDisableDiscountPrice(true);
      setDisableDiscountPercentage(false); // Habilitar porcentaje
    }

    // Si cambia el precio con descuento, calcular el porcentaje de descuento y desactivar ese campo
    if (field === "discount_price" && value) {
      setProduct({
        ...product,
        discount_percentage: ((product.price - value) / product.price) * 100,
      });
      setDisableDiscountPrice(false); // Habilitar precio con descuento
      setDisableDiscountPercentage(true);
    }
  };
  const onImageSelect = (e) => {
    const file = e.files[0];
    setImageFile(file); // Guardamos la imagen seleccionada
    setProduct({ ...product, ["image"]: file.objectURL });
  };
  const onSaveProduct = () => {
    setSubmitted(true);
    if (product.name && product.price && product.stock) {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("discount_price", product.discount_price);
      formData.append("discount_percentage", product.discount_percentage);
      formData.append("is_active", product.is_active);
      if (imageFile) {
        formData.append("image", imageFile); // Agregar la imagen al formData
      }

      onSave(formData); // Enviar los datos del producto al backend
    }
  };

  return (
    <div className="p-fluid">
        {/* Imagen centrada arriba */}
        {product?.image && (
            <div className="text-center">
                <img
                    src={`${product?.image}`}
                    alt={product?.image}
                    className="product-image block m-auto pb-3 rounded-md  w-3/4"
                />
            </div>
        )}
      

        {/* Organizar el formulario en dos columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
              {/* Subir Imagen */}
        <div className="field text-center">
            <FileUpload
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
                }}
                className="mt-4 input-productos"
            />
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

            {/* Precio */}
            <div className="field col-6">
                <label htmlFor="price" className="font-bold">
                    Precio
                </label>
                <InputNumber
                    id="price"
                    value={product?.price}
                    onValueChange={(e) => onInputNumberChange(e, "price")}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    className="input-productos"
                />
                {submitted && !product.price && (
                    <small className="p-error">El precio es obligatorio.</small>
                )}
            </div>

            {/* Descripción */}
            <div className="field col-12">
                <label htmlFor="description" className="font-bold">
                    Descripción
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

            {/* Categorías (puedes modificar esto según cómo manejes las categorías) */}
            <div className="field col-6">
                <label className="font-bold">Categoría</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="category1"
                            name="category"
                            value="Accessories"
                            onChange={(e) => onInputChange(e, "categories")}
                            checked={product?.categories?.includes("Accessories")}
                             className="input-productos"
                        />
                        <label htmlFor="category1">Accesorios</label>
                    </div>
                    {/* Otras categorías aquí */}
                </div>
            </div>

            {/* Precio con descuento */}
            <div className="field col-6">
                <label htmlFor="discount_price" className="font-bold">
                    Precio con Descuento
                </label>
                <InputNumber
                    id="discount_price"
                    value={product?.discount_price}
                    onValueChange={(e) => onInputNumberChange(e, "discount_price")}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
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
                    onValueChange={(e) => onInputNumberChange(e, "discount_percentage")}
                    suffix="%"
                    min={0}
                    max={100}
                    disabled={disableDiscountPercentage}
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
                    onValueChange={(e) => onInputNumberChange(e, "stock")}
                     className="input-productos"
                />
                {submitted && !product.stock && (
                    <small className="p-error">El stock es obligatorio.</small>
                )}
            </div>

            {/* Activo/Inactivo */}
            <div className="field-checkbox col-6">
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
