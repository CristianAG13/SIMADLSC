export const fetchAsistenciasFiltradas = async (filtros) => {
    const queryParams = new URLSearchParams(filtros).toString();
  
    const response = await fetch(`http://localhost:3000/asistencia?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener los datos de asistencia');
    }
  
    return await response.json();
  };
  
  export default fetchAsistenciasFiltradas;