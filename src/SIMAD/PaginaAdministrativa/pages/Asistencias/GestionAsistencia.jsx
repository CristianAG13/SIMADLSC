import { useEffect, useState } from "react";
import { useDatosIniciales } from "./Hook/useDatosIniciales";
import {
  actualizarAsistencia,
  eliminarAsistencia,
  obtenerGestionAsistencias,
  obtenerTodasLasAsistencias,
} from "./Services/GestionAsistenciaService";
import { usePeriodos } from "./Hook/usePeriodos";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

export const GestionAsistencia = () => {
  const { materias, grados, secciones } = useDatosIniciales();
  const { periodos } = usePeriodos();

  const [asistencias, setAsistencias] = useState([]);
  const [filtros, setFiltros] = useState({
    periodo: "",
    fecha: "",
    grado: "",
    materia: "",
    seccion: "",
  });
  const [error, setError] = useState("");

  // Paginación: 20 items por página, máximo 100 registros.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const data = await obtenerTodasLasAsistencias();
        setAsistencias(data);
        setError("");
      } catch (err) {
        setError("Error al obtener las asistencias");
        setAsistencias([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al obtener las asistencias",
          confirmButtonColor: "#2563EB",
        });
      }
    };

    fetchAsistencias();
  }, []);

  const handleBuscar = async () => {
    try {
      const data = await obtenerGestionAsistencias(filtros);
      if (data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No se encontraron asistencias con los criterios de búsqueda.",
          confirmButtonColor: "#2563EB",
        });
        setAsistencias([]);
      } else {
        setAsistencias(data);
      }
    } catch (err) {
      console.error("Error al obtener las asistencias:", err);
      setError("Error al obtener las asistencias");
      setAsistencias([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener las asistencias",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleEditar = async (id) => {
    const asistencia = asistencias.find((a) => a.asistencia_id === id);
    if (!asistencia) return;
    const { value: formValues } = await Swal.fire({
      title: "Editar Asistencia",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Estado" value="${asistencia.estado}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Lecciones" value="${
          Array.isArray(asistencia.lecciones)
            ? asistencia.lecciones.join(", ")
            : asistencia.lecciones
        }">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
      preConfirm: () => {
        const estado = document.getElementById("swal-input1").value;
        const lecciones = document.getElementById("swal-input2").value;
        if (!estado) {
          Swal.showValidationMessage("El campo Estado es obligatorio");
        }
        return { estado, lecciones };
      },
    });
    if (formValues) {
      const updatedData = {
        estado: formValues.estado,
        lecciones: formValues.lecciones
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l !== ""),
      };
      try {
        await actualizarAsistencia(asistencia.asistencia_id, updatedData);
        setAsistencias(
          asistencias.map((a) =>
            a.asistencia_id === asistencia.asistencia_id
              ? { ...a, ...updatedData }
              : a
          )
        );
        Swal.fire({
          icon: "success",
          title: "Actualización exitosa",
          confirmButtonColor: "#2563EB",
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error al actualizar la asistencia",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Confirmar Eliminación",
      text: "¿Estás seguro de que deseas eliminar esta asistencia?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
    });
    if (result.isConfirmed) {
      try {
        await eliminarAsistencia(id);
        setAsistencias((prev) =>
          prev.filter((a) => a.asistencia_id !== id)
        );
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La asistencia ha sido eliminada.",
          confirmButtonColor: "#2563EB",
        });
      } catch (err) {
        setError("Error al eliminar la asistencia");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al eliminar la asistencia",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  // Cálculo de paginación: se limita el total de asistencias a 100.
  const totalItems = Math.min(asistencias.length, 100);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedAsistencias = asistencias.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Asistencias</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          name="periodo"
          value={filtros.periodo}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="">Seleccionar Periodo</option>
          {periodos.map((periodo) => (
            <option key={periodo.id_Periodo} value={periodo.id_Periodo}>
              {periodo.nombre_Periodo}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={filtros.fecha}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        />

        <select
          name="grado"
          value={filtros.grado}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="">Seleccionar Grado</option>
          {grados.map((grado) => (
            <option key={grado.id_grado} value={grado.id_grado}>
              {grado.nivel}
            </option>
          ))}
        </select>

        <select
          name="materia"
          value={filtros.materia}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="">Seleccionar Materia</option>
          {materias.map((materia) => (
            <option key={materia.id_Materia} value={materia.id_Materia}>
              {materia.nombre_Materia}
            </option>
          ))}
        </select>

        <select
          name="seccion"
          value={filtros.seccion}
          onChange={handleChange}
          className="border rounded px-4 py-2"
        >
          <option value="">Seleccionar Sección</option>
          {secciones.map((seccion) => (
            <option key={seccion.id_Seccion} value={seccion.id_Seccion}>
              {seccion.nombre_Seccion}
            </option>
          ))}
        </select>

        <button
          onClick={handleBuscar}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {paginatedAsistencias.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Estudiante</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Profesor</th>
              <th className="border px-4 py-2">Materia</th>
              <th className="border px-4 py-2">Sección</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Lecciones</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAsistencias.map((asistencia) => (
              <tr key={asistencia.asistencia_id} className="text-center">
                <td className="border px-4 py-2">
                  {asistencia.id_Estudiante?.nombre_Estudiante || "Sin nombre"}{" "}
                  {asistencia.id_Estudiante?.apellido1_Estudiante || ""}{" "}
                  {asistencia.id_Estudiante?.apellido2_Estudiante || ""}
                </td>
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">
                  {asistencia.id_Profesor?.nombre_Profesor || "Sin profesor"}{" "}
                  {asistencia.id_Profesor?.apellido1_Profesor || ""}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.id_Materia?.nombre_Materia || "Sin materia"}
                </td>
                <td className="border px-4 py-2">
                  {asistencia.id_Seccion?.nombre_Seccion || "Sin sección"}
                </td>
                <td className="border px-4 py-2">{asistencia.estado}</td>
                <td className="border px-4 py-2">
                  {typeof asistencia.lecciones === "string"
                    ? asistencia.lecciones.split(",").join(", ")
                    : Array.isArray(asistencia.lecciones)
                    ? asistencia.lecciones.join(", ")
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditar(asistencia.asistencia_id)}
                    className="bg-green-700 text-white px-3 py-1 rounded mr-2 hover:bg-green-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(asistencia.asistencia_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-300"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron asistencias.</p>
      )}

      {/* Controles de paginación */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            currentPage < totalPages && setCurrentPage((prev) => prev + 1)
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};