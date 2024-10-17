
import { useEffect, useState } from 'react';
import { obtenerMaterias } from '../Services/MateriaService';

const useMaterias = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const data = await obtenerMaterias();
        setMaterias(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, []);

  return { materias, loading };
};

export default useMaterias;
