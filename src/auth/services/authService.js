export const AuthService = {
    resetPassword: async (token, contraseña_Usuario) => {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, contraseña_Usuario }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Error en la solicitud');
        error.status = response.status;
        throw error;
      }
  
      return await response.json();
    },
  
    // Puedes agregar otros métodos como login, register, etc.
  };
  