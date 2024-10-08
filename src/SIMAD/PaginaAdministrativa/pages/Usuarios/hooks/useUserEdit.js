// hooks/useUserEdit.js
import { useState } from 'react';
import { updateUser } from '../services/useUserService';

export const useUserEdit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const editUser = async (id, userData, token) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUser(id, userData, token); // Llamada a la función de actualizar en el servicio
      setSuccess(true);
    } catch (ERROR) {
      setError('Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, editUser };
};
