// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/FormularioHorarioProfesor.jsx

import  { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { HorarioProfesorSchema } from './validationSchemas';
import PropTypes from 'prop-types';

const FormularioHorarioProfesor = ({
  onSubmitSuccess,
  horarioInicial = null,
  grados,
  materias,
  profesores,
  aulas,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(HorarioProfesorSchema),
    defaultValues: {
      profesorId: '',
      gradoId: '',
      seccionId: '',
      materiaId: '',
      dia_semana_Horario: '',
      hora_inicio_Horario: '',
      hora_fin_Horario: '',
      aulaId: '',
    },
  });

  // Prellenar el formulario con los datos del horario seleccionado si existe
  useEffect(() => {
    if (horarioInicial) {
      setValue('profesorId', horarioInicial.profesorId);
      setValue('gradoId', horarioInicial.gradoId);
      setValue('seccionId', horarioInicial.seccionId);
      setValue('materiaId', horarioInicial.materiaId);
      setValue('dia_semana_Horario', horarioInicial.dia_semana_Horario);
      setValue('hora_inicio_Horario', horarioInicial.hora_inicio_Horario);
      setValue('hora_fin_Horario', horarioInicial.hora_fin_Horario);
      setValue('aulaId', horarioInicial.aulaId);
    }
  }, [horarioInicial, setValue]);

  // Manejar el cambio de grado para actualizar secciones disponibles
  const gradoSeleccionado = watch('gradoId');

  // Busca el grado seleccionado y obtén las secciones disponibles.
  const seccionesDisponibles = grados.find(
    (grado) => grado.id_grado === Number(gradoSeleccionado)
  )?.secciones || []; // Si el grado tiene secciones, las usa, de lo contrario, un array vací
console.log(seccionesDisponibles);
console.log(grados)

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        ...data,
        id_grado: Number(data.id_grado),
        materiaId: Number(data.materiaId),
        aulaId: Number(data.aulaId),
      };

      if (horarioInicial) {
        // Editar un horario existente
        const response = await axios.put(
          `http://localhost:3000/horarios/${horarioInicial.id_horario}`,
          transformedData
        );
        onSubmitSuccess(response.data);
      } else {
        // Crear un nuevo horario
        const response = await axios.post('http://localhost:3000/horarios/profesor', transformedData);
        onSubmitSuccess(response.data);
        reset(); // Resetear el formulario después de crear
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un error al procesar la solicitud.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
      {/* Combo Box para Profesor */}
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

      {/* Combo Box para Grado */}
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

      {/* Combo Box para Sección */}
      <div className="mb-4">
        <label className="block text-gray-700">Sección</label>
        <select
          className={`border p-2 rounded-lg w-full ${errors.seccionId ? 'border-red-500' : ''}`}
          {...register('seccionId')}
        >
          <option value="">Seleccione una sección</option>
          {seccionesDisponibles.map(({ id_Seccion }) => (
            <option key={id_Seccion} value={id_Seccion}>
              {id_Seccion}
            </option>
          ))}
        </select>
        {errors.seccionId && <p className="text-red-500">{errors.seccionId.message}</p>}
      </div>

      {/* Combo Box para Materia */}
      <div className="mb-4">
        <label className="block text-gray-700">Materia</label>
        <select
          className={`border p-2 rounded-lg w-full ${errors.materiaId ? 'border-red-500' : ''}`}
          {...register('materiaId')}
        >
          <option value="">Seleccione una materia</option>
          {materias.map((materia, index) => (
            <option key={materia.id_Materia || index} value={materia.id_Materia}>
              {materia.nombre_Materia}
            </option>
          ))}
        </select>
        {errors.materiaId && <p className="text-red-500">{errors.materiaId.message}</p>}
      </div>

      {/* Combo Box para Día */}
      <div className="mb-4">
        <label className="block text-gray-700">Día de la Semana</label>
        <select
          className={`border p-2 rounded-lg w-full ${errors.dia_semana_Horario ? 'border-red-500' : ''}`}
          {...register('dia_semana_Horario')}
        >
          <option value="">Seleccione un día</option>
          <option value="Lunes">Lunes</option>
          <option value="Martes">Martes</option>
          <option value="Miércoles">Miercoles</option>
          <option value="Jueves">Jueves</option>
          <option value="Viernes">Viernes</option>
          <option value="Sábado">Sábado</option>
          <option value="Domingo">Domingo</option>
        </select>
        {errors.dia_semana_Horario && <p className="text-red-500">{errors.dia_semana_Horario.message}</p>}
      </div>

      {/* Hora de Inicio */}
      <div className="mb-4">
        <label className="block text-gray-700">Hora de Inicio</label>
        <input
          type="time"
          className={`border p-2 rounded-lg w-full ${errors.hora_inicio_Horario ? 'border-red-500' : ''}`}
          {...register('hora_inicio_Horario')}
        />
        {errors.hora_inicio_Horario && <p className="text-red-500">{errors.hora_inicio_Horario.message}</p>}
      </div>

      {/* Hora de Fin */}
      <div className="mb-4">
        <label className="block text-gray-700">Hora de Fin</label>
        <input
          type="time"
          className={`border p-2 rounded-lg w-full ${errors.hora_fin_Horario ? 'border-red-500' : ''}`}
          {...register('hora_fin_Horario')}
        />
        {errors.hora_fin_Horario && <p className="text-red-500">{errors.hora_fin_Horario.message}</p>}
      </div>

      {/* Combo Box para Aula */}
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

      {/* Botones */}
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
          onClick={() => {
            reset();
            onSubmitSuccess(null);
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : horarioInicial ? 'Guardar Cambios' : 'Registrar Horario'}
        </button>
      </div>
    </form>
  );
};

FormularioHorarioProfesor.propTypes = {
  onSubmitSuccess: PropTypes.func.isRequired,
  horarioInicial: PropTypes.object,
  grados: PropTypes.array.isRequired,
  materias: PropTypes.array.isRequired,
  profesores: PropTypes.array.isRequired,
  aulas: PropTypes.array.isRequired,
};

export default FormularioHorarioProfesor;
