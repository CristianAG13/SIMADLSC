import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { InfoAdminPage } from '../pages/InfoAdminPage';
import { AsistenciaEst } from '../pages/Asistencias/AsistenciaEst';
import { GestionAsistencia } from '../pages/Asistencias/GestionAsistencia';
import { JustificacionAusencias } from '../pages/Asistencias/JustificacionAusencias';
import { ReporteAsistencia } from '../pages/Asistencias/ReporteAsistencia';
import { Eventos } from '../../components/Eventos';
import { GestionEventos } from '../pages/Eventos/GestionEventos';
import { GestionHorario } from '../pages/Horarios/GestionHorario';
import { HorarioEstu } from '../pages/Horarios/Vistas/HorarioEstu';
import { HorarioProf } from '../pages/Horarios/Vistas/HorarioProf';
import { FormularioMatricula } from '../pages/Matricula/FormularioMatricula';
import { GestionMatricula } from '../pages/Matricula/GestionMatricula';
import { MatriculaOrdinaria } from '../pages/Matricula/MatriculaOrdinaria';
import { MatriculaExtraordinaria } from '../pages/Matricula/MatriculaExtraordinaria';
import GestionUsuarios from '../pages/Usuarios/GestionUsuarios';
import CrearUsuario from '../pages/Usuarios/CrearUsuario';
import { MiPerfil } from '../pages/Perfil/MiPerfil';

export const AdminRoutes = () => {
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex-grow p-6 bg-gray-100 min-h-screen overflow-auto">

      <Routes>
        <Route path="/" element={<Navigate to="/info" replace />} />
        <Route path="/info" element={<InfoAdminPage />} />

        {/* Rutas para asistencia, según rol */}
        {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
          <>
            <Route path="/asistencia-estudiantes" element={<AsistenciaEst />} />
            <Route path="/gestion-asistencia" element={<GestionAsistencia />} />
            <Route path="/justificacion-ausencias" element={<JustificacionAusencias />} />
            <Route path="/reporte-asistencia" element={<ReporteAsistencia />} />
          </>
        )}

        {/* Rutas para eventos, accesibles a todos */}
        <Route path="/eventos" element={<Eventos />} />
        {(role === 'admin' || role === 'superadmin') && (
          <Route path="/gestion-eventos" element={<GestionEventos />} />
        )}

        {/* Rutas para horarios, según el rol */}
        {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
          <>
            <Route path="/gestion-horario" element={<GestionHorario />} />
            <Route path="/horario-estudiantes" element={<HorarioEstu />} />
            <Route path="/horario-profesores" element={<HorarioProf />} />
          </>
        )}

        {/* Rutas para matrícula, según el rol */}
        {(role === 'admin' || role === 'superadmin') && (
          <>
            <Route path="/formulario-matricula" element={<FormularioMatricula />} />
            <Route path="/gestion-matricula" element={<GestionMatricula />} />
            <Route path="/matricula-ordinaria" element={<MatriculaOrdinaria />} />
            <Route path="/matricula-extraordinaria" element={<MatriculaExtraordinaria />} />
          </>
        )}
        {role === 'Estudiante' && (
          <Route path="/formulario-matricula" element={<FormularioMatricula />} />
        )}

        {/* Rutas de usuarios solo para admin */}
        {role === 'superadmin' && (
          <>
            <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="/crear-usuarios" element={<CrearUsuario />} />
          </>
        )}

        {/* Ruta para el perfil, accesible a todos */}
        <Route path="/mi-perfil" element={<MiPerfil />} />
      </Routes>
    </div>
  );
};

