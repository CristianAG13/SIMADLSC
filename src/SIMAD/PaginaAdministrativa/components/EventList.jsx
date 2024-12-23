// src/components/EventList.jsx

import  { useEffect, useState } from 'react';
import UseFetchEventos from '../pages/Eventos/Hook/UseFetchEventos';

export const EventList = () => {
  const { data: eventos, loading, error } = UseFetchEventos();
  const [approvedEvents, setApprovedEvents] = useState([]);

  useEffect(() => {
    if (eventos) {
      const filteredApprovedEvents = eventos.filter(
        (evento) => evento.estadoEvento?.nombre.toLowerCase() === 'aprobado'
      );
      setApprovedEvents(filteredApprovedEvents);
    }
  }, [eventos]);

  // Función para formatear la hora al formato HH:MM
  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';

    // Divide la cadena por los dos puntos
    const parts = timeStr.split(':');

    // Verifica que al menos tenga horas y minutos
    if (parts.length < 2) return timeStr;

    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  if (loading) {
    return <p className="text-center">Cargando eventos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error al cargar los eventos.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Próximos eventos</h2>
      {approvedEvents.length === 0 ? (
        <p className="text-center text-gray-500">No hay eventos aprobados por ahora.</p>
      ) : (
        <ul>
          {approvedEvents.map((event) => (
            <li key={event.id_Evento} className="mb-2 p-4 border rounded shadow-sm">
              <h3 className="text-xl font-semibold">{event.nombre_Evento}</h3>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(event.fecha_Evento).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Hora de Inicio: {formatTime(event.hora_inicio_Evento)} - Hora de Fin: {formatTime(event.hora_fin_Evento)}
              </p>
              <p className="text-sm text-gray-500">
                Dirigido a: {event.dirigidoA?.nombre || 'Público no especificado'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
