
// src/components/EventosList.jsx
import { Link } from 'react-router-dom';

const GestionEventos = () => {
  const eventos = [
    {
      id_Evento: 1,
      nombre_Evento: 'Evento de Bienvenida',
      fecha_Evento: '2024-01-10',
      estado_Evento: { nombre_estado_evento: 'Aprobado' },
    },
    {
      id_Evento: 2,
      nombre_Evento: 'Taller de Programación',
      fecha_Evento: '2024-01-15',
      estado_Evento: { nombre_estado_evento: 'Pendiente' },
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Gestión de Eventos</h1>
      <Link
        to="/create-evento"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4 inline-block shadow-lg hover:bg-blue-700 transition"
      >
        Crear Evento
      </Link>
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
              <td className="border-t border-gray-200 px-6 py-4">
                <Link to={`/eventos/${evento.id_Evento}`} className="text-blue-600 hover:underline">Ver Detalles</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionEventos;
