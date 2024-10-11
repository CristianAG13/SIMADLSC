// src/Hooks/UseFetchEventos.js

import { useState, useEffect } from 'react';
import EventosService from '../Service/EventosService';

const UseFetchEventos = (type = 'all') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Ubicaciones
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(true);
  const [errorUbicaciones, setErrorUbicaciones] = useState(null);

  // Estados para Tipos de Evento
  const [tiposEventos, setTiposEventos] = useState([]);
  const [loadingTiposEventos, setLoadingTiposEventos] = useState(true); // Setter Correcto
  const [errorTiposEventos, setErrorTiposEventos] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      try {
        let response;
        if (type === 'user') {
          response = await EventosService.getUserEventos();
        } else {
          response = await EventosService.getAllEventos();
        }
        console.log('Fetched eventos:', response); // Para depuración
        setData(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [type]);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      setLoadingUbicaciones(true);
      try {
        const response = await EventosService.getUbicaciones();
        setUbicaciones(response);
      } catch (err) {
        setErrorUbicaciones(err.response?.data?.message || 'Error al obtener ubicaciones');
      } finally {
        setLoadingUbicaciones(false);
      }
    };

    const fetchTiposEventos = async () => {
      setLoadingTiposEventos(true);
      try {
        const response = await EventosService.getTiposEventos();
        setTiposEventos(response);
      } catch (err) {
        setErrorTiposEventos(err.response?.data?.message || 'Error al obtener tipos de eventos');
      } finally {
        setLoadingTiposEventos(false);
      }
    };

    // Realizar las dos solicitudes en paralelo
    const fetchAll = async () => {
      await Promise.all([fetchUbicaciones(), fetchTiposEventos()]);
    };

    fetchAll();
  }, []);

  return { 
    data, 
    setData, // Añadido para actualizar el estado desde el componente
    loading, 
    error,
    ubicaciones,
    loadingUbicaciones,
    errorUbicaciones,
    tiposEventos,
    loadingTiposEventos,
    errorTiposEventos
  };
};

export default UseFetchEventos;
