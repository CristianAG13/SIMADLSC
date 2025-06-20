import useGrados from "../../Asistencias/Hook/useGrados";
import { useMatriculaForm } from "../Hooks/useMatriculaForm";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import ActivarFormularioButton from "./ActivarFormularioButton";
import { useEffect, useState } from "react";
import axios from "axios"; // Asegúrate de importar axios si no está ya importado

const validarCedulaUsuario = async (cedula, API_BASE_URL) => {
  const idEst = localStorage.getItem("id_Estudiante");
  if (!idEst) return false;
  try {
    const { data } = await axios.get(`${API_BASE_URL}/estudiantes/${idEst}`);
    return data.cedula.trim() === cedula.trim();
  } catch {
    return false;
  }
};

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const FormularioMatricula = () => {
  const {
    page,
    setPage,
    formData,
    removeFile, // <-- usa el formData del hook
    handleChange, // <-- usa el handleChange del hook
    handleSubmit,
    handleFileChange,    // ← nuevo
    files,    
    isSubmitting,
  } = useMatriculaForm();

  const { grados } = useGrados();

  // Obtenemos role y userId del localStorage (o de donde corresponda)
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId") || "default";
  

  // Estados para controlar la activación del formulario, el deadline y envío único
  const [isFormActive, setIsFormActive] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // Controla si los campos son editables
  const [timeToResend, setTimeToResend] = useState(null);

  // Cargamos el estado del formulario y el deadline desde localStorage al montar
  useEffect(() => {
    const formActiveLS = localStorage.getItem("formActive");
    setIsFormActive(formActiveLS === "true");

    const deadlineLS = localStorage.getItem("formDeadline");
    if (deadlineLS) {
      setDeadline(Number(deadlineLS));
    }
  }, []);

  // Escuchamos cambios en localStorage para mantener la actualización en tiempo real
  useEffect(() => {
    const handleStorageChange = () => {
      const formActiveLS = localStorage.getItem("formActive");
      setIsFormActive(formActiveLS === "true");

      const deadlineLS = localStorage.getItem("formDeadline");
      if (deadlineLS) {
        setDeadline(Number(deadlineLS));
      } else {
        setDeadline(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Verificamos si el usuario ya envió el formulario (envío único de 24 horas)
  useEffect(() => {
    const submittedTime = localStorage.getItem(`matricula-submitted-${userId}`);
    if (submittedTime) {
      const timeDiff = Date.now() - Number(submittedTime);
      const twentyFourHours = 86400000;
      if (timeDiff < twentyFourHours) {
        setHasSubmitted(true);
        setTimeToResend(twentyFourHours - timeDiff);
      } else {
        localStorage.removeItem(`matricula-submitted-${userId}`);
        setHasSubmitted(false);
        setTimeToResend(null);
      }
    }
  }, [userId]);

  const API_BASE_URL =
    import.meta.env.NODE_ENV === "production"

  // Función para calcular la edad a partir de la fecha de nacimiento
  const handleFechaNacimientoChange = (e) => {
    handleChange(e);
    const birthDate = new Date(e.target.value);
    if (!e.target.value || isNaN(birthDate.getTime())) return;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // Actualizamos el campo 'edad' en el estado del formulario
    const edadEvent = {
      target: { name: "estudiante.edad", value: age },
    };
    handleChange(edadEvent);
  };

  const buscarEstudiantePorCedula = async (cedula) => {
    if (!cedula || cedula.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingrese un número de cédula antes de buscar.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // 6.1) Validar cédula vs usuario logeado
    const esValida = await validarCedulaUsuario(cedula, API_BASE_URL);
    if (!esValida) {
      return Swal.fire({
        icon: "error",
        title: "Cédula inválida",
        text: "Solo puedes usar tu propia cédula.",
        confirmButtonColor: "#2563EB",
      });
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/estudiantes/cedula/${cedula}`
      );
      const estudiante = response.data;

      if (estudiante) {
        // Actualizar los datos del estudiante y del encargado legal
        handleChange({
          target: { name: "estudiante.cedula", value: estudiante.cedula },
        });
        handleChange({
          target: {
            name: "estudiante.nombre_Estudiante",
            value: estudiante.nombre_Estudiante,
          },
        });
        handleChange({
          target: {
            name: "estudiante.apellido1_Estudiante",
            value: estudiante.apellido1_Estudiante,
          },
        });
        handleChange({
          target: {
            name: "estudiante.apellido2_Estudiante",
            value: estudiante.apellido2_Estudiante,
          },
        });
        handleChange({
          target: {
            name: "estudiante.fecha_nacimiento",
            value: estudiante.fecha_nacimiento,
          },
        });
        handleChange({
          target: {
            name: "estudiante.correo_estudiantil",
            value: estudiante.correo_estudiantil,
          },
        });
        handleChange({
          target: { name: "estudiante.telefono", value: estudiante.telefono },
        });
        handleChange({
          target: { name: "estudiante.sexo", value: estudiante.sexo },
        });
        handleChange({
          target: {
            name: "estudiante.lugar_de_nacimiento",
            value: estudiante.lugar_de_nacimiento,
          },
        });
        handleChange({
          target: {
            name: "estudiante.nacionalidad",
            value: estudiante.nacionalidad,
          },
        });
        handleChange({
          target: { name: "estudiante.edad", value: estudiante.edad },
        });
        handleChange({
          target: {
            name: "estudiante.condicion_migratoria",
            value: estudiante.condicion_migratoria,
          },
        });
        handleChange({
          target: {
            name: "estudiante.Repite_alguna_materia",
            value: estudiante.Repite_alguna_materia,
          },
        });
        handleChange({
          target: {
            name: "estudiante.institucion_de_procedencia",
            value: estudiante.institucion_de_procedencia,
          },
        });
        handleChange({
          target: {
            name: "estudiante.tipo_de_adecuacion",
            value: estudiante.tipo_de_adecuacion,
          },
        });
        handleChange({
          target: {
            name: "estudiante.recibe_religion",
            value: estudiante.recibe_religion,
          },
        });
        handleChange({
          target: {
            name: "estudiante.presenta_carta",
            value: estudiante.presenta_carta,
          },
        });
        handleChange({
          target: {
            name: "estudiante.Presenta_alguna_enfermedad",
            value: estudiante.Presenta_alguna_enfermedad,
          },
        });
        handleChange({
          target: {
            name: "estudiante.medicamentos_que_debe_tomar",
            value: estudiante.medicamentos_que_debe_tomar,
          },
        });
        handleChange({
          target: {
            name: "estudiante.Ruta_de_viaje",
            value: estudiante.Ruta_de_viaje,
          },
        });
        // Encargado legal
        handleChange({
          target: {
            name: "encargadoLegal.nombre_Encargado_Legal",
            value: estudiante.encargadoLegal.nombre_Encargado_Legal,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.apellido1_Encargado_Legal",
            value: estudiante.encargadoLegal.apellido1_Encargado_Legal,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.apellido2_Encargado_Legal",
            value: estudiante.encargadoLegal.apellido2_Encargado_Legal,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.N_Cedula",
            value: estudiante.encargadoLegal.N_Cedula,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.ocupacion",
            value: estudiante.encargadoLegal.ocupacion,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.nacionalidad",
            value: estudiante.encargadoLegal.nacionalidad,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.direccion",
            value: estudiante.encargadoLegal.direccion,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.telefono_celular",
            value: estudiante.encargadoLegal.telefono_celular,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.habitacion",
            value: estudiante.encargadoLegal.habitacion,
          },
        });
        handleChange({
          target: {
            name: "encargadoLegal.correo",
            value: estudiante.encargadoLegal.correo,
          },
        });

        // Permitir la edición si los datos son correctos
        setIsEditable(true);

        Swal.fire({
          icon: "success",
          title: "Estudiante encontrado",
          text: "Los datos del estudiante y del encargado legal han sido rellenados automáticamente. Ahora puedes editarlos.",
          confirmButtonColor: "#2563EB",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Permitir la edición manual si no se encuentra el estudiante
        setIsEditable(true);
        Swal.fire({
          icon: "warning",
          title: "Estudiante no encontrado",
          text: `No se encontró un estudiante con la cédula: ${cedula}. Por favor, ingrese los datos manualmente.`,
          confirmButtonColor: "#2563EB",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al buscar el estudiante. Intente nuevamente.",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  // Validaciones antes de enviar el formulario
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const ced = formData.estudiante.cedula.trim();
    const idEst = localStorage.getItem("id_estudiante");
    try {
      const { data: userData } = await axios.get(
        `${API_BASE_URL}/estudiantes/${idEst}`
      );
      if (userData.cedula.trim() !== ced) {
        return Swal.fire({
          icon: "error",
          title: "Cédula inválida",
          text: "Solo puedes enviar tu propia cédula.",
          confirmButtonColor: "#2563EB",
        });
      }
    } catch {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo validar la cédula.",
        confirmButtonColor: "#2563EB",
      });
    }

    // Si ya se envió, mostramos aviso
    if (hasSubmitted) {
      Swal.fire({
        icon: "info",
        title: "Ya enviaste el formulario",
        text: "No puedes enviar más de una vez.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // Si el formulario está inactivo, no se permite el envío
    if (!isFormActive) {
      Swal.fire({
        icon: "warning",
        title: "Formulario Inactivo",
        text: "No puedes enviar el formulario porque está deshabilitado actualmente.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    // Validar campos vacíos o inválidos
    const missingFields = [];

    // Verificar campos básicos
    if (!formData.estudiante.gradoId || formData.estudiante.gradoId === "") {
      missingFields.push("Grado");
    }

    // Campos de estudiante
    if (
      !formData.estudiante.nombre_Estudiante ||
      formData.estudiante.nombre_Estudiante.trim() === ""
    ) {
      missingFields.push("Nombre del estudiante");
    }
    if (
      !formData.estudiante.apellido1_Estudiante ||
      formData.estudiante.apellido1_Estudiante.trim() === ""
    ) {
      missingFields.push("Primer apellido del estudiante");
    }
    if (
      !formData.estudiante.apellido2_Estudiante ||
      formData.estudiante.apellido2_Estudiante.trim() === ""
    ) {
      missingFields.push("Segundo apellido del estudiante");
    }
    if (!formData.estudiante.edad || formData.estudiante.edad === "") {
      missingFields.push("Edad del estudiante");
    }
    if (
      !formData.estudiante.telefono ||
      formData.estudiante.telefono.trim() === ""
    ) {
      missingFields.push("Teléfono del estudiante");
    }
    if (
      !formData.estudiante.cedula ||
      formData.estudiante.cedula.trim() === ""
    ) {
      missingFields.push("Cédula del estudiante");
    } else {
      // Permitir ambos formatos: 1-2345-6789 y 1558-4834-4420
      const cedulaRegex = /^(\d-\d{4}-\d{4}|\d{4}-\d{4}-\d{4})$/;
      if (!cedulaRegex.test(formData.estudiante.cedula.trim())) {
        missingFields.push("Cédula del estudiante (formato válido: 1-2345-6789 o 1558-4834-4420)");
      }
    }
    if (
      !formData.estudiante.correo_estudiantil ||
      formData.estudiante.correo_estudiantil.trim() === ""
    ) {
      missingFields.push("Correo estudiantil");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.estudiante.correo_estudiantil.trim())) {
        missingFields.push("Correo estudiantil (debe ser un email válido)");
      }
    }
    if (
      !formData.estudiante.fecha_nacimiento ||
      formData.estudiante.fecha_nacimiento.trim() === ""
    ) {
      missingFields.push("Fecha de nacimiento");
    }
    if (!formData.estudiante.sexo || formData.estudiante.sexo.trim() === "") {
      missingFields.push("Sexo");
    }
    if (
      !formData.estudiante.lugar_de_nacimiento ||
      formData.estudiante.lugar_de_nacimiento.trim() === ""
    ) {
      missingFields.push("Lugar de nacimiento");
    }
    if (
      !formData.estudiante.nacionalidad ||
      formData.estudiante.nacionalidad.trim() === ""
    ) {
      missingFields.push("Nacionalidad del estudiante");
    }
    if (
      !formData.estudiante.condicion_migratoria ||
      formData.estudiante.condicion_migratoria.trim() === ""
    ) {
      missingFields.push("Condición migratoria");
    }
    if (
      !formData.estudiante.Repite_alguna_materia ||
      formData.estudiante.Repite_alguna_materia.trim() === ""
    ) {
      // Asignar un valor por defecto si está vacío
      formData.estudiante.Repite_alguna_materia = "Ninguna";
    }
    if (
      !formData.estudiante.institucion_de_procedencia ||
      formData.estudiante.institucion_de_procedencia.trim() === ""
    ) {
      missingFields.push("Institución de procedencia");
    }
    if (
      !formData.estudiante.tipo_de_adecuacion ||
      formData.estudiante.tipo_de_adecuacion.trim() === ""
    ) {
      missingFields.push("Tipo de adecuación");
    } else if (
      !["N", "DA", "S", "NS"].includes(formData.estudiante.tipo_de_adecuacion)
    ) {
      missingFields.push("Tipo de adecuación (debe ser N, DA, S o NS)");
    }
    if (
      !formData.estudiante.Presenta_alguna_enfermedad ||
      formData.estudiante.Presenta_alguna_enfermedad.trim() === ""
    ) {
      // Valor por defecto
      formData.estudiante.Presenta_alguna_enfermedad = "Ninguna";
    }
    if (
      !formData.estudiante.medicamentos_que_debe_tomar ||
      formData.estudiante.medicamentos_que_debe_tomar.trim() === ""
    ) {
      // Valor por defecto
      formData.estudiante.medicamentos_que_debe_tomar = "Ninguno";
    }
    if (
      !formData.estudiante.Ruta_de_viaje ||
      formData.estudiante.Ruta_de_viaje.trim() === ""
    ) {
      // Valor por defecto
      formData.estudiante.Ruta_de_viaje = "Ninguna";
    }
    if (
      !formData.estudiante.recibe_religion ||
      formData.estudiante.recibe_religion.trim() === ""
    ) {
      missingFields.push("Recibe religión");
    }
    if (
      !formData.estudiante.presenta_carta ||
      formData.estudiante.presenta_carta.trim() === ""
    ) {
      missingFields.push("Presenta carta");
    }

    // Campos de encargado legal
    if (
      !formData.encargadoLegal.nombre_Encargado_Legal ||
      formData.encargadoLegal.nombre_Encargado_Legal.trim() === ""
    ) {
      missingFields.push("Nombre del encargado legal");
    }
    if (
      !formData.encargadoLegal.apellido1_Encargado_Legal ||
      formData.encargadoLegal.apellido1_Encargado_Legal.trim() === ""
    ) {
      missingFields.push("Primer apellido del encargado legal");
    }
    if (
      !formData.encargadoLegal.apellido2_Encargado_Legal ||
      formData.encargadoLegal.apellido2_Encargado_Legal.trim() === ""
    ) {
      missingFields.push("Segundo apellido del encargado legal");
    }
    if (
      !formData.encargadoLegal.N_Cedula ||
      formData.encargadoLegal.N_Cedula.trim() === ""
    ) {
      missingFields.push("Cédula del encargado legal");
    } else {
      // Permitir ambos formatos: 1-2345-6789 y 1558-4834-4420
      const cedulaRegex = /^(\d-\d{4}-\d{4}|\d{4}-\d{4}-\d{4})$/;
      if (!cedulaRegex.test(formData.encargadoLegal.N_Cedula.trim())) {
        missingFields.push("Cédula del encargado legal (formato válido: 1-2345-6789 o 1558-4834-4420)");
      }
    }
    if (
      !formData.encargadoLegal.ocupacion ||
      formData.encargadoLegal.ocupacion.trim() === ""
    ) {
      missingFields.push("Ocupación del encargado legal");
    }
    if (
      !formData.encargadoLegal.nacionalidad ||
      formData.encargadoLegal.nacionalidad.trim() === ""
    ) {
      missingFields.push("Nacionalidad del encargado legal");
    }
    if (
      !formData.encargadoLegal.direccion ||
      formData.encargadoLegal.direccion.trim() === ""
    ) {
      missingFields.push("Dirección del encargado legal");
    }
    if (
      !formData.encargadoLegal.telefono_celular ||
      formData.encargadoLegal.telefono_celular.trim() === ""
    ) {
      missingFields.push("Teléfono celular del encargado legal");
    }
    if (
      !formData.encargadoLegal.habitacion ||
      formData.encargadoLegal.habitacion.trim() === ""
    ) {
      missingFields.push("Habitación del encargado legal");
    }
    if (
      !formData.encargadoLegal.correo ||
      formData.encargadoLegal.correo.trim() === ""
    ) {
      missingFields.push("Correo del encargado legal");
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios incompletos o inválidos",
        text: "Por favor, complete o corrija: " + missingFields.join(", "),
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    try {
      await handleSubmit(e);
      localStorage.setItem(`matricula-submitted-${userId}`, "true");
      setHasSubmitted(true);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Formulario enviado correctamente",
        confirmButtonColor: "#2563EB",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message ||
          "Hubo un error al enviar el formulario. Intente nuevamente.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  if (hasSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-center text-2xl font-bold mb-4 dark:text-white">
          Boleta de Matrícula 
        </h1>
        <p className="text-center text-green-600 dark:text-green-300">
          ¡Ya has enviado tu formulario de matrícula!
        </p>
        {timeToResend && (
          <p className="text-center text-gray-700 dark:text-gray-300 mt-2">
            Podrás reenviar el formulario en {formatTime(timeToResend)}.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-md">
      {/* Se muestra siempre el componente para controlar la activación y el contador.
          Se le pasa el role para que solo los admin/superadmin vean los botones */}
      <ActivarFormularioButton
        isFormActive={isFormActive}
        setIsFormActive={setIsFormActive}
        deadline={deadline}
        setDeadline={setDeadline}
        role={role}
      />

      <h1 className="text-center text-2xl font-bold mb-2 dark:text-white">
        Boleta de matrícula
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Por favor, complete todos los campos solicitados con datos verídicos.
      </p>

      {/* Mensaje de aviso si el formulario está inactivo */}
      {!isFormActive && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
          <strong>El formulario está inactivo.</strong> No podrás enviarlo hasta
          que sea habilitado.
        </div>
      )}

      <form className="space-y-6" onSubmit={onSubmitHandler}>
        {page === 1 ? (
          <>
            {/* Página 1: Datos del Estudiante */}
            <div className="flex justify-between">

              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Grado:
                </label>
                {grados.length === 0 ? (
                  <p>Cargando grados...</p>
                ) : (
                  <select
                    name="estudiante.gradoId"
                    value={formData.estudiante.gradoId}
                    onChange={handleChange}
                    className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccione un grado</option>
                    {grados
                      .filter((grado) => grado.nivel !== "Sétimo")
                      .map((grado) => (
                        <option key={grado.id_grado} value={grado.id_grado}>
                          {grado.nivel}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold dark:text-white">
              Datos del Estudiante
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Complete la información personal del estudiante. Asegúrese de que
              los datos sean correctos.
            </p>
            {/* Campo de cédula al inicio */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200">
                Nº Cédula o Pasaporte:
              </label>
              <div className="flex items-center space-x-2">
              <input
                  type="text"
                  name="estudiante.cedula"
                  value={formData.estudiante.cedula}
                  onChange={handleChange}
                  onBlur={(e) => buscarEstudiantePorCedula(e.target.value)}
                  placeholder="5-0434-0022"
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => buscarEstudiantePorCedula(formData.estudiante.cedula)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Nombre Completo:
                </label>
                <input
                  type="text"
                  name="estudiante.nombre_Estudiante"
                  value={formData.estudiante.nombre_Estudiante}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  1º Apellido:
                </label>
                <input
                  type="text"
                  name="estudiante.apellido1_Estudiante"
                  value={formData.estudiante.apellido1_Estudiante}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  2º Apellido:
                </label>
                <input
                  type="text"
                  name="estudiante.apellido2_Estudiante"
                  value={formData.estudiante.apellido2_Estudiante}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Correo Estudiantil:
                </label>
                <input
                  type="email"
                  name="estudiante.correo_estudiantil"
                  value={formData.estudiante.correo_estudiantil}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  placeholder="ejemplo@correo.com"
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Teléfono:
                </label>
                <input
                  type="text"
                  name="estudiante.telefono"
                  value={formData.estudiante.telefono}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="block text-gray-700 dark:text-gray-200">
                Sexo:
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="estudiante.sexo"
                  value="Femenino"
                  checked={formData.estudiante.sexo === "Femenino"}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="mr-2"
                />
                Femenino
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.sexo"
                  value="Masculino"
                  checked={formData.estudiante.sexo === "Masculino"}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="mr-2"
                />
                Masculino
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Lugar de Nacimiento:
                </label>
                <input
                  type="text"
                  name="estudiante.lugar_de_nacimiento"
                  value={formData.estudiante.lugar_de_nacimiento}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Fecha de Nacimiento:
                </label>
                <input
                  type="date"
                  name="estudiante.fecha_nacimiento"
                  value={formData.estudiante.fecha_nacimiento}
                  onChange={handleFechaNacimientoChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Nacionalidad:
                </label>
                <input
                  type="text"
                  name="estudiante.nacionalidad"
                  value={formData.estudiante.nacionalidad}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Edad:
                </label>
                <input
                  type="number"
                  name="estudiante.edad"
                  value={formData.estudiante.edad}
                  readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Campos adicionales */}
            <div className="flex space-x-4">
              <label className="block text-gray-700 dark:text-gray-200">
                Condición Migratoria:
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="legal"
                  checked={formData.estudiante.condicion_migratoria === "legal"}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="mr-2"
                />
                Legal
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="refugiado"
                  checked={
                    formData.estudiante.condicion_migratoria === "refugiado"
                  }
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="mr-2"
                />
                Refugiado
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="estudiante.condicion_migratoria"
                  value="ilegal"
                  checked={
                    formData.estudiante.condicion_migratoria === "ilegal"
                  }
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="mr-2"
                />
                Ilegal
              </label>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">
                Repite alguna materia:
              </label>
              <input
                type="text"
                name="estudiante.Repite_alguna_materia"
                value={formData.estudiante.Repite_alguna_materia}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white mt-1"
                placeholder="Si repite alguna materia, ingrese el nombre; de lo contrario, déjelo en blanco."
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">
                Institución de Procedencia:
              </label>
              <input
                type="text"
                name="estudiante.institucion_de_procedencia"
                value={formData.estudiante.institucion_de_procedencia}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Tipo de Adecuación:
                </label>
                <select
                  name="estudiante.tipo_de_adecuacion"
                  value={formData.estudiante.tipo_de_adecuacion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="N">No presenta</option>
                  <option value="DA">Adecuación de Acceso</option>
                  <option value="S">Adecuación Significativa</option>
                  <option value="NS">Adecuación No Significativa</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Recibe Religión:
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.recibe_religion"
                      value="Si"
                      checked={formData.estudiante.recibe_religion === "Si"}
                      onChange={handleChange}
                      readOnly={!isEditable} // Cambiado de disabled a readOnly
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.recibe_religion"
                      value="No"
                      checked={formData.estudiante.recibe_religion === "No"}
                      onChange={handleChange}
                      readOnly={!isEditable} // Cambiado de disabled a readOnly
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Presenta Carta:
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.presenta_carta"
                      value="Si"
                      checked={formData.estudiante.presenta_carta === "Si"}
                      onChange={handleChange}
                      readOnly={!isEditable} // Cambiado de disabled a readOnly
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="estudiante.presenta_carta"
                      value="No"
                      checked={formData.estudiante.presenta_carta === "No"}
                      onChange={handleChange}
                      readOnly={!isEditable} // Cambiado de disabled a readOnly
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold dark:text-white">
              Enfermedades y Medicamentos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Si el estudiante presenta alguna condición médica o necesita
              medicación específica, indíquelo aquí.
            </p>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">
                Presenta alguna enfermedad:
              </label>
              <input
                type="text"
                name="estudiante.Presenta_alguna_enfermedad"
                value={formData.estudiante.Presenta_alguna_enfermedad}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">
                Medicamentos que debe tomar:
              </label>
              <input
                type="text"
                name="estudiante.medicamentos_que_debe_tomar"
                value={formData.estudiante.medicamentos_que_debe_tomar}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200">
                Ruta que viaja el estudiante:
              </label>
              <select
                name="estudiante.Ruta_de_viaje"
                value={formData.estudiante.Ruta_de_viaje}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">Seleccione una ruta</option>
                <option value="San Juan - Guayabal - Santa Cruz">
                  San Juan - Guayabal - Santa Cruz
                </option>
                <option value="Río Cañas - Barrio Limón - Santa Cruz">
                  Río Cañas - Barrio Limón - Santa Cruz
                </option>
                <option value="Bolsón - Ortega - Oriente - Santa Cruz">
                  Bolsón - Ortega - Oriente - Santa Cruz
                </option>
                <option value="Guaitil - Santa Bárbara - Santa Cruz">
                  Guaitil - Santa Bárbara - Santa Cruz
                </option>
                <option value="Bernabela - El Cacao - Santa Cruz">
                  Bernabela - El Cacao - Santa Cruz
                </option>
                <option value="Arado - Hato Viejo - Santa Cruz">
                  Arado - Hato Viejo - Santa Cruz
                </option>
                <option value="Lagunilla - San Pedro - Santa Cruz">
                  Lagunilla - San Pedro - Santa Cruz
                </option>
                <option value="San José de la montaña - Santa Cruz">
                  San José de la montaña - Santa Cruz
                </option>
              </select>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => setPage(2)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold dark:text-white">
              Datos del Encargado Legal
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Ingrese la información del encargado legal o tutor del estudiante.
              Asegúrese de completar todos los campos.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Nombre Completo:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.nombre_Encargado_Legal"
                  value={formData.encargadoLegal.nombre_Encargado_Legal}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  1º Apellido:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.apellido1_Encargado_Legal"
                  value={formData.encargadoLegal.apellido1_Encargado_Legal}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  2º Apellido:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.apellido2_Encargado_Legal"
                  value={formData.encargadoLegal.apellido2_Encargado_Legal}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Nº Cédula:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.N_Cedula"
                  value={formData.encargadoLegal.N_Cedula}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  placeholder="5-0123-0456"
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Ocupación:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.ocupacion"
                  value={formData.encargadoLegal.ocupacion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Nacionalidad:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.nacionalidad"
                  value={formData.encargadoLegal.nacionalidad}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Dirección:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.direccion"
                  value={formData.encargadoLegal.direccion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Teléfono Celular:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.telefono_celular"
                  value={formData.encargadoLegal.telefono_celular}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Habitación:
                </label>
                <input
                  type="text"
                  name="encargadoLegal.habitacion"
                  value={formData.encargadoLegal.habitacion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Correo:
                </label>
                <input
                  type="email"
                  name="encargadoLegal.correo"
                  value={formData.encargadoLegal.correo}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
{/* ----------------------- */}
{/* Aquí va el input de archivos */}

<div className="mt-6">
  {/* Descripción de lo que debe llevar */}
  <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">
    Por favor, adjunta los siguientes documentos en formato PDF y imagen en formato JPG/PNG, todos claros y legibles:
  </p>
  <ul className="list-disc list-inside mb-4 text-sm text-gray-700 dark:text-gray-200">
    <li>Copia de las notas del estudiante.</li>
    <li>Copia de la cédula del padre, madre o encargado legal.</li>
    <li>Copia de la cédula del estudiante.</li>
    <li>Foto tipo pasaporte del estudiante (JPG o PNG).</li>
  </ul>

  {/* Input de archivos */}
  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
    Adjuntar documentos <span className="text-red-500">*</span>
  </label>
  <div className="relative inline-block">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 16v4m0 0H3m4 0h4m4-4v4m0 0h-4m4 0h4M12 12v8m0 0H8m4 0h4m0-8V4m0 0H8m4 0h4"
        />
      </svg>
      Seleccionar archivos
    </button>
    <input
      id="archivo"
      type="file"
      name="archivo"
      multiple
      accept=".pdf,image/*"
      onChange={handleFileChange}
      required
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>

  {/* Conteo y lista de archivos */}
  {files.length > 0 && (
    <div className="mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {files.length} archivo{files.length > 1 && 's'} seleccionado{files.length > 1 && 's'}:
      </p>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
        {files.map((file, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => removeFile(idx)}
              className="text-xs text-red-500 hover:underline ml-4"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
{/* ----------------------- */}
            

            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
              <button
                type="button"
                onClick={() => setPage(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600"
              >
                Anterior
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default FormularioMatricula;
