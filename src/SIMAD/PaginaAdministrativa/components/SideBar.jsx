import { Link, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaClipboardList, FaUsers, FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export const SideBar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // Mantén el estado de autenticación
    const [openSections, setOpenSections] = useState({
        asistencia: false,
        eventos: false,
        horarios: false,
        matricula: false,
        usuarios: false,
    });

    const navigate = useNavigate();

    const toggleSection = (section) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const handleLogout = () => {
        // Elimina el token y el rol de localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        // Actualiza el estado de autenticación
        setIsAuthenticated(false);
        console.log('Token y rol eliminados');

        // Redirige utilizando useNavigate
        window.location.href = '/paginainformativa' 
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/paginainformativa'); // Redirige si el usuario no está autenticado
        }
    }, [isAuthenticated, navigate]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
        {/* Botón de menú hamburguesa visible solo en pantallas pequeñas */}
        <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-800 bg-white shadow-md rounded-full fixed top-4 left-4 z-50"
        >
            <FaBars size={20} />
        </button>

        {/* Sidebar */}
        <div className={`fixed lg:relative top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 min-h-screen flex flex-col`}>
            {/* Enlace del título "SIMAD" que redirige a InfoAdminPage */}
            <Link to="/info" className="text-2xl font-bold mb-4 hover:text-gray-400">
                SIMADLSC
            </Link>
            
            {/* Asistencia */}
            <div>
                <div onClick={() => toggleSection('asistencia')} className="cursor-pointer flex items-center space-x-2 py-2">
                    <FaUserGraduate />
                    <span>Asistencia</span>
                </div>
                {openSections.asistencia && (
                    <div className="ml-6">
                        <Link to="/asistencia-estudiantes" className="block py-1 hover:text-gray-400">Asistencia Estudiantes</Link>
                        <Link to="/asistencia-profesores" className="block py-1 hover:text-gray-400">Asistencia Profesores</Link>
                        <Link to="/gestion-asistencia" className="block py-1 hover:text-gray-400">Gestión Asistencia</Link>
                        <Link to="/justificacion-ausencias" className="block py-1 hover:text-gray-400">Justificación Ausencias</Link>
                        <Link to="/reporte-asistencia" className="block py-1 hover:text-gray-400">Reporte Asistencia</Link>
                    </div>
                )}
            </div>
            {/* Eventos */}
            <div>
                <div onClick={() => toggleSection('eventos')} className="cursor-pointer flex items-center space-x-2 py-2">
                    <FaCalendarAlt />
                    <span>Eventos</span>
                </div>
                {openSections.eventos && (
                    <div className="ml-6">
                        <Link to="/eventos" className="block py-1 hover:text-gray-400">Eventos</Link>
                        <Link to="/gestion-eventos" className="block py-1 hover:text-gray-400">Gestión Eventos</Link>
                    </div>
                )}
            </div>
            {/* Horarios */}
            <div>
                <div onClick={() => toggleSection('horarios')} className="cursor-pointer flex items-center space-x-2 py-2">
                    <FaChalkboardTeacher />
                    <span>Horarios</span>
                </div>
                {openSections.horarios && (
                    <div className="ml-6">
                        <Link to="/horario-estudiantes" className="block py-1 hover:text-gray-400">Horario Estudiantes</Link>
                        <Link to="/horario-profesores" className="block py-1 hover:text-gray-400">Horario Profesores</Link>
                        <Link to="/gestion-horario" className="block py-1 hover:text-gray-400">Gestión Horario</Link>
                    </div>
                )}
            </div>
            {/* Matrícula */}
            <div>
                <div onClick={() => toggleSection('matricula')} className="cursor-pointer flex items-center space-x-2 py-2">
                    <FaClipboardList />
                    <span>Matrícula</span>
                </div>
                {openSections.matricula && (
                    <div className="ml-6">
                        <Link to="/formulario-matricula" className="block py-1 hover:text-gray-400">Formulario Matrícula</Link>
                        <Link to="/gestion-matricula" className="block py-1 hover:text-gray-400">Gestión Matrícula</Link>
                        <Link to="/matricula-ordinaria" className="block py-1 hover:text-gray-400">Matrícula Ordinaria</Link>
                        <Link to="/matricula-extraordinaria" className="block py-1 hover:text-gray-400">Matrícula Extraordinaria</Link>
                    </div>
                )}
            </div>
            {/* Usuarios */}
            <div>
                <div onClick={() => toggleSection('usuarios')} className="cursor-pointer flex items-center space-x-2 py-2">
                    <FaUsers />
                    <span>Usuarios</span>
                </div>
                {openSections.usuarios && (
                    <div className="ml-6">
                        <Link to="/gestion-usuarios" className="block py-1 hover:text-gray-400">Gestión Usuarios</Link>
                    </div>
                )}
            </div>

            {/* Perfil y Logout */}
            <div className="border-t border-gray-700 pt-4 mt-auto">
                <div className="flex items-center space-x-2">
                    <FaUserCircle size={20} />
                    <span className="text-lg">Perfil</span>
                </div>
                <div className="ml-6">
                    <Link to="/mi-perfil" className="py-1 hover:text-gray-400 flex items-center space-x-1">
                        <FaUserCircle size={14} />
                        <span>Ver mi perfil</span>
                    </Link>
                    <button onClick={handleLogout} className="py-1 hover:text-gray-400 w-full text-left flex items-center space-x-1">
                        <FaSignOutAlt size={14} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </>
    );
};
