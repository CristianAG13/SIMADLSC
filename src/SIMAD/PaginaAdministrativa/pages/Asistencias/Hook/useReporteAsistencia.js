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
        const fechaInicioFinal = fechaInicioParam !== undefined ? fechaInicioParam : fechaInicio;
        const fechaFinFinal = fechaFinParam !== undefined ? fechaFinParam : fechaFin;         
        const data = await obtenerReporteAsistencias(cedula, fechaInicioFinal, fechaFinFinal, idPeriodo, idMateria);
        const asistenciasArray = Array.isArray(data)
          ? data
          : data?.asistencias || [];        if (asistenciasArray.length > 0) {
          let resultadosFiltrados = asistenciasArray;
          
          if (idMateria && idMateria !== "") {
            resultadosFiltrados = asistenciasArray.filter(asistencia => {
              const materiaId = asistencia.id_Materia?.id_Materia || asistencia.id_Materia;
              const materiaIdStr = materiaId?.toString();
              return materiaIdStr === idMateria.toString();
            });
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
        }      } catch (err) {
        if (err.message === "NOT_FOUND") {
          setAsistencias([]);
          setGrado("");
          setSeccion("");
          // Distinguimos entre estudiante no encontrado y otras razones de "no encontrado"
          setError(cedula ? "estudiante-no-encontrado" : "not-found");
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
      error,
      buscarAsistencias,
      loading,
    };
  };