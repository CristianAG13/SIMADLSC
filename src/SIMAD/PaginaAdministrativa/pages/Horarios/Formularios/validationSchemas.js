// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/validationSchemas.js
import * as Yup from 'yup';

// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/validationSchemas.js

import * as yup from 'yup';

export const HorarioEstudianteSchema = yup.object().shape({
  gradoId: yup.number()
    .typeError('Grado debe ser un número')
    .required('El grado es obligatorio'),
  seccionId: yup.number()
    .typeError('Sección debe ser un número')
    .required('La sección es obligatoria'),
  materiaId: yup.number()
    .typeError('Materia debe ser un número')
    .required('La materia es obligatoria'),
  profesorId: yup.number()
    .typeError('Profesor debe ser un número')
    .required('El profesor es obligatorio'),
  dia_semana_Horario: yup.string()
    .oneOf(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], 'Seleccione un día válido')
    .required('El día de la semana es obligatorio'),
  hora_inicio_Horario: yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de inicio inválida')
    .required('La hora de inicio es obligatoria'),
  hora_fin_Horario: yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de fin inválida')
    .required('La hora de fin es obligatoria'),
  aulaId: yup.number()
    .typeError('Aula debe ser un número')
    .required('El aula es obligatoria'),
});



export const HorarioProfesorSchema = Yup.object().shape({
  profesorId: Yup.number()
    .typeError('El profesor ID debe ser un número')
    .required('El profesor ID es obligatorio'),
  
  gradoId: Yup.number()
    .typeError('El grado ID debe ser un número')
    .required('El grado ID es obligatorio'),
  
  materiaId: Yup.number()
    .typeError('El materia ID debe ser un número')
    .required('El materia ID es obligatorio'),
  
  dia_semana_Horario: Yup.string()
    .oneOf(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], 'Día de semana inválido')
    .required('El día de la semana es obligatorio'),
  
  hora_inicio_Horario: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de inicio inválida')
    .required('La hora de inicio es obligatoria'),
  
  hora_fin_Horario: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de fin inválida')
    .required('La hora de fin es obligatoria'),
  
  aulaId: Yup.number()
    .typeError('El aula ID debe ser un número')
    .required('El aula ID es obligatorio'),
});
