import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";

import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import useControlPedidos from "../../../hooks/useControlPedidos";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method

export const ConfigDomicilio = () => {
  const {
    ValorDomicilio,
    valoresdomicilio,
    crearvalorDomicilio,
    setvaloresdomicilio,
    editarvalorDomicilio,
    eliminarvalorDomicilio
  } = useControlPedidos();
  const [visibleCrearDomi, setvisibleCrearDomi] = useState(false);
  const [valor, setValor] = useState(0);
  const [domi, setDomi] = useState(0);
  const [visible, setVisible] = useState(false);
  const buttonEl = useRef(null);
  const toast = useRef(null);
  const columns = [
    { field: "id", header: "Id" },
    { field: "address_cost", header: "Valor Domicilio" },
    { field: "update_date", header: "Fecha de actualizacion" },
  ];
  const [statuses] = useState([true, false]);
  useEffect(() => {
    if(valoresdomicilio.length === 0) {
      ValorDomicilio();

    }
    console.log(valoresdomicilio);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSeverity = (value) => {
    switch (value) {
      case true:
        return "success";
      case false:
        return "danger";

      default:
        return null;
    }
  };
  const getMessage = (value) => {
    switch (value) {
      case true:
        return "Activo";
      case false:
        return "INACTIVO";

      default:
        return null;
    }
  };

  const onRowEditComplete = (e) => {
    let _vals = [...valoresdomicilio];
    let { newData, index } = e;

    _vals[index] = newData;

    setvaloresdomicilio(_vals);
    editarvalorDomicilio(newData);
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Selecciona un estado"
        itemTemplate={(option) => {
          return (
            <Tag
              value={getMessage(option)}
              severity={getSeverity(option)}
            ></Tag>
          );
        }}
      />
    );
  };

  const priceEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="COP"
        locale="es-CO"
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={getMessage(rowData.is_active)}
        severity={getSeverity(rowData.is_active)}
      ></Tag>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(rowData.address_cost);
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nuevo valor domicilio"
          icon="pi pi-plus"
          className="bg-purple-500 hover:bg-purple-800 border-purple-500"
          onClick={() => {
            setvisibleCrearDomi(true);
          }}
        />
      </div>
    );
  };
  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };
  const accept = () => {
    eliminarvalorDomicilio(domi)
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Has cancelado el proceso",
      life: 3000,
    });
  };

  /* BOTONES DE ACCION */
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <ConfirmPopup
          target={buttonEl.current}
          visible={visible}
          onHide={() => setVisible(false)}
          message="Esta seguro de eliminar?"
          icon="pi pi-exclamation-triangle"
          accept={accept}
          reject={reject}
        />
        <Button
          ref={buttonEl}
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => {
            setVisible(true);
            setDomi(rowData);
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <div className="md:mt-8 w-full flex justify-center">
      <div className="card md:w-1/2 justify-center ">
        <Toast ref={toast} />
        <Dialog
          headerClassName="custom-header2"
          className="p-fluid custom-dialog"
          visible={visibleCrearDomi}
          header="Crear nuevo valor de domicilio"
          modal
          onHide={() => {
            setvisibleCrearDomi(false);
          }}
        >
          <div className="flex flex-col">
            <InputNumber
              type="text"
              value={valor}
              onChange={(e) => {
                setValor(e.value);
              }}
              mode="currency"
              currency="COP"
              min={0}
              placeholder="Valor del domicilio"
              locale="es-CO"
            />
            <Button
              disabled={valor <= 0}
              label="Crear"
              icon="pi pi-plus"
              onClick={() => {
                if (valor > 0) {
                  crearvalorDomicilio(valor);
                  setvisibleCrearDomi(false)
                }
              }}
              className="mt-2 w-5rem bg-purple-600 border-purple-500  hover:bg-purple-700"
            />
          </div>
        </Dialog>
        <Toolbar
          className="mt-24 bg-green-400"
          left={leftToolbarTemplate}
        ></Toolbar>

        <div className=" border-gray-100 border-2 ">
          <DataTable
            value={valoresdomicilio}
            emptyMessage={"No hay valores de domicilio"}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
          >
            <Column field="id" header="Id"></Column>
            <Column
              field="address_cost"
              header="Valor del domicilio"
              body={priceBodyTemplate}
              editor={(options) => priceEditor(options)}
            ></Column>
            <Column
              field="is_active"
              header="Estado"
              body={statusBodyTemplate}
              editor={(options) => statusEditor(options)}
            ></Column>
            <Column
              rowEditor={allowEdit}
              bodyStyle={{ textAlign: "end" }}
            ></Column>
            <Column body={actionBodyTemplate} exportable={false}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};
