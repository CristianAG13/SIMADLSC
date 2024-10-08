// src/components/EventoDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventosService from '../services/EventosService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-tailwind/tailwind.css'; // Opcional: si instalaste el tema

const EventoDetails = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const data = await EventosService.getEventoById(id);
        setEvento(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener detalles del evento');
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [id]);

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

  if (loading) return <div className="p-6">Cargando detalles del evento...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!evento) return <div className="p-6">Evento no encontrado.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{evento.nombre_Evento}</h2>
        <p className="mb-2"><strong>Descripción:</strong> {evento.descripcion_Evento}</p>
        <p className="mb-2"><strong>Fecha:</strong> {evento.fecha_Evento}</p>
        <p className="mb-2"><strong>Hora de Inicio:</strong> {evento.hora_inicio_Evento}</p>
        <p className="mb-2"><strong>Hora de Fin:</strong> {evento.hora_fin_Evento}</p>
        <p className="mb-2"><strong>Dirigido a:</strong> {evento.dirigido_a_Evento.nombre_dirigido_a}</p>
        <p className="mb-4"><strong>Estado:</strong> {evento.estado_Evento.nombre_estado_evento}</p>
        <Link to="/user-eventos" className="text-blue-500 hover:underline">
          Volver a Mis Solicitudes
        </Link>
      </div>
    </div>
  );
};

export default EventoDetails;
