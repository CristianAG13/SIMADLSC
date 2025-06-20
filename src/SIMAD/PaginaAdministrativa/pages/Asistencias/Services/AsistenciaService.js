const API_URL = import.meta.env.VITE_API_URL;

export const crearAsistencias = async (asistenciasData) => {
  const response = await fetch(`${API_URL}/asistencias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(asistenciasData),
  });

  if (!response.ok) throw new Error('Error al crear asistencias');
  return await response.json();
};

export const obtenerAsistencias = async () => {
  const response = await fetch(`${API_URL}/asistencias`);
  if (!response.ok) throw new Error('Error al obtener asistencias');
  return await response.json();
};

export const justificarAusencia = async (asistenciaId, justificacion) => {
  const response = await fetch(`${API_URL}/asistencias/${asistenciaId}/justificar`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ justificacion }),
  });
  if (!response.ok) {
      throw new Error('Error al justificar la ausencia');
  }
  return response.json();
};

export const fetchAsistencias = async ({ cedula, fecha, id_Materia }) => {
  let url = `${API_URL}/asistencias/estudiante/${cedula}`;
  const params = new URLSearchParams();

  if (fecha) params.append("fecha", fecha);
  if (id_Materia) params.append("id_Materia", id_Materia);

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  try {
    const response = await fetch(url);

    // Verificamos si la respuesta es OK (status 200-299)
    if (!response.ok) {
      // Extraemos el status y tratamos de parsear el body
      const status = response.status;
      let data = null;
      try {
        data = await response.json();
      } catch (_) {
        // Si no se puede parsear, data queda null
      }

      // Dependiendo del status, lanzamos un Error con un prefijo
      if (status === 404) {
        const msg = data?.message || "No se encontraron asistencias con los filtros proporcionados.";
        throw new Error(`NOT_FOUND: ${msg}`);
      } else if (status >= 400 && status < 500) {
        const msg = data?.message || "Hubo un error al procesar la solicitud.";
        throw new Error(`CLIENT_ERROR: ${msg}`);
      } else {
        const msg = data?.message || "Ocurrió un error en el servidor.";
        throw new Error(`SERVER_ERROR: ${msg}`);
      }
    }

    // Si la respuesta es OK, devolvemos el JSON
    return await response.json();
  } catch (error) {
    // Si el fetch falla (CORS, desconexión, etc.), no hay response
    // Verificamos si ya es un error NOT_FOUND, SERVER_ERROR, etc.
    if (
      error.message.startsWith("NOT_FOUND:") ||
      error.message.startsWith("CLIENT_ERROR:") ||
      error.message.startsWith("SERVER_ERROR:")
    ) {
      // Es un error que ya clasificamos arriba
      throw error;
    } else {
      // Caso de fallo de red, CORS, etc.
      throw new Error(`NETWORK_ERROR: ${error.message}`);
    }
  }
};

export const obtenerReporteAsistencias = async (cedula, fechaInicio, fechaFin, idPeriodo, idMateria) => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);
  if (idPeriodo) params.append("id_Periodo", idPeriodo);  // Aseguramos que idMateria sea una cadena válida y no vacía antes de añadirlo
  if (idMateria && idMateria !== "") {
    params.append("id_Materia", idMateria.toString());
    console.log(`Enviando filtro de materia: ${idMateria} a la API`);
    // Para verificar la URL final
    console.log(`URL con parámetros: ${API_URL}/asistencias/reporte/${cedula}?${params.toString()}`);
  }

  const response = await fetch(`${API_URL}/asistencias/reporte/${cedula}?${params.toString()}`);

  // Verificamos si la respuesta es exitosa
  if (!response.ok) {
    if (response.status === 404) {
      // Caso: No se encontraron resultados
      throw new Error("NOT_FOUND");
    } else {
      // Error de servidor (500, 403, etc.)
      throw new Error("SERVER_ERROR");
    }
  }

  const data = await response.json();
  return data;
};

// Nuevo servicio para obtener reporte de asistencia por sección
export const obtenerReporteAsistenciaSeccion = async (idSeccion, fechaInicio, fechaFin, idMateria) => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);
  
  // Verificamos si el filtro de materia está activo
  if (idMateria && idMateria !== "") {
    params.append("id_Materia", idMateria.toString());
    console.log(`Aplicando filtro de materia en servicio seccion: ${idMateria}`);
  }

  const url = `${API_URL}/asistencias/reporte-seccion/${idSeccion}?${params.toString()}`;
  console.log(`Realizando petición a: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("NOT_FOUND");
      } else {
        throw new Error("SERVER_ERROR");
      }
    }

    const data = await response.json();
    
    // Si se especificó una materia, filtramos los resultados localmente para garantizar que solo se muestren
    // los datos de esa materia, en caso de que el backend no aplique el filtro correctamente
    if (idMateria && idMateria !== "" && data.estudiantes && data.estudiantes.length > 0) {
      console.log(`Filtrando ${data.estudiantes.length} estudiantes por materia ID: ${idMateria}`);
      
      // Para cada estudiante, filtramos sus asistencias por la materia seleccionada
      data.estudiantes = data.estudiantes.map(estudiante => {
        // Si el estudiante tiene asistencias por materia, las filtramos
        if (estudiante.asistencias_por_materia && Array.isArray(estudiante.asistencias_por_materia)) {
          // Filtramos para mantener solo las asistencias de la materia seleccionada
          const asistenciasFiltradas = estudiante.asistencias_por_materia.filter(asistencia => {
            const materiaId = asistencia.id_Materia?.toString() || asistencia.materia_id?.toString();
            return materiaId === idMateria.toString();
          });
              // Actualizamos las asistencias del estudiante
          estudiante.asistencias_por_materia = asistenciasFiltradas;
          
          // Recalculamos los totales solo para la materia seleccionada
          if (asistenciasFiltradas.length > 0) {
            // Actualizamos los contadores con los valores filtrados
            const totales = asistenciasFiltradas.reduce((acc, curr) => {
              // Sumamos las propiedades relevantes si existen
              if (curr.asistencias) acc.asistencias += curr.asistencias;
              if (curr.ausencias) acc.ausencias += curr.ausencias;
              if (curr.tardias) acc.tardias += curr.tardias;
              if (curr.justificados) acc.justificados += curr.justificados;
              if (curr.escapados) acc.escapados += curr.escapados;
              return acc;
            }, { asistencias: 0, ausencias: 0, tardias: 0, justificados: 0, escapados: 0 });
            
            console.log(`Estudiante ${estudiante.nombre_completo}: Recalculando totales para materia ID: ${idMateria}`);
            console.log(`Totales originales - A:${estudiante.asistencias}, F:${estudiante.ausencias}, T:${estudiante.tardias}`);
            console.log(`Totales recalculados - A:${totales.asistencias}, F:${totales.ausencias}, T:${totales.tardias}`);
            
            // Actualizamos los contadores del estudiante
            estudiante.asistencias = totales.asistencias;
            estudiante.ausencias = totales.ausencias;
            estudiante.tardias = totales.tardias;
            estudiante.justificados = totales.justificados;
            estudiante.escapados = totales.escapados;
          } else {
            // Si no hay asistencias para esta materia, ponemos todos los contadores a 0
            estudiante.asistencias = 0;
            estudiante.ausencias = 0;
            estudiante.tardias = 0;
            estudiante.justificados = 0;
            estudiante.escapados = 0;
          }
        }
        return estudiante;
      });
      
      // Filtramos para eliminar estudiantes sin asistencias para la materia seleccionada
      data.estudiantes = data.estudiantes.filter(est => 
        est.asistencias_por_materia && est.asistencias_por_materia.length > 0
      );      
      // Recalculamos las estadísticas generales para reflejar solo la materia seleccionada
      if (data.estadisticas_generales) {
        const originales = { ...data.estadisticas_generales };
        
        data.estadisticas_generales.total_asistencias = data.estudiantes.reduce((sum, est) => sum + (est.asistencias || 0), 0);
        data.estadisticas_generales.total_ausencias = data.estudiantes.reduce((sum, est) => sum + (est.ausencias || 0), 0);
        data.estadisticas_generales.total_tardias = data.estudiantes.reduce((sum, est) => sum + (est.tardias || 0), 0);
        data.estadisticas_generales.total_justificados = data.estudiantes.reduce((sum, est) => sum + (est.justificados || 0), 0);
        data.estadisticas_generales.total_escapados = data.estudiantes.reduce((sum, est) => sum + (est.escapados || 0), 0);
        
        console.log("Estadísticas generales actualizadas para la materia:");
        console.log("Originales:", originales);
        console.log("Filtradas:", data.estadisticas_generales);
      }
      
      // Añadimos información sobre el filtro aplicado para que la UI lo muestre correctamente
      if (idMateria && idMateria !== "") {
        data.filtro_aplicado = {
          tipo: "materia",
          id_Materia: idMateria
        };
      }
      
      console.log(`Después de filtrar: ${data.estudiantes.length} estudiantes`);
    }
    
    return data;
  } catch (err) {
    console.error("Error al obtener reporte de sección:", err);
    throw err;
  }
};