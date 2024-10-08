// src/SIMAD/PaginaAdministrativa/pages/Horarios/Vistas/ListaHorarios.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioHorario from '../Formularios/FormularioHorarioEstudiante';

const ListaHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [aulas, setAulas] = useState([]);

  const obtenerHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/horarios');
      setHorarios(response.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al obtener horarios:', err);
      setError('No se pudieron obtener los horarios.');
      setCargando(false);
    }
  };

  const obtenerMaterias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/materias');
      setMaterias(response.data);
    } catch (err) {
      console.error('Error al obtener materias:', err);
    }
  };

  const obtenerProfesores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/profesores');
      setProfesores(response.data);
    } catch (err) {
      console.error('Error al obtener profesores:', err);
    }
  };

  const obtenerAulas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/aulas');
      setAulas(response.data);
    } catch (err) {
      console.error('Error al obtener aulas:', err);
    }
  };

  useEffect(() => {
    obtenerHorarios();
    obtenerMaterias();
    obtenerProfesores();
    obtenerAulas();
  }, []);

  const eliminarHorario = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este horario?');

    if (!confirmacion) return;

    try {
      // Realiza la petición DELETE con el ID correcto
      await axios.delete(`http://localhost:3000/horarios/${id}`);

      // Elimina el horario de la lista localmente
      setHorarios(horarios.filter((horario) => horario.id_Horario !== id));

      alert('Horario eliminado exitosamente.');
    } catch (err) {
      console.error('Error al eliminar horario:', err);
      alert('Hubo un error al eliminar el horario.');
    }
  };

  const abrirModalEditar = (horario) => {
    setHorarioSeleccionado(horario);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setHorarioSeleccionado(null);
    setModalAbierto(false);
  };

  const actualizarHorarioEnLista = (horarioEditado) => {
    setHorarios(
      horarios.map((horario) => (horario.id_Horario === horarioEditado.id_Horario ? horarioEditado : horario))
    );
  };

  if (cargando) {
    return <p>Cargando horarios...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
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
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Sección</th>
                <th className="py-2 px-4 border-b">Materia</th>
                <th className="py-2 px-4 border-b">Profesor/Estudiante</th>
                <th className="py-2 px-4 border-b">Día</th>
                <th className="py-2 px-4 border-b">Hora Inicio</th>
                <th className="py-2 px-4 border-b">Hora Fin</th>
                <th className="py-2 px-4 border-b">Aula</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <tr key={horario.id_Horario} className="text-center">
                  <td className="py-2 px-4 border-b">{horario.id_Horario}</td>
                  <td className="py-2 px-4 border-b">{horario.seccion.nombre_Seccion}</td>
                  <td className="py-2 px-4 border-b">{horario.materia.nombre_Materia}</td>
                  <td className="py-2 px-4 border-b">
                    {horario.nombre_profesor
                      ? `${horario.nombre_profesor} ${horario.apellido_profesor}`
                      : `${horario.nombre_estudiante} ${horario.apellido_estudiante}`}
                  </td>
                  <td className="py-2 px-4 border-b">{horario.dia_semana_Horario}</td>
                  <td className="py-2 px-4 border-b">{horario.hora_inicio_Horario}</td>
                  <td className="py-2 px-4 border-b">{horario.hora_fin_Horario}</td>
                  <td className="py-2 px-4 border-b">{horario.aula.nombre_Aula}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      onClick={() => abrirModalEditar(horario)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => eliminarHorario(horario.id_Horario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
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
            className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 overflow-y-auto max-h-full"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro
          >
            <FormularioHorario
              onSubmitSuccess={actualizarHorarioEnLista}
              horarioInicial={horarioSeleccionado}
              materias={materias}
              profesores={profesores}
              aulas={aulas}
            />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={cerrarModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaHorarios;
