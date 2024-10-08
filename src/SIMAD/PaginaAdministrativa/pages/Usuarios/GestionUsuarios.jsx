import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser, toggleBlockUser } from './services/useUserService';

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Asegúrate de que el token esté en el localStorage

  // Función para cargar los usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      setError('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Cargamos los usuarios al montar el componente
  }, []);

  // Función para bloquear/desbloquear usuarios
  const handleBlockUser = async (id, bloqueado_Usuario) => {
    try {
      await toggleBlockUser(id, !bloqueado_Usuario, token);
      fetchUsers(); // Volvemos a cargar los usuarios después de bloquear/desbloquear
    } catch (error) {
      console.error('Error al bloquear/desbloquear el usuario:', error);
    }
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id, token);
      fetchUsers(); // Volvemos a cargar los usuarios después de eliminar
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  // Función para ver información del usuario (ejemplo)
  const handleViewUserInfo = (user) => {
    alert(`Información del usuario:\nNombre: ${user.nombre_Usuario}\nEmail: ${user.email_Usuario}`);
  };

  // Función para editar un usuario (esto debería abrir un formulario de edición)
  const handleEditUser = (user) => {
    alert(`Editar información del usuario: ${user.nombre_Usuario}`);
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <Link
            to="/Crear-usuarios"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Crear Usuario
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>
        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre Completo</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rol</th>
                  <th className="px-4 py-2 text-left">Bloqueado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
  {users.map((user) => (
    <tr key={user.id_usuario} className="border-b">
      <td className="px-4 py-2">{`${user.nombre_Usuario} ${user.apellido1_Usuario} ${user.apellido2_Usuario}`}</td>
      <td className="px-4 py-2">{user.email_Usuario}</td>
      <td className="px-4 py-2">{user.rol_Usuario.nombre_Rol}</td>
      <td className="px-4 py-2">
        {user.bloqueado_Usuario ? (
          <span className="text-red-500">Sí</span>
        ) : (
          <span className="text-green-500">No</span>
        )}
      </td>
      <td className="px-4 py-2 flex gap-2">
        <button
          onClick={() => handleViewUserInfo(user)}
          className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
        >
          Ver Info
        </button>
        <button
          onClick={() => handleEditUser(user)}
          className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600"
        >
          Editar
        </button>
        <button
          onClick={() => handleDeleteUser(user.id_usuario)}
          className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
        >
          Eliminar
        </button>
        <button
          onClick={() => handleBlockUser(user.id_usuario)}
          className={`px-2 py-1 rounded-lg text-white ${
            user.bloqueado_Usuario ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {user.bloqueado_Usuario ? "Desbloquear" : "Bloquear"}
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No hay usuarios disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;
