// src/auth/services/forgotPasswordService.js

  export const forgotPassword = async (email_Usuario) => {
    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_Usuario }),
      });
  
      if (!response.ok) {
        // Manejo de errores HTTP
        const errorText = await response.text();
        throw new Error(`Error en la solicitud: ${response.statusText} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log(data.message); // 'Se ha enviado un correo para restablecer tu contraseña.'
    } catch (error) {
      console.error('Error:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };
 
  