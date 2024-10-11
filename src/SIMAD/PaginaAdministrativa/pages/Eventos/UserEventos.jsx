import React from 'react';
import { Link } from 'react-router-dom';
import UseFetchEventos from './Hook/UseFetchEventos';
import EventosService from './Service/EventosService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import { FaInfoCircle, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const UserEventos = () => {
  const { data: eventos, setData, loading, error } = UseFetchEventos('Aprobado');

  const handleEventoClick = (evento) => {
    Swal.fire({
      title: evento.nombre_Evento,
      html: `
        <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${new Date(evento.fecha_Evento).toLocaleDateString()}</p>
        <p><strong>Hora de Inicio:</strong> ${evento.hora_inicio_Evento || 'No especificado'}</p>
        <p><strong>Hora de Fin:</strong> ${evento.hora_fin_Evento || 'No especificado'}</p>
        <p><strong>Dirigido A:</strong> ${evento.dirigidoA?.nombre || 'No especificado'}</p>
        <p><strong>Estado:</strong> ${evento.estadoEvento?.nombre || 'No especificado'}</p>
        <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento?.nombre || 'No especificado'}</p>
        <p><strong>Ubicación:</strong> ${evento.ubicacion?.nombre || 'No especificado'}</p>
      `,
      icon: 'info',
      confirmButtonColor: '#2563EB', // Tailwind azul-600
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444', // Tailwind rojo-500
      cancelButtonColor: '#2563EB', // Tailwind azul-600
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEvento(id);
      }
    });
  };

  const deleteEvento = async (id) => {
    try {
      await EventosService.deleteEvento(id);
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'Tu solicitud de evento ha sido eliminada.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        setData((prevEventos) => prevEventos.filter((evento) => evento.id_Evento !== id));
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar el evento',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  React.useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        confirmButtonColor: '#2563EB',
      });
    }
  }, [error]);

  if (loading)
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando tus solicitudes...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Solicitudes de Eventos</h1>
        <Link
          to="/crear-evento"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          title="Crear Nuevo Evento"
        >
          <FaPlus className="mr-2" />
          Crear Evento
        </Link>
      </div>

      {eventos.length === 0 ? (
        <p className="text-gray-600">No tienes solicitudes de eventos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eventos.map((evento, index) => (
                <tr
                  key={evento.id_Evento}
                  className={`hover:bg-gray-100 transition ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{evento.nombre_Evento}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(evento.fecha_Evento).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      {evento.estadoEvento.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-4">
                    <button
                      onClick={() => handleEventoClick(evento)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      title="Ver Información"
                    >
                      <FaInfoCircle className="mr-1" />
                      Ver Info
                    </button>
                    <Link
  to={`/eventos-edit/${evento.id_Evento}`} // Enlace a la vista de edición con el ID del evento
  className="flex items-center text-yellow-500 hover:text-yellow-700"
  title="Editar Evento"
>
  <FaEdit className="mr-1" />
  Editar
</Link>

                    <button
                      onClick={() => handleDelete(evento.id_Evento)}
                      className="flex items-center text-red-500 hover:text-red-700"
                      title="Eliminar Evento"
                    >
                      <FaTrash className="mr-1" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserEventos;
