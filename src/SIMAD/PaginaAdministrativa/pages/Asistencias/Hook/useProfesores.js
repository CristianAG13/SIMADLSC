
import { useEffect, useState } from 'react';
import { obtenerProfesores } from '../Services/ProfesorService';

const useProfesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const data = await obtenerProfesores();
        setProfesores(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  return { profesores, loading };
};

export default useProfesores;
