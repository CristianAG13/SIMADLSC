// src/components/ReporteAsistencia.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { generarPDF } from "./utils/pdfGenerator";
import { useReporteAsistencia } from "./Hook/useReporteAsistencia";
import { usePeriodos } from "./Hook/usePeriodos";
import useMaterias from "./Hook/useMaterias";
import getCloudinaryUrl from "../../../PaginaInformativa/utils/cloudinary";
import "@sweetalert2/theme-bulma/bulma.css";
import { formatearFechaUI, esDiaLaborable } from "./utils/dateUtils";

export const ReporteAsistencia = () => {
  const {
    cedula,
    setCedula,
    grado,
    seccion,
    fechaInicio,
    fechaFin,
    idPeriodo,
    idMateria,
    setFechaInicio,
    setFechaFin,
    setIdPeriodo,
    setIdMateria,
    asistencias,
    setAsistencias,
    error,
    buscarAsistencias,
    loading,
  } = useReporteAsistencia();
  
  const { materias } = useMaterias();

  const { periodos } = usePeriodos();
  const [hasSearched, setHasSearched] = useState(false);

  const estudianteNombre =
    asistencias.length > 0
      ? `${asistencias[0]?.id_Estudiante?.nombre_Estudiante} ${asistencias[0]?.id_Estudiante?.apellido1_Estudiante} ${asistencias[0]?.id_Estudiante?.apellido2_Estudiante || ""}`
      : "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cedula.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: "Por favor, ingresa la cédula del estudiante.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // Validar que sean días laborables si hay fechas
    if (fechaInicio && !esDiaLaborable(fechaInicio)) {
      Swal.fire({
        icon: "warning",
        title: "Fecha inválida",
        text: "La fecha de inicio debe ser un día laborable (lunes a viernes).",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (fechaFin && !esDiaLaborable(fechaFin)) {
      Swal.fire({
        icon: "warning",
        title: "Fecha inválida",
        text: "La fecha final debe ser un día laborable (lunes a viernes).",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Rango de fechas inválido",
        text: "La fecha de inicio no puede ser mayor que la fecha final.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }    setHasSearched(true);
    setAsistencias([]);
    try {
      // Si hay un filtro de materia, mostramos un mensaje
      if (idMateria && idMateria !== "") {
        const materiaSeleccionada = materias.find(m => m.id_Materia.toString() === idMateria)?.nombre_Materia || "";
        console.log(`Aplicando filtro por materia: ${materiaSeleccionada} (ID: ${idMateria})`);
        
        // Mostrar toast informativo
        Swal.fire({
          icon: "info",
          title: "Filtrando por materia",
          text: `Buscando asistencias solo para la materia: ${materiaSeleccionada}`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
      
      await buscarAsistencias(fechaInicio, fechaFin);
    } catch (err) {
      console.error("Error en la búsqueda:", err);
    }
  };

  useEffect(() => {
    if (!hasSearched || loading) return;

    if (error === "not-found") {
      Swal.fire({
        icon: "warning",
        title: "Sin resultados",
        text: "No se encontraron asistencias con los criterios ingresados. Por favor, verifica la información.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    } else if (error === "server-error") {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un problema",
        text: "Error al obtener las asistencias. Por favor, intenta de nuevo.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    } else {
      if (cedula.trim() && asistencias.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Sin resultados",
          text: "No se encontraron asistencias con los criterios ingresados. Verifica la información.",
          confirmButtonColor: "#2563EB",
        });
        setHasSearched(false);
      }
    }
  }, [hasSearched, loading, error, cedula, asistencias]);

  // Función para traducir el estado
  const traducirEstado = (estado) => {
    switch (estado) {
      case "P":
        return "Presente";
      case "A":
        return "Ausente";
      case "E":
        return "Escapado";
      case "J":
        return "Justificado";
      case "T":
        return "Tardía";
      default:
        return "Desconocido";
    }
  };
  // Manejar la exportación del PDF
  const handleExportPDF = async () => {
    // Obtiene la URL del logo desde Cloudinary
    const logoUrl = getCloudinaryUrl(
      "364228843_669464341867218_3303264254839208450_n_f2ehi6.jpg",
      "w_40,h_40,c_fill"
    );
    // Trae el logo y lo convierte a base64
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const logoBase64 = reader.result;
      
      // Determinar el nombre de la materia si hay un filtro activo
      const nombreMateria = idMateria 
        ? materias.find(m => m.id_Materia.toString() === idMateria)?.nombre_Materia || ""
        : "";
        
      generarPDF({
        logoBase64,
        estudianteNombre,
        cedula,
        grado,
        seccion,
        asistencias,
        traducirEstado,
        materiaFiltrada: idMateria ? nombreMateria : "",
      });
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de reportes de asistencia</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Consulta y gestiona los reportes de asistencia por cédula o nombre del estudiante y fechas.
        </p>
      </div>

      {/* Formulario de búsqueda */}      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Cédula del Estudiante
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={cedula}
              onChange={(e) => {
                setCedula(e.target.value);
                setHasSearched(false);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
              placeholder="Ingresa la cédula o el nombre del estudiante"
              required
            />
          </div>

          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Fecha de inicio
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={fechaInicio}
              onChange={(e) => {
                const fecha = e.target.value;
                if (!fecha || esDiaLaborable(fecha)) {
                  setFechaInicio(fecha);
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Día no válido",
                    text: "Solo se permiten días laborables (lunes a viernes).",
                    confirmButtonColor: "#2563EB",
                  });
                }
                setHasSearched(false);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Fecha final
            </label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={fechaFin}
              onChange={(e) => {
                const fecha = e.target.value;
                if (!fecha || esDiaLaborable(fecha)) {
                  setFechaFin(fecha);
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Día no válido",
                    text: "Solo se permiten días laborables (lunes a viernes).",
                    confirmButtonColor: "#2563EB",
                  });
                }
                setHasSearched(false);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
            />
          </div>          <div>
            <label htmlFor="idPeriodo" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Periodo
            </label>
            <select
              name="idPeriodo"
              value={idPeriodo}
              onChange={(e) => {
                setIdPeriodo(e.target.value);
                setHasSearched(false);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
            >
              <option value="">Seleccionar periodo</option>
              {periodos.map((periodo) => (
                <option key={periodo.id_Periodo} value={periodo.id_Periodo}>
                  {periodo.nombre_Periodo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="idMateria" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Materia
            </label>            <select
              name="idMateria"
              value={idMateria}
              onChange={(e) => {
                const value = e.target.value;
                console.log(`Materia seleccionada: ${value}`);
                // Cambiamos la materia seleccionada
                setIdMateria(value);
                // Reiniciamos la búsqueda para que se aplique el filtro al buscar nuevamente
                setHasSearched(false);
                // Si ya hay resultados, limpiamos para evitar confusiones
                if (asistencias.length > 0) {
                  setAsistencias([]);
                }
              }}
              className={`mt-1 block w-full p-2 border ${
                idMateria ? 'border-green-500 dark:border-green-600' : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md shadow-sm`}
            ><option value="">Todas las materias</option>
              {materias.map((materia) => (
                <option key={materia.id_Materia} value={materia.id_Materia.toString()}>
                  {materia.nombre_Materia}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">Buscando asistencias...</p>
      )}

      {asistencias.length > 0 && (
        <>
          <div id="reporte-asistencias" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">          <div className="mb-4">
              <h3 className="text-lg font-semibold">Grado: {grado}</h3>
              <h3 className="text-lg font-semibold">Sección: {seccion}</h3>
              <h3 className="text-lg font-semibold">Estudiante: {estudianteNombre}</h3>
              {idMateria && (
                <h3 className="text-lg font-semibold">
                  Materia: {materias.find(m => m.id_Materia.toString() === idMateria)?.nombre_Materia || ""}
                </h3>
              )}
            </div>

            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lecciones</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Materia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Profesor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Justificación</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {asistencias.map((asistencia) => (
                  <tr key={asistencia.asistencia_id}>
                    <td className="px-6 py-4">{formatearFechaUI(asistencia.fecha)}</td>
                    <td className="px-6 py-4">
                      {Array.isArray(asistencia.lecciones)
                        ? asistencia.lecciones.join(", ")
                        : typeof asistencia.lecciones === "string"
                        ? asistencia.lecciones.split(",").join(", ")
                        : "N/A"}
                    </td>                    <td className="px-6 py-4">{traducirEstado(asistencia.estado)}</td>
                    <td className={`px-6 py-4 ${idMateria && asistencia.id_Materia?.id_Materia?.toString() === idMateria ? 'font-bold text-green-600 dark:text-green-400' : ''}`}>
                      {/* Maneja diferentes estructuras posibles del objeto materia */}
                      {asistencia.id_Materia?.nombre_Materia || 
                       (typeof asistencia.id_Materia === 'object' ? JSON.stringify(asistencia.id_Materia) : asistencia.id_Materia?.toString() || "N/A")}
                    </td>
                    <td className="px-6 py-4">
                      {`${asistencia.id_Profesor?.nombre_Profesor || ''} ${asistencia.id_Profesor?.apellido1_Profesor || ''}`}
                    </td>
                    <td className="px-6 py-4">
                      {asistencia.justificacionAusencia
                        ? asistencia.justificacionAusencia.descripcion
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button
              onClick={handleExportPDF}
              className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-md shadow focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Exportar reporte a PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};
