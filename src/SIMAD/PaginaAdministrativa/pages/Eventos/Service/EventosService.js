
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
      const response = await axiosInstance.get('/eventos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos del usuario:', error);
      throw error;
    }
  },

  // Obtener un evento por ID
  getEventoById: (id) => {
    return axios.get(`${'http://localhost:3000'}/eventos/${id}`);
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
  updateEvento: (id, evento) => {
    return axios.put(`${'http://localhost:3000'}/eventos/${id}`, evento);
  },

  // Aprobar un evento
  approveEvento: (id) => {
    return axios.post(`${'http://localhost:3000'}/eventos/${id}/approve`);
  },

  deleteEvento: (id) => {
    return axios.delete(`${'http://localhost:3000'}/eventos/${id}`);
  },

  // Rechazar un evento
  rejectEvento: (id) => {
    return axios.post(`${'http://localhost:3000'}/eventos/${id}/reject`);
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
