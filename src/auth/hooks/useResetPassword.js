// src/auth/hooks/useResetPassword.js
import { resetPassword } from '../services/resetPasswordService';

export const useResetPassword = () => {
  const handleResetPassword = async (token, contraseña_Usuario) => {
    try {
      // Llamamos al servicio para restablecer la contraseña
      return await resetPassword(token, contraseña_Usuario);
    } catch (error) {
      // Si ocurre un error, lo propagamos para que el componente lo maneje
      throw error;
    }
  };

  return { handleResetPassword };
};
