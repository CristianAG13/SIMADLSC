import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditUserModal = ({ user, onClose, onSave, roles, loadingRoles, rolesError }) => {
  const [formData, setFormData] = useState({
    nombre_Usuario: '',
    apellido1_Usuario: '',
    apellido2_Usuario: '',
    email_Usuario: '',
    rol_Usuario: '',  // Valor por defecto
  });

  // Actualizamos el estado con los datos del usuario al abrir el modal
  useEffect(() => {
    if (user && user.id_usuario) {
      setFormData({
        nombre_Usuario: user.nombre_Usuario || '',
        apellido1_Usuario: user.apellido1_Usuario || '',
        apellido2_Usuario: user.apellido2_Usuario || '',
        email_Usuario: user.email_Usuario || '',
        rol_Usuario: user.rol_Usuario?.id || '',  // Usamos el ID del rol
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);  // Pasamos el formulario actualizado
  };


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-1/2">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
          <input
            type="text"
            name="nombre_Usuario"
            value={formData.nombre_Usuario}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Primer Apellido</label>
          <input
            type="text"
            name="apellido1_Usuario"
            value={formData.apellido1_Usuario}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Segundo Apellido</label>
          <input
            type="text"
            name="apellido2_Usuario"
            value={formData.apellido2_Usuario}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email_Usuario"
            value={formData.email_Usuario}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Rol</label>
          {loadingRoles ? (
            <p className="text-gray-600 dark:text-gray-400">Cargando roles...</p>
          ) : rolesError ? (
            <p className="text-red-500">Error al cargar roles</p>
          ) : (
            <select
              name="rol_Usuario"
              value={formData.rol_Usuario}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            >
              <option value="">Seleccionar rol</option>
              {roles
                .filter(rol => rol.id_Rol !== undefined)
                .map((rol) => (
                  <option key={`rol-${rol.id_Rol}`} value={rol.id_Rol}>
                    {rol.nombre_Rol}
                  </option>
                ))}
            </select>
          )}
        </div>
  
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
          >
            Cancelar
          </button>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

EditUserModal.propTypes = {
  user: PropTypes.shape({
    id_usuario: PropTypes.number,
    nombre_Usuario: PropTypes.string,
    apellido1_Usuario: PropTypes.string,
    apellido2_Usuario: PropTypes.string,
    email_Usuario: PropTypes.string,
    rol_Usuario: PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
  loadingRoles: PropTypes.bool.isRequired,
  rolesError: PropTypes.string,
};

export default EditUserModal;
