import { useState } from 'react';

export default function LoginPage() {
  const [email_Usuario, setEmail_Usuario] = useState('');
  const [contraseña_Usuario, setContraseña_Usuario] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setError('');
    setSuccess('');

    if (!email_Usuario || !contraseña_Usuario) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Limpiar el token y el role antes de hacer una nueva solicitud
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      // Realizar la petición al servidor para el login
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_Usuario, contraseña_Usuario }),  // Enviar los nuevos campos
      });

      // Verificar si la respuesta no es 200 (OK)
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error en el inicio de sesión. Credenciales incorrectas.');
        return;
      }

      // Si la respuesta es exitosa, recibir los datos (token y role)
      const data = await response.json();
      console.log('Respuesta completa del backend:', data);  // Verificar la estructura de la respuesta

      // Acceder a 'role' directamente desde 'data'
      const role = data.role;

      // Verificar si existe un rol
      if (!role) {
        setError('El rol de usuario no está definido.');
        return;
      }

      // Guardar el token y el role en localStorage
      try {
        localStorage.setItem('token', data.access_token);  // Guardar el token
        localStorage.setItem('role', role);  // Guardar el rol
        console.log('Rol guardado en localStorage:', localStorage.getItem('role'));
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }

      // Mostrar mensaje de éxito
      setSuccess('Inicio de sesión exitoso');

      // Redirigir al usuario a la página principal o una específica según el rol
      window.location.href = '/';  
    } catch (error) {
      console.error(error);
      setError('Error de conexión con el servidor.');
    }
  };

  const handleGoBack = () => {
    window.location.href = '/paginainformativa'; 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl transition-transform transform hover:scale-105">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Inicia sesión en tu cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email_Usuario"
                  type="email"
                  value={email_Usuario}
                  onChange={(e) => setEmail_Usuario(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="contraseña_Usuario"
                  type="password"
                  value={contraseña_Usuario}
                  onChange={(e) => setContraseña_Usuario(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            {/* Mostrar mensaje de error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Mostrar mensaje de éxito */}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-between items-center">
            {/* Botón Volver a la izquierda con una flecha */}
            <button
              onClick={handleGoBack}
              className="text-blue-700 font-medium hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>

            {/* Enlace "¿Olvidaste tu contraseña?" más azul y a la derecha */}
            <a
              href="/paginainformativa/login/forgot-password"
              className="text-blue-600 font-medium hover:underline hover:text-blue-800"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
