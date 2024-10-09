
const API_URL = 'http://localhost:3000/secciones';

export const obtenerSecciones = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener secciones');
  return await response.json();
};