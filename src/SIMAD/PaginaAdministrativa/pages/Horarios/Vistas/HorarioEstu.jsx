import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Import for table formatting

const MySwal = withReactContent(Swal);

export const HorarioEstu = () => {
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [apellidosEstudiante, setApellidosEstudiante] = useState('');
  const [seccion, setSeccion] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [secciones, setSecciones] = useState([]); // Lista de secciones para seleccionar
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Obtener el rol desde el localStorage
  const role = localStorage.getItem('role');
  const estudianteId = localStorage.getItem('id_estudiante');

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        setCargando(true);

        // Cargar todas las secciones si el rol es admin o superadmin
        if (role === 'admin' || role === 'superadmin') {
          const responseSecciones = await axios.get('http://localhost:3000/secciones');
          setSecciones(responseSecciones.data);
        }

        // Si es estudiante, cargar sus datos y sección
        if (role === 'estudiante' && estudianteId) {
          const responseEstudiante = await axios.get(`http://localhost:3000/estudiante/${estudianteId}`);
          const dataEstudiante = responseEstudiante.data;
          setNombreEstudiante(dataEstudiante.nombre_Estudiante);
          setApellidosEstudiante(`${dataEstudiante.apellido1_Estudiante} ${dataEstudiante.apellido2_Estudiante}`);
          setSeccion(dataEstudiante.seccion?.nombre_Seccion || 'Sin Sección');
          setSeccionSeleccionada(dataEstudiante.seccion.id_Seccion); // Establecer la sección del estudiante
        }

        setCargando(false);
      } catch (error) {
        console.error('Error al obtener los datos iniciales:', error);
        setError('Error de conexión con el servidor.');
        setCargando(false);
      }
    };

    obtenerDatosIniciales();
  }, [role, estudianteId]);

  useEffect(() => {
    const obtenerHorarios = async () => {
      if (!seccionSeleccionada) return;
      
      try {
        setCargando(true);
        const responseHorarios = await axios.get(`http://localhost:3000/horarios/seccion/${seccionSeleccionada}`);
        const horariosOrdenados = responseHorarios.data.sort((a, b) => a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario));
        setHorarios(horariosOrdenados);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
        setHorarios([]); // Establece horarios como un array vacío si no se encuentran datos
        setCargando(false);
      }
    };

    obtenerHorarios();
  }, [seccionSeleccionada]);

  const convertirHora12 = (hora24) => {
    const [hora, minuto] = hora24.split(':');
    let horaNum = parseInt(hora, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12;
    return `${horaNum}:${minuto} ${ampm}`;
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (cargando) {
    return <div>Cargando datos...</div>;
  }

  const horasUnicas = [...new Set(horarios.map(horario => `${convertirHora12(horario.hora_inicio_Horario)} - ${convertirHora12(horario.hora_fin_Horario)}`))];
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const obtenerHorario = (dia, hora) => {
    return horarios.find(h => h.dia_semana_Horario === dia && `${convertirHora12(h.hora_inicio_Horario)} - ${convertirHora12(h.hora_fin_Horario)}` === hora);
  };

  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: `Detalles de la clase`,
        html: `<b>Aula:</b> ${horario.aula?.nombre_Aula || 'N/A'}<br><b>Profesor:</b> ${horario.profesor?.nombre_Profesor || 'N/A'} ${horario.profesor?.apellido1_Profesor || 'N/A'} ${horario.profesor?.apellido2_Profesor || 'N/A'}`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  const exportarPdf = () => {
    const doc = new jsPDF();
    doc.text(`Horario de ${nombreEstudiante} ${apellidosEstudiante} - Sección ${seccion}`, 10, 10);

    const tableColumn = ['Hora', ...dias];
    const tableRows = [];

    horasUnicas.forEach((hora) => {
      const fila = [hora];
      dias.forEach((dia) => {
        const horario = obtenerHorario(dia, hora);
        fila.push(horario ? horario.materia?.nombre_Materia || '-' : '-');
      });
      tableRows.push(fila);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Horario_${nombreEstudiante}_${apellidosEstudiante}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {role !== 'admin' && role !== 'superadmin' && (
        <>
          <h1 className="text-3xl font-bold mb-4">Sección: {seccion}</h1>
          <h2 className="text-2xl font-bold mb-6">
            Hola, {nombreEstudiante} {apellidosEstudiante}! Bienvenido al horario.
          </h2>
        </>
      )}

      {role === 'admin' || role === 'superadmin' ? (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Seleccionar Sección</label>
          <select
            value={seccionSeleccionada}
            onChange={(e) => setSeccionSeleccionada(e.target.value)}
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Seleccione una sección</option>
            {secciones.map((sec) => (
              <option key={sec.id_Seccion} value={sec.id_Seccion}>
                {sec.nombre_Seccion}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {horarios.length > 0 ? (
        <>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
            onClick={exportarPdf}
          >
            Exportar Horario como PDF
          </button>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Tu Horario</h2>
            <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Hora</th>
                  {dias.map((dia, index) => (
                    <th key={index} className="px-4 py-2 text-left">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horasUnicas.map((hora, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{hora}</td>
                    {dias.map((dia) => {
                      const horario = obtenerHorario(dia, hora);
                      return (
                        <td
                          key={dia}
                          className="px-4 py-2 text-center cursor-pointer hover:bg-blue-100"
                          onClick={() => mostrarDetalles(horario)}
                        >
                          {horario ? horario.materia?.nombre_Materia || '-' : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg">No se encontraron horarios para la sección seleccionada.</p>
        </div>
      )}
    </div>
  );
};

export default HorarioEstu;
