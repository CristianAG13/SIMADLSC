
import { useEffect, useState } from "react";
import { fetchUserProfile } from "./services/useProfileService";

export const MiPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
        setError("Error al cargar el perfil del usuario");
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  if (!user) {
    return <p>No se encontraron datos del usuario</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-white text-3xl font-bold">
            {user.nombre_Usuario ? user.nombre_Usuario.charAt(0) : ""}
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold">{`${user.nombre_Usuario} ${user.apellido1_Usuario} ${user.apellido2_Usuario}`}</p>
            <p>{user.email_Usuario}</p>
          </div>
        </div>
        <p>
          <strong>Soy</strong>{" "}
          {user.nombre_Rol ? user.nombre_Rol : "Sin rol asignado"}
        </p>
      </div>
    </div>
  );
};