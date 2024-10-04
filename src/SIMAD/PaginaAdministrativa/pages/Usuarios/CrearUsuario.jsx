import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from './services/useUserService';

const CrearUsuario = () => {
  const [newUser, setNewUser] = useState({
    nombre_Usuario: '',
    apellido1_Usuario: '',
    apellido2_Usuario: '',
    email_Usuario: '',
    contraseña_Usuario: '',
    rol_Usuario: 2,  // Aquí puedes inicializar con el ID de "Administrativo" por defecto
  });

  const [loading, setLoading] = useState(false); // Estado de carga
  const [success, setSuccess] = useState(false); // Estado de éxito
  const [error, setError] = useState(null); // Estado de error

  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Asegúrate de que el token JWT esté almacenado en localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null); // Reseteamos el error

    try {
      // Llamamos al servicio de crear usuario
      await createUser(newUser, token);

      // Si fue exitoso, reseteamos el formulario
      setNewUser({
        nombre_Usuario: '',
        apellido1_Usuario: '',
        apellido2_Usuario: '',
        email_Usuario: '',
        contraseña_Usuario: '',
        rol_Usuario: 2,  // Resetear al rol predeterminado
      });
      setSuccess(true); // Mostramos el mensaje de éxito
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setError(error.message); // Mostramos el mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <header className="mb-8">
          {/* Botón de volver con flecha */}
          <button
            onClick={() => navigate(-1)} // Volver a la página anterior
            className="text-gray-700 flex items-center mb-4 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L4.414 10l3.293 3.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-800 text-center">Crear Nuevo Usuario</h1>
        </header>

        {/* Mostrar mensaje de éxito si el usuario fue creado */}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
            Usuario creado exitosamente.
          </div>
        )}

        {/* Mostrar mensaje de error si ocurrió un error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre_Usuario"
            value={newUser.nombre_Usuario}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="apellido1_Usuario"
            value={newUser.apellido1_Usuario}
            onChange={handleInputChange}
            placeholder="Primer Apellido"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="apellido2_Usuario"
            value={newUser.apellido2_Usuario}
            onChange={handleInputChange}
            placeholder="Segundo Apellido"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="email"
            name="email_Usuario"
            value={newUser.email_Usuario}
            onChange={handleInputChange}
            placeholder="Correo Electrónico"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <input
            type="password"
            name="contraseña_Usuario"
            value={newUser.contraseña_Usuario}
            onChange={handleInputChange}
            placeholder="Contraseña"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
          <select
            name="rol_Usuario"
            value={newUser.rol_Usuario}
            onChange={handleInputChange}
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            {/* Mapeamos los IDs de los roles en lugar de los nombres */}
            <option value={1}>Super-Administrador</option>
            <option value={2}>Administrador</option>
            <option value={3}>Estudiante</option>
            <option value={4}>Super-Admin</option>
          </select>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className={`bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-700 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
