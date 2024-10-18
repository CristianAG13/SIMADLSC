import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import UseFetchEventos from './Hook/UseFetchEventos';
import EventosService from './Service/EventosService';

const EventosEdit = () => {
  const { id } = useParams(); // Obtenemos el id del evento desde la URL
  const navigate = useNavigate();
  const { 
    ubicaciones, 
    loadingUbicaciones, 
    errorUbicaciones,
    tiposEventos,
    loadingTiposEventos,
    errorTiposEventos
  } = UseFetchEventos();

  const [formData, setFormData] = useState({
    nombre_Evento: '',
    descripcion_Evento: '',
    fecha_Evento: '',
    hora_inicio_Evento: '',
    hora_fin_Evento: '',
    id_dirigido_a: '',
    ubicacion: '',
    tipo_evento: '',   
  });

  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del evento actual
  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await EventosService.getEventoById(id);
        const eventoData = response.data;
        setFormData({
          nombre_Evento: eventoData.nombre_Evento,
          descripcion_Evento: eventoData.descripcion_Evento,
          fecha_Evento: eventoData.fecha_Evento.split('T')[0], // Formato de fecha YYYY-MM-DD
          hora_inicio_Evento: eventoData.hora_inicio_Evento,
          hora_fin_Evento: eventoData.hora_fin_Evento,
          id_dirigido_a: eventoData.id_dirigido_a,
          ubicacion: eventoData.id_ubicacion,
          tipo_evento: eventoData.id_tipo_evento,
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el evento. Inténtalo de nuevo.',
          confirmButtonColor: '#2563EB',
        });
      }
    };
    fetchEvento();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.ubicacion || !formData.tipo_evento) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona una ubicación y un tipo de evento.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    // Validación de fechas
    const fechaEvento = formData.fecha_Evento;
    const horaInicio = formData.hora_inicio_Evento;
    const horaFin = formData.hora_fin_Evento;

    const fechaInicio = new Date(`${fechaEvento}T${horaInicio}`);
    const fechaFinObj = new Date(`${fechaEvento}T${horaFin}`);

    if (fechaFinObj <= fechaInicio) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La hora de fin debe ser posterior a la hora de inicio.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        nombre_Evento: formData.nombre_Evento,
        descripcion_Evento: formData.descripcion_Evento,
        fecha_Evento: fechaEvento,
        hora_inicio_Evento: horaInicio,
        hora_fin_Evento: horaFin,
        id_dirigido_a: parseInt(formData.id_dirigido_a, 10),
        id_ubicacion: parseInt(formData.ubicacion, 10),
        id_tipo_evento: parseInt(formData.tipo_evento, 10),
      };

      await EventosService.updateEvento(id, payload);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Evento actualizado exitosamente.',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate('/user-eventos');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al actualizar evento',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Evento</h2>

        {/* Campo de Nombre del Evento */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nombre del Evento</label>
          <input
            type="text"
            name="nombre_Evento"
            value={formData.nombre_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Campo de Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            name="descripcion_Evento"
            value={formData.descripcion_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Campo de Fecha del Evento */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Fecha del Evento</label>
          <input
            type="date"
            name="fecha_Evento"
            value={formData.fecha_Evento}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Campos de Hora de Inicio y Fin */}
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Hora de Inicio</label>
            <input
              type="time"
              name="hora_inicio_Evento"
              value={formData.hora_inicio_Evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Hora de Fin</label>
            <input
              type="time"
              name="hora_fin_Evento"
              value={formData.hora_fin_Evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        {/* Campo de Dirigido a */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Dirigido a</label>
          <select
            name="id_dirigido_a"
            value={formData.id_dirigido_a}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Selecciona un público</option>
            <option value="1">Estudiantes</option>
            <option value="2">Público en General</option>
            {/* Agrega más opciones según tus necesidades */}
          </select>
        </div>

        {/* Campo de Ubicación */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Ubicación</label>
          {loadingUbicaciones ? (
            <p>Cargando ubicaciones...</p>
          ) : errorUbicaciones ? (
            <p className="text-red-500">Error al cargar ubicaciones.</p>
          ) : (
            <select
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona una ubicación</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Campo de Tipo de Evento */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Tipo de Evento</label>
          {loadingTiposEventos ? (
            <p>Cargando tipos de eventos...</p>
          ) : errorTiposEventos ? (
            <p className="text-red-500">Error al cargar tipos de eventos.</p>
          ) : (
            <select
              name="tipo_evento"
              value={formData.tipo_evento}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona un tipo de evento</option>
              {tiposEventos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Evento'}
        </button>
      </form>
    </div>
  );
};

export default EventosEdit;
