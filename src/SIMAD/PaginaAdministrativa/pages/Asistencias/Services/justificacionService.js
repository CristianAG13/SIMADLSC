export const justificarAsistencia = async (id_asistencia, justificationData) => {
    const response = await fetch(`/api/asistencia/justificar/${id_asistencia}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(justificationData),
    });
  
    if (!response.ok) {
      throw new Error('Error al justificar la asistencia');
    }
  
    return await response.json();
  };
  export default justificarAsistencia;