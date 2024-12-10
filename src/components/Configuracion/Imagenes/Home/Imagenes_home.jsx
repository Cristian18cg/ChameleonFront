import React, { useState, useEffect, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import useControlAdministracion from "../../../../hooks/useControlAdministracion";
import { Galleria } from "primereact/galleria";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
const Imagenes = () => {
  const {
    listaImagenes,
    ListarImagenesHome,
    CrearImagenesHome,
    setListaImagenes,
    EditarImagen,
    EliminarImagen,
  } = useControlAdministracion();
  const fileUploadRef = useRef(null);
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Para almacenar múltiples imágenes
  useEffect(() => {
    return () => {
      // Limpiar URLs al desmontar el componente
      images.forEach((image) => URL.revokeObjectURL(image.objectURL));
    };
  }, [images]);
  useEffect(() => {
    console.log("images", images);
  }, [images]);
  useEffect(() => {
    if (listaImagenes.length === 0) {
      ListarImagenesHome();
    }
  }, [listaImagenes]);

  const onImageSelect = (e) => {
    const selectedFiles = Array.from(e.files);

    const filesWithMetadata = selectedFiles.map((file) => ({
      file: file, // Archivo original
      objectURL: URL.createObjectURL(file),
      title: file.name, // Por defecto, usa el nombre del archivo como título
      is_active: true, // Valor predeterminado
      is_mobil: false, // Valor predeterminado
    }));

    setImageFiles([...imageFiles, ...filesWithMetadata]);
    setImages([...images, ...filesWithMetadata]);
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
    // Liberar URL generada
    URL.revokeObjectURL(file.objectURL);
    setImageFiles(imageFiles.filter((img) => img.name !== file.name));
    setImages(images.filter((img) => img.name !== file.name));
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
      <div className="flex flex-wrap items-center gap-4 md:gap-6 p-4">
        <div className="flex items-center gap-4 w-full md:w-2/5">
          <img
            alt={file?.name}
            role="presentation"
            src={file?.objectURL}
            className="w-16 h-16 object-cover md:w-20 md:h-20 rounded"
          />
          <span className="flex flex-col text-left">
            <span className="text-sm font-medium text-gray-700">
              {file?.name}
            </span>
            <small className="text-gray-500">
              {new Date().toLocaleDateString()}
            </small>
          </span>
        </div>
        <div className="flex-grow">
          <Tag
            value={props?.formatSize}
            severity="warning"
            className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-2"
          />
        </div>
        <div className="flex justify-end w-full md:w-auto">
          <Button
            type="button"
            icon="pi pi-times"
            className="custom-cancel-btn p-button-outlined p-button-rounded p-button-danger"
            onClick={() => onTemplateRemove(file, props?.onRemove)}
          />
        </div>
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
    CrearImagenesHome(images);
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
  const itemTemplateImg = (item) => {
    console.log("itemmme", item);
    return (
      <img
        alt={item?.name}
        src={item?.objectURL} // Usar la propiedad correcta
        className="rounded"
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        alt={item?.name}
        src={item?.objectURL} // Usar la propiedad correcta
        className="w-12 md:w-44 lg:w-44 xl:w-44"
      />
    );
  };
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-3">Administrar imagenes home</h3>
      <IconField iconPosition="right">
        <InputIcon className="pi pi-search " />
        <InputText
          type="search"
          unstyled
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar imagen..."
          className="input-productos p-inputtext p-component p-input "
        />
      </IconField>
    </div>
  );
  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`${rowData.image_url}`}
        alt={rowData.name}
        className="shadow-md shadow-slate-200 rounded"
        style={{ width: "64px" }}
      />
    );
  };
  const getSeverity = (user, campo) => {
    if (user[campo]) {
      return `success`;
    } else {
      return `danger`;
    }
  };

  const getMessage = (user, campo) => {
    if (user[campo]) {
      return `ACTIVO`;
    } else {
      return `INACTIVO`;
    }
  };

  const statusBodyTemplate = (rowData, campo) => {
    return (
      <Tag
        value={getMessage(rowData, campo)}
        severity={getSeverity(rowData, campo)}
      ></Tag>
    );
  };
  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const [statuses] = useState([false, true]);
  const getMessageEditor = (user) => {
    console.log(user)
    if (user) {
      return `ACTIVO`;
    } else {
      return `INACTIVO`;
    }
  };
  const getSeverityEditor = (user) => {
    console.log(user)

    if (user) {
      return `success`;
    } else {
      return `danger`;
    }
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return (
            <Tag
              value={getMessageEditor(option)}
              severity={getSeverityEditor(option)}
            ></Tag>
          );
        }}
      />
    );
  };
  const onRowEditComplete = (e) => {
    let { newData, index } = e;

    EditarImagen(newData);
  };

  const botonEliminar = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => {
          EliminarImagen(rowData.id);
        }}
      />
    );
  };
  return (
    <div className="mt-24">
      <div className="p-2 md:p-20">
        {images.length > 0 && (
          <div className="card flex-col justify-center">
            <Galleria
              value={images} // El arreglo de imágenes
              responsiveOptions={responsiveOptions}
              numVisible={6}
              item={itemTemplateImg}
              thumbnail={thumbnailTemplate}
              thumbnailsPosition="bottom"
              indicatorsPosition="bottom"
            />
          </div>
        )}
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
          disabled={images.length === 0} // Evalúa si no hay imágenes
          className="mt-2"
          label="Subir Imagenes"
          onClick={subirImagenes}
        />
      </div>
      <div className="card">
        <DataTable
          value={listaImagenes}
          header={header}
          className="p-datatable-striped"
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          globalFilter={globalFilter}
        >
          <Column header="Id" field="id"></Column>
          <Column
            header="Nombre"
            editor={(options) => textEditor(options)}
            field="title"
          ></Column>
          <Column
            field="is_active"
            header="Estado"
            editor={(options) => statusEditor(options)}
            body={(rowData) => statusBodyTemplate(rowData, "is_active")}
            sortable
          ></Column>
          <Column
            field="is_mobil"
            header="Imagen Celular"
            editor={(options) => statusEditor(options)}
            body={(rowData) => statusBodyTemplate(rowData, "is_mobil")}
            sortable
          ></Column>
          <Column
            header="Imagen"
            field="image_url"
            body={imageBodyTemplate}
          ></Column>
          <Column
            rowEditor={allowEdit}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column body={botonEliminar}></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default Imagenes;
