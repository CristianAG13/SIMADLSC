import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { HorarioEstudianteSchema } from './validationSchemas';
import PropTypes from 'prop-types';

const FormularioHorarioEstudiante = ({
  onSubmitSuccess,
  onCancel,
  initialData = null,
  grados,
  materias,
  profesores,
  aulas,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(HorarioEstudianteSchema, { context: { isEditing: !!initialData } }),
    defaultValues: {
      gradoId: '',
      seccionId: '',
      materiaId: '',
      profesorId: '',
      dia_semana_Horario: '',
      hora_inicio_Horario: '',
      hora_fin_Horario: '',
      aulaId: '',
    },
  });

  const gradoSeleccionado = watch('gradoId');
  const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);

  useEffect(() => {
    const fetchSecciones = async () => {
      if (gradoSeleccionado) {
        try {
          const response = await axios.get(`http://localhost:3000/secciones?gradoId=${gradoSeleccionado}`);
          setSeccionesDisponibles(response.data);
        } catch (error) {
          console.error('Error al obtener las secciones:', error);
        }
      } else {
        setSeccionesDisponibles([]);
      }
    };

    fetchSecciones();
  }, [gradoSeleccionado]);

  useEffect(() => {
    if (initialData) {
      // Establecemos todos los campos excepto las horas
      setValue('gradoId', initialData.gradoId || '');
      setValue('seccionId', initialData.seccionId || '');
      setValue('materiaId', initialData.materiaId || '');
      setValue('profesorId', initialData.profesorId || '');
      setValue('dia_semana_Horario', initialData.dia_semana_Horario || '');
      setValue('aulaId', initialData.aulaId || '');
      // No pre-poblamos hora_inicio_Horario ni hora_fin_Horario
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        gradoId: Number(data.gradoId),
        seccionId: Number(data.seccionId),
        materiaId: Number(data.materiaId),
        profesorId: Number(data.profesorId),
        aulaId: Number(data.aulaId),
        dia_semana_Horario: data.dia_semana_Horario,
        ...(data.hora_inicio_Horario && { hora_inicio_Horario: data.hora_inicio_Horario }),
        ...(data.hora_fin_Horario && { hora_fin_Horario: data.hora_fin_Horario }),
      };

      let response;

      if (initialData) {
        // Editar horario existente
        response = await axios.put(
          `http://localhost:3000/horarios/estudiante/${initialData.id_Horario}`,
          transformedData
        );
        Swal.fire('Éxito', 'Horario de estudiante actualizado exitosamente.', 'success');
      } else {
        // Crear nuevo horario
        response = await axios.post('http://localhost:3000/horarios/estudiante', transformedData);
        Swal.fire('Éxito', 'Horario de estudiante creado exitosamente.', 'success');
      }

      reset();

      if (onSubmitSuccess) onSubmitSuccess(response.data);
    } catch (error) {
      console.error('Error al guardar el horario de estudiante:', error);
      Swal.fire('Error', 'Hubo un problema al guardar el horario.', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {initialData ? 'Editar Horario de Estudiante' : 'Crear Horario de Estudiante'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Grado */}
        <div className="mb-4">
          <label className="block text-gray-700">Grado</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.gradoId ? 'border-red-500' : ''}`}
            {...register('gradoId')}
          >
            <option value="">Seleccione un grado</option>
            {grados.map((grado) => (
              <option key={grado.id_grado} value={grado.id_grado}>
                {grado.nivel}
              </option>
            ))}
          </select>
          {errors.gradoId && <p className="text-red-500">{errors.gradoId.message}</p>}
        </div>

        {/* Sección */}
        <div className="mb-4">
          <label className="block text-gray-700">Sección</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.seccionId ? 'border-red-500' : ''}`}
            {...register('seccionId')}
            disabled={!gradoSeleccionado}
          >
            <option value="">Seleccione una sección</option>
            {seccionesDisponibles.map((seccion) => (
              <option key={seccion.id_Seccion} value={seccion.id_Seccion}>
                {seccion.nombre_Seccion}
              </option>
            ))}
          </select>
          {errors.seccionId && <p className="text-red-500">{errors.seccionId.message}</p>}
        </div>

        {/* Resto de los campos del formulario */}
        {/* Materia, Profesor, Aula, Día de la Semana, Hora de Inicio, Hora de Fin */}

        {/* Materia */}
        <div className="mb-4">
          <label className="block text-gray-700">Materia</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.materiaId ? 'border-red-500' : ''}`}
            {...register('materiaId')}
          >
            <option value="">Seleccione una materia</option>
            {materias.map((materia) => (
              <option key={materia.id_Materia} value={materia.id_Materia}>
                {materia.nombre_Materia}
              </option>
            ))}
          </select>
          {errors.materiaId && <p className="text-red-500">{errors.materiaId.message}</p>}
        </div>

        {/* Profesor */}
        <div className="mb-4">
          <label className="block text-gray-700">Profesor</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.profesorId ? 'border-red-500' : ''}`}
            {...register('profesorId')}
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.id_Profesor} value={profesor.id_Profesor}>
                {`${profesor.nombre_Profesor} ${profesor.apellido1_Profesor} ${profesor.apellido2_Profesor}`}
              </option>
            ))}
          </select>
          {errors.profesorId && <p className="text-red-500">{errors.profesorId.message}</p>}
        </div>

        {/* Aula */}
        <div className="mb-4">
          <label className="block text-gray-700">Aula</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.aulaId ? 'border-red-500' : ''}`}
            {...register('aulaId')}
          >
            <option value="">Seleccione un aula</option>
            {aulas.map((aula) => (
              <option key={aula.id_aula} value={aula.id_aula}>
                {aula.nombre_Aula}
              </option>
            ))}
          </select>
          {errors.aulaId && <p className="text-red-500">{errors.aulaId.message}</p>}
        </div>

        {/* Día de la Semana */}
        <div className="mb-4">
          <label className="block text-gray-700">Día de la Semana</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.dia_semana_Horario ? 'border-red-500' : ''}`}
            {...register('dia_semana_Horario')}
          >
            <option value="">Seleccione un día</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>
          {errors.dia_semana_Horario && <p className="text-red-500">{errors.dia_semana_Horario.message}</p>}
        </div>

        {/* Hora de Inicio */}
        <div className="mb-4">
          <label className="block text-gray-700">Hora de Inicio (ej: 13:00)</label>
          <input
            type="time"
            className={`border p-2 rounded-lg w-full ${errors.hora_inicio_Horario ? 'border-red-500' : ''}`}
            {...register('hora_inicio_Horario')}
          />
          {errors.hora_inicio_Horario && <p className="text-red-500">{errors.hora_inicio_Horario.message}</p>}
        </div>

        {/* Hora de Fin */}
        <div className="mb-4">
          <label className="block text-gray-700">Hora de Fin (ej: 14:30)</label>
          <input
            type="time"
            className={`border p-2 rounded-lg w-full ${errors.hora_fin_Horario ? 'border-red-500' : ''}`}
            {...register('hora_fin_Horario')}
          />
          {errors.hora_fin_Horario && <p className="text-red-500">{errors.hora_fin_Horario.message}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            onClick={() => {
              reset();
              if (onCancel) onCancel();
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Registrar Horario'}
          </button>
        </div>
      </form>
    </div>
  );
};

FormularioHorarioEstudiante.propTypes = {
  onSubmitSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  initialData: PropTypes.object,
  grados: PropTypes.array.isRequired,
  materias: PropTypes.array.isRequired,
  profesores: PropTypes.array.isRequired,
  aulas: PropTypes.array.isRequired,
};

export default FormularioHorarioEstudiante;
