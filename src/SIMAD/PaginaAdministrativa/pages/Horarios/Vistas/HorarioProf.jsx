import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MySwal = withReactContent(Swal);

export const HorarioProf = () => {
  const [profesores, setProfesores] = useState([]);
  const [idProfesorSeleccionado, setIdProfesorSeleccionado] = useState(null);
  const [nombreProfesor, setNombreProfesor] = useState('');
  const [apellidosProfesor, setApellidosProfesor] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [horasLecciones, setHorasLecciones] = useState([]);
  const [error, setError] = useState(null);

  const role = localStorage.getItem('role');
  const idProfesorLocal = localStorage.getItem('id_profesor');

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  useEffect(() => {
    const obtenerProfesores = async () => {
      try {
        const response = await fetch(`http://localhost:3000/profesores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener la lista de profesores.');

        const profesoresData = await response.json();
        setProfesores(profesoresData);
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
        setError('Error al cargar la lista de profesores.');
      }
    };

    if (role === 'admin' || role === 'superadmin') {
      obtenerProfesores();
    }
  }, [role]);

  useEffect(() => {
    const obtenerDatosProfesorYHorario = async () => {
      try {
        let profesorId = idProfesorSeleccionado;
        if (role === 'profesor') profesorId = idProfesorLocal;

        if (!profesorId) return;

        const profesorResponse = await fetch(`http://localhost:3000/profesores/${profesorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!profesorResponse.ok) throw new Error('Error al obtener los datos del profesor desde el servidor.');

        const profesorData = await profesorResponse.json();
        setNombreProfesor(profesorData.nombre_Profesor);
        setApellidosProfesor(`${profesorData.apellido1_Profesor} ${profesorData.apellido2_Profesor}`);

        const horariosResponse = await fetch(`http://localhost:3000/horarios/profesor/${profesorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!horariosResponse.ok) throw new Error('Error al obtener los horarios desde el servidor.');

        const horariosData = await horariosResponse.json();

        if (Array.isArray(horariosData)) {
          const horariosOrdenados = horariosData.sort((a, b) => a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario));
          setHorarios(horariosOrdenados);

          const uniqueHours = [...new Set(horariosOrdenados.map(h => `${h.hora_inicio_Horario} - ${h.hora_fin_Horario}`))]
            .map(hora => ({
              inicio: convertirHora12(hora.split(' - ')[0]),
              fin: convertirHora12(hora.split(' - ')[1]),
            }));

          setHorasLecciones(uniqueHours);
        } else {
          setHorarios([]);
        }
      } catch (error) {
        console.error('Error al obtener los datos del backend:', error);
        setError('Error de conexión con el servidor o credenciales inválidas.');
      }
    };

    obtenerDatosProfesorYHorario();
  }, [idProfesorSeleccionado, role, idProfesorLocal]);

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

  const obtenerHorarioPorDiaYHora = (dia, horaInicio) => {
    return horarios.find(horario => horario.dia_semana_Horario === dia && convertirHora12(horario.hora_inicio_Horario) === horaInicio);
  };

  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: `Detalles de la clase`,
        html: `<b>Asignatura:</b> ${horario.materia?.nombre_Materia || 'N/A'}<br><b>Aula:</b> ${horario.aula?.nombre_Aula || 'N/A'}<br><b>Sección:</b> ${horario.seccion?.nombre_Seccion || 'N/A'}`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  const exportarPdf = () => {
    const doc = new jsPDF();
    doc.text(`Horario de ${nombreProfesor} ${apellidosProfesor}`, 10, 10);

    const tableColumn = ['Hora', ...diasSemana];
    const tableRows = [];

    horasLecciones.forEach((hora) => {
      const fila = [`${hora.inicio} - ${hora.fin}`];
      diasSemana.forEach((dia) => {
        const horario = obtenerHorarioPorDiaYHora(dia, hora.inicio);
        fila.push(
          horario ? `Asig: ${horario.materia?.nombre_Materia || 'N/A'}\nAula: ${horario.aula?.nombre_Aula || 'N/A'}` : '-'
        );
      });
      tableRows.push(fila);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Horario_${nombreProfesor}_${apellidosProfesor}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {role === 'admin' || role === 'superadmin' ? (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Selecciona un Profesor</h1>
          <select
            className="border p-2 rounded-lg w-full mb-4"
            onChange={(e) => setIdProfesorSeleccionado(e.target.value)}
            value={idProfesorSeleccionado || ''}
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.id_Profesor} value={profesor.id_Profesor}>
                {`${profesor.nombre_Profesor} ${profesor.apellido1_Profesor} ${profesor.apellido2_Profesor}`}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        onClick={exportarPdf}
        disabled={!idProfesorSeleccionado && role !== 'profesor'}
      >
        Exportar Horario como PDF
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {role === 'profesor' ? `Horario de ${nombreProfesor} ${apellidosProfesor}` : 'Horarios de todos los profesores'}
        </h2>
        {horasLecciones.length > 0 && diasSemana.length > 0 ? (
          <table className="min-w-full table-auto bg-gray-50 shadow-sm rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Hora</th>
                {diasSemana.map((dia, index) => (
                  <th key={index} className="px-4 py-2">{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horasLecciones.map((hora, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{hora.inicio} - {hora.fin}</td>
                  {diasSemana.map((dia, diaIndex) => {
                    const horario = obtenerHorarioPorDiaYHora(dia, hora.inicio);
                    return (
                      <td key={diaIndex} className="px-4 py-2 text-center">
                        {horario ? (
                          <button
                            onClick={() => mostrarDetalles(horario)}
                            className="text-blue-500 underline"
                          >
                            {horario.seccion?.nombre_Seccion || 'Ver detalles'}
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No hay datos disponibles para mostrar el horario.</div>
        )}
      </div>
    </div>
  );
};

export default HorarioProf;
