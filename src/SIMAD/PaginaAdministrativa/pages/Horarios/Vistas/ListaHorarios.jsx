import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormularioHorarioEstudiante from '../Formularios/FormularioHorarioEstudiante';
import PropTypes from 'prop-types';

// URL base de la API
const API_BASE_URL =
   import.meta.env.NODE_ENV === 'production'
    ? 'https://simadlsc-backend-production.up.railway.app'
    : 'http://localhost:3000';

// Función utilitaria para formatear hora de 24 horas a 12 horas con AM/PM
const formatearHora12 = (hora24) => {
  const [hora, minutos] = hora24.split(':').map(Number);
  const periodo = hora >= 12 ? 'PM' : 'AM';
  const hora12 = hora % 12 === 0 ? 12 : hora % 12;
  return `${hora12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
};

// Mapeo para ordenar los días de la semana
const ordenDias = {
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
};

const ListaHorarios = ({ horarios, onEditHorario, setHorarios, materias, profesores, aulas, secciones }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [detallesAbiertos, setDetallesAbiertos] = useState({}); // Para manejar detalles por fila

  // Función para eliminar un horario
  const eliminarHorario = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este horario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/horarios/${id}`);
        setHorarios(horarios.filter((horario) => horario.id_Horario !== id));
        Swal.fire('¡Eliminado!', 'El horario ha sido eliminado exitosamente.', 'success');
      } catch (err) {
        console.error('Error al eliminar horario:', err);
        Swal.fire('Error', 'Hubo un error al eliminar el horario.', 'error');
      }
    }
  };

  // Función para abrir el modal de edición
  const abrirModalEditar = async (horarioId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/horarios/${horarioId}`);
      setHorarioSeleccionado(response.data);
      setModalAbierto(true);
    } catch (error) {
      console.error('Error al obtener el horario:', error);
      Swal.fire('Error', 'No se pudo obtener el horario para editar.', 'error');
    }
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setHorarioSeleccionado(null);
    setModalAbierto(false);
  };

  // Función para actualizar el horario en la lista después de editar
  const actualizarHorarioEnLista = (horarioEditado) => {
    setHorarios(
      horarios.map((horario) =>
        horario.id_Horario === horarioEditado.id_Horario ? horarioEditado : horario
      )
    );
    Swal.fire('Actualizado', 'El horario ha sido actualizado exitosamente.', 'success');
    cerrarModal();
  };

  // Función para abrir y cerrar los detalles por fila
  const toggleDetalles = (id) => {
    setDetallesAbiertos((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Manejo del caso en que no hay horarios
  if (!horarios) {
    return <p>No hay horarios disponibles.</p>;
  }

  // Ordenar los horarios de lunes a viernes usando useMemo para optimizar el rendimiento
  const horariosOrdenados = useMemo(() => {
    return [...horarios].sort((a, b) => {
      const ordenA = ordenDias[a.dia_semana_Horario] || 8; // Asignar un valor alto si no está en el mapeo
      const ordenB = ordenDias[b.dia_semana_Horario] || 8;
      if (ordenA !== ordenB) {
        return ordenA - ordenB;
      } else {
        // Si están en el mismo día, ordenar por hora de inicio
        return a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario);
      }
    });
  }, [horarios]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
    <h2 className="text-2xl font-semibold mb-4">Lista de Horarios</h2>
  
    {horariosOrdenados.length === 0 ? (
      <p>No hay horarios creados.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Sección</th>
              <th className="py-2 px-4 border-b">Profesor</th>
              <th className="py-2 px-4 border-b">Materia</th>
              <th className="py-2 px-4 border-b">Día</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horariosOrdenados.map((horario) => (
              <React.Fragment key={horario.id_Horario}>
                <tr className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="py-2 px-4 border-b">{horario.seccion?.nombre_Seccion || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    {horario.profesor
                      ? `${horario.profesor.nombre_Profesor} ${horario.profesor.apellido1_Profesor} ${horario.profesor.apellido2_Profesor}`
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">{horario.materia?.nombre_Materia || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{horario.dia_semana_Horario}</td>
                  <td className="py-2 px-4 border-b flex justify-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => {
                        if (modalAbierto) {
                          Swal.fire(
                            'Edición en curso',
                            'Ya tienes una lección en edición. Cierra la edición actual para continuar.',
                            'info'
                          );
                          return;
                        }
                        onEditHorario(horario);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => eliminarHorario(horario.id_Horario)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => toggleDetalles(horario.id_Horario)}
                    >
                      {detallesAbiertos[horario.id_Horario] ? 'Ocultar' : 'Ver Más'}
                    </button>
                  </td>
                </tr>
  
                {detallesAbiertos[horario.id_Horario] && (
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <td colSpan="5" className="py-2 px-4">
                      <div className="flex flex-col md:flex-row md:space-x-6">
                        <div className="mb-2 md:mb-0">
                          <p>
                            <strong>Hora de Inicio:</strong> {formatearHora12(horario.hora_inicio_Horario)}
                          </p>
                          <p>
                            <strong>Hora de Fin:</strong> {formatearHora12(horario.hora_fin_Horario)}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Aula:</strong> {horario.aula?.nombre_Aula || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )}
  
    {/* Modal para editar horario */}
    {modalAbierto && horarioSeleccionado && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={cerrarModal}
      >
        <div
          className="bg-white dark:bg-gray-900 p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-full overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl"
            onClick={cerrarModal}
          >
            &times;
          </button>
          <FormularioHorarioEstudiante
            onSubmitSuccess={actualizarHorarioEnLista}
            onCancel={cerrarModal}
            initialData={horarioSeleccionado}
            materias={materias}
            profesores={profesores}
            aulas={aulas}
            secciones={secciones}
          />
        </div>
      </div>
    )}
  </div>  
  );
};

ListaHorarios.propTypes = {
  horarios: PropTypes.array.isRequired,
  onEditHorario: PropTypes.func.isRequired,
  setHorarios: PropTypes.func.isRequired,
  materias: PropTypes.array.isRequired,
  profesores: PropTypes.array.isRequired,
  aulas: PropTypes.array.isRequired,
  secciones: PropTypes.array.isRequired,
};

export default ListaHorarios;
