import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormularioHorarioEstudiante from '../Formularios/FormularioHorarioEstudiante';
import PropTypes from 'prop-types';

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
        await axios.delete(`http://localhost:3000/horarios/${id}`);
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
      const response = await axios.get(`http://localhost:3000/horarios/${horarioId}`);
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

  // Función para actualizar el horario en la lista
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

  // Si no hay horarios, mostrar un mensaje
  if (!horarios) {
    return <p>No hay horarios disponibles.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lista de Horarios</h2>
      {horarios.length === 0 ? (
        <p>No hay horarios creados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Sección</th>
                <th className="py-2 px-4 border-b">Materia</th>
                <th className="py-2 px-4 border-b">Profesor</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <React.Fragment key={horario.id_Horario}>
                  <tr className="text-center">
                    <td className="py-2 px-4 border-b">{horario.seccion?.nombre_Seccion || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{horario.materia?.nombre_Materia || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {horario.profesor
                        ? `${horario.profesor.nombre_Profesor} ${horario.profesor.apellido1_Profesor} ${horario.profesor.apellido2_Profesor}`
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b flex justify-center space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        onClick={() => abrirModalEditar(horario.id_Horario)}
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
                        {detallesAbiertos[horario.id_Horario] ? 'Ocultar' : 'Ver Más Detalles'}
                      </button>
                    </td>
                  </tr>
                  {/* Fila de detalles */}
                  {detallesAbiertos[horario.id_Horario] && (
                    <tr className="bg-gray-100">
                      <td colSpan="5" className="py-2 px-4">
                        <div>
                          <p>
                            <strong>Día de la Semana:</strong> {horario.dia_semana_Horario}
                          </p>
                          <p>
                            <strong>Hora de Inicio:</strong> {horario.hora_inicio_Horario}
                          </p>
                          <p>
                            <strong>Hora de Fin:</strong> {horario.hora_fin_Horario}
                          </p>
                          <p>
                            <strong>Aula:</strong> {horario.aula?.nombre_Aula || 'N/A'}
                          </p>
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
            className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 overflow-y-auto max-h-full relative"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
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
