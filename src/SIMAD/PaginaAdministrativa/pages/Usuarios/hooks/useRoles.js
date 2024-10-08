// hooks/useRoles.js
import { useState, useEffect } from 'react';
import { getAllRoles } from '../services/useRoleService';

export const useRoles = (token) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getAllRoles(token);
        setRoles(rolesData);  // Guardamos los roles obtenidos
        setLoading(false);
    } catch (err) {
        console.error('Error al obtener los roles:', err);
        setError('Error al obtener los roles');
        setLoading(false);
    }
};

if (token) {
    fetchRoles();
}
}, [token]);

  return { roles, loading, error };
};
