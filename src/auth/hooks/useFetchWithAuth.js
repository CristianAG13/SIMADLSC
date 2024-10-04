import { useAuth } from "./useAuth";

export const useFetchWithAuth = () => {
  const { token } = useAuth();

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    return response.json();
  };

  return { fetchWithAuth };
};
