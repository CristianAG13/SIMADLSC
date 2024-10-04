// useCreateUser.js
import { useState } from 'react';
import { createUser } from '../services/useUserService';

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCreateUser = async (userData, token) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createUser(userData, token);
      setSuccess(true); // Marcar que se creó correctamente
      return response; // Devolver la respuesta para manejarla en el componente si se necesita
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateUser, loading, error, success };
};
