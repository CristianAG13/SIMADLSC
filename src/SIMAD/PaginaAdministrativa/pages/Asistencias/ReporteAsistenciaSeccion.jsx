// src/components/ReporteAsistenciaSeccion.jsx
import { useEffect, useState } from 'react';
import { generarPDFSeccion } from './utils/pdfGeneratorSeccion';
import getCloudinaryUrl from '../../../PaginaInformativa/utils/cloudinary';
import { useReporteAsistenciaSeccion } from './Hook/useReporteAsistenciaSeccion';
import useAllSecciones from './Hook/seAllSecciones';
import useMaterias from './Hook/useMaterias';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

export const ReporteAsistenciaSeccion = () => {
  const [nombreSeccion, setNombreSeccion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Obtenemos la lógica para buscar el reporte
  const { reporte, loading, error, buscarReporteSeccion, idMateriaSelected, setIdMateriaSelected } = useReporteAsistenciaSeccion();
  // Hook para obtener todas las secciones
  const { secciones, loadingSecciones, errorSecciones } = useAllSecciones();
  
  // Hook para obtener todas las materias - ignoramos loadingMaterias ya que no lo usamos directamente
  const { materias } = useMaterias();

  // Para controlar si el usuario ya presionó "Consultar"
  const [hasSearched, setHasSearched] = useState(false);

  // Validación y búsqueda del reporte
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreSeccion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, ingresa la sección (ej: 7-1).",
        confirmButtonColor: "#2563EB",
      });
      return;
    }
    if (!/^\d+-\d+$/.test(nombreSeccion)) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: 'El formato de la sección es incorrecto. Debe ser algo como "7-1".',
        confirmButtonColor: "#2563EB",
      });
      return;
    }
    if (!fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, ingresa las fechas de inicio y fin.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      Swal.fire({
        icon: "warning",
        title: "Rango de fechas inválido",
        text: "La fecha de inicio no puede ser mayor que la fecha de fin.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // Buscamos la sección en el array de secciones
    const seccionEncontrada = secciones.find(
      (sec) => sec.nombre_Seccion.toLowerCase() === nombreSeccion.toLowerCase()
    );
    if (!seccionEncontrada) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: `No se encontró la sección "${nombreSeccion}". Verifica el nombre.`,
        confirmButtonColor: "#2563EB",
      });
      return;
    }    setHasSearched(true);
    const idSeccion = seccionEncontrada.id_Seccion;
    try {
      await buscarReporteSeccion({ 
        idSeccion, 
        fechaInicio, 
        fechaFin,
        idMateria: idMateriaSelected || undefined 
      });
    } catch (error) {
      console.error("Error al buscar reporte de sección:", error);
    }
  };

  // Reseteo de la bandera de búsqueda al cambiar algún campo
  const handleChangeSeccion = (e) => {
    setNombreSeccion(e.target.value);
    setHasSearched(false);
  };
  const handleChangeFechaInicio = (e) => {
    setFechaInicio(e.target.value);
    setHasSearched(false);
  };  const handleChangeFechaFin = (e) => {
    setFechaFin(e.target.value);
    setHasSearched(false);
  };
  
  const handleChangeMateria = (e) => {
    setIdMateriaSelected(e.target.value);
    setHasSearched(false);
  };

  // useEffect para mostrar alertas en función de la búsqueda y errores
  useEffect(() => {
    if (!hasSearched || loading) return;    if (error === "seccion-not-found") {
      Swal.fire({
        icon: "warning",
        title: "Sección no encontrada",
        text: `No se encontró la sección "${nombreSeccion}". Por favor, verifica el nombre de la sección e intenta nuevamente.`,
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    } else if (error === "not-found") {
      Swal.fire({
        icon: "warning",
        title: "Sin resultados",
        text: "No se encontraron datos para la sección y fechas ingresadas. Verifica la información.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    } else if (error === "server-error") {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un problema",
        text: "No fue posible obtener el reporte de asistencia. Por favor, inténtalo de nuevo.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    } else if (!error && !reporte) {
      Swal.fire({
        icon: "warning",
        title: "Sin resultados",
        text: "No se encontraron datos para la sección y fechas ingresadas.",
        confirmButtonColor: "#2563EB",
      });
      setHasSearched(false);
    }  }, [hasSearched, loading, error, reporte, nombreSeccion]);

  // Integración del botón para exportar a PDF usando generarPDFSeccion
  const handleExportPDF = async () => {
    // Obtenemos el logo desde Cloudinary con los parámetros deseados
    const logoUrl = getCloudinaryUrl(
          "364228843_669464341867218_3303264254839208450_n_f2ehi6.jpg",
          "w_40,h_40,c_fill"
        );
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const logoBase64 = reader.result;
      
      // Determinar el nombre de la materia si hay un filtro activo
      const nombreMateria = idMateriaSelected 
        ? materias.find(m => m.id_Materia.toString() === idMateriaSelected)?.nombre_Materia || ""
        : "";
      
      generarPDFSeccion({
        logoBase64,
        nombreSeccion: reporte.nombre_Seccion,
        fechaInicio,
        fechaFin,
        estadisticas: reporte.estadisticas_generales,
        estudiantes: reporte.estudiantes,
        materiaFiltrada: nombreMateria,
      });
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Reporte de Asistencia por Sección</h1>
  
      {/* Formulario */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Sección (ej: 7-1)
            </label>
            <input
              type="text"
              value={nombreSeccion}
              onChange={handleChangeSeccion}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md"
              placeholder="7-1, 10-2, 11-8, etc."
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Materia
            </label>
            <select
              value={idMateriaSelected}
              onChange={handleChangeMateria}
              className={`mt-1 block w-full p-2 border ${
                idMateriaSelected ? 'border-green-500 dark:border-green-700' : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md`}
            >
              <option value="">Todas las materias</option>
              {materias.map((materia) => (
                <option key={materia.id_Materia} value={materia.id_Materia}>
                  {materia.nombre_Materia}
                </option>
              ))}
            </select>
            {idMateriaSelected && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Filtrando por materia seleccionada
              </p>
            )}
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={handleChangeFechaInicio}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Fecha Final
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={handleChangeFechaFin}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md"
            />
          </div>
           
  
          <div className="flex items-end md:col-span-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={loadingSecciones}
            >
              {loadingSecciones ? "Cargando secciones..." : "Consultar"}
            </button>
          </div>
        </form>
      </div>
  
      {/* Error al cargar secciones */}
      {errorSecciones && (
        <p className="text-red-500 dark:text-red-400">
          Error al cargar las secciones: {errorSecciones}
        </p>
      )}
  
      {/* Indicador de carga */}
      {loading && (
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
          Cargando reporte...
        </p>
      )}
  
      {/* Renderizado del reporte */}
      {reporte && (        <div
          id="reporte-seccion"
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto mb-6"
        >          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Sección: {reporte.nombre_Seccion}
            </h2>
            {idMateriaSelected && (
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mt-2">
                Materia: {materias.find(m => m.id_Materia.toString() === idMateriaSelected)?.nombre_Materia || ""}
              </h3>
            )}
          </div>
  
          <div className="mb-4">
            <h3 className="font-bold">Estadísticas Generales</h3>
            <p>Asistencias Totales: {reporte.estadisticas_generales.total_asistencias}</p>
            <p>Ausencias Totales: {reporte.estadisticas_generales.total_ausencias}</p>
            <p>Escapados Totales: {reporte.estadisticas_generales.total_escapados}</p>
            <p>Justificados Totales: {reporte.estadisticas_generales.total_justificados}</p>
            <p>Tardías Totales: {reporte.estadisticas_generales.total_tardias}</p>
          </div>
  
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Asistencias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Ausencias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Escapados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Justificados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Tardías
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reporte.estudiantes.map((est) => (
                <tr key={est.id_Estudiante}>
                  <td className="px-6 py-4 whitespace-nowrap">{est.nombre_completo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{est.asistencias}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{est.ausencias}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{est.escapados}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{est.justificados}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{est.tardias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {/* Botón para exportar a PDF */}
      {reporte && (
        <div className="mt-6">
          <button
            onClick={handleExportPDF}
            className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-md shadow focus:ring-2 focus:ring-green-600 focus:outline-none"
          >
            Exportar Reporte a PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ReporteAsistenciaSeccion;
