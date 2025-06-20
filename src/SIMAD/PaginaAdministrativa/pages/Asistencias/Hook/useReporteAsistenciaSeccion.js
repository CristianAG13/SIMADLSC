import { useState } from 'react';
import { obtenerReporteAsistenciaSeccion } from '../Services/AsistenciaService';

export const useReporteAsistenciaSeccion = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idMateriaSelected, setIdMateriaSelected] = useState("");

  const buscarReporteSeccion = async ({ idSeccion, fechaInicio, fechaFin, idMateria }) => {
    setLoading(true);
    setError(null);
    setReporte(null);

    try {
      console.log(`Iniciando búsqueda de reporte para sección ID: ${idSeccion}`);
      console.log(`Parámetros: fechaInicio=${fechaInicio}, fechaFin=${fechaFin}, idMateria=${idMateria || 'todas'}`);
        // Usamos el nuevo servicio que maneja el filtrado correctamente
      const dataReporte = await obtenerReporteAsistenciaSeccion(idSeccion, fechaInicio, fechaFin, idMateria);

      // Si el reporte no tiene datos, lanzamos un error
      if (!dataReporte || !dataReporte.estudiantes || dataReporte.estudiantes.length === 0) {
        console.log("No se encontraron datos para la sección con los filtros aplicados");
        throw new Error("NOT_FOUND");
      }

      console.log(`Reporte obtenido con éxito: ${dataReporte.estudiantes.length} estudiantes`);
      
      // Si hay filtro de materia, verificamos que efectivamente haya datos
      if (idMateria && idMateria !== "" && dataReporte.estudiantes.length === 0) {
        console.log("No se encontraron datos para la materia seleccionada");
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
  };
  return { 
    reporte, 
    loading, 
    error, 
    buscarReporteSeccion,
    idMateriaSelected,
    setIdMateriaSelected
  };
};