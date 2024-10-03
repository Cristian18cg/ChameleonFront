import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import useControlProductos from "../../hooks/useControlProductos";
import axios from "axios";

export const CrearCategoria = () => {
  const [categoriaPadre, setCategoriaPadre] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const {
    crearCategoria,
    listarCategorias,
    categorias,
  } = useControlProductos();

  useEffect(() => {
    if (categorias?.length === 0) {
      listarCategorias();
    }
  }, [categorias]);

  const CategoriaCrear = () => {
    crearCategoria(categoria, categoriaPadre.id);
  };
  return (
    <div className="card  grid grid-cols-1  w-full items-center justify-content-center gap-3">
      <div>
        <Dropdown
          value={categoriaPadre }
          onChange={(e) => setCategoriaPadre(e.value)}
          options={categorias}
          optionLabel="name"
          placeholder="Seleccione clase padre"
          className="w-full min-w-40rem"
        />
      </div>
      <div>
        <InputText
          placeholder="Ingresa el nombre de la categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
      </div>
      <div>
        <Button
          label="Crear categoria"
          icon="pi pi-plus"
          onClick={() => CategoriaCrear()}
        />
      </div>
    </div>
  );
};
