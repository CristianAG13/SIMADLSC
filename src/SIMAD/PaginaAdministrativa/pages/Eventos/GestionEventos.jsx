import { useState, useEffect } from 'react';
import EventosService from './Service/EventosService';
import UseFetchEventos from './Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const GestionEventos = () => {
  const { data: eventos, setData, loading, error } = UseFetchEventos();
  const [filters, setFilters] = useState({
    estado: '',
    dirigido_a: '',
    fecha: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas aprobar este evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Sí, aprobar',
    }).then((result) => {
      if (result.isConfirmed) {
        approveEvento(id);
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas rechazar este evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#2563EB',
      confirmButtonText: 'Sí, rechazar',
    }).then((result) => {
      if (result.isConfirmed) {
        rejectEvento(id);
      }
    });
  };

  const approveEvento = async (id) => {
    try {
      await EventosService.approveEvento(id);
      Swal.fire({
        icon: 'success',
        title: 'Aprobado',
        text: 'El evento ha sido aprobado.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        setData((prevEventos) =>
          prevEventos.map((evento) =>
            evento.id_Evento === id
              ? { ...evento, estadoEvento: { nombre: 'Aprobado' } }
              : evento
          )
        );
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al aprobar el evento',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const rejectEvento = async (id) => {
    try {
      await EventosService.rejectEvento(id);
      Swal.fire({
        icon: 'success',
        title: 'Rechazado',
        text: 'El evento ha sido rechazado.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        setData((prevEventos) =>
          prevEventos.map((evento) =>
            evento.id_Evento === id
              ? { ...evento, estadoEvento: { nombre: 'Rechazado' } }
              : evento
          )
        );
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al rechazar el evento',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleViewInfo = (evento) => {
    Swal.fire({
      title: evento.nombre_Evento,
      html: `
        <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${new Date(evento.fecha_Evento).toLocaleDateString()}</p>
        <p><strong>Hora de Inicio:</strong> ${evento.hora_inicio_Evento}</p>
        <p><strong>Hora de Fin:</strong> ${evento.hora_fin_Evento}</p>
        <p><strong>Dirigido A:</strong> ${evento.dirigidoA?.nombre || 'Sin Público'}</p>
        <p><strong>Estado:</strong> ${evento.estadoEvento?.nombre || 'Sin Estado'}</p>
        <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento?.nombre || 'Sin Tipo'}</p>
        <p><strong>Ubicación:</strong> ${evento.ubicacion?.nombre || 'Sin Ubicación'}</p>
      `,
      icon: 'info',
      confirmButtonColor: '#2563EB',
    });
  };

  const filteredEventos = eventos.filter((evento) => {
    const matchesEstado = filters.estado
      ? evento.estadoEvento?.nombre.trim().toLowerCase() === filters.estado.trim().toLowerCase()
      : true;
    const matchesDirigidoA = filters.dirigido_a
      ? evento.dirigidoA?.nombre.trim().toLowerCase() === filters.dirigido_a.trim().toLowerCase()
      : true;
    const matchesFecha = filters.fecha
      ? new Date(evento.fecha_Evento).toISOString().split('T')[0] === filters.fecha
      : true;
    return matchesEstado && matchesDirigidoA && matchesFecha;
  });

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        confirmButtonColor: '#2563EB',
      });
    }
  }, [error]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Eventos</h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="estado"
          value={filters.estado}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los Estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
        </select>
        <select
          name="dirigido_a"
          value={filters.dirigido_a}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los Públicos</option>
          <option value="Estudiantes">Estudiantes</option>
          <option value="Público en General">Público en General</option>
        </select>
        <input
          type="date"
          name="fecha"
          value={filters.fecha}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center">Cargando eventos...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : filteredEventos.length === 0 ? (
        <div className="text-center">No hay eventos que coincidan con los filtros.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Dirigido a</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEventos.map((evento) => (
                <tr key={evento.id_Evento} className="hover:bg-gray-100 transition">
                  <td className="border-t border-gray-200 px-6 py-4">{evento.nombre_Evento}</td>
                  <td className="border-t border-gray-200 px-6 py-4">
                    {new Date(evento.fecha_Evento).toLocaleDateString()}
                  </td>
                  <td className="border-t border-gray-200 px-6 py-4">
                    {evento.dirigidoA?.nombre || 'Sin Público'}
                  </td>
                  <td className="border-t border-gray-200 px-6 py-4">
                    {evento.estadoEvento?.nombre || 'Sin Estado'}
                  </td>
                  <td className="border-t border-gray-200 px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleViewInfo(evento)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Ver Información
                    </button>
                    {evento.estadoEvento?.nombre.trim().toLowerCase() === 'pendiente' && (
                      <>
                        <button
                          onClick={() => handleApprove(evento.id_Evento)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(evento.id_Evento)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
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

export default GestionEventos;
