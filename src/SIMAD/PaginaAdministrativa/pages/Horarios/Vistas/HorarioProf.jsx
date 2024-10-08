import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Import for table formatting

const MySwal = withReactContent(Swal);

export const HorarioProf = () => {
  const [nombreProfesor, setNombreProfesor] = useState(''); // Estado para el nombre del profesor
  const [horarios, setHorarios] = useState([]);             // Estado para los horarios del profesor
  const [horasLecciones, setHorasLecciones] = useState([]);  // Estado para las horas de las lecciones
  const [diasSemana, setDiasSemana] = useState([]);          // Estado para los días de la semana
  const [error, setError] = useState(null);                  // Estado para manejar errores

  useEffect(() => {
    // Simulación de datos quemados
    const obtenerDatos = async () => {
      try {
        const data = {
          nombreProfesor: 'Carlos Sánchez',
          horarios: [
            {
              dia: 'Lunes',
              horaInicio: '08:00',
              horaFin: '09:30',
              seccion: '7A',
              aula: 'Aula 101',
              asignatura: 'Matemáticas',
            },
            {
              dia: 'Martes',
              horaInicio: '10:00',
              horaFin: '11:30',
              seccion: '8B',
              aula: 'Aula 202',
              asignatura: 'Ciencias',
            },
            {
              dia: 'Miércoles',
              horaInicio: '08:00',
              horaFin: '09:30',
              seccion: '7A',
              aula: 'Aula 103',
              asignatura: 'Historia',
            },
          ],
          horasLecciones: [
            { inicio: '08:00', fin: '09:30' },
            { inicio: '10:00', fin: '11:30' },
            { inicio: '12:00', fin: '13:30' },
          ],
          diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        };

        setNombreProfesor(data.nombreProfesor);
        setHorarios(data.horarios);
        setHorasLecciones(data.horasLecciones);
        setDiasSemana(data.diasSemana);

      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('Error de conexión con el servidor.');
      }
    };

    obtenerDatos();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Función para obtener los detalles del horario en una celda específica (basado en día y hora)
  const obtenerHorarioPorDiaYHora = (dia, horaInicio) => {
    return horarios.find(horario => horario.dia === dia && horario.horaInicio === horaInicio);
  };

  // Función para mostrar los detalles usando SweetAlert
  const mostrarDetalles = (horario) => {
    if (horario) {
      MySwal.fire({
        title: `Detalles de la clase`,
        html: `<b>Asignatura:</b> ${horario.asignatura}<br><b>Aula:</b> ${horario.aula}<br><b>Sección:</b> ${horario.seccion}`,
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    } else {
      MySwal.fire({
        title: 'Detalles de la clase',
        text: 'No hay clase en este horario',
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  // Función para exportar el horario como PDF
  const exportarPdf = () => {
    const doc = new jsPDF();

    doc.text(`Horario de ${nombreProfesor}`, 10, 10);

    const tableColumn = ['Hora', ...diasSemana];
    const tableRows = [];

    horasLecciones.forEach((hora) => {
      const fila = [`${hora.inicio} - ${hora.fin}`];
      diasSemana.forEach((dia) => {
        const horario = obtenerHorarioPorDiaYHora(dia, hora.inicio);
        fila.push(horario ? `Asig: ${horario.asignatura}\nAula: ${horario.aula}` : '-');
      });
      tableRows.push(fila);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Horario_${nombreProfesor}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Hola, {nombreProfesor || 'Profesor'}! Aquí está tu horario.
      </h1>

      {/* Botón para exportar a PDF */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        onClick={exportarPdf}
      >
        Exportar Horario como PDF
      </button>

      {/* Tabla de Horarios */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tus Horarios</h2>
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
                  {/* Columna de horas */}
                  <td className="px-4 py-2">{hora.inicio} - {hora.fin}</td>

                  {/* Columnas de días */}
                  {diasSemana.map((dia, diaIndex) => {
                    const horario = obtenerHorarioPorDiaYHora(dia, hora.inicio);
                    return (
                      <td key={diaIndex} className="px-4 py-2 text-center">
                        {horario ? (
                          <button
                            onClick={() => mostrarDetalles(horario)}
                            className="text-blue-500 underline"
                          >
                            {horario.seccion} {/* Muestra solo la sección */}
                          </button>
                        ) : (
                          '-' /* Si no hay clase, muestra un guion */
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
