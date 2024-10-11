
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegúrate de almacenar el token JWT al iniciar sesión
  },
});

const EventosService = {
  // Obtener todos los eventos
  getAllEventos: async () => {
    try {
      const response = await axiosInstance.get('/eventos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los eventos:', error);
      throw error;
    }
  },

  // Obtener eventos del usuario
  getUserEventos: async () => {
    try {
      const response = await axiosInstance.get('/user-eventos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos del usuario:', error);
      throw error;
    }
  },

  // Obtener un evento por ID
  getEventoById: async (id) => {
    try {
      const response = await axiosInstance.get(`/eventos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el evento con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo evento
  createEvento: async (eventoData) => {
    try {
      const response = await axiosInstance.post('/eventos', eventoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  },

  // Actualizar un evento existente
  updateEvento: async (id, eventoData) => {
    try {
      const response = await axiosInstance.put(`/eventos/${id}`, eventoData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el evento con ID ${id}:`, error);
      throw error;
    }
  },

  // Aprobar un evento
  approveEvento: async (id) => {
    try {
      const response = await axiosInstance.patch(`/eventos/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error al aprobar el evento con ID ${id}:`, error);
      throw error;
    }
  },

  // Rechazar un evento
  rejectEvento: async (id) => {
    try {
      const response = await axiosInstance.patch(`/eventos/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error(`Error al rechazar el evento con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener todas las ubicaciones
  getUbicaciones: async () => {
    try {
      const response = await axiosInstance.get('/ubicaciones');
      return response.data; // Asumiendo que la respuesta es un array de ubicaciones
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      throw error;
    }
  },

  // Obtener todos los tipos de eventos
  getTiposEventos: async () => {
    try {
      const response = await axiosInstance.get('/tipos-eventos');
      return response.data; // Asumiendo que la respuesta es un array de tipos de eventos
    } catch (error) {
      console.error('Error al obtener tipos de eventos:', error);
      throw error;
    }
  },
};

export default EventosService;
