import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useReporteAsistenciaSeccion = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idMateriaSelected, setIdMateriaSelected] = useState("");

  const buscarReporteSeccion = async ({ idSeccion, fechaInicio, fechaFin, idMateria }) => {
    setLoading(true);
    setError(null);
    setReporte(null);

    try {      // Construir URL con parámetros de consulta
      const params = new URLSearchParams();
      params.append('fechaInicio', fechaInicio);
      params.append('fechaFin', fechaFin);
      
      // Verifica que el idMateria sea una cadena no vacía o un número válido antes de agregarlo
      if (idMateria && idMateria !== "") {
        params.append('id_Materia', idMateria.toString());
        console.log(`Filtrando por materia ID: ${idMateria}`);
      }
      
      const url = `${API_URL}/asistencias/reporte-seccion/${idSeccion}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          // Sin resultados o sección no encontrada
          throw new Error("NOT_FOUND");
        } else {
          // Error de servidor (500, etc.)
          throw new Error("SERVER_ERROR");
        }
      }

      const data = await response.json();

      // Si tu backend retorna un objeto con "estudiantes" vacío,
      // también podrías interpretarlo como "not-found".
      if (!data || !data.estudiantes || data.estudiantes.length === 0) {
        throw new Error("NOT_FOUND");
      }

      setReporte(data);
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