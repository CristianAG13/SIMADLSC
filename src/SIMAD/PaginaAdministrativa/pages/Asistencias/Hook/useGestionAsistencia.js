// hooks/useGestionAsistencia.js
import { useState, useEffect } from 'react';
import fetchGestionAsistencia from '../Services/GestionAsistenciaService';
const useGestionAsistencia = (filters, currentPage) => {
  const [attendance, setAttendance] = useState([]); // Estado para los registros de asistencia
  const [totalPages, setTotalPages] = useState(1); // Estado para el número total de páginas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de errores

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Empezar la carga
      try {
        // Llamada al servicio con la página actual y los filtros
        const result = await fetchGestionAsistencia(currentPage, filters);
        setAttendance(result.data); // Guardar los registros de asistencia
        setTotalPages(result.totalPages); // Guardar el total de páginas desde la respuesta
      } catch (err) {
        setError(err.message); // Capturar cualquier error
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    fetchData(); // Ejecutar la función para obtener los datos
  }, [filters, currentPage]); // Reejecutar cuando cambien los filtros o la página

  return { attendance, totalPages, loading, error, setAttendance }; // Retornar los datos y los estados necesarios
};

export default useGestionAsistencia;
