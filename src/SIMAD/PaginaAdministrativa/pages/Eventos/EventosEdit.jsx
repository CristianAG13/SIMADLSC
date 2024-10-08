import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventosService from '../services/EventosService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-tailwind/tailwind.css'; // Opcional: si instalaste el tema

const EventoEdit = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState({
    nombre_Evento: '',
    descripcion_Evento: '',
    fecha_Evento: '',
    hora_inicio_Evento: '',
    hora_fin_Evento: '',
    id_dirigido_a: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const data = await EventosService.getEventoById(id);
        setEvento({
          nombre_Evento: data.nombre_Evento,
          descripcion_Evento: data.descripcion_Evento,
          fecha_Evento: data.fecha_Evento,
          hora_inicio_Evento: data.hora_inicio_Evento,
          hora_fin_Evento: data.hora_fin_Evento,
          id_dirigido_a: data.id_dirigido_a,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener evento');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EventosService.updateEvento(id, evento);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Evento actualizado exitosamente.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        navigate('/user-eventos'); // Redirige a la vista de solicitudes del usuario
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al actualizar evento',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Evento</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nombre del Evento</label>
          <input
            type="text"
            name="nombre_Evento"
            value={evento.nombre_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            name="descripcion_Evento"
            value={evento.descripcion_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Fecha del Evento</label>
          <input
            type="date"
            name="fecha_Evento"
            value={evento.fecha_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Hora de Inicio</label>
            <input
              type="time"
              name="hora_inicio_Evento"
              value={evento.hora_inicio_Evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Hora de Fin</label>
            <input
              type="time"
              name="hora_fin_Evento"
              value={evento.hora_fin_Evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Dirigido a</label>
          <select
            name="id_dirigido_a"
            value={evento.id_dirigido_a}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          >
            <option value="">Selecciona un público</option>
            <option value="1">Estudiantes</option>
            <option value="2">Público en General</option>
            {/* Agrega más opciones según tus necesidades */}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
        >
          Actualizar Evento
        </button>
      </form>
    </div>
  );
};

export default EventoEdit;
