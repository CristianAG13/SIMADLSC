const BASE_URL = 'http://localhost:3000/users';  // URL base para las peticiones

// Obtener todos los usuarios
export const getAllUsers = async (token) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }

  return response.json();
};


export const createUser = async (userData, token) => {
  if (!token) {
    throw new Error('No se proporcionó un token de autenticación');
  }
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Error al crear el usuario');
    
  }

  return response.json();
};

// Actualizar un usuario existente
export const updateUser = async (id, userData, token) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el usuario');
  }

  return response.json();
};

// Eliminar un usuario
export const deleteUser = async (id, token) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (response.status === 204) {
    return; // No hay contenido
  }

  if (!response.ok) {
    throw new Error('Error al eliminar el usuario');
  }

  return response.json();
};

// Bloquear o desbloquear un usuario
export const toggleBlockUser = async (id, bloqueado_Usuario, token) => {
  const response = await fetch(`http://localhost:3000/users/${id}/block`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Error al bloquear/desbloquear el usuario');
  }

  return response.json();
};
