// hooks/useGestionAsistencia.js
import { useState, useEffect } from 'react';
import fetchGestionAsistencia from '../Services/GestionAsistenciaService';
const useGestionAsistencia = (filters, currentPage) => {
  const [attendance, setAttendance] = useState([]); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Empezar la carga
      try {
        const result = await fetchGestionAsistencia(currentPage, filters);
        setAttendance(result.data); 
        setTotalPages(result.totalPages); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, [filters, currentPage]); 

  return { attendance, totalPages, loading, error, setAttendance }; 
};

export default useGestionAsistencia;
