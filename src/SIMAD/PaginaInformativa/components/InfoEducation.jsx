export const InfoEducation = () => {

  return (
    <div>
      <section className="py-16 bg-blue-800 text-white" data-aos="fade-up">
        {/* Azul oscuro para fondo de sección */}
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6">Nuestra Educación Secundaria</h3>
          <p className="mb-10 max-w-2xl mx-auto text-gray-300">
            En el Liceo Santa Cruz, nos especializamos en brindar una educación secundaria de calidad que prepara a nuestros estudiantes para los retos del futuro.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card de Currículo Académico */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-[#9F0808] mb-4">Currículo Académico</h4>
              <p className="text-gray-700">
                Nuestro currículo está diseñado para proporcionar una educación integral, enfocada en el desarrollo de habilidades críticas y conocimiento profundo en diversas disciplinas. 
                Los estudiantes participan en programas académicos rigurosos que incluyen ciencias, matemáticas, humanidades, y tecnología, asegurando que estén bien preparados para 
                continuar su educación superior o ingresar directamente al mundo laboral.
                <br/><br/>
                Además, fomentamos la creatividad y el pensamiento crítico a través de proyectos interdisciplinarios y actividades prácticas. Esto permite a nuestros estudiantes 
                aplicar lo aprendido en situaciones de la vida real, desarrollando competencias que serán valiosas en sus futuras carreras.
              </p>
            </div>
            
            {/* Card de Actividades Extracurriculares */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-[#9F0808] mb-4">Actividades Extracurriculares</h4>
              <p className="text-gray-700">
                Ofrecemos una variedad de actividades extracurriculares que complementan la educación académica y fomentan habilidades sociales y de liderazgo. 
                Los estudiantes pueden elegir entre clubes de deportes, música, baile y arte, proporcionando oportunidades para explorar sus intereses y talentos.
                <br/><br/>
                Estas actividades no solo mejoran la experiencia educativa, sino que también ayudan a los estudiantes a desarrollar una sólida ética de trabajo, 
                habilidades de trabajo en equipo y liderazgo, y una mayor apreciación por la diversidad cultural. A través de eventos y competencias, 
                los estudiantes aprenden a representar a su escuela y a trabajar hacia objetivos comunes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
