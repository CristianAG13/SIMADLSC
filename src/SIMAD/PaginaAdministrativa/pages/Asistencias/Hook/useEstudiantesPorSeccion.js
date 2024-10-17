
import { useEffect, useState } from 'react';
import { getEstudiantesBySeccion } from '../Services/EstudianteService';

const useEstudiantesPorSeccion = (id_Seccion) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (id_Seccion) {
        setLoading(true);
        getEstudiantesBySeccion(id_Seccion)
          .then((data) => {
            const estudiantesConEstado = data.map(estudiante => ({ ...estudiante, estado: 'P' })); // Establecer 'Presente' por defecto
            setEstudiantes(estudiantesConEstado);
          })
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      } else {
        setEstudiantes([]); // Si no hay sección seleccionada, vacía la lista
      }
    }, [id_Seccion]);
  
    return { estudiantes, setEstudiantes, loading, error };
  };
  
  export default useEstudiantesPorSeccion;