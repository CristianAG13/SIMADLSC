// services/useRoleService.js
const BASE_URL = 'http://localhost:3000'; // Asegúrate de ajustar esta URL según tu API

// Función para obtener todos los roles
export const getAllRoles = async (token) => {
  const response = await fetch(`${BASE_URL}/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Si necesitas token para autenticar la petición
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los roles');
  }

  return response.json();  // Devuelve los roles en formato JSON
};
