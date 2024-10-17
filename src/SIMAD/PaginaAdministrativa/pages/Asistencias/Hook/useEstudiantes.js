// src/hooks/useEstudiantes.js

import { useEffect, useState } from 'react';
import { obtenerEstudiantes } from '../Services/EstudianteService';

const useEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const data = await obtenerEstudiantes();
        const estudiantesConEstado = data.map(estudiante => ({ ...estudiante, estado: 'P' }));
        setEstudiantes(estudiantesConEstado);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEstudiantes();
  }, []);

  return { estudiantes, setEstudiantes, loading };
};

export default useEstudiantes;
