import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MySwal = withReactContent(Swal);

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://simadlsc-backend-production.up.railway.app'
    : 'http://localhost:3000';

const lessonTimes = {
  "1": { start: "07:00", end: "07:40" },
  "2": { start: "07:40", end: "08:20" },
  "Recreo 1 ": { start: "08:20", end: "08:30" },
  "3": { start: "08:30", end: "09:10" },
  "4": { start: "09:10", end: "09:50" },
  "Recreo 2 ": { start: "09:50", end: "10:00" },
  "5": { start: "10:00", end: "10:40" },
  "6": { start: "10:40", end: "11:20" },
  "Almuerzo": { start: "11:20", end: "12:00" },
  "7": { start: "12:00", end: "12:40" },
  "8": { start: "12:40", end: "13:20" },
  "Recreo 3 ": { start: "13:20", end: "13:25" },
  "9": { start: "13:25", end: "14:05" },
  "10": { start: "14:05", end: "14:45" },
  "Recreo 4": { start: "14:45", end: "14:55" },
  "11": { start: "14:55", end: "15:35" },
  "12": { start: "15:35", end: "16:15" },
};

export const HorarioEstu = () => {
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [apellidosEstudiante, setApellidosEstudiante] = useState('');
  const [seccion, setSeccion] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const role = localStorage.getItem('role');
  const estudianteId = localStorage.getItem('id_estudiante');

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        setCargando(true);
        if (role === 'admin' || role === 'superadmin') {
          const responseSecciones = await axios.get(`${API_BASE_URL}/secciones`);
          setSecciones(responseSecciones.data);
        }
        if (role === 'estudiante' && estudianteId) {
          const responseEstudiante = await axios.get(`${API_BASE_URL}/estudiantes/${estudianteId}`);
          const dataEstudiante = responseEstudiante.data;
          setNombreEstudiante(dataEstudiante.nombre_Estudiante);
          setApellidosEstudiante(
            `${dataEstudiante.apellido1_Estudiante} ${dataEstudiante.apellido2_Estudiante}`
          );
          setSeccion(dataEstudiante.seccion?.nombre_Seccion || 'Sin Sección');
          setSeccionSeleccionada(dataEstudiante.seccion.id_Seccion);
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
        const responseHorarios = await axios.get(
          `${API_BASE_URL}/horarios/seccion/${seccionSeleccionada}`
        );
        const horariosOrdenados = responseHorarios.data.sort((a, b) =>
          a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario)
        );
        setHorarios(horariosOrdenados);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
        setHorarios([]);
        setCargando(false);
      }
    };
    obtenerHorarios();
  }, [seccionSeleccionada]);

  const convertirHora12 = (hora24) => {
    if (!hora24 || typeof hora24 !== 'string' || !hora24.includes(':')) return 'Sin hora';
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


  const lessons = Object.entries(lessonTimes)
    .sort(([, a], [, b]) => a.start.localeCompare(b.start))
    .map(([key]) => key);

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const subjectColors = {
    'Religión': 'bg-indigo-200',
    'Español': 'bg-yellow-200',
    'Estudios Sociales': 'bg-purple-200',
    'Matemática': 'bg-blue-200',
    'Inglés': 'bg-pink-200',
    'Ciencias': 'bg-green-200',
    'Química': 'bg-teal-200',
    'Biología': 'bg-lime-200',
    'Física': 'bg-orange-200',
    'Educación Física': 'bg-rose-200',
    'Educación para el Hogar': 'bg-cyan-200',
    'Psicología': 'bg-fuchsia-200',
    'Turismo': 'bg-violet-200',
    'Francés': 'bg-emerald-200',
    'Artes Plásticas': 'bg-red-200',
    'Música': 'bg-indigo-300',
    'Informática - Cómputo': 'bg-blue-300',
    'Emprendedurismo': 'bg-amber-300',
    'Sexualidad y Afectividad': 'bg-pink-300',
    'Filosofía': 'bg-gray-300',
    'Coordinación de Departamento': 'bg-yellow-300',
    'Comité de Evaluación': 'bg-purple-300',
    'Educación Cívica': 'bg-green-300',
    'Formación Tecnológica': 'bg-teal-300',
    'Guía': 'bg-lime-300',
    'Orientación': 'bg-orange-300',
    'Artes Industriales': 'bg-red-300',
  };

  const obtenerHorario = (dia, lesson) => {
    const lessonStart = lessonTimes[lesson].start;
    return horarios.find(
      (h) =>
        h.dia_semana_Horario === dia &&
        h.hora_inicio_Horario.substring(0, 5) === lessonStart
    );
  };

  const agruparMateriasPorLeccion = (dia) => {
    const bloques = [];
    let actual = null;

    lessons.forEach((lesson) => {
      const horario = obtenerHorario(dia, lesson);
      const materia = horario?.materia?.nombre_Materia || '-';

      if (!actual || actual.materia !== materia) {
        if (actual) bloques.push(actual);
        actual = { materia, span: 1, horarios: [horario] };
      } else {
        actual.span += 1;
        actual.horarios.push(horario);
      }
    });

    if (actual) bloques.push(actual);

    return bloques;
  };

  const mostrarDetalles = (bloque) => {
    if (!bloque || !Array.isArray(bloque.horarios) || bloque.horarios.length === 0) return;

    const { materia, horarios } = bloque;

    let detallesHTML = '';

    horarios.forEach((h, index) => {
      const horaInicio = convertirHora12(h?.hora_inicio_Horario);

      let horaFin = 'Sin hora fin';
      if (h?.hora_final_Horario) {
        horaFin = convertirHora12(h.hora_final_Horario);
      } else {
        const found = Object.entries(lessonTimes).find(
          ([, value]) => value.start === h?.hora_inicio_Horario?.substring(0, 5)
        );
        if (found) {
          horaFin = convertirHora12(found[1].end);
        }
      }

      const profesorNombre = h.profesor
        ? `${h.profesor.nombre_Profesor || ''} ${h.profesor.apellido1_Profesor || ''} ${h.profesor.apellido2_Profesor || ''}`
        : 'N/A';

      const aulaNombre = h.aula?.nombre_Aula || 'N/A';

      detallesHTML += `
        <b>Lección ${index + 1}:</b><br/>
        <b>Hora:</b> ${horaInicio} - ${horaFin}<br/>
        <b>Profesor:</b> ${profesorNombre}<br/>
        <b>Aula:</b> ${aulaNombre}<br/><br/>
      `;
    });

    MySwal.fire({
      title: materia,
      html: detallesHTML,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      customClass: {
        htmlContainer: 'text-start text-sm',
      },
    });
  };

  const exportarPdf = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();


    const seccionActual = secciones.find(
      (s) => String(s.id_Seccion) === String(seccionSeleccionada)
    );


    const title =
      role === 'estudiante'
        ? `Horario de ${nombreEstudiante} ${apellidosEstudiante}`
        : `Horario por Sección`;

    const subTitle =
      role === 'admin' || role === 'superadmin'
        ? `Sección seleccionada: ${seccionActual?.nombre_Seccion || 'N/D'}`
        : `Sección: ${seccion}`;
    const fecha = new Date().toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, margin);


    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const subTitleWidth = doc.getTextWidth(subTitle);
    const subTitleX = (pageWidth - subTitleWidth) / 2;
    doc.text(subTitle, subTitleX, margin + 16);

 
    doc.setFontSize(9);
    doc.text(`Generado: ${fecha}`, pageWidth - margin, margin, { align: 'right' });


    const lessonsOrdenadas = Object.entries(lessonTimes)
      .sort(([, a], [, b]) => a.start.localeCompare(b.start))
      .map(([key]) => key);

    const tableColumns = ['Lección', ...dias];

    const tableRows = lessonsOrdenadas.map((lessonKey) => {
      const row = [lessonKey];
      const startHora = lessonTimes[lessonKey].start;
      const endHora = lessonTimes[lessonKey].end;

      dias.forEach((dia) => {
        const horario = horarios.find(
          (h) =>
            h.dia_semana_Horario === dia &&
            h.hora_inicio_Horario?.substring(0, 5) === startHora
        );

        if (horario) {
          const materia = horario.materia?.nombre_Materia || '-';
          const prof =
            horario.profesor?.nombre_Profesor &&
              horario.profesor?.apellido1_Profesor
              ? `${horario.profesor.nombre_Profesor} ${horario.profesor.apellido1_Profesor} ${horario.profesor.apellido2_Profesor}`
              : 'Sin prof.';
          const aula = `Aula: ` + horario.aula?.nombre_Aula || 'Aula N/D';
          const hora = `${convertirHora12(startHora)} - ${convertirHora12(endHora)}`;

          row.push(`${materia}\n${prof}\n${aula}\n${hora}`);
        } else {
          row.push('-');
        }
      });

      return row;
    });

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: margin + 25,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 78, 99],
        textColor: 255,
        halign: 'center',
        fontSize: 9,
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 7,
        cellPadding: { top: 5, bottom: 5, left: 3, right: 3 },
      },
      styles: {
        fontSize: 7,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 50 },
      },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    const nombreArchivo =
      role === 'estudiante'
        ? `Horario_${nombreEstudiante}_${apellidosEstudiante}.pdf`
        : `Horario_${seccionActual?.nombre_Seccion || 'SeccionDesconocida'}.pdf`;

    doc.save(nombreArchivo);

  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-white">
      {role !== 'admin' && role !== 'superadmin' && (
        <>
          <h1 className="text-xl font-bold mb-1 text-center">
            Horario {new Date().getFullYear()}
          </h1>
          <h2 className="text-sm font-medium mb-1 text-center">
            {nombreEstudiante} {apellidosEstudiante}
          </h2>
          <h3 className="text-sm font-medium mb-4 text-center">
            Sección: {seccion}
          </h3>
        </>
      )}

      {(role === 'admin' || role === 'superadmin') && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Seleccionar Sección
          </label>
          <select
            value={seccionSeleccionada}
            onChange={(e) => setSeccionSeleccionada(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-800 dark:text-white text-sm"
          >
            <option value="">Seleccione una sección</option>
            {secciones.map((sec) => (
              <option key={sec.id_Seccion} value={sec.id_Seccion}>
                {sec.nombre_Seccion}
              </option>
            ))}
          </select>
        </div>
      )}

      {horarios.length > 0 ? (
        <section className="max-w-full overflow-auto px-2 sm:px-4">
          {role === 'estudiante' && (
            <div className="mb-4 text-center text-sm text-blue-700 dark:text-blue-300 font-medium">
              Este es tu horario personal de clases.
            </div>
          )}

          {(role === 'admin' || role === 'superadmin') && (
            <div className="mb-4 text-center text-sm text-purple-700 dark:text-purple-300 font-medium">
              Vista administrativa del horario por sección.
            </div>
          )}
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg mb-4 text-sm transition"
            onClick={exportarPdf}
          >
            Exportar Horario como PDF
          </button>

          <div className="rounded-lg border border-gray-300 dark:border-gray-700 shadow overflow-x-auto w-full">
            <table className="table-auto w-full min-w-max text-xs text-center border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                <tr>
                  <th className="px-2 py-2 sticky top-0 left-0 z-20 bg-gray-200 dark:bg-gray-700">
                    Lección
                  </th>
                  {dias.map((dia, i) => (
                    <th
                      key={i}
                      className="px-2 py-2 sticky top-0 bg-gray-200 dark:bg-gray-700 z-10 whitespace-nowrap"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, lessonIndex) => (
                  <tr
                    key={lessonIndex}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
                  >
                    <td className="px-2 py-2 font-medium bg-gray-100 dark:bg-gray-800 sticky left-0 z-10 whitespace-nowrap text-left">
                      <div className="text-[12px] font-semibold">{lesson}</div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-300">
                        {convertirHora12(lessonTimes[lesson].start)} - {convertirHora12(lessonTimes[lesson].end)}
                      </div>
                    </td>

                    {dias.map((dia) => {
                      const bloques = agruparMateriasPorLeccion(dia);
                      const bloque = bloques.find(
                        (b) =>
                          b.horarios.some(
                            (h) =>
                              h?.hora_inicio_Horario?.substring(0, 5) ===
                              lessonTimes[lesson]?.start
                          )
                      );

                      if (!bloque || bloque.mostrado) return null;

                      const primeraHora = bloque.horarios[0]?.hora_inicio_Horario;
                      if (
                        !primeraHora ||
                        primeraHora.substring(0, 5) !== lessonTimes[lesson]?.start
                      )
                        return null;

                      bloque.mostrado = true;

                      const materia = bloque.materia;
                      const isEspecial =
                        materia.toLowerCase().includes('recreo') ||
                        materia.toLowerCase().includes('almuerzo');

                      const bgColor = isEspecial
                        ? 'bg-yellow-100 dark:bg-yellow-300 text-gray-900 font-bold'
                        : materia !== '-' && subjectColors[materia]
                          ? subjectColors[materia]
                          : 'bg-white dark:bg-gray-900';

                      return (
                        <td
                          key={`${dia}-${lesson}`}
                          rowSpan={bloque.span}
                          className={`px-2 py-2 ${bgColor} border dark:border-gray-700 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition duration-150 whitespace-nowrap`}
                          onClick={() =>
                            materia !== '-' && mostrarDetalles(bloque)
                          }
                          title={`Materia: ${materia}`}
                        >
                          <div className="font-semibold text-[11px] truncate leading-tight">
                            {materia}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <p className="text-sm dark:text-gray-300">
            No se encontraron horarios para la sección seleccionada.
          </p>
        </div>
      )}
    </div>
  );

};

export default HorarioEstu;
