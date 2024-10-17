import { useEffect, useState } from 'react';
import { eliminarAsistencia, justificarAusencia, obtenerAsistencias } from '../Services/AsistenciaService';

const useAsistencias = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAsistencias = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await obtenerAsistencias();
                setAsistencias(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAsistencias();
    }, []);

    const handleJustificar = async (id, justificacion) => {
        try {
            const updatedAsistencia = await justificarAusencia(id, justificacion);
            setAsistencias((prev) => prev.map(asistencia => asistencia.asistencia_id === updatedAsistencia.asistencia_id ? updatedAsistencia : asistencia));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEliminar = async (id) => {
        try {
            await eliminarAsistencia(id);
            setAsistencias((prev) => prev.filter(asistencia => asistencia.asistencia_id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return { asistencias, loading, error, handleJustificar, handleEliminar };
};

export default useAsistencias;
