
const API_URL = 'http://localhost:3000/estudiante';

export const obtenerEstudiantes = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener estudiantes');
  const data = response.json();
  return data;
};


export const getEstudiantesBySeccion = async (id_Seccion) => {
  try {
    const response = await fetch(`${API_URL}/seccion/${id_Seccion}`);
    if (!response.ok) throw new Error('Error al obtener los estudiantes');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
