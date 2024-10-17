// src/hooks/useJustificacion.js
import { useState, useEffect } from 'react';
import { crearJustificacion, obtenerJustificaciones } from '../Services/JustificacionService';

export const useJustificacion = () => {
    const [justificaciones, setJustificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJustificaciones = async () => {
            try {
                const data = await obtenerJustificaciones();
                setJustificaciones(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJustificaciones();
    }, []);

    const handleJustificar = async (idAsistencia, descripcion) => {
        try {
            const newJustificacion = await crearJustificacion(idAsistencia, descripcion);
            setJustificaciones((prev) => [...prev, newJustificacion]);
        } catch (error) {
            setError(error.message);
        }
    };

    return { justificaciones, loading, error, handleJustificar };
};
