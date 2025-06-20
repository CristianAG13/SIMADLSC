import { useState, useEffect, useMemo, useCallback  } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MySwal = withReactContent(Swal);

const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.NODE_ENV === "production"
      ? "https://simadlsc-backend-production.up.railway.app"
      : "http://localhost:3000");


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
  const estudianteId = localStorage.getItem('id_Estudiante');

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
      } catch (error) {
        console.warn('Error al obtener los horarios:', error); // Solo muestra si hay error real
        setHorarios([]);
      } finally {
        setCargando(false);
      }
    };
    obtenerHorarios();
  }, [seccionSeleccionada]);
  

  const convertirHora12 = useCallback((hora24) => {
    if (!hora24 || typeof hora24 !== 'string' || !hora24.includes(':')) return 'Sin hora';
    const [hora, minuto] = hora24.split(':');
    let horaNum = parseInt(hora, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12;
    return `${horaNum}:${minuto} ${ampm}`;
  }, []);
  
  const lessons = useMemo(() => {
    return Object.entries(lessonTimes)
      .sort(([, a], [, b]) => a.start.localeCompare(b.start))
      .map(([key]) => key);
  }, []);

 

  const agruparMateriasPorLeccion = (dia) => {
    const bloques = [];
    let actual = null;

    // Filtrar primero los horarios por el día específico
    const horariosDelDia = horarios.filter(h => h.dia_semana_Horario === dia);

    lessons.forEach((lesson) => {
      // Buscar el horario que coincida con la lección actual para este día específico
      const horario = horariosDelDia.find(
        h => h.hora_inicio_Horario?.substring(0, 5) === lessonTimes[lesson].start
      );
      
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

  // Generar un mapeo de celdas para ubicar rowSpan correctos
  const cellMap = useMemo(() => {
    const map = {};
    dias.forEach((dia) => {
      const bloques = agruparMateriasPorLeccion(dia);
      let offset = 0;
      bloques.forEach((b) => {
        map[`${offset}-${dia}`] = b;
        offset += b.span;
      });
    });
    return map;
  }, [horarios]);

  const mostrarDetalles = useCallback((bloque) => {
    if (!bloque || !bloque.horarios || bloque.horarios.length === 0) return;

    const { materia, horarios } = bloque;

    let detallesHTML = '';
    
    // Para cada lección dentro del bloque
    for (let i = 0; i < horarios.length; i++) {
      const h = horarios[i];
      if (!h) continue;
      
      // Encontrar el número de lección actual basado en la hora de inicio
      const horaInicio = h?.hora_inicio_Horario?.substring(0, 5);
      const leccionActual = Object.entries(lessonTimes).find(
        ([, value]) => value.start === horaInicio
      );
      const numeroLeccion = leccionActual ? leccionActual[0] : `Lección ${i + 1}`;
      
      // Formatear las horas para mostrar
      const horaInicioFormateada = convertirHora12(h?.hora_inicio_Horario);

      let horaFin = 'Sin hora fin';
      if (h?.hora_final_Horario) {
        horaFin = convertirHora12(h.hora_final_Horario);
      } else if (horaInicio) {
        const found = Object.entries(lessonTimes).find(
          ([, value]) => value.start === horaInicio
        );
        if (found) {
          horaFin = convertirHora12(`${found[1].end}:00`);
        }
      }

      const profesorNombre = h.profesor
        ? `${h.profesor.nombre_Profesor || ''} ${h.profesor.apellido1_Profesor || ''} ${h.profesor.apellido2_Profesor || ''}`
        : 'N/A';

      const aulaNombre = h.aula?.nombre_Aula || 'N/A';

      detallesHTML += `
        <b>Lección ${numeroLeccion}:</b><br/>
        <b>Hora:</b> ${horaInicioFormateada} - ${horaFin}<br/>
        <b>Profesor:</b> ${profesorNombre}<br/>
        <b>Aula:</b> ${aulaNombre}<br/><br/>
      `;
    }

    MySwal.fire({
      title: materia,
      html: detallesHTML,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      customClass: {
        htmlContainer: 'text-start text-sm',
      },
    });
  }, [convertirHora12]);

  const exportarPdf = useCallback(() => {
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

    // Configuración del título y subtítulo
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

    // Preparar datos para la tabla
    const lessonsOrdenadas = Object.entries(lessonTimes)
      .sort(([, a], [, b]) => a.start.localeCompare(b.start))
      .map(([key]) => key);

    const tableColumns = ['Lección/Hora', ...dias];

    // Construir las filas de la tabla
    const tableRows = [];
    
    lessonsOrdenadas.forEach((lessonKey) => {
      const row = [];
      const isBreakOrLunch = lessonKey.toLowerCase().includes('recreo') || lessonKey.toLowerCase().includes('almuerzo');
      
      // Primera columna: lección y hora
      const lesson = `${lessonKey}\n${lessonTimes[lessonKey].start}-${lessonTimes[lessonKey].end}`;
      row.push(lesson);
      
      // Para cada día de la semana
      dias.forEach((dia) => {
        if (isBreakOrLunch) {
          // Para recreos y almuerzos, mostrar solo el nombre
          row.push(lessonKey);
          return;
        }
        
        // Buscar el horario que coincide con el día y la hora de inicio
        const horario = horarios.find(
          (h) => 
            h.dia_semana_Horario === dia && 
            h.hora_inicio_Horario?.substring(0, 5) === lessonTimes[lessonKey].start
        );
        
        if (horario && horario.materia) {
          const materia = horario.materia.nombre_Materia || '-';
          
          // Información del profesor
          let prof = '';
          if (horario.profesor) {
            prof = `${horario.profesor.nombre_Profesor || ''} ${horario.profesor.apellido1_Profesor || ''} ${horario.profesor.apellido2_Profesor || ''}`.trim();
            if (!prof) prof = 'Sin profesor';
          }
          
          // Información del aula
          const aula = horario.aula?.nombre_Aula ? `Aula: ${horario.aula.nombre_Aula}` : '';
          
          // Construir la celda con la información completa
          const cellContent = [materia];
          if (prof) cellContent.push(prof);
          if (aula) cellContent.push(aula);
          
          row.push(cellContent.join('\n'));
        } else {
          row.push('-');
        }
      });
      
      tableRows.push(row);
    });

    // Generar la tabla en el PDF
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
        fontStyle: 'bold',
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 7,
        cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
      },
      styles: {
        fontSize: 7,
        overflow: 'linebreak',
        lineColor: [80, 80, 80],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { 
          cellWidth: 45,
          fontStyle: 'bold',
          fillColor: [240, 240, 240],
          textColor: [50, 50, 50]
        },
      },
      didParseCell: function(data) {
        // Estilizar las celdas para recreos y almuerzo
        const cellText = data.cell.text.join('').toLowerCase();
        if (cellText.includes('recreo') || cellText.includes('almuerzo')) {
          data.cell.styles.fillColor = [255, 241, 184]; // Amarillo claro
          data.cell.styles.textColor = [100, 80, 0]; // Texto más oscuro para contraste
          data.cell.styles.fontStyle = 'bold';
        }
        
        // Estilizar las materias según el tipo
        if (data.section === 'body' && data.column.index > 0 && !cellText.includes('recreo') && !cellText.includes('almuerzo') && cellText !== '-') {
          // Extraer el nombre de la materia (primera línea)
          const materiaNombre = data.cell.text[0]?.toLowerCase();
          
          // Asignar colores según la materia
          if (materiaNombre?.includes('religión')) {
            data.cell.styles.fillColor = [230, 230, 255]; // Azul claro
          } else if (materiaNombre?.includes('matemática')) {
            data.cell.styles.fillColor = [220, 240, 255]; // Celeste
          } else if (materiaNombre?.includes('español')) {
            data.cell.styles.fillColor = [255, 245, 220]; // Amarillo crema
          } else if (materiaNombre?.includes('estudios sociales') || materiaNombre?.includes('cívica')) {
            data.cell.styles.fillColor = [245, 225, 255]; // Lila
          } else if (materiaNombre?.includes('ciencias') || materiaNombre?.includes('química') || materiaNombre?.includes('biología')) {
            data.cell.styles.fillColor = [225, 255, 225]; // Verde claro
          } else if (materiaNombre?.includes('inglés')) {
            data.cell.styles.fillColor = [255, 225, 240]; // Rosa claro
          } else {
            data.cell.styles.fillColor = [245, 245, 245]; // Gris muy claro para otras materias
          }
        }
      },
      willDrawCell: function(data) {
        // Opcional: bordes personalizados u otros ajustes visuales
        if (data.section === 'body') {
          // Nada adicional por ahora
        }
      },
    });

    // Agregar leyenda de colores al final
    const legendY = doc.autoTable.previous.finalY + 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("Leyenda:", margin, legendY);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text("• Las materias se muestran con diferentes colores para facilitar su identificación.", margin, legendY + 15);
    doc.text("• Los recreos y almuerzos se muestran en amarillo.", margin, legendY + 30);

    // Agregar número de página
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

    // Nombre del archivo según el rol
    const nombreArchivo =
      role === 'estudiante'
        ? `Horario_${nombreEstudiante}_${apellidosEstudiante}.pdf`
        : `Horario_${seccionActual?.nombre_Seccion || 'SeccionDesconocida'}.pdf`;

    doc.save(nombreArchivo);
  }, [role, nombreEstudiante, apellidosEstudiante, secciones, seccionSeleccionada, seccion, horarios]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }
  
  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // Inicializar estructura de filas procesadas por día
  const processed = {};
  dias.forEach(dia => { processed[dia] = new Set(); });

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
                      // Si ya procesamos esta celda, la omitimos
                      if (processed[dia].has(lessonIndex)) return null;
                      // Obtener el horario de este día y lección
                      const horario = horarios.find(
                        h => h.dia_semana_Horario === dia &&
                          h.hora_inicio_Horario?.substring(0,5) === lessonTimes[lesson].start
                      );
                      if (!horario) {
                        return <td key={`${dia}-${lesson}`} className="px-2 py-2">-</td>;
                      }
                      const materia = horario.materia?.nombre_Materia || '-';
                      // Calcular rowspan contando bloques consecutivos con misma materia
                      let span = 1;
                      for (let k = lessonIndex + 1; k < lessons.length; k++) {
                        const next = horarios.find(
                          h => h.dia_semana_Horario === dia &&
                            h.hora_inicio_Horario?.substring(0,5) === lessonTimes[lessons[k]].start
                        );
                        if (next && next.materia?.nombre_Materia === materia) {
                          span += 1;
                        } else break;
                      }
                      // Marcar como procesadas esas filas para este día
                      for (let i = lessonIndex; i < lessonIndex + span; i++) {
                        processed[dia].add(i);
                      }
                      // Estilo del fondo
                      const isEspecial =
                        materia.toLowerCase().includes('recreo') || materia.toLowerCase().includes('almuerzo');
                      const bgColor = isEspecial
                        ? 'bg-yellow-100 dark:bg-yellow-300 text-gray-900 font-bold'
                        : materia !== '-' && subjectColors[materia]
                          ? subjectColors[materia]
                          : 'bg-white dark:bg-gray-900';
                      return (
                        <td
                          key={`${dia}-${lesson}`}
                          rowSpan={span}
                          className={`px-2 py-2 ${bgColor} border dark:border-gray-700 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition duration-150 whitespace-nowrap`}
                          onClick={() => materia !== '-' && mostrarDetalles({
                            materia, 
                            span, 
                            horarios: lessons.slice(lessonIndex, lessonIndex + span).map(lessonKey => {
                              // Para cada lección incluida en el span, buscar su horario correspondiente
                              return horarios.find(h => 
                                h.dia_semana_Horario === dia && 
                                h.hora_inicio_Horario?.substring(0, 5) === lessonTimes[lessonKey]?.start
                              ) || null;
                            })
                          })}
                          title={`Materia: ${materia}`}
                        >
                          <div className="font-semibold text-[11px] truncate leading-tight">{materia}</div>
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
