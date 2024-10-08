// src/auth/services/resetPasswordService.js
export const resetPassword = async (token, contraseña_Usuario) => {
  try {
    const response = await fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, contraseña_Usuario }), // Enviamos el token y la contraseña
    });

    if (!response.ok) {
      // Si la respuesta no es OK, procesamos el error
      const errorData = await response.json();
      const error = new Error(errorData.message || 'Error en la solicitud');
      error.status = response.status; // Agregamos el código de estado al error para más contexto
      throw error; // Lanzamos el error para que sea capturado en el componente que llama al servicio
    }

    // Si la solicitud fue exitosa, devolvemos la respuesta en formato JSON
    return await response.json();
  } catch (error) {
    console.error('Error en resetPasswordService:', error); // Log de errores
    throw error; // Asegúrate de lanzar el error para que el componente lo capture
  }
};
