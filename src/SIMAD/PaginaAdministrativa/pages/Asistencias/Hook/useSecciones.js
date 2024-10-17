
import { useEffect, useState } from 'react';
import { obtenerSeccionesPorGrado } from '../Services/SeccionService';

const useSecciones = (idGrado) => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idGrado) {
      setSecciones([]);
      setLoading(false);
      return;
    }

    const fetchSecciones = async () => {
      setLoading(true);
      try {
        const data = await obtenerSeccionesPorGrado(idGrado);
        setSecciones(data);
      } catch (error) {
        console.error(error);
        setSecciones([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSecciones();
  }, [idGrado]);

  return { secciones, loading };
};

export default useSecciones;
