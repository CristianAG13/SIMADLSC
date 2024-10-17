import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useFetch from '../../../../Hooks/useFetch';
import FormularioHorarioEstudiante from '../../../PaginaAdministrativa/pages/Horarios/Formularios/FormularioHorarioEstudiante';
import ListaHorarios from './Vistas/ListaHorarios';
import ToggleButton from '../../../../Components/ToggleButton';
import ErrorMessage from '../../../../Components/ErrorMessage';
import LoadingIndicator from '../../../../Components/LoadingIndicator';

export const GestionHorario = () => {
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [horarioEdit, setHorarioEdit] = useState(null); // Estado para el horario a editar

  // Utilizar el hook personalizado useFetch para obtener datos
  const {
    data: grados,
    loading: loadingGrados,
    error: errorGrados,
  } = useFetch('http://localhost:3000/grados');

  const {
    data: secciones,
    loading: loadingSecciones,
    error: errorSecciones,
  } = useFetch('http://localhost:3000/secciones');

  const {
    data: materias,
    loading: loadingMaterias,
    error: errorMaterias,
  } = useFetch('http://localhost:3000/materias');

  const {
    data: profesores,
    loading: loadingProfesores,
    error: errorProfesores,
  } = useFetch('http://localhost:3000/profesores');

  const {
    data: aulas,
    loading: loadingAulas,
    error: errorAulas,
  } = useFetch('http://localhost:3000/aulas');

  const {
    data: horariosData,
    loading: loadingHorarios,
    error: errorHorarios,
    refetch: refetchHorarios,
  } = useFetch('http://localhost:3000/horarios');

  // Actualizar horarios al obtener los datos iniciales
  useEffect(() => {
    if (horariosData) {
      setHorarios(horariosData);
    }
  }, [horariosData]);

  const toggleFormulario = () => {
    setFormularioAbierto(!formularioAbierto);
    setHorarioEdit(null); // Resetear el horarioEdit al abrir o cerrar el formulario
  };

  const handleSubmitSuccess = (nuevoHorario) => {
    setHorarios((prevHorarios) => [...prevHorarios, nuevoHorario]);

    // SweetAlert2 para éxito de registro
    Swal.fire({
      icon: 'success',
      title: 'Horario registrado exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    refetchHorarios(); // Refrescar la lista de horarios
    setFormularioAbierto(false); // Cerrar el formulario después de crear
  };

  const handleEditHorario = (horario) => {
    setFormularioAbierto(true);
    setHorarioEdit(horario); // Establecer el horario a editar
  };

  const handleUpdateHorario = (horarioActualizado) => {
    setHorarios((prevHorarios) =>
      prevHorarios.map((horario) =>
        horario.id_Horario === horarioActualizado.id_Horario ? horarioActualizado : horario
      )
    );

    // SweetAlert2 para éxito de actualización
    Swal.fire({
      icon: 'success',
      title: 'Horario actualizado exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    setHorarioEdit(null);
    setFormularioAbierto(false); // Cerrar el formulario después de actualizar
    refetchHorarios();
  };

  // Manejar estados de carga y errores
  const isLoading =
    loadingGrados ||
    loadingMaterias ||
    loadingProfesores ||
    loadingAulas ||
    loadingHorarios ||
    loadingSecciones;

  const hasError =
    errorGrados ||
    errorMaterias ||
    errorProfesores ||
    errorAulas ||
    errorHorarios ||
    errorSecciones;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Horarios</h1>

      {/* Botón para abrir o cerrar el formulario */}
      <div className="mb-6">
        <ToggleButton
          label={formularioAbierto ? 'Cerrar Formulario' : 'Crear Horario'}
          isSelected={formularioAbierto}
          onClick={toggleFormulario}
          color="green"
        />
      </div>

      {/* Manejar estados de carga y errores */}
      {isLoading && <LoadingIndicator />}
      {hasError && (
        <ErrorMessage message="Hubo un problema al cargar los datos. Por favor, intenta nuevamente." />
      )}

      {/* Mostrar el formulario o la lista, pero no ambos */}
      {!isLoading && !hasError && (
        <>
          {formularioAbierto ? (
            <FormularioHorarioEstudiante
              onSubmitSuccess={horarioEdit ? handleUpdateHorario : handleSubmitSuccess}
              onCancel={() => setFormularioAbierto(false)}
              initialData={horarioEdit}
              grados={grados}
              materias={materias}
              profesores={profesores}
              aulas={aulas}
            />
          ) : (
            <ListaHorarios
              horarios={horarios}
              onEditHorario={handleEditHorario} // Pasar la función de edición
              setHorarios={setHorarios}
              materias={materias}
              profesores={profesores}
              aulas={aulas}
              secciones={secciones}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GestionHorario;
