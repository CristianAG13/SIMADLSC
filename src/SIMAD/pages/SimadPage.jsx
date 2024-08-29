import React from 'react';
import Navbar from '../../Components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../App.css';



const SimadPage = () => {

  React.useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <div className="bg-gray-300 min-h-screen font-roboto"> {/* Usar Roboto como fuente principal */}
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="h-96 flex items-center justify-center relative bg-hero">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative p-10 text-center text-white" data-aos="fade-up">
        <h2 className="text-5xl font-bold">Bienvenido al Liceo Santa Cruz</h2>
        <p className="mt-4 text-lg">Donde la educación secundaria es una aventura.</p>
      </div>
    </section>

      {/* Sección de Educación Secundaria */}
      <section className="py-16 bg-blue-800 text-white" data-aos="fade-up"> {/* Azul oscuro para fondo de sección */}
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6">Nuestra Educación Secundaria</h3>
          <p className="mb-10 max-w-2xl mx-auto text-gray-300">En el Liceo Santa Cruz, nos especializamos en brindar una educación secundaria de calidad que prepara a nuestros estudiantes para los retos del futuro.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-white mb-4">Currículo Académico</h4>
              <p className="text-gray-300">Nuestro currículo está diseñado para proporcionar una educación integral, enfocada en el desarrollo de habilidades críticas y conocimiento profundo en diversas disciplinas.</p>
            </div>
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-white mb-4">Actividades Extracurriculares</h4>
              <p className="text-gray-300">Ofrecemos una variedad de actividades extracurriculares que complementan la educación académica y fomentan habilidades sociales y de liderazgo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Eventos Próximos */}
      <section className="py-16 bg-gray-100" data-aos="fade-up">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6 text-blue-900">Eventos Próximos</h3> {/* Azul para título */}
          <ul className="space-y-6">
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold text-red-600">Semana de la Ciencia</h4> {/* Rojo para título */}
              <p className="text-gray-600">Fecha: 15 de septiembre de 2024</p>
              <p className="text-gray-700 mt-2">Participa en nuestra semana de la ciencia donde los estudiantes presentan proyectos innovadores y exploraciones científicas.</p>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold text-red-600">Campeonato Intercolegial</h4> {/* Rojo para título */}
              <p className="text-gray-600">Fecha: 22 de septiembre de 2024</p>
              <p className="text-gray-700 mt-2">Únete a nosotros para apoyar a nuestros equipos en el campeonato intercolegial de deportes.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="py-16 bg-blue-900 text-white" data-aos="fade-up"> {/* Azul oscuro para fondo de sección */}
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6">Contáctanos</h3>
          <p className="text-lg mb-4">Para más información sobre nuestra educación secundaria, contáctanos:</p>
          <p>Teléfono: +123 456 789</p>
          <p>Email: info@liceosantacruz.com</p>
          <p>Dirección: Calle Falsa 123, Ciudad Ejemplo</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>© 2024 Liceo Santa Cruz. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:text-red-600">Facebook</a> {/* Rojo para enlaces hover */}
            <a href="https://twitter.com" className="hover:text-red-600">Twitter</a>
            <a href="https://instagram.com" className="hover:text-red-600">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimadPage;