// src/components/Eventos.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import UseFetchEventos from './Hook/UseFetchEventos';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const Eventos = () => {
  const { data: eventos, loading, error } = UseFetchEventos('Aprobado'); // Cambiado de 'all' a 'Aprobado'

  // Función para manejar el clic en un evento
  const handleEventoClick = (evento) => {
    Swal.fire({
      title: evento.nombre_Evento,
      html: `
        <p><strong>Descripción:</strong> ${evento.descripcion_Evento || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${new Date(evento.fecha_Evento).toLocaleDateString()}</p>
        <p><strong>Hora de Inicio:</strong> ${evento.hora_inicio_Evento}</p>
        <p><strong>Hora de Fin:</strong> ${evento.hora_fin_Evento}</p>
        <p><strong>Dirigido A:</strong> ${evento.dirigidoA.nombre}</p>
        <p><strong>Estado:</strong> ${evento.estadoEvento.nombre}</p>
        <p><strong>Tipo de Evento:</strong> ${evento.tipoEvento.nombre}</p>
        <p><strong>Ubicación:</strong> ${evento.ubicacion.nombre}</p>
      `,
      icon: 'info',
      confirmButtonColor: '#2563EB', // Tailwind azul-600
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
        <p className="text-xl text-gray-700">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Eventos Aprobados</h1>
        <Link
          to="/user-eventos"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          Mis solicitudes de eventos
        </Link>
        <Link
          to="/crear-eventos"
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          Crear Evento
        </Link>
      </div>
      {eventos.length === 0 ? (
        <p className="text-gray-600">No hay eventos aprobados disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {eventos.map((evento) => (
            <li
              key={evento.id_Evento}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition"
              onClick={() => handleEventoClick(evento)}
              onTouchStart={() => handleEventoClick(evento)} // Para dispositivos táctiles
            >
              <h2 className="text-xl font-semibold text-blue-600">{evento.nombre_Evento}</h2>
              <p className="text-gray-600">
                Fecha: {new Date(evento.fecha_Evento).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Hora: {evento.hora_inicio_Evento} - {evento.hora_fin_Evento}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {evento.tipoEvento.nombre}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {evento.estadoEvento.nombre}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  {evento.ubicacion.nombre}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Eventos;
