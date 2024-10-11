// hooks/useAsistenciaFiltrada.js
import { useState, useEffect } from 'react';
import fetchAsistenciasFiltradas from '../Services/AsistenciaService';
const useAsistenciaFiltrada = (filtros) => {
  const [asistencias, setAsistencias] = useState([]); 
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const result = await fetchAsistenciasFiltradas(filtros);
        setAsistencias(result.asistencias); 
        setProfesor(result.profesor); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, [filtros]); 

  return { asistencias, profesor, loading, error }; 
};

export default useAsistenciaFiltrada;
