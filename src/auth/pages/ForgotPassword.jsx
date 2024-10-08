// src/auth/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const ForgotPassword = () => {
  const [email_Usuario, setEmail_Usuario] = useState('');
  const { handleForgotPassword } = useForgotPassword();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Evita múltiples envíos
    }

    setIsSubmitting(true);

    try {
      await handleForgotPassword(email_Usuario);

      // Mostrar alerta de éxito y redirigir al inicio
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Se ha enviado un enlace para restablecer tu contraseña.',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate('/'); // Redirigir a la página de inicio
      });
    } catch (error) {
      if (error.status === 404) {
        // Mostrar SweetAlert específico para el error 404
        Swal.fire({
          icon: 'error',
          title: 'Correo no encontrado',
          text: 'El correo electrónico ingresado no está registrado.',
          confirmButtonText: 'Aceptar',
        });
      } else {
        // Manejar otros errores
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al enviar el correo.',
          confirmButtonText: 'Aceptar',
        });
      }
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl transition-transform transform hover:scale-105">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Recuperar contraseña
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email_Usuario" className="block text-sm font-medium text-gray-800">
                Correo Electrónico
              </label>
              <input
                id="email_Usuario"
                name="email_Usuario"
                type="email"
                value={email_Usuario}
                onChange={(e) => setEmail_Usuario(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150
                      ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600'}
                    `}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
