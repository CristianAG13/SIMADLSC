import { useState } from 'react';
import { obtenerReporteAsistenciaSeccion } from '../Services/AsistenciaService';

export const useReporteAsistenciaSeccion = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Eliminamos el estado para el filtro de materia

  const buscarReporteSeccion = async ({ idSeccion, fechaInicio, fechaFin }) => {
    setLoading(true);
    setError(null);
    setReporte(null);    try {
      // Usamos el servicio actualizado (sin filtro de materia)
      const dataReporte = await obtenerReporteAsistenciaSeccion(idSeccion, fechaInicio, fechaFin);

      // Si el reporte no tiene datos, lanzamos un error
      if (!dataReporte || !dataReporte.estudiantes || dataReporte.estudiantes.length === 0) {
        throw new Error("NOT_FOUND");
      }
      
      setReporte(dataReporte);
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        setError("not-found");
      } else {
        setError("server-error");
      }
    } finally {
      setLoading(false);
    }
  };  return { 
    reporte, 
    loading, 
    error, 
    buscarReporteSeccion
  };
};