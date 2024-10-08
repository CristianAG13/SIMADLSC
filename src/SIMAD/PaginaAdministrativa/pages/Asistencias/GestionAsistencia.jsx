import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DataTable from 'react-data-table-component'; 
import useGestionAsistencia from "./Hook/useGestionAsistencia";
import justificarAsistencia from "./Services/justificacionService";
import fetchGradosSecciones from "./Services/gradosSeccionesService";
const MySwal = withReactContent(Swal);

const GestionAsistencia = () => {
  const [currentPage, setCurrentPage] = useState(1); 
  const [filters, setFilters] = useState({
    nombre: "",
    estado: "",
    justificado: "",
    seccion: "",
    grado: "",
    fecha: "",
  });

  const [grados, setGrados] = useState([]); 
  const [secciones, setSecciones] = useState([]); 

  const { attendance, totalPages, loading, error: loadError, setAttendance } = useGestionAsistencia(filters, currentPage);

  useEffect(() => {
    const cargarGradosSecciones = async () => {
      try {
        const { grados, secciones } = await fetchGradosSecciones();
        setGrados(grados); 
        setSecciones(secciones); 
      } catch (err) {
        console.error("Error al cargar los grados y secciones", err);
      }
    };

    cargarGradosSecciones();
  }, []); 

  // const handleJustifyAttendance = (record) => {
  //   MySwal.fire({
  //     title: `Justificar Ausencia de ${record.nombre_estudiante}`,
  //     input: 'textarea',
  //     inputLabel: 'Motivo de la justificación',
  //     inputPlaceholder: 'Escriba el motivo aquí...',
  //     inputAttributes: {
  //       'aria-label': 'Motivo de la justificación',
  //       rows: 5,
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: 'Aceptar',
  //     cancelButtonText: 'Cancelar',
  //     customClass: {
  //       confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg',
  //       cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg',
  //       input: 'p-3 border rounded-lg',
  //     },
  //     preConfirm: (justification) => {
  //       if (!justification) {
  //         MySwal.showValidationMessage('Debe ingresar un motivo de justificación');
  //       } else {
  //         return justification;
  //       }
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const justification = result.value;
  //       const justificationData = {
  //         justificado: true,
  //         motivo_justificacion: justification,
  //       };

  //       justificarAsistencia(record.id_asistencia, justificationData)
  //         .then(() => {
  //           const updatedAttendance = attendance.map((r) =>
  //             r.id_asistencia === record.id_asistencia
  //               ? { ...r, justificado: true, motivo_justificacion: justification }
  //               : r
  //           );
  //           setAttendance(updatedAttendance); 
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Justificación guardada',
  //             text: `La ausencia de ${record.nombre_estudiante} ha sido justificada.`,
  //             confirmButtonText: 'Ok',
  //             customClass: {
  //               confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg',
  //             },
  //           });
  //         })
  //         .catch(() => {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: 'Hubo un problema al guardar la justificación.',
  //             confirmButtonText: 'Ok',
  //             customClass: {
  //               confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg',
  //             },
  //           });
  //         });
  //     }
  //   });
  // };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const columns = [
    {
      name: 'Nombre Estudiante',
      selector: (row) => row.nombre_estudiante,
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: 'Estado de Asistencia',
      selector: (row) => row.estado_asistencia,
      sortable: true,
    },
    {
      name: 'Justificado',
      cell: (row) => row.justificado ? 'Sí' : 'No',
      sortable: true,
    },
    {
      name: 'Grado',
      selector: (row) => row.grado,
      sortable: true,
    },
    {
      name: 'Sección',
      selector: (row) => row.seccion,
      sortable: true,
    },
    // {
    //   name: 'Acciones',
    //   cell: (row) => (
    //     <button
    //       onClick={() => handleJustifyAttendance(row)}
    //       className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
    //     >
    //       Justificar
    //     </button>
    //   ),
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Barra superior */}
      <header className="bg-white shadow-md py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Asistencia Estudiantil</h1>
          <Link
            to="/Crear-asistencia"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Registrar Asistencia
          </Link>
        </div>
      </header>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del estudiante"
            value={filters.nombre}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <select
            name="estado"
            value={filters.estado}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">Estado de asistencia</option>
            <option value="Presente">Presente</option>
            <option value="Ausente">Ausente</option>
            <option value="Escapado">Escapado</option>
          </select>
          <select
            name="justificado"
            value={filters.justificado}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">Justificado</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
          <select
            name="grado"
            value={filters.grado}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">Grado</option>
            {/* {grados.map((grado) => (
              <option key={grado} value={grado}>{grado}</option>
            ))} */}
          </select>
          <select
            name="seccion"
            value={filters.seccion}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">Sección</option>
            {/* {secciones.map((seccion) => (
              <option key={seccion} value={seccion}>{seccion}</option>
            ))} */}
          </select>

          {/* Filtro por fecha */}
          <input
            type="date"
            name="fecha"
            value={filters.fecha}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Cargando asistencia...</div>
          ) : loadError ? (
            <div className="text-center text-red-500 py-10">{loadError}</div>
          ) : attendance.length > 0 ? (
            <DataTable
              columns={columns}
              data={attendance}
              pagination
              paginationServer
              paginationTotalRows={totalPages}
              onChangePage={setCurrentPage}
              highlightOnHover
              striped
              dense
            />
          ) : (
            <div className="text-center text-gray-500 py-10">No hay registros de asistencia disponibles.</div>
          )}
        </div>

        {/* Paginación */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionAsistencia;
