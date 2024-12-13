import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import clienteAxios from "../../../config/url";
import { Password } from "primereact/password";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = query.get("uid");
    const token = query.get("token");

    try {
      await clienteAxios.post("/users/password-reset-confirm/", {
        uid,
        token,
        new_password: newPassword,
      });
      setMessage("Contraseña restablecida con éxito.");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.detail || "Algo salió mal."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nueva Contraseña
            </label>
            <Password
              readonly
              onfocus="this.removeAttribute('readonly');"
              autoComplete="off"
              inputId="confirmarContrasena"
              name="confirmarContrasena"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-login min-w-full "
              toggleMask
              placeholder="Ingresa tu nueva contraseña"

            />
          
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
          >
            Cambiar Contraseña
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("éxito") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
