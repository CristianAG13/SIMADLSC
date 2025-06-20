import { useState } from "react";
import { obtenerReporteAsistencias } from "../Services/AsistenciaService";

export const useReporteAsistencia = () => {
    const [cedula, setCedula] = useState("");
    const [grado, setGrado] = useState("");
    const [seccion, setSeccion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [idPeriodo, setIdPeriodo] = useState("");
    const [idMateria, setIdMateria] = useState("");
    const [asistencias, setAsistencias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const buscarAsistencias = async (fechaInicioParam, fechaFinParam) => {
      setLoading(true);
      setError(null);
      try {
        // Usar los parámetros si se proporcionan, de lo contrario usar los valores del estado
        const fechaInicioFinal = fechaInicioParam !== undefined ? fechaInicioParam : fechaInicio;
        const fechaFinFinal = fechaFinParam !== undefined ? fechaFinParam : fechaFin;          const data = await obtenerReporteAsistencias(cedula, fechaInicioFinal, fechaFinFinal, idPeriodo, idMateria);
        
        // Si data es un objeto que contiene la propiedad "asistencias"
        const asistenciasArray = Array.isArray(data)
          ? data
          : data?.asistencias || [];        if (asistenciasArray.length > 0) {
          // Verificamos si debemos filtrar por materia en el frontend
          // A veces el backend no aplica el filtro correctamente
          let resultadosFiltrados = asistenciasArray;
          
          if (idMateria && idMateria !== "") {
            console.log(`Filtrando por materia ID: ${idMateria} en el frontend`);
            resultadosFiltrados = asistenciasArray.filter(asistencia => {
              // Intentamos manejar diferentes estructuras de datos posibles
              const materiaId = asistencia.id_Materia?.id_Materia || asistencia.id_Materia;
              const materiaIdStr = materiaId?.toString();
              
              console.log(`Asistencia materia ID: ${materiaIdStr}, comparando con: ${idMateria}`);
              return materiaIdStr === idMateria.toString();
            });
            
            console.log(`Se filtraron ${resultadosFiltrados.length} de ${asistenciasArray.length} registros`);
          }
          
          setAsistencias(resultadosFiltrados);
          
          if (resultadosFiltrados.length > 0) {
            setGrado(resultadosFiltrados[0].id_grado.nivel);
            setSeccion(resultadosFiltrados[0].id_Seccion.nombre_Seccion);
          } else {
            setGrado("");
            setSeccion("");
            setError("not-found");
          }
        } else {
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("not-found");
        }
      } catch (err) {
        if (err.message === "NOT_FOUND") {
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("not-found");
        } else {
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          setError("server-error");
        }
      } finally {
        setLoading(false);
      }
    };
  
  return {
      cedula,
      setCedula,
      grado,
      seccion,
      fechaInicio,
      setFechaInicio,
      fechaFin,
      setFechaFin,
      idPeriodo,
      setIdPeriodo,
      idMateria,
      setIdMateria,
      asistencias,
      setAsistencias,
      error,       // "not-found" | "server-error" | null
      buscarAsistencias,
      loading,
    };
  };