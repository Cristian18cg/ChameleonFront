import React, { useState, useEffect, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import useControlAdministracion from '../../../../hooks/useControlAdministracion'
const Imagenes = () => {
  const { CrearImagenesHome } = useControlAdministracion();
  const fileUploadRef = useRef(null);
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState({});
  const [imageFiles, setImageFiles] = useState([]); // Para almacenar múltiples imágenes

  const onImageSelect = (e) => {
    console.log("entro imagenes", e);
    const selectedFiles = Array.from(e.files); // Obtener las nuevas imágenes seleccionadas

    // Filtrar las imágenes que no están ya en imageFiles
    const filteredFiles = selectedFiles.filter((newFile) => {
      return !imageFiles.some(
        (existingFile) => existingFile.name === newFile.name
      ); // Verificar que no se repitan
    });

    if (filteredFiles.length > 0) {
      setImageFiles([...imageFiles, ...filteredFiles]); // Agregar solo las imágenes no repetidas
      setImages({ ...images, images: [...imageFiles, ...filteredFiles] }); // Actualizar el estado del producto
    } else {
      console.log("Las imágenes ya están seleccionadas.");
    }
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
          <span className="flex flex-column text-left ml-3 mx-2">
            {file?.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props?.formatSize}
          severity="warning"
          className="px-3 py-2 mx-4"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="custom-cancel-btn p-button-outlined p-button-rounded p-button-danger ml-auto"
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
            fontSize: "3em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="mx-12 mt-12 font-semibold"
        >
          Arrastra y suelta las imagenes del producto acá
        </span>
      </div>
    );
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
  const subirImagenes = () => { 
    CrearImagenesHome()
  }
  return (
    <div className="mt-24">
      <div className="p-20">
        Banners Home
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
        <Button
          disabled={() => {
            if (images.length > 0) {
              return false;
            } else {
              return true;
            }
          }}
          className="mt-2"
          label="Subir Imagenes"
          onClick={subirImagenes}
        ></Button>
      </div>
    </div>
  );
};

export default Imagenes;
