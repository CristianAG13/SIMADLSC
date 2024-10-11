// services/gradosSeccionesService.js
export const fetchGradosSecciones = async () => {
    const response = await fetch('/api/asistencia/grados-secciones', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener los grados y secciones');
    }
  
    return await response.json();
  };
  export default fetchGradosSecciones;