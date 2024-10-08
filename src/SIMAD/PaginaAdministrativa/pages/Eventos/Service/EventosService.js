// src/services/EventosService.js

import axios from 'axios';

// Configura la URL base de tu API
const API_BASE_URL = 'http://localhost:3000/api'; // Cambia según tu configuración

// Crear una instancia de Axios con configuraciones predeterminadas
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegúrate de almacenar el token JWT al iniciar sesión
  },
});

// Service para gestionar eventos
const EventosService = {
  // Obtener todos los eventos
  getAllEventos: async () => {
    const response = await axiosInstance.get('/eventos');
    return response.data;
  },

  // Obtener eventos del usuario
  getUserEventos: async () => {
    const response = await axiosInstance.get('/eventos/user');
    return response.data;
  },

  // Obtener un evento por ID
  getEventoById: async (id) => {
    const response = await axiosInstance.get(`/eventos/${id}`);
    return response.data;
  },

  // Crear un nuevo evento
  createEvento: async (eventoData) => {
    const response = await axiosInstance.post('/eventos', eventoData);
    return response.data;
  },

  // Actualizar un evento existente
  updateEvento: async (id, eventoData) => {
    const response = await axiosInstance.put(`/eventos/${id}`, eventoData);
    return response.data;
  },

  // Aprobar un evento
  approveEvento: async (id) => {
    const response = await axiosInstance.patch(`/eventos/${id}/approve`);
    return response.data;
  },

  // Rechazar un evento
  rejectEvento: async (id) => {
    const response = await axiosInstance.patch(`/eventos/${id}/reject`);
    return response.data;
  },
};

export default EventosService;
