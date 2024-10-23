import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; 

export const Footer = () => {
  return (
    <footer className="bg-[#0A2A4A] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Columna 1: Logo y descripción */}
        <div className="text-center md:text-left">
        <img src="images/ruta_del_logo.png" alt="Liceo Santa Cruz" style={{ width: '40px', height: '40px' }} className="mx-auto md:mx-0 mb-4" />
        <p className="text-sm">
            Liceo Santa Cruz Clímaco A. Pérez. <br />
            Somos una huella de éxito en el tiempo, con el futuro en tus manos.
          </p>
        </div>

        {/* Columna 2: Contactos */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-2">Contactos</h4>
          <p className="text-sm">Teléfono: 2680-0219</p>
          <p className="text-sm">
            Correo electrónico: 
            <a href="mailto:lic.santacruz@mep.go.cr" className="text-blue-400 hover:text-blue-600"> lic.santacruz@mep.go.cr</a>
          </p>
        </div>

        {/* Columna 3: Ubicación */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-2">Ubicación</h4>
          <p className="text-sm">
            Santa Cruz, Santa Cruz, Guanacaste del Hotel la Calle de Alcalá 100 mts este.
          </p>
        </div>

        {/* Columna 4: Redes Sociales */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-2">Redes Sociales</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-white hover:text-blue-400">
              <FaFacebook size="1.5em" /> 
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <FaTwitter size="1.5em" /> 
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <FaInstagram size="1.5em" /> 
            </a>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-600 mt-6"></div>

      {/* Copyright */}
      <div className="text-center mt-4 text-sm">
      © 2024 Liceo Santa Cruz. Todos los derechos reservados      
      </div>
    </footer>
  );
};

export default Footer;
