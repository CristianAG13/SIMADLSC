// src/auth/hooks/useForgotPassword.js
import { useState } from 'react';

export const useForgotPassword = () => {
  const [error, setError] = useState(null);

  const handleForgotPassword = async (email_Usuario) => {
    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_Usuario }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Error en la solicitud');
        error.status = response.status; // Adjuntar el código de estado al error
        throw error;
      }

      setError(null); // Reiniciar el error si la solicitud fue exitosa
    } catch (error) {
      setError(error.message);
      throw error; // Re-lanzar el error para que sea capturado en el componente
    }
  };

  return { handleForgotPassword, error };
};
