import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { HorarioEstudianteSchema } from './validationSchemas';

const API_BASE_URL =
  import.meta.env.NODE_ENV === 'production'



const lessonTimes = {
  "1": { start: "07:00", end: "07:40" },
  "2": { start: "07:40", end: "08:20" },
  "3": { start: "08:30", end: "09:10" },
  "4": { start: "09:10", end: "09:50" },
  "5": { start: "10:00", end: "10:40" },
  "6": { start: "10:40", end: "11:20" },
  "7": { start: "12:00", end: "12:40" },
  "8": { start: "12:40", end: "13:20" },
  "9": { start: "13:25", end: "14:05" },
  "10": { start: "14:05", end: "14:45" },
  "11": { start: "14:55", end: "15:35" },
  "12": { start: "15:35", end: "16:15" },
};

const FormularioHorarioEstudiante = ({
  onSubmitSuccess,
  onCancel,
  initialData = null,
  grados,
  materias,
  profesores,
  aulas,
}) => {
  const isEditing = !!initialData;


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(HorarioEstudianteSchema),
    defaultValues: {
      gradoId: '',
      seccionId: '',
      materiaId: '',
      profesorId: '',
      dia_semana_Horario: '',
      aulaId: '',
      lessons: [
        {
          lessonKey: '',
          hora_inicio_Horario: '',
          hora_fin_Horario: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lessons',
  });

  const [errorGeneral, setErrorGeneral] = useState('');
  const gradoSeleccionado = watch('gradoId');
  const diaSeleccionado = watch('dia_semana_Horario');
  const seccionSeleccionada = watch('seccionId');


  const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);


  useEffect(() => {
    const fetchSecciones = async () => {
      if (gradoSeleccionado) {
        try {
          const response = await axios.get(`${API_BASE_URL}/secciones?gradoId=${gradoSeleccionado}`);
          setSeccionesDisponibles(response.data);
        } catch (error) {
          console.error('Error al obtener las secciones:', error);
          Swal.fire('Error', 'Hubo un problema al obtener las secciones.', 'error');
        }
      } else {
        setSeccionesDisponibles([]);
      }
    };
    fetchSecciones();
  }, [gradoSeleccionado]);


  const [materiasDelProfesor, setMateriasDelProfesor] = useState([]);



  useEffect(() => {
    const profesorId = watch('profesorId');

    if (profesorId) {
      const fetchMaterias = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/profesores/${profesorId}/materias`);
          setMateriasDelProfesor(response.data.materias || []); // 👈 Accede a "materias"
          setValue('materiaId', ''); // Limpia el campo materia cuando cambia el profesor
        } catch (error) {
          console.error('Error al obtener materias del profesor:', error);
          Swal.fire('Error', 'No se pudieron obtener las materias del profesor.', 'error');
          setMateriasDelProfesor([]);
        }
      };
      fetchMaterias();
    } else {
      setMateriasDelProfesor([]);
      setValue('materiaId', '');
    }
  }, [watch('profesorId')]);



  useEffect(() => {
    if (initialData) {
      setValue('gradoId', initialData.gradoId || '');
      setValue('seccionId', initialData.seccionId || '');
      setValue('materiaId', initialData.materiaId || '');
      setValue('profesorId', initialData.profesorId || '');
      setValue('dia_semana_Horario', initialData.dia_semana_Horario || '');
      setValue('aulaId', initialData.aulaId || '');

    }
  }, [initialData, setValue]);


  const [occupiedLessons, setOccupiedLessons] = useState([]);

  useEffect(() => {
    const fetchHorariosSeccion = async () => {
      if (diaSeleccionado && seccionSeleccionada) {
        try {
          const resp = await axios.get(`${API_BASE_URL}/horarios/seccion/${seccionSeleccionada}`);
          const sameDay = resp.data.filter(
            (item) => item.dia_semana_Horario === diaSeleccionado
          );
          const used = [];
          sameDay.forEach((item) => {
            const startHHmm = item.hora_inicio_Horario.substring(0, 5);
            const endHHmm = item.hora_fin_Horario.substring(0, 5);

            const foundKey = Object.entries(lessonTimes).find(
              ([, val]) => val.start === startHHmm && val.end === endHHmm
            );
            if (foundKey) used.push(foundKey[0]);
          });
          setOccupiedLessons(used);
        } catch (error) {
          console.error('Error al obtener horarios de la seccion:', error);
        }
      } else {
        setOccupiedLessons([]);
      }
    };

    fetchHorariosSeccion();
  }, [diaSeleccionado, seccionSeleccionada]);

  const getAvailableLessons = (index) => {
    let allKeys = Object.keys(lessonTimes);

    allKeys = allKeys.filter((k) => !occupiedLessons.includes(k));

    const selectedLessons = watch('lessons').map((l) => l.lessonKey).filter(Boolean);
    const currentValue = selectedLessons[index];
    const selectedOthers = selectedLessons.filter((_, i) => i !== index);

    allKeys = allKeys.filter((k) => !selectedOthers.includes(k));

    if (
      currentValue &&
      !occupiedLessons.includes(currentValue) &&
      !selectedOthers.includes(currentValue) &&
      !allKeys.includes(currentValue)
    ) {
      allKeys.push(currentValue);
    }

    return allKeys;
  };
  const handleLessonChange = (lessonKey, index) => {
    if (lessonTimes[lessonKey]) {
      setValue(`lessons.${index}.hora_inicio_Horario`, lessonTimes[lessonKey].start);
      setValue(`lessons.${index}.hora_fin_Horario`, lessonTimes[lessonKey].end);
    } else {
      setValue(`lessons.${index}.hora_inicio_Horario`, '');
      setValue(`lessons.${index}.hora_fin_Horario`, '');
    }
  };

  const onSubmit = async (formData) => {
    try {
      setErrorGeneral('');

      const {
        gradoId,
        seccionId,
        materiaId,
        profesorId,
        dia_semana_Horario,
        aulaId,
        lessons,
      } = formData;

      // Datos comunes
      const commonData = {
        gradoId: Number(gradoId),
        seccionId: Number(seccionId),
        materiaId: Number(materiaId),
        profesorId: Number(profesorId),
        aulaId: Number(aulaId),
        dia_semana_Horario,
      };

      if (isEditing && initialData?.id_Horario) {

        const [firstLesson] = lessons;
        const updateData = {
          ...commonData,
          hora_inicio_Horario: firstLesson.hora_inicio_Horario,
          hora_fin_Horario: firstLesson.hora_fin_Horario,
        };

        const response = await axios.put(
          `${API_BASE_URL}/horarios/estudiante/${initialData.id_Horario}`,
          updateData
        );
        Swal.fire('Éxito', 'Horario de estudiante actualizado exitosamente.', 'success');
        reset();
        if (onSubmitSuccess) onSubmitSuccess(response.data);
        return;
      }
      const createdHorarios = [];
      const createdLessonKeys = [];

      for (const lesson of lessons) {
        if (lesson.lessonKey) {
          const newHorarioData = {
            ...commonData,
            hora_inicio_Horario: lesson.hora_inicio_Horario,
            hora_fin_Horario: lesson.hora_fin_Horario,
          };

          const resp = await axios.post(`${API_BASE_URL}/horarios/estudiante`, newHorarioData);
          createdHorarios.push(resp.data);
          createdLessonKeys.push(lesson.lessonKey);
        }
      }


      if (createdLessonKeys.length > 0) {
        Swal.fire(
          'Éxito',
          `Se crearon los horarios exitosamente para las lecciones: ${createdLessonKeys.join(', ')}`,
          'success'
        );
      } else {
        Swal.fire('Info', 'No se creó ningún horario (no se seleccionaron lecciones).', 'info');
      }

      const newFields = watch('lessons').filter((l) => !createdLessonKeys.includes(l.lessonKey));
      reset(
        {
          ...formData,
          lessons: newFields,
        },
        {
          keepDefaultValues: true,
        }
      );

      if (onSubmitSuccess) onSubmitSuccess(createdHorarios);
    } catch (error) {
      console.error('Error al guardar el horario de estudiante:', error);

      if (error.response && error.response.data) {
        const {
          errors: backendErrors,
          message: backendMessage,
          error: backendError,
        } = error.response.data;

        if (backendErrors && typeof backendErrors === 'object') {
          Object.keys(backendErrors).forEach((field) => {
            setError(field, { type: 'server', message: backendErrors[field] });
          });
        }

        const message =
          backendMessage || backendError || 'Hubo un problema al guardar el horario.';
        if (message) {
          setErrorGeneral(message);
        }

        Swal.fire(
          'Error',
          'Hubo un problema al guardar el horario. Revisa los errores en el formulario.',
          'error'
        );
      } else {
        setErrorGeneral('Hubo un problema inesperado al guardar el horario.');
        Swal.fire('Error', 'Hubo un problema al guardar el horario.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        {isEditing ? 'Editar Horario de Estudiante' : 'Crear Horario de Estudiante'}
      </h2>
  
      {errorGeneral && <p className="text-red-500 mb-4">{errorGeneral}</p>}
  
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Grado */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200">Grado</label>
          <select
            className={`border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.gradoId ? 'border-red-500' : ''}`}
            {...register('gradoId')}
          >
            <option value="">Seleccione un grado</option>
            {grados.map((grado) => (
              <option key={grado.id_grado} value={grado.id_grado}>{grado.nivel}</option>
            ))}
          </select>
          {errors.gradoId && <p className="text-red-500">{errors.gradoId.message}</p>}
        </div>
  
        {/* Sección */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200">Sección</label>
          <select
            className={`border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.seccionId ? 'border-red-500' : ''}`}
            {...register('seccionId')}
            disabled={!gradoSeleccionado}
          >
            <option value="">Seleccione una sección</option>
            {seccionesDisponibles.map((seccion) => (
              <option key={seccion.id_Seccion} value={seccion.id_Seccion}>{seccion.nombre_Seccion}</option>
            ))}
          </select>
          {errors.seccionId && <p className="text-red-500">{errors.seccionId.message}</p>}
        </div>
  
        {/* Profesor */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200">Profesor</label>
          <select
            className={`border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.profesorId ? 'border-red-500' : ''}`}
            {...register('profesorId')}
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.id_Profesor} value={profesor.id_Profesor}>
                {profesor.nombre_Profesor} {profesor.apellido1_Profesor} {profesor.apellido2_Profesor}
              </option>
            ))}
          </select>
          {errors.profesorId && <p className="text-red-500">{errors.profesorId.message}</p>}
        </div>
  
        {/* Materia */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200">Materia</label>
          <select
            className={`border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.materiaId ? 'border-red-500' : ''}`}
            {...register('materiaId')}
            disabled={!watch('profesorId')}
          >
            <option value="">Seleccione una materia</option>
            {materiasDelProfesor.map((materia) => (
              <option key={materia.id} value={materia.id}>{materia.nombre}</option>
            ))}
          </select>
        </div>
  
        {/* Aula */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200">Aula</label>
          <select
            className={`border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.aulaId ? 'border-red-500' : ''}`}
            {...register('aulaId')}
          >
            <option value="">Seleccione un aula</option>
            {aulas.map((aula) => (
              <option key={aula.id_aula} value={aula.id_aula}>{aula.nombre_Aula}</option>
            ))}
          </select>
          {errors.aulaId && <p className="text-red-500">{errors.aulaId.message}</p>}
        </div>
  
        {/* Día de la Semana */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200">Día de la Semana</label>
          <select
            className={`border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.dia_semana_Horario ? 'border-red-500' : ''}`}
            {...register('dia_semana_Horario')}
          >
            <option value="">Seleccione un día</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>
          {errors.dia_semana_Horario && (
            <p className="text-red-500">{errors.dia_semana_Horario.message}</p>
          )}
        </div>
  
        {/* Lecciones */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Lecciones</label>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 mb-4 rounded relative dark:border-gray-600">
              <label className="block text-gray-700 dark:text-gray-200">Lección #{index + 1}</label>
              <select
                className="border p-2 rounded-lg w-full mt-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                {...register(`lessons.${index}.lessonKey`)}
                onChange={(e) => handleLessonChange(e.target.value, index)}
              >
                <option value="">Seleccione una lección</option>
                {getAvailableLessons(index).map((key) => (
                  <option key={key} value={key}>{key} Lección</option>
                ))}
              </select>
  
              <input type="hidden" {...register(`lessons.${index}.hora_inicio_Horario`)} />
              <input type="hidden" {...register(`lessons.${index}.hora_fin_Horario`)} />
  
              {fields.length > 1 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => remove(index)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
  
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
            onClick={() => append({ lessonKey: '', hora_inicio_Horario: '', hora_fin_Horario: '' })}
          >
            Agregar otra lección
          </button>
        </div>
  
        {/* Acciones */}
        <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Guardando...'
              : isEditing
              ? 'Guardar Cambios'
              : 'Registrar Horario(s)'}
          </button>
  
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full sm:w-auto"
            onClick={() => {
              reset();
              setErrorGeneral('');
              if (onCancel) onCancel();
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
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
