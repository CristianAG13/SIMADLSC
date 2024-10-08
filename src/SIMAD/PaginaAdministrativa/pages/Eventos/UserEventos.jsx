import React from 'react';
import { Link } from 'react-router-dom';
import UseFetchEventos from '../hooks/UseFetchEventos';
import EventosService from '../services/EventosService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-tailwind/tailwind.css'; // Opcional: si instalaste el tema

const UserEventos = () => {
  const { data: eventos, loading, error } = UseFetchEventos('user');

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
        // Actualiza la lista de eventos sin recargar la página
        window.location.reload();
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

  if (loading) return <div className="p-6">Cargando tus solicitudes...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Solicitudes de Eventos</h1>
      {eventos.length === 0 ? (
        <p>No tienes solicitudes de eventos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id_Evento} className="hover:bg-gray-100 transition">
                  <td className="border-t border-gray-200 px-6 py-4">{evento.nombre_Evento}</td>
                  <td className="border-t border-gray-200 px-6 py-4">{evento.fecha_Evento}</td>
                  <td className="border-t border-gray-200 px-6 py-4">{evento.estado_Evento.nombre_estado_evento}</td>
                  <td className="border-t border-gray-200 px-6 py-4 flex space-x-4">
                    <Link to={`/user-eventos/${evento.id_Evento}`} className="text-blue-600 hover:underline">
                      Ver Info
                    </Link>
                    <Link to={`/user-eventos/edit/${evento.id_Evento}`} className="text-yellow-500 hover:underline">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(evento.id_Evento)}
                      className="text-red-500 hover:underline"
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
    </div>
  );
};

export default UserEventos;
