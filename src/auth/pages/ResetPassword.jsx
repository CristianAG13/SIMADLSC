// src/auth/pages/ResetPassword.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useResetPassword } from '../hooks/useResetPassword';
import Swal from 'sweetalert2';

export const ResetPassword = () => {
  const [contraseña_Usuario, setContraseña_Usuario] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { handleResetPassword } = useResetPassword(); // Usamos el hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (contraseña_Usuario !== confirmarContraseña) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden. Por favor, intenta de nuevo.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    try {
      await handleResetPassword(token, contraseña_Usuario); // Llamamos al hook que usa el servicio

      // Mostrar alerta de éxito y redirigir al login
      Swal.fire({
        icon: 'success',
        title: 'Contraseña restablecida',
        text: 'Tu contraseña ha sido restablecida con éxito. Ahora puedes iniciar sesión.',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate('/auth/login'); // Redirigir a la página de inicio de sesión
      });
    } catch (error) {
      // Mostrar alerta de error y no avanzar
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ocurrió un error al restablecer la contraseña.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl transition-transform transform hover:scale-105">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Restablecer contraseña
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="contraseña_Usuario" className="block text-sm font-medium text-gray-800">
                Nueva contraseña
              </label>
              <input
                id="contraseña_Usuario"
                name="contraseña_Usuario"
                type="password"
                value={contraseña_Usuario}
                onChange={(e) => setContraseña_Usuario(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                placeholder="Ingresa tu nueva contraseña"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-800">
                Confirmar contraseña
              </label>
              <input
                id="confirmarContraseña"
                name="confirmarContraseña"
                type="password"
                value={confirmarContraseña}
                onChange={(e) => setConfirmarContraseña(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                placeholder="Confirma tu nueva contraseña"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Restablecer contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
