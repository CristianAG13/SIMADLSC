
import { useEffect, useState } from 'react';
import { obtenerGrados } from '../Services/GradoService';

const useGrados = () => {
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const data = await obtenerGrados();
        setGrados(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrados();
  }, []);

  return { grados, loading };
};

export default useGrados;
