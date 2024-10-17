// src/services/profesor.service.js

const API_URL = 'http://localhost:3000/profesores';

export const obtenerProfesores = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener profesores');
  return await response.json();
};
