import { useState } from 'react';

export const ReporteAsistencia = () => {
  const [studentId, setStudentId] = useState(''); // Guardar el ID del estudiante
  const [grade, setGrade] = useState(''); // Guardar el grado del estudiante
  const [section, setSection] = useState(''); // Guardar la sección del estudiante
  const [startDate, setStartDate] = useState(''); // Guardar la fecha de inicio
  const [endDate, setEndDate] = useState(''); // Guardar la fecha final
  const [filteredData, setFilteredData] = useState([]); // Estado para almacenar los resultados filtrados

  // Datos de ejemplo simulando la base de datos
  const asistenciaData = [
    {
      id_estudiante: 1,
      id_seccion: '7-1',
      id_materia: 67,
      fecha: "2024-09-12T09:30:00.000Z",
      estado: "presente",
      detalles_justificacion: "El estudiante llegó a tiempo"
    },
    {
      id_estudiante: 2,
      id_seccion: '8-1',
      id_materia: 67,
      fecha: "2024-09-10T09:30:00.000Z",
      estado: "ausente",
      detalles_justificacion: "El estudiante llegó tarde"
    },
  ];

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
    setSection(''); // Reiniciar la sección cuando cambia el grado
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filtrar los datos
    const filteredResults = asistenciaData.filter(item => {
      const itemDate = new Date(item.fecha); // Convertir la fecha de la data en un objeto Date
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // Filtrar por ID de estudiante, grado, sección y rango de fechas
      return (
        (studentId ? item.id_estudiante === parseInt(studentId) : true) &&
        (grade ? item.id_seccion.startsWith(grade) : true) &&
        (section ? item.id_seccion === section : true) &&
        (start ? itemDate >= start : true) &&  // Comparar con fecha de inicio
        (end ? itemDate <= end : true)         // Comparar con fecha final
      );
    });

    // Actualizar el estado con los resultados filtrados
    setFilteredData(filteredResults);
  };

  // Función para exportar los datos
  const handleExport = () => {
    console.log('Exportando los datos:', filteredData); // Aquí puedes integrar una librería para exportar en CSV o PDF
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de reportes de asistencia</h1>
        <p className="text-gray-600">Consulta y gestiona los reportes de asistencia por ID de estudiante, grado, sección y fecha.</p>
      </div>

      {/* Filtros para buscar por ID de estudiante, grado, sección y fechas */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">ID estudiante</label>
            <input
              type="number"
              id="studentId"
              name="studentId"
              value={studentId}
              onChange={handleStudentIdChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ingresa el ID del estudiante"
            />
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grado</label>
            <select
              id="grade"
              name="grade"
              value={grade}
              onChange={handleGradeChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Selecciona un Grado</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>
          </div>
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">Sección</label>
            <select
              id="section"
              name="section"
              value={section}
              onChange={handleSectionChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Selecciona una Sección</option>
              {grade &&
                [...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={`${grade}-${num + 1}`}>
                    {`${grade}-${num + 1}`}
                  </option>
                ))
              }
            </select>
          </div>

          {/* Campo de fecha de inicio */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Campo de fecha final */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha Final</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Resultados filtrados: solo mostrar si hay datos en filteredData */}
      {filteredData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Estudiante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map(item => (
                <tr key={item.id_estudiante}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.id_estudiante}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.id_seccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.id_materia}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.fecha).toLocaleDateString()}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${item.estado === 'presente' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.estado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.detalles_justificacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Botón para exportar */}
      {filteredData.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleExport}
            className="w-full bg-green-500 text-white p-2 rounded-md shadow hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Exportar Reporte
          </button>
        </div>
      )}
    </div>
  );
};

export default ReporteAsistencia;
