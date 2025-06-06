// src/components/Secciones.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UseFetchSecciones from '../Hooks/UseFetchSecciones';
import SeccionesService from '../Services/SeccionesService';
import EstudiantesService from '../../../../pages/Modulos academicos/Estudiantes/Service/EstudiantesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Importamos la función para generar PDF
import { generateStudentsListPDF } from '../Utils/pdfsecciones';

const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const allowedPatterns = {
  setimo: /^7-\d+$/,
  octavo: /^8-\d+$/,
  undecimo: /^11-\d+$/,
  noveno: /^9-\d+$/,
  decimo: /^10-\d+$/,
};

const exampleSectionNames = {
  setimo: '7-1',
  octavo: '8-1',
  undecimo: '11-1',
  noveno: '9-1',
  decimo: '10-1',
};

const levelOrder = {
  setimo: 7,
  octavo: 8,
  noveno: 9,
  decimo: 10,
  undecimo: 11,
};

const Secciones = () => {
  // Hook personalizado que trae: secciones (array), loading (boolean), error (string), fetchSecciones (fn)
  const { secciones, loading, error, fetchSecciones } = UseFetchSecciones();

  // Filtros y estados para paginación:
  const [nivelFilter, setNivelFilter] = useState('');
  const [levels, setLevels] = useState([]);

  // Modal para crear sección:
  const [showModal, setShowModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionGradeId, setNewSectionGradeId] = useState('');

  // Paginación:
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 15;

  // Al montar, traemos la lista de niveles (para el select de creación):
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await EstudiantesService.getNiveles();
        setLevels(data);
      } catch (err) {
        console.error('Error al obtener niveles:', err);
      }
    };
    fetchLevels();
  }, []);

  // Función que sugiere un nombre de ejemplo para la nueva sección
  const getExampleSectionName = () => {
    if (newSectionGradeId) {
      const selectedLevel = levels.find(
        (level) => level.id_grado === Number(newSectionGradeId)
      );
      if (selectedLevel) {
        const normalizedNivel = normalizeText(selectedLevel.nivel);
        return exampleSectionNames[normalizedNivel] || '';
      }
    }
    return '';
  };
  const exampleSectionName = getExampleSectionName();

  // Filtrar secciones según el nivel (nivelFilter). Si nivelFilter está vacío, no filtra.
  const filteredSecciones = nivelFilter
    ? secciones.filter(
        (sec) =>
          sec.grado &&
          sec.grado.nivel &&
          normalizeText(sec.grado.nivel) === normalizeText(nivelFilter)
      )
    : secciones;

  // Ordenar secciones: primero por nivel (7,8,9,10,11) y luego por número de sección
  const sortedSecciones = [...filteredSecciones].sort((a, b) => {
    const nivelA = levelOrder[normalizeText(a.grado.nivel)] || 100;
    const nivelB = levelOrder[normalizeText(b.grado.nivel)] || 100;
    if (nivelA !== nivelB) return nivelA - nivelB;
    const numA = parseInt(a.nombre_Seccion.split('-')[1], 10);
    const numB = parseInt(b.nombre_Seccion.split('-')[1], 10);
    if (numA !== numB) return numA - numB;
    return a.nombre_Seccion.localeCompare(b.nombre_Seccion);
  });

  // Cálculo de índices para paginación
  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
  const currentSecciones = sortedSecciones.slice(
    indexOfFirstSection,
    indexOfLastSection
  );
  const totalPages = Math.ceil(sortedSecciones.length / sectionsPerPage);

  // Lógica para mostrar hasta 6 botones de página a la vez
  const maxButtons = 6;
  let startPage, endPage;
  if (totalPages <= maxButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.floor(maxButtons / 2)) {
      startPage = 1;
      endPage = maxButtons;
    } else if (currentPage + Math.floor(maxButtons / 2) - 1 >= totalPages) {
      startPage = totalPages - maxButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxButtons / 2) + 1;
      endPage = startPage + maxButtons - 1;
    }
  }

  // ------------------------------------------------
  // FUNCION: Descargar PDF de la lista de estudiantes
  // ------------------------------------------------
  const handleDownloadPDF = async (seccion) => {
    try {
      // 1. Llamar al servicio que devuelve un array de estudiantes para esa sección
      const estudiantesInSection = await SeccionesService.getEstudiantesPorSeccion(
        seccion.id_Seccion
      );

      // 2. Validar que venga un arreglo con al menos un elemento
      if (!Array.isArray(estudiantesInSection)) {
        console.warn(
          'getEstudiantesPorSeccion NO devolvió un arreglo. Revisa la respuesta en el backend.'
        );
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la lista de estudiantes. Intenta nuevamente.',
          confirmButtonColor: '#2563EB',
        });
      }

      if (estudiantesInSection.length === 0) {
        return Swal.fire({
          icon: 'info',
          title: 'Sin estudiantes',
          text: `La sección "${seccion.nombre_Seccion}" no tiene estudiantes asignados.`,
          confirmButtonColor: '#2563EB',
        });
      }

      // 3. Si todo está bien, generamos el PDF
      generateStudentsListPDF(seccion.nombre_Seccion, estudiantesInSection);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar PDF',
        text: 'Ocurrió un error al intentar descargar el PDF. Intenta nuevamente.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  // -----------------------------------
  // FUNCION: Eliminar sección (con alerta)
  // -----------------------------------
  const handleDelete = async (idSeccion) => {
    try {
      // Primero, verificar si la sección tiene estudiantes
      const estudiantesInSection = await SeccionesService.getEstudiantesPorSeccion(
        idSeccion
      );
      if (Array.isArray(estudiantesInSection) && estudiantesInSection.length > 0) {
        return Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'La sección tiene estudiantes asignados.',
          confirmButtonColor: '#2563EB',
        });
      }

      // Confirmar eliminación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminará la sección.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2563EB',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
      });
      if (result.isConfirmed) {
        await SeccionesService.deleteSeccion(idSeccion);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La sección se eliminó correctamente.',
          confirmButtonColor: '#2563EB',
        });
        fetchSecciones(); // Refrescar la lista
      }
    } catch (error) {
      console.error('Error al eliminar sección:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al eliminar la sección.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  // ---------------------------------------
  // FUNCIONES PARA CREAR NUEVA SECCIÓN
  // ---------------------------------------
  const openModal = () => {
    setNewSectionName('');
    setNewSectionGradeId('');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!newSectionName.trim()) {
      return Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: `Ingrese el nombre de la sección. Ejemplo: "${exampleSectionName || '7-1'}".`,
        confirmButtonColor: '#2563EB',
      });
    }
    if (!newSectionGradeId) {
      return Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: 'Seleccione el nivel correspondiente.',
        confirmButtonColor: '#2563EB',
      });
    }

    // Verificar que el nivel exista en el arreglo levels
    const selectedLevel = levels.find(
      (level) => level.id_grado === Number(newSectionGradeId)
    );
    if (!selectedLevel) {
      return Swal.fire({
        icon: 'error',
        title: 'Nivel inválido',
        text: 'El nivel seleccionado no es válido. Seleccione uno de la lista.',
        confirmButtonColor: '#2563EB',
      });
    }

    // Validar formato (7-1, 8-2, etc.)
    const normalizedNivel = normalizeText(selectedLevel.nivel);
    const pattern = allowedPatterns[normalizedNivel];
    if (!pattern) {
      return Swal.fire({
        icon: 'error',
        title: 'Nivel no permitido',
        text: `No se pueden crear secciones en el nivel "${selectedLevel.nivel}".`,
        confirmButtonColor: '#2563EB',
      });
    }
    if (!pattern.test(newSectionName)) {
      return Swal.fire({
        icon: 'error',
        title: 'Formato incorrecto',
        text: `El nombre debe ser como "${exampleSectionName}" según el nivel "${selectedLevel.nivel}".`,
        confirmButtonColor: '#2563EB',
      });
    }

    // Validar existencia de la sección anterior: p.ej. para "7-2" debe existir "7-1"
    const match = newSectionName.match(/^(\d+)-(\d+)$/);
    if (!match) {
      return Swal.fire({
        icon: 'error',
        title: 'Formato incorrecto',
        text: `El nombre debe ser como "${exampleSectionName}".`,
        confirmButtonColor: '#2563EB',
      });
    }
    const sectionLevel = match[1];
    const sectionNumber = parseInt(match[2], 10);
    const previousSectionName = `${sectionLevel}-${sectionNumber - 1}`;
    if (sectionNumber > 1) {
      const previousExists = secciones.some(
        (sec) =>
          sec.nombre_Seccion.toLowerCase() === previousSectionName.toLowerCase()
      );
      if (!previousExists) {
        return Swal.fire({
          icon: 'error',
          title: 'Orden incorrecto',
          text: `Para crear la sección "${newSectionName}", primero debe existir "${previousSectionName}".`,
          confirmButtonColor: '#2563EB',
        });
      }
    }

    // Validar que la sección no exista ya
    const sectionExists = secciones.some(
      (sec) =>
        sec.nombre_Seccion.toLowerCase() === newSectionName.toLowerCase()
    );
    if (sectionExists) {
      return Swal.fire({
        icon: 'error',
        title: 'Sección existente',
        text: `La sección "${newSectionName}" ya existe.`,
        confirmButtonColor: '#2563EB',
      });
    }

    // Preparar payload y llamar servicio de creación
    const payload = {
      nombre_Seccion: newSectionName,
      gradoId: Number(newSectionGradeId),
    };
    try {
      await SeccionesService.create(payload);
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: `La sección "${newSectionName}" se creó correctamente.`,
        confirmButtonColor: '#2563EB',
      });
      fetchSecciones();
      closeModal();
    } catch (error) {
      console.error('Error al crear la sección:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error del sistema',
        text: 'Ocurrió un error al guardar la sección. Intenta nuevamente.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  // -----------------------
  // RENDERIZADO DEL COMPONENTE
  // -----------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando secciones...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen relative">
      <div className="container mx-auto">
        {/* Título + botón Crear Sección */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Lista de Secciones
          </h1>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Crear Sección
          </button>
        </div>

        {/* Filtro por nivel */}
        <div className="mb-4">
          <label
            htmlFor="nivelFilter"
            className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >
            Filtrar por Nivel:
          </label>
          <select
            id="nivelFilter"
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-800 dark:text-white"
          >
            <option value="">Todos los niveles</option>
            {levels.map((level, index) => (
              <option key={level.id_grado ?? index} value={level.nivel}>
                {level.nivel}
              </option>
            ))}
          </select>
        </div>

        {/* Si no hay secciones después del filtro */}
        {sortedSecciones.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No hay secciones disponibles.
          </p>
        ) : (
          <>
            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSecciones.map((seccion) => (
                <div
                  key={seccion.id_Seccion}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                >
                  <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    {seccion.nombre_Seccion}
                  </h2>
                  {seccion.grado && (
                    <p className="text-gray-700 dark:text-gray-300">
                      Nivel: {seccion.grado.nivel}
                    </p>
                  )}
                  <div className="mt-4 flex justify-between space-x-2">
                    {/* Ver Lista en UI */}
                    <Link
                      to={`/lista-estudiantes/${seccion.id_Seccion}`}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Ver Lista
                    </Link>
                    {/* Descargar PDF */}
                    <button
                      onClick={() => handleDownloadPDF(seccion)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Descargar PDF
                    </button>
                    {/* Eliminar Sección */}
                    <button
                      onClick={() => handleDelete(seccion.id_Seccion)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                  const pageNumber = startPage + idx;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition font-medium ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para crear nueva sección */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Crear Sección
            </h2>
            <form onSubmit={handleCreateSection}>
              <div className="mb-4">
                <label
                  htmlFor="sectionName"
                  className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
                >
                  Nombre de la Sección:
                </label>
                <input
                  type="text"
                  id="sectionName"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={exampleSectionName ? `Ej: "${exampleSectionName}"` : 'Ej: "7-1"'}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="sectionLevel"
                  className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
                >
                  Nivel:
                </label>
                <select
                  id="sectionLevel"
                  value={newSectionGradeId}
                  onChange={(e) => setNewSectionGradeId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione un nivel</option>
                  {levels.map((level) => (
                    <option key={level.id_grado} value={level.id_grado}>
                      {level.nivel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Secciones;
