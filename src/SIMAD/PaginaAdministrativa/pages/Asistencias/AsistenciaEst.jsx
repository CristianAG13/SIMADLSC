import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import fetchGradosSecciones from './Services/gradosSeccionesService';
import fetchAsistenciasFiltradas from './Services/AsistenciaService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AsistenciaEst = () => {
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [selectedGrado, setSelectedGrado] = useState('');
  const [selectedSeccion, setSelectedSeccion] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [fechaActual, setFechaActual] = useState('');
  const [horaActual, setHoraActual] = useState('');

  useEffect(() => {
    const cargarGradosSecciones = async () => {
      try {
        const { grados, secciones } = await fetchGradosSecciones();
        setGrados(grados);
        setSecciones(secciones);
      } catch (error) {
        console.error('Error al cargar los grados y secciones', error);
      }
    };
    cargarGradosSecciones();
  }, []);

  useEffect(() => {
    if (selectedSeccion) {
      const fetchEstudiantes = async () => {
        try {
          const estudiantesData = await fetchAsistenciasFiltradas({
            grado: selectedGrado,
            seccion: selectedSeccion,
          });
          setEstudiantes(estudiantesData);
        } catch (error) {
          console.error('Error al cargar los estudiantes', error);
        }
      };
      fetchEstudiantes();
    }
  }, [selectedGrado, selectedSeccion]);

  useEffect(() => {
    const fecha = new Date();
    setFechaActual(fecha.toLocaleDateString());
    setHoraActual(fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const handleAsistenciaChange = (id, estado) => {
    setAsistencia((prev) => ({
      ...prev,
      [id]: estado,
    }));
  };

  const handleObservacionesChange = (id, obs) => {
    setObservaciones((prev) => ({
      ...prev,
      [id]: obs,
    }));
  };

  const handleSubmit = () => {
    const asistenciaData = {
      grado: selectedGrado,
      seccion: selectedSeccion,
      asistencia: asistencia,
      observaciones: observaciones,
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato ISO
    };

    console.log('Datos de asistencia enviados:', asistenciaData);
    MySwal.fire({
      icon: 'success',
      title: 'Asistencia Enviada',
      text: 'La asistencia ha sido enviada correctamente.',
    });
  };

  const columns = [
    {
      name: 'Estudiante',
      selector: (row) => row.nombre_completo,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Estado',
      cell: (row) => (
        <select
          value={asistencia[row.id_estudiante] || ''}
          onChange={(e) => handleAsistenciaChange(row.id_estudiante, e.target.value)}
          className="p-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Seleccionar</option>
          <option value="Presente">Presente</option>
          <option value="Ausente">Ausente</option>
          <option value="Escapado">Escapado</option>
        </select>
      ),
      width: '120px',
    },
    {
      name: 'Observaciones',
      cell: (row) => (
        <input
          type="text"
          value={observaciones[row.id_estudiante] || ''}
          onChange={(e) => handleObservacionesChange(row.id_estudiante, e.target.value)}
          placeholder="Observación"
          className="p-1 border border-gray-300 rounded-lg text-sm w-full"
        />
      ),
      width: 'auto',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-semibold mb-4">Pasar Asistencia</h2>

      {/* Información de fecha y hora */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block font-medium">Fecha:</label>
          <div className="p-2 border border-gray-300 rounded-lg bg-gray-100">
            {fechaActual}
          </div>
        </div>
        <div>
          <label className="block font-medium">Hora:</label>
          <div className="p-2 border border-gray-300 rounded-lg bg-gray-100">
            {horaActual}
          </div>
        </div>
      </div>

      {/* Selección de Grado */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Grado:</label>
        <select
          className="block w-full p-2 border border-gray-300 rounded-lg text-sm"
          value={selectedGrado}
          onChange={(e) => setSelectedGrado(e.target.value)}
        >
          <option value="">Seleccionar Grado</option>
          {grados.map((grado) => (
            <option key={grado} value={grado}>
              {grado}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de Sección */}
      {selectedGrado && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Sección:</label>
          <select
            className="block w-full p-2 border border-gray-300 rounded-lg text-sm"
            value={selectedSeccion}
            onChange={(e) => setSelectedSeccion(e.target.value)}
          >
            <option value="">Seleccionar Sección</option>
            {secciones
              .filter((seccion) => seccion.grado === selectedGrado)
              .map((seccion) => (
                <option key={seccion} value={seccion}>
                  {seccion}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Tabla de estudiantes */}
      {selectedSeccion && (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <DataTable
            columns={columns}
            data={estudiantes}
            pagination={false}
            highlightOnHover
            striped
            dense
          />
        </div>
      )}

      {/* Botón de Envío */}
      {selectedSeccion && (
        <div className="mt-4 text-right">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
            onClick={handleSubmit}
          >
            Enviar Asistencia
          </button>
        </div>
      )}
    </div>
  );
};

export default AsistenciaEst;
