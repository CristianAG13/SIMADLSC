import { useState } from "react";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";
import { useMatriculaForm } from "../Hooks/useMatriculaForm";
import useGrados from "../../Asistencias/Hook/useGrados";
import axios from "axios"; // Asegúrate de importar axios si no está ya importado

export const FormularioMatriculaUnificado = () => {
  const {
    page,
    setPage,
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useMatriculaForm();

  const { grados } = useGrados();

  const [matriculaType, setMatriculaType] = useState("ordinaria");
  const [isEditable, setIsEditable] = useState(false); // Controla si los campos son editables

  const API_BASE_URL =
    import.meta.env.NODE_ENV === "production"
      ? "https://simadlsc-backend-production.up.railway.app"
      : "http://localhost:3000";

  const handleMatriculaTypeChange = (e) => {
    setMatriculaType(e.target.value);
  };

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
    const edadEvent = {
      target: { name: "estudiante.edad", value: age },
    };
    handleChange(edadEvent);
  };

  const buscarEstudiantePorCedula = async (cedula) => {
    if (!cedula || cedula.trim() === "") {
      // Mostrar advertencia si el campo de cédula está vacío
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingrese un número de cédula antes de buscar.",
        confirmButtonColor: "#2563EB",
      });
      return; // Detener la ejecución si el campo está vacío
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/estudiantes/cedula/${cedula}`);
      const estudiante = response.data;
  
      if (estudiante) {
        // Actualizar los datos del formulario con los datos del estudiante
        handleChange({
          target: { name: "estudiante.nombre_Estudiante", value: estudiante.nombre_Estudiante },
        });
        handleChange({
          target: { name: "estudiante.apellido1_Estudiante", value: estudiante.apellido1_Estudiante },
        });
        handleChange({
          target: { name: "estudiante.apellido2_Estudiante", value: estudiante.apellido2_Estudiante },
        });
        handleChange({
          target: { name: "estudiante.fecha_nacimiento", value: estudiante.fecha_nacimiento },
        });
        handleChange({
          target: { name: "estudiante.correo_estudiantil", value: estudiante.correo_estudiantil },
        });
        handleChange({
          target: { name: "estudiante.telefono", value: estudiante.telefono },
        });
        handleChange({
          target: { name: "estudiante.sexo", value: estudiante.sexo },
        });
        handleChange({
          target: { name: "estudiante.lugar_de_nacimiento", value: estudiante.lugar_de_nacimiento },
        });
        handleChange({
          target: { name: "estudiante.cedula", value: estudiante.cedula },
        });
        handleChange({
          target: { name: "estudiante.edad", value: estudiante.edad },
        });
        handleChange({
          target: { name: "estudiante.nacionalidad", value: estudiante.nacionalidad },
        });
        handleChange({
          target: { name: "estudiante.condicion_migratoria", value: estudiante.condicion_migratoria },
        });
        handleChange({
          target: { name: "estudiante.Repite_alguna_materia", value: estudiante.Repite_alguna_materia },
        });
        handleChange({
          target: { name: "estudiante.institucion_de_procedencia", value: estudiante.institucion_de_procedencia },
        });
        handleChange({
          target: { name: "estudiante.tipo_de_adecuacion", value: estudiante.tipo_de_adecuacion },
        });
        handleChange({
          target: { name: "estudiante.recibe_religion", value: estudiante.recibe_religion },
        });
        handleChange({
          target: { name: "estudiante.presenta_carta", value: estudiante.presenta_carta },
        });
        handleChange({
          target: { name: "estudiante.Presenta_alguna_enfermedad", value: estudiante.Presenta_alguna_enfermedad },
        }); 
        handleChange({
          target: { name: "estudiante.medicamentos_que_debe_tomar", value: estudiante.medicamentos_que_debe_tomar },
        });
        handleChange({
          target: { name: "estudiante.Ruta_de_viaje", value: estudiante.Ruta_de_viaje },
        });
        handleChange({
          target: { name: "encargadoLegal.nombre_Encargado_Legal", value: estudiante.encargadoLegal.nombre_Encargado_Legal },
        });
        handleChange({
          target: { name: "encargadoLegal.apellido1_Encargado_Legal", value: estudiante.encargadoLegal.apellido1_Encargado_Legal },
        });
        handleChange({
          target: { name: "encargadoLegal.apellido2_Encargado_Legal", value: estudiante.encargadoLegal.apellido2_Encargado_Legal },
        });
        handleChange({
          target: { name: "encargadoLegal.N_Cedula", value: estudiante.encargadoLegal.N_Cedula },
        });
        handleChange({
          target: { name: "encargadoLegal.ocupacion", value: estudiante.encargadoLegal.ocupacion },
        });
        handleChange({
          target: { name: "encargadoLegal.nacionalidad", value: estudiante.encargadoLegal.nacionalidad },
        });
        handleChange({
          target: { name: "encargadoLegal.direccion", value: estudiante.encargadoLegal.direccion },
        });
        handleChange({
          target: { name: "encargadoLegal.telefono_celular", value: estudiante.encargadoLegal.telefono_celular },
        });
        handleChange({
          target: { name: "encargadoLegal.habitacion", value: estudiante.encargadoLegal.habitacion },
        });
        handleChange({
          target: { name: "encargadoLegal.correo", value: estudiante.encargadoLegal.correo },
        });
        


        setIsEditable(true); // Bloquear los campos
        Swal.fire({
          icon: "success",
          title: "Estudiante encontrado",
          text: "Los datos del estudiante han sido rellenados automáticamente.",
          confirmButtonColor: "#2563EB",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Manejar específicamente el error 404 como un warning
        setIsEditable(true); // Permitir la edición manual
        const errorMessage = typeof error.response.data.message === "string"
          ? error.response.data.message
          : `No se encontró un estudiante con la cédula: ${cedula}. Por favor, ingrese los datos manualmente.`;
        Swal.fire({
          icon: "warning",
          title: "Estudiante no encontrado",
          text: errorMessage, // Mostrar el mensaje correctamente
          confirmButtonColor: "#2563EB",
        });
      } else {
        // Manejar otros errores como errores generales
        console.error("Error al buscar el estudiante:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al buscar el estudiante. Intente nuevamente.",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    let missingFields = [];

    if (
      !formData.estudiante.gradoId ||
      formData.estudiante.gradoId.toString().trim() === ""
    ) {
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

    if (matriculaType === "extraordinaria") {
      if (
        !formData.estudiante.motivo_matricula ||
        formData.estudiante.motivo_matricula.trim() === ""
      ) {
        missingFields.push("Motivo de la Matrícula (requerido en matrícula extraordinaria)");
      }
    }

    if (page === 2) {
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
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: `Formulario de Matrícula ${
          matriculaType === "extraordinaria" ? "Extraordinaria" : "Ordinaria"
        } enviado correctamente`,
        confirmButtonColor: "#2563EB",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message || "Hubo un error al enviar el formulario. Intente nuevamente.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md dark:bg-gray-900 dark:text-gray-100">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold dark:text-gray-100">Tipo de Matrícula:</label>
        <div className="flex space-x-4 mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="matriculaType"
              value="ordinaria"
              checked={matriculaType === "ordinaria"}
              onChange={handleMatriculaTypeChange}
              className="mr-2"
            />
            Ordinaria
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="matriculaType"
              value="extraordinaria"
              checked={matriculaType === "extraordinaria"}
              onChange={handleMatriculaTypeChange}
              className="mr-2"
            />
            Extraordinaria
          </label>
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold mb-2">
        Boleta de Matrícula 
        {matriculaType === "ordinaria" && " Ordinaria"}
        {matriculaType === "extraordinaria" && " Extraordinaria"}
      </h1>
      <p className="text-center text-gray-600 mb-6 dark:text-gray-400">
        Por favor, complete todos los campos solicitados con datos verídicos.
        Verifique la información antes de enviar el formulario. Recuerde que el campo{" "}
        <strong>Cédula del estudiante</strong> debe tener el formato{" "}
        <strong>`5-0421-0921`</strong> y el <strong>Correo Estudiantil</strong> es obligatorio.
      </p>

      <form className="space-y-6" onSubmit={onSubmitHandler}>
        {page === 1 ? (
          <>
            <div className="flex justify-between">

              <div>
                <label className="block text-gray-700 dark:text-gray-200">Grado:</label>
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
                    {grados.map((grado) => (
                      <option key={grado.id_grado} value={grado.id_grado}>
                        {grado.nivel}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold dark:text-gray-100">Datos del Estudiante</h2>
            <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
              Complete la información personal del estudiante. Asegúrese de que los datos sean correctos.
            </p>
            <div>
                <label className="block text-gray-700 dark:text-gray-100">Nº Cédula o Pasaporte:</label>
                <input
                  type="text"
                  name="estudiante.cedula"
                  value={formData.estudiante.cedula}
                  onChange={handleChange}
                  placeholder="5-0433-0921"
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => buscarEstudiantePorCedula(formData.estudiante.cedula)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                >
                  Buscar Estudiante
                </button>
              </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Nombre Completo:</label>
                <input
                  type="text"
                  name="estudiante.nombre_Estudiante"
                  value={formData.estudiante.nombre_Estudiante}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">1º Apellido:</label>
                <input
                  type="text"
                  name="estudiante.apellido1_Estudiante"
                  value={formData.estudiante.apellido1_Estudiante}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">2º Apellido:</label>
                <input
                  type="text"
                  name="estudiante.apellido2_Estudiante"
                  value={formData.estudiante.apellido2_Estudiante}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Teléfono:</label>
                <input
                  type="text"
                  name="estudiante.telefono"
                  value={formData.estudiante.telefono}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Correo Estudiantil:</label>
                <input
                  type="email"
                  name="estudiante.correo_estudiantil"
                  value={formData.estudiante.correo_estudiantil}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  placeholder="ejemplo@correo.com"
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="block text-gray-700 dark:text-gray-100">Sexo:</label>
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
                <label className="block text-gray-700 dark:text-gray-100">Lugar de Nacimiento:</label>
                <input
                  type="text"
                  name="estudiante.lugar_de_nacimiento"
                  value={formData.estudiante.lugar_de_nacimiento}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  name="estudiante.fecha_nacimiento"
                  value={formData.estudiante.fecha_nacimiento}
                  onChange={handleFechaNacimientoChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Nacionalidad:</label>
                <input
                  type="text"
                  name="estudiante.nacionalidad"
                  value={formData.estudiante.nacionalidad}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Edad:</label>
                <input
                  type="number"
                  name="estudiante.edad"
                  value={formData.estudiante.edad}
                  readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="block text-gray-700 dark:text-gray-100">Condición Migratoria:</label>
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
                  checked={formData.estudiante.condicion_migratoria === "refugiado"}
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
                  checked={formData.estudiante.condicion_migratoria === "ilegal"}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="mr-2"
                />
                Ilegal
              </label>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-100">Repite alguna materia:</label>
              <input
                type="text"
                name="estudiante.Repite_alguna_materia"
                value={formData.estudiante.Repite_alguna_materia}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="Si repite alguna materia, ingrese el nombre; de lo contrario, déjelo en blanco."
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-100">Institución de Procedencia:</label>
              <input
                type="text"
                name="estudiante.institucion_de_procedencia"
                value={formData.estudiante.institucion_de_procedencia}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Tipo de Adecuación:</label>
                <select
                  name="estudiante.tipo_de_adecuacion"
                  value={formData.estudiante.tipo_de_adecuacion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="N">No presenta</option>
                  <option value="DA">Adecuación de Acceso</option>
                  <option value="S">Adecuación Significativa</option>
                  <option value="NS">Adecuación No Significativa</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Recibe Religión:</label>
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
                <label className="block text-gray-700 dark:text-gray-100">Presenta Carta:</label>
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

            {matriculaType === "extraordinaria" && (
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Motivo de la Matrícula:</label>
                <input
                  type="text"
                  name="estudiante.motivo_matricula"
                  value={formData.estudiante.motivo_matricula || ""}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
            )}

            <h2 className="text-lg font-semibold mt-6 dark:text-gray-100">Enfermedades y Medicamentos</h2>
            <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
              Si el estudiante presenta alguna condición médica o necesita medicación específica, indíquelo aquí.
            </p>

            <div>
              <label className="block text-gray-700 dark:text-gray-100">Presenta alguna enfermedad:</label>
              <input
                type="text"
                name="estudiante.Presenta_alguna_enfermedad"
                value={formData.estudiante.Presenta_alguna_enfermedad}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-100">Medicamentos que debe tomar:</label>
              <input
                type="text"
                name="estudiante.medicamentos_que_debe_tomar"
                value={formData.estudiante.medicamentos_que_debe_tomar}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-100">Ruta que viaja el estudiante:</label>
              <select
                name="estudiante.Ruta_de_viaje"
                value={formData.estudiante.Ruta_de_viaje}
                onChange={handleChange}
                readOnly={!isEditable} // Cambiado de disabled a readOnly
                className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              >
                <option value="">Seleccione una ruta</option>
                <option value="Centro de Santa Cruz">Centro de Santa Cruz</option>
                <option value="San Juan - Guayabal - Santa Cruz">San Juan - Guayabal - Santa Cruz</option>
                <option value="Río Cañas - Barrio Limón - Santa Cruz">Río Cañas - Barrio Limón - Santa Cruz</option>
                <option value="Bolsón - Ortega - Oriente - Santa Cruz">Bolsón - Ortega - Oriente - Santa Cruz</option>
                <option value="Guaitil - Santa Bárbara - Santa Cruz">Guaitil - Santa Bárbara - Santa Cruz</option>
                <option value="Bernabela - El Cacao - Santa Cruz">Bernabela - El Cacao - Santa Cruz</option>
                <option value="Arado - Hato Viejo - Santa Cruz">Arado - Hato Viejo - Santa Cruz</option>
                <option value="Lagunilla - San Pedro - Santa Cruz">Lagunilla - San Pedro - Santa Cruz</option>
                <option value="San José de la montaña - Santa Cruz">San José de la montaña - Santa Cruz</option>
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
            <h2 className="text-lg font-semibold dark:text-gray-100">Datos del Encargado Legal</h2>
            <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
              Ingrese la información del encargado legal o tutor del estudiante. Asegúrese de completar todos los campos.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Nombre Completo:</label>
                <input
                  type="text"
                  name="encargadoLegal.nombre_Encargado_Legal"
                  value={formData.encargadoLegal.nombre_Encargado_Legal}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">1º Apellido:</label>
                <input
                  type="text"
                  name="encargadoLegal.apellido1_Encargado_Legal"
                  value={formData.encargadoLegal.apellido1_Encargado_Legal}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">2º Apellido:</label>
                <input
                  type="text"
                  name="encargadoLegal.apellido2_Encargado_Legal"
                  value={formData.encargadoLegal.apellido2_Encargado_Legal}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Nº Cédula:</label>
                <input
                  type="text"
                  name="encargadoLegal.N_Cedula"
                  value={formData.encargadoLegal.N_Cedula}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  placeholder="5-0123-0456"
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Ocupación:</label>
                <input
                  type="text"
                  name="encargadoLegal.ocupacion"
                  value={formData.encargadoLegal.ocupacion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Nacionalidad:</label>
                <input
                  type="text"
                  name="encargadoLegal.nacionalidad"
                  value={formData.encargadoLegal.nacionalidad}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Dirección:</label>
                <input
                  type="text"
                  name="encargadoLegal.direccion"
                  value={formData.encargadoLegal.direccion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Teléfono Celular:</label>
                <input
                  type="text"
                  name="encargadoLegal.telefono_celular"
                  value={formData.encargadoLegal.telefono_celular}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Habitación:</label>
                <input
                  type="text"
                  name="encargadoLegal.habitacion"
                  value={formData.encargadoLegal.habitacion}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-100">Correo:</label>
                <input
                  type="email"
                  name="encargadoLegal.correo"
                  value={formData.encargadoLegal.correo}
                  onChange={handleChange}
                  readOnly={!isEditable} // Cambiado de disabled a readOnly
                  className="border p-2 rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
            </div>

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

export default FormularioMatriculaUnificado;
