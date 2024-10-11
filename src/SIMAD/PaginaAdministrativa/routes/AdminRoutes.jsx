import { Routes, Route, Navigate } from 'react-router-dom';
import { InfoAdminPage } from '../pages/InfoAdminPage';
import  AsistenciaEst  from '../pages/Asistencias/AsistenciaEst';
import  GestionAsistencia  from '../pages/Asistencias/GestionAsistencia';
import { JustificacionAusencias } from '../pages/Asistencias/JustificacionAusencias';
import { ReporteAsistencia } from '../pages/Asistencias/ReporteAsistencia';
import Eventos from '../pages/Eventos/Eventos';
import GestionEventos from '../pages/Eventos/GestionEventos';
import { GestionHorario } from '../pages/Horarios/GestionHorario';
import { HorarioEstu } from '../pages/Horarios/HorarioEstu';
import { HorarioProf } from '../pages/Horarios/HorarioProf';
import { FormularioMatricula } from '../pages/Matricula/FormularioMatricula';
import { GestionMatricula } from '../pages/Matricula/GestionMatricula';
import { MatriculaOrdinaria } from '../pages/Matricula/MatriculaOrdinaria';
import { MatriculaExtraordinaria } from '../pages/Matricula/MatriculaExtraordinaria';
import GestionUsuarios from '../pages/Usuarios/GestionUsuarios';
import { MiPerfil } from '../pages/Perfil/MiPerfil';
import CrearUsuario from '../pages/Usuarios/CrearUsuario';
import CrearEventos from '../pages/Eventos/CrearEventos';
import UserEventos from '../pages/Eventos/UserEventos';



export const AdminRoutes = () => {
  return (
    <div className="flex-grow p-6 bg-gray-100 min-h-screen overflow-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="/info" replace />} />
                        <Route path="/info" element={<InfoAdminPage />} />

                        {/* Asistencia Routes */}
                        <Route path="/asistencia-estudiantes" element={<AsistenciaEst />} />
                        <Route path="/gestion-asistencia" element={<GestionAsistencia />} />
                        <Route path="/justificacion-ausencias" element={<JustificacionAusencias />} />
                        <Route path="/reporte-asistencia" element={<ReporteAsistencia />} />
                        
                        {/* Eventos Routes */}
                        <Route path="/eventos" element={<Eventos />} />
                        <Route path="/crear-eventos" element={<CrearEventos />} />
                        <Route path="/gestion-eventos" element={<GestionEventos />} />
                        <Route path="/user-eventos" element={<UserEventos />} />
                        

                        
                        {/* Horarios Routes */}
                        <Route path="/gestion-horario" element={<GestionHorario />} />
                        <Route path="/horario-estudiantes" element={<HorarioEstu />} />
                        <Route path="/horario-profesores" element={<HorarioProf />} />
                        
                        {/* Matrícula Routes */}
                        <Route path="/formulario-matricula" element={<FormularioMatricula />} />
                        <Route path="/gestion-matricula" element={<GestionMatricula />} />
                        <Route path="/matricula-ordinaria" element={<MatriculaOrdinaria />} />
                        <Route path="/matricula-extraordinaria" element={<MatriculaExtraordinaria />} />
                        
                        {/* Usuarios Routes */}
                        <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
                        <Route path="/Crear-usuarios" element={<CrearUsuario />} />

                        {/* Perfil y Logout */}
                        <Route path="/mi-perfil" element={<MiPerfil />} />
                    </Routes>
                </div>
  )
}
