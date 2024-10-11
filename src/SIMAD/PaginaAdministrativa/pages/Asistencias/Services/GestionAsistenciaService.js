export const fetchGestionAsistencia = async (page, filters) => {
    const queryParams = new URLSearchParams({
      ...filters,
      page: page.toString(),
    }).toString();
  
    const response = await fetch(`/api/asistencia/filter?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      }
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener los datos de gestión de asistencia');
    }
  
    return await response.json();
  };
  export default fetchGestionAsistencia;