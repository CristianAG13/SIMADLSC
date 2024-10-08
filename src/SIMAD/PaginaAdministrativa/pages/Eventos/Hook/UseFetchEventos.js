
import { useState, useEffect } from 'react';
import EventosService from '../services/EventosService';

const UseFetchEventos = (type = 'all') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setData(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [type]);

  return { data, loading, error };
};

export default UseFetchEventos;
