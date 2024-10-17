import { useState } from "react";
import { crearJustificacion } from "./Services/JustificacionService";
import useMaterias from "./Hook/useMaterias";

export const JustificacionAusencias = () => {

    const fetchAsistencias = async ({ id_Estudiante, fecha, id_Materia }) => {
        const response = await fetch(`http://localhost:3000/asistencias?id_Estudiante=${id_Estudiante}&fecha=${fecha}&id_Materia=${id_Materia}`);
        if (!response.ok) {
          throw new Error('Error al obtener las asistencias');
        }
        return response.json();
      };



    const { materias } = useMaterias();
    const [formData, setFormData] = useState({
      id_Estudiante: '',
      id_Materia: '',
      fecha: '',
    });
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSearch = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAsistencias(formData);
        setAsistencias(data);
      } catch (err) {
        setError('Error al obtener las asistencias');
      } finally {
        setLoading(false);
      }
    };
  
    const handleJustificar = async (asistenciaId) => {
      const descripcion = prompt('Ingrese el motivo de justificación');
      if (descripcion) {
        try {
          await crearJustificacion(asistenciaId, { descripcion });
          alert('Justificación guardada con éxito');
          const data = await fetchAsistencias(formData);
          setAsistencias(data);
        } catch (err) {
          alert('Error al justificar la ausencia');
        }
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Justificar Ausencias</h2>
        <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="id_Estudiante"
              placeholder="Nombre del Estudiante"
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <select name="id_Materia" onChange={handleChange} className="border p-2 rounded">
              <option value="">Seleccionar Materia</option>
              {materias.map((materia) => (
                <option key={materia.id_Materia} value={materia.id_Materia}>
                  {materia.nombre_Materia}
                </option>
              ))}
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
          </div>
        </form>
  
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Cargando asistencias...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Fecha</th>
                <th className="py-2">Materia</th>
                <th className="py-2">Profesor</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Justificar</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((asistencia) => (
                <tr key={asistencia.asistencia_id}>
                  <td className="border px-4 py-2">{asistencia.fecha}</td>
                  <td className="border px-4 py-2">{asistencia.id_Materia.nombre_Materia}</td>
                  <td className="border px-4 py-2">{asistencia.id_Profesor.nombre_Profesor}</td>
                  <td className="border px-4 py-2">{asistencia.estado}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleJustificar(asistencia.asistencia_id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      disabled={asistencia.estado !== 'A'}
                    >
                      Justificar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
}
