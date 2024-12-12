import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Swal from "sweetalert2";
import { InputMask } from "primereact/inputmask";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaEye,
  FaEyeSlash,
  FaCity,
} from "react-icons/fa";
import { BsCardList } from "react-icons/bs";
import { FaMountainCity } from "react-icons/fa6";
import useControl from "../../../hooks/useControl";
import { Dropdown } from "primereact/dropdown";

const UserProfile = () => {
  const {
    jsonlogin,
    ActualizarPerfil,
    departments,
    cities,
    departamentos,
    ciudades,
    actualizarPefil,
  } = useControl();

  const toastRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const tiposIdentificacion = [
    { label: "Cédula de Ciudadanía", value: "CC" },
    { label: "Cédula de Extranjería", value: "CE" },
    { label: "Permiso Especial de Permanencia (PEP)", value: "PEP" },
    { label: "Permiso por Protección Temporal (PPT)", value: "PPT" },
    { label: "Pasaporte", value: "PAS" },
  ];
  const [formData, setFormData] = useState({
    firstName: jsonlogin.first_name,
    lastName: jsonlogin.last_name,
    email: jsonlogin.email || "john.doe@example.com",
    phone: jsonlogin.phone || "+57 316 567 8900",
    type_document: jsonlogin.type_document || null,
    city: null,
    department: null,
    address: jsonlogin.address || "123 Street, City, Country",
    idNumber: jsonlogin.number_document || "ID12345678",
    password: "********",
    isActive: jsonlogin.number_document || true,
    confirmPassword: null,
  });

  useEffect(() => {
    // Inicializar departamentos si aún no se han cargado
    if (departamentos.length === 0) {
      departments();
    } else if (jsonlogin?.department) {
      const userDepartment = departamentos.find(
        (d) => d.name === jsonlogin.department
      );
      setFormData((prev) => ({
        ...prev,
        department: userDepartment?.id || null,
      }));
      cities(userDepartment?.id);
    }
  }, [departamentos, jsonlogin]);

  useEffect(() => {
    if (ciudades.length > 0 && jsonlogin?.city) {
      const userCity = ciudades.find((c) => c.name === jsonlogin.city);
      setFormData((prev) => ({ ...prev, city: userCity?.id || null }));
    }
  }, [ciudades, jsonlogin]);

  useEffect(() => {
    // Sincronizar datos del formulario cuando cambie jsonlogin
    if (jsonlogin) {
      setFormData({
        firstName: jsonlogin.first_name || "",
        lastName: jsonlogin.last_name || "",
        email: jsonlogin.email || "john.doe@example.com",
        phone: jsonlogin.phone || "+57 316 567 8900",
        address: jsonlogin.address || "123 Street, City, Country",
        idNumber: jsonlogin.number_document || "ID12345678",
        type_document: jsonlogin.type_document || null,
        password: "********",
        confirmPassword: null,
        department: jsonlogin.department?.id || null,
        city: jsonlogin.city?.id || null,
      });
    }
  }, [jsonlogin]);

  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Las contraseñas no coinciden",
      }));
      return false;
    } else {
      setErrors((prevErrors) => {
        const { password, ...rest } = prevErrors;
        return rest;
      });
      return true;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
   
    // Validaciones
    const newErrors = { ...errors };
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = "Por favor ingresa un correo válido";
    } else if (
      name === "phone" &&
      !/^\(\+\d{2}\)\s\d{3}-\d{3}-\d{4}$/.test(value)
    ) {
      newErrors.phone = "Por favor ingresa un número de teléfono válido";
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };
  const handleDepartmentChange = (e) => {
    const departmentId = e.value;
    setFormData((prev) => ({ ...prev, department: departmentId }));
    cities(departmentId); // Cargar ciudades del departamento seleccionado
  };

  const handleCityChange = (e) => {
    setFormData((prev) => ({ ...prev, city: e.value }));
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };
  const handleTypeDocumentChange = (e) => {
    setFormData((prev) => ({ ...prev, type_document: e.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordMatch()) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      return;
    }
    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== jsonlogin[key]) {
        updatedFields[key] = formData[key];
      }
    });

    if (formData.password === "********") {
      delete updatedFields.password;
    }

    if (Object.keys(updatedFields).length === 0) {
      Swal.fire("Sin cambios", "No se han realizado cambios.", "info");
      return;
    }

    setLoading(true);
    try {
      await ActualizarPerfil(updatedFields);
      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-24">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-green-800">Mi Perfil</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaUser className="mr-2 text-green-800" /> Nombres
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaUser className="mr-2 text-green-800" /> Apellidos
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaEnvelope className="mr-2 text-green-800" /> Correo
                    Electronico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaPhone className="mr-2 text-green-800" /> Celular
                  </label>
                  <InputMask
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    mask="(+99) 999-999-9999"
                    style={{ width: "100%" }}
                  />

                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <BsCardList className="mr-2 text-green-800" /> Tipo
                    Identificación
                  </label>
                  <Dropdown
                    value={formData.type_document}
                    options={tiposIdentificacion}
                    onChange={handleTypeDocumentChange}
                    placeholder="Selecciona un tipo"
                    className="mt-1 w-full rounded-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaIdCard className="mr-2 text-green-800" /> Cedula
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg  focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                {/* Dropdown de Departamento */}
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaMountainCity className="mr-2 text-green-800" />{" "}
                    Departamento
                  </label>
                  <Dropdown
                    value={formData.department}
                    options={departamentos.map((d) => ({
                      label: d.name,
                      value: d.id,
                    }))}
                    onChange={handleDepartmentChange}
                    placeholder="Selecciona un departamento"
                    className="w-full rounded-lg"
                  />
                </div>
                {/* Dropdown de Ciudad */}
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaCity className="mr-2 text-green-800" /> Ciudad
                  </label>
                  <Dropdown
                    value={formData.city}
                    options={ciudades.map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))}
                    onChange={handleCityChange}
                    placeholder="Selecciona una ciudad"
                    className="w-full rounded-lg"
                  />
                </div>
                {/* Campos de contraseña y confirmación */}

                <div className="md:col-span-2">
                  <label className="flex items-center text-gray-700 mb-2">
                    <FaMapMarkerAlt className="mr-2 text-green-800" /> Direccion
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                {/* Campos de contraseña y confirmación */}
                <div>
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label>Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  className={`px-6 py-2 rounded-lg text-white font-semibold
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }
                    transition-colors duration-300 flex items-center`}
                >
                  {loading && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {loading ? "Actualizando..." : "Actualizar Perfil"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
