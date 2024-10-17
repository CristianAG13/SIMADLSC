
import { useState } from 'react';
import { crearAsistencias } from '../Services/AsistenciaService';

const useCrearAsistencia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCrearAsistencias = async (asistenciasData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await crearAsistencias(asistenciasData);
      return result;
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleCrearAsistencias, loading, error };
};

export default useCrearAsistencia;
