const API_URL = 'http://localhost:3000/grados';

export const obtenerGrados = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener grados');
  const data = await response.json();
  return data
};