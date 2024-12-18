import React from 'react';
import { useNavigate } from 'react-router-dom';
import useControl from '../../../hooks/useControl';

export const FooterLogin = () => {
  const navigate = useNavigate();
  const { vistaLog, setVistaLog,setVisibleProfile } = useControl();

  return (
    <div className="flex flex-col justify-center items-center mt-1 space-y-2">
      {vistaLog === 2 ? (
        <>
          {/* Si el usuario está en la vista de registro, muestra esto */}
          <p className="text-gray-600">¿Ya tienes una cuenta?</p>
          <button
            onClick={() => setVistaLog(1)}
            className="text-purple-600 hover:underline"
          >
            Inicia sesión aquí
          </button>
        </>
      ) : (
        <>
          {/* Si el usuario está en la vista de login, muestra estos botones */}
          <button
            onClick={() => {
              setVisibleProfile(false)
              navigate('/recuperar_contraseña')}}
            className="text-purple-600 hover:underline"
          >
            Olvidé mi contraseña
          </button>
          <button
            onClick={() => setVistaLog(2)}
            className="text-purple-600 hover:underline"
          >
            Registrarse
          </button>
        </>
      )}
    </div>
  );
};