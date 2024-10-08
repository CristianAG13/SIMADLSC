import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import UseFetchEventos from '../hooks/UseFetchEventos';

const Eventos = () => {
  const { data: eventos, loading, error } = UseFetchEventos('all');

  // Función para agregar eventos al calendario
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = eventos.filter(
        (evento) =>
          new Date(evento.fecha_Evento).toDateString() === date.toDateString()
      );
      return (
        <ul className="mt-1">
          {dayEvents.map((evento) => (
            <li key={evento.id_Evento} className="text-xs text-blue-500">
              {evento.nombre_Evento}
            </li>
          ))}
        </ul>
      );
    }
  };

  if (loading) return <div className="p-6">Cargando eventos...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Calendario de Eventos</h1>
        <Link
          to="/create-evento"
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          Crear Evento
        </Link>
      </div>
      <Calendar
        tileContent={tileContent}
        className="shadow-lg rounded-lg p-4 bg-white"
      />
    </div>
  );
};

export default Eventos;
