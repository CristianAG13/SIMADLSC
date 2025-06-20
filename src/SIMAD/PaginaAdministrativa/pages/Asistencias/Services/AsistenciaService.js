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

// Nuevo servicio para obtener reporte de asistencia por sección (sin filtro por materia)
export const obtenerReporteAsistenciaSeccion = async (idSeccion, fechaInicio, fechaFin) => {  const params = new URLSearchParams();
  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);
    const url = `${API_URL}/asistencias/reporte-seccion/${idSeccion}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("NOT_FOUND");
    } else {
      throw new Error("SERVER_ERROR");
    }
  }  
  const data = await response.json();
  return data;
};