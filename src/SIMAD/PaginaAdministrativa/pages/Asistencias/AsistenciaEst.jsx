import { useState } from "react";
import useCrearAsistencia from "./Hook/useCrearAsistencia";
import useGrados from "./Hook/useGrados";
import useMaterias from "./Hook/useMaterias";
import useProfesores from "./Hook/useProfesores";
import useSecciones from "./Hook/useSecciones";
import useEstudiantesPorSeccion from "./Hook/useEstudiantesPorSeccion";
import { usePeriodos } from "./Hook/usePeriodos";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

export const AsistenciaEst = () => {
  // ============================
  // 1. LEE DATOS DEL LOCALSTORAGE
  // ============================
  const role = localStorage.getItem("role");
  const materiaLocalStorage = localStorage.getItem("materia"); // Podría ser "[1,2]" o "1,2" o incluso "3"

  // Convertimos la cadena de localStorage a un arreglo de IDs
  let materiaIds = [];
  if (role === "profesor" && materiaLocalStorage) {
    try {
      // Intentamos parsear como JSON (ej: "[1,2,3]")
      const parsed = JSON.parse(materiaLocalStorage);
      if (Array.isArray(parsed)) {
        materiaIds = parsed.map((id) => Number(id));
      } else {
        // Si no es array, asumimos que es un número suelto (ej: "3")
        materiaIds = [Number(parsed)];
      }
    } catch (error) {
      // Si falla el parse, puede que sea un CSV (ej: "1,2,3")
      materiaIds = materiaLocalStorage
        .split(",")
        .map((id) => Number(id.trim()));
    }
  }

  // ============================
  // 2. OBTÉN TUS DATOS DEL HOOK
  // ============================
  const { grados } = useGrados();
  const { materias } = useMaterias();
  const { profesores } = useProfesores();
  const { periodos } = usePeriodos();

  // ============================
  // 3. FILTRA MATERIAS SI ES PROFESOR
  // ============================
  const filteredMaterias =
    role === "profesor"
      ? materias.filter((mat) => materiaIds.includes(mat.id_Materia))
      : materias;

  // ============================
  // 4. ESTADO DEL FORMULARIO
  // ============================
  const [formData, setFormData] = useState({
    fecha: "",
    id_Materia: "",
    id_grado: "",
    id_Seccion: "",
    id_Profesor: "",
    id_Periodo: "",
    lecciones: [],
  });

  const { secciones, loading: loadingSecciones } = useSecciones(formData.id_grado);
  const { estudiantes, setEstudiantes, loading: loadingEstudiantes } =
    useEstudiantesPorSeccion(formData.id_Seccion);
  const { handleCrearAsistencias, loading, error } = useCrearAsistencia();

  // ============================
  // 5. FUNCIÓN PARA VALIDAR FIN DE SEMANA
  // ============================
  const isWeekend = (dateStr) => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0: Domingo, 6: Sábado
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // ============================
  // 6. HANDLERS DE CAMBIO
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fecha" && isWeekend(value)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pueden seleccionar sábados ni domingos como fecha de asistencia.",
        confirmButtonColor: "#2563EB",
      });
      setFormData((prev) => ({ ...prev, fecha: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "id_grado") {
      // Al cambiar grado, limpiamos la sección y la lista de estudiantes
      setFormData((prev) => ({ ...prev, id_Seccion: "" }));
      setEstudiantes([]);
    }

    if (name === "id_Seccion") {
      // Al cambiar sección, limpiamos la lista de estudiantes
      setEstudiantes([]);
    }
  };

  const handleLeccionToggle = (leccion) => {
    const leccionesActualizadas = formData.lecciones.includes(leccion)
      ? formData.lecciones.filter((l) => l !== leccion)
      : [...formData.lecciones, leccion];

    setFormData((prev) => ({ ...prev, lecciones: leccionesActualizadas }));
  };

  const handleEstadoChange = (id_Estudiante, estado) => {
    const updatedEstudiantes = estudiantes.map((est) =>
      est.id_Estudiante === id_Estudiante ? { ...est, estado } : est
    );
    setEstudiantes(updatedEstudiantes);
  };

  // ============================
  // 7. SUBMIT DEL FORMULARIO
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.fecha) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona una fecha.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (!formData.id_Materia) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona una materia.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (!formData.id_grado) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona un grado.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (!formData.id_Seccion) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona una sección.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (!formData.id_Profesor) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona un profesor.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (!formData.id_Periodo) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona un periodo.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (formData.lecciones.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona al menos una lección.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    const asistenciasData = estudiantes.map((estudiante) => ({
      fecha: formData.fecha,
      estado: estudiante.estado,
      id_Estudiante: estudiante.id_Estudiante,
      id_Materia: formData.id_Materia,
      id_grado: formData.id_grado,
      id_Seccion: formData.id_Seccion,
      id_Profesor: formData.id_Profesor,
      id_Periodo: formData.id_Periodo,
      lecciones: formData.lecciones,
    }));

    try {
      await handleCrearAsistencias(asistenciasData);
      Swal.fire({
        icon: "success",
        title: "¡Asistencia creada exitosamente!",
        confirmButtonColor: "#2563EB",
      });
      // Limpiar formulario y lista de estudiantes
      setFormData({
        fecha: "",
        id_Materia: "",
        id_grado: "",
        id_Seccion: "",
        id_Profesor: "",
        id_Periodo: "",
        lecciones: [],
      });
      setEstudiantes([]);
    } catch (err) {
      const error = err.response?.data?.error;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Error al crear la asistencia",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  // ============================
  // 8. RENDER
  // ============================
  return (
    <div className="container mx-auto p-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4">Registrar Asistencia</h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FECHA */}
          <div>
            <label className="block mb-2">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* GRADO */}
          <div>
            <label className="block mb-2">Grado:</label>
            <select
              name="id_grado"
              value={formData.id_grado}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar Grado</option>
              {grados.map((grado) => (
                <option key={grado.id_grado} value={grado.id_grado}>
                  {grado.nivel}
                </option>
              ))}
            </select>
          </div>

          {/* SECCIÓN */}
          <div>
            <label className="block mb-2">Sección:</label>
            <select
              name="id_Seccion"
              value={formData.id_Seccion}
              onChange={handleChange}
              required
              disabled={!formData.id_grado}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar Sección</option>
              {loadingSecciones ? (
                <option>Cargando secciones...</option>
              ) : (
                secciones.map((seccion) => (
                  <option key={seccion.id_Seccion} value={seccion.id_Seccion}>
                    {seccion.nombre_Seccion}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* MATERIA */}
          <div>
            <label className="block mb-2">Materia:</label>
            <select
              name="id_Materia"
              value={formData.id_Materia}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar Materia</option>
              {filteredMaterias.map((materia) => (
                <option key={materia.id_Materia} value={materia.id_Materia}>
                  {materia.nombre_Materia}
                </option>
              ))}
            </select>
          </div>

          {/* PROFESOR */}
          <div>
            <label className="block mb-2">Profesor:</label>
            <select
              name="id_Profesor"
              value={formData.id_Profesor}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar Profesor</option>
              {profesores.map((prof) => (
                <option key={prof.id_Profesor} value={prof.id_Profesor}>
                  {prof.nombre_Profesor} {prof.apellido1_Profesor} {prof.apellido2_Profesor}
                </option>
              ))}
            </select>
          </div>

          {/* PERIODO */}
          <div>
            <label className="block mb-2">Periodo:</label>
            <select
              name="id_Periodo"
              value={formData.id_Periodo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar Periodo</option>
              {periodos.map((periodo) => (
                <option key={periodo.id_Periodo} value={periodo.id_Periodo}>
                  {periodo.nombre_Periodo}
                </option>
              ))}
            </select>
          </div>

          {/* LECCIONES */}
          <div className="col-span-2">
            <label className="block mb-2">Seleccionar Lecciones:</label>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((leccion) => (
                <label key={leccion} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={leccion}
                    checked={formData.lecciones.includes(leccion)}
                    onChange={() => handleLeccionToggle(leccion)}
                    className="form-checkbox text-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <span>Lección {leccion}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Seleccionadas:{" "}
              {formData.lecciones.length > 0
                ? formData.lecciones.sort((a, b) => a - b).join("/")
                : "Ninguna"}
            </p>
          </div>
        </div>

        {/* ESTUDIANTES */}
        <h3 className="text-xl font-semibold mt-6 mb-4">Lista de Estudiantes</h3>
        <div className="overflow-x-auto">
          {loadingEstudiantes ? (
            <p>Cargando estudiantes...</p>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <thead>
                <tr>
                  <th className="py-2 border border-gray-300 dark:border-gray-700">Estudiante</th>
                  <th className="py-2 border border-gray-300 dark:border-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante) => (
                  <tr key={estudiante.id_Estudiante}>
                    <td className="border px-4 py-2 border-gray-300 dark:border-gray-700">
                      {estudiante.nombre_Estudiante} {estudiante.apellido1_Estudiante}
                    </td>
                    <td className="border px-4 py-2 border-gray-300 dark:border-gray-700">
                      <select
                        value={estudiante.estado}
                        onChange={(e) =>
                          handleEstadoChange(estudiante.id_Estudiante, e.target.value)
                        }
                        className="p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="P">Presente</option>
                        <option value="A">Ausente</option>
                        <option value="E">Escapado</option>
                        <option value="J">Justificado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          {loading ? "Guardando..." : "Guardar Asistencia"}
        </button>
      </form>
    </div>
  );
};