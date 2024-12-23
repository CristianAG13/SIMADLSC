// src/CrearEventos.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import UseFetchEventos from './Hook/UseFetchEventos';
import EventosService from './Service/EventosService';

const CrearEventos = () => {
  const { 
    ubicaciones, 
    loadingUbicaciones, 
    errorUbicaciones,
    tiposEventos,
    loadingTiposEventos,
    errorTiposEventos,
    estadosEventos,
    loadingEstadosEventos,
    errorEstadosEventos,
    dirigidosA, // Añadido
    loadingDirigidosA, // Añadido
    errorDirigidosA, // Añadido
  } = UseFetchEventos();

  // Función para obtener la fecha en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para obtener la fecha mínima (hoy + 3 días)
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, '0');
    const day = String(minDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    nombre_Evento: '',
    descripcion_Evento: '',
    fecha_Evento: getTodayDate(), // Establece la fecha actual como valor inicial
    hora_inicio_Evento: '',
    hora_fin_Evento: '',
    id_dirigido_a: '',
    ubicacion: '',
    tipo_evento: '',   
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para verificar si la fecha es al menos 3 días en el futuro
  const isAtLeastThreeDaysAhead = (fecha) => {
    const selectedDate = new Date(fecha);
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 3);

    // Comparar solo fechas, sin considerar la hora
    selectedDate.setHours(0,0,0,0);
    minDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    return selectedDate >= minDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el nombre del evento no esté vacío
    if (!formData.nombre_Evento.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El nombre del evento no puede estar vacío.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    // Validar que se hayan seleccionado Ubicación y Tipo de Evento
    if (!formData.ubicacion || !formData.tipo_evento) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona una ubicación y un tipo de evento.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    // Validar que fecha_Evento, hora_inicio_Evento y hora_fin_Evento estén completos
    if (!formData.fecha_Evento || !formData.hora_inicio_Evento || !formData.hora_fin_Evento) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, completa la fecha y las horas del evento.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    // Validar que la fecha sea al menos 3 días en el futuro
    if (!isAtLeastThreeDaysAhead(formData.fecha_Evento)) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El evento debe ser reservado con al menos 3 días de anticipación.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    // Validar que los estados de eventos se hayan cargado correctamente
    if (loadingEstadosEventos) {
      Swal.fire({
        icon: 'info',
        title: 'Cargando...',
        text: 'Por favor, espera mientras se cargan los estados del evento.',
        showConfirmButton: false,
      });
      return;
    }

    if (errorEstadosEventos) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los estados del evento.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    if (loadingDirigidosA) { // Añadido para manejar carga de "Dirigido a"
      Swal.fire({
        icon: 'info',
        title: 'Cargando...',
        text: 'Por favor, espera mientras se cargan los públicos.',
        showConfirmButton: false,
      });
      return;
    }

    if (errorDirigidosA) { // Añadido para manejar errores de "Dirigido a"
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los públicos.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Validar que se haya seleccionado "Dirigido a"
    if (!formData.id_dirigido_a) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona a quién está dirigido el evento.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    // Encontrar el ID del estado 'pendiente'
    const estadoPendiente = estadosEventos.find(
      (estado) => estado.nombre.toLowerCase() === 'pendiente'
    );

    if (!estadoPendiente) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el estado "pendiente".',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Convertir fecha y hora a formatos adecuados
    const fechaEvento = formData.fecha_Evento; // "YYYY-MM-DD"
    const horaInicio = formData.hora_inicio_Evento; // "HH:mm:ss"
    const horaFin = formData.hora_fin_Evento; // "HH:mm:ss"

    // Verificar que las horas sean válidas
    const fechaInicio = new Date(`${fechaEvento}T${horaInicio}`);
    const fechaFinObj = new Date(`${fechaEvento}T${horaFin}`);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFinObj.getTime())) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Fecha u hora inválida.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Asegurarse que la hora de fin sea después de la hora de inicio
    if (fechaFinObj <= fechaInicio) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La hora de fin debe ser posterior a la hora de inicio.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Eliminada la validación de solapamiento

    setIsLoading(true);
    try {
      const payload = {
        nombre_Evento: formData.nombre_Evento.trim(),
        descripcion_Evento: formData.descripcion_Evento.trim(),
        fecha_Evento: fechaEvento, // "YYYY-MM-DD"
        hora_inicio_Evento: horaInicio, // "HH:mm:ss"
        hora_fin_Evento: horaFin, // "HH:mm:ss"
        id_dirigido_a: parseInt(formData.id_dirigido_a, 10),
        id_ubicacion: parseInt(formData.ubicacion, 10),
        id_tipo_evento: parseInt(formData.tipo_evento, 10),
        id_estado_evento: estadoPendiente.id, // Usando el ID dinámico
      };

      await EventosService.createEvento(payload);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Evento creado exitosamente.',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          content: 'swal2-content',
          confirmButton: 'swal2-confirm',
        },
        buttonsStyling: false,
      }).then(() => {
        navigate('/user-eventos'); // Redirige a la vista de solicitudes del usuario
      });
    } catch (err) {
      console.error('Error al crear evento:', err); // Para depuración
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al crear evento',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          content: 'swal2-content',
          confirmButton: 'swal2-confirm',
        },
        buttonsStyling: false,
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nuevo Evento</h2>

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
            min={getTodayDate()} // Establece el mínimo a la fecha actual
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
          {loadingDirigidosA ? (
            <p>Cargando públicos...</p>
          ) : errorDirigidosA ? (
            <p className="text-red-500">Error al cargar los públicos: {errorDirigidosA}</p>
          ) : (
            <select
              name="id_dirigido_a"
              value={formData.id_dirigido_a}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona un público</option>
              {dirigidosA.map((publico) => (
                <option key={publico.id} value={publico.id}>
                  {publico.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Campo de Ubicación */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Ubicación</label>
          {loadingUbicaciones ? (
            <p>Cargando ubicaciones...</p>
          ) : errorUbicaciones ? (
            <p className="text-red-500">Error al cargar ubicaciones: {errorUbicaciones}</p>
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
            <p className="text-red-500">Error al cargar tipos de eventos: {errorTiposEventos}</p>
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
          {isLoading ? 'Creando...' : 'Crear Evento'}
        </button>
      </form>
    </div>
  );
};

export default CrearEventos;
