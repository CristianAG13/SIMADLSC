import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/useProfileService';

export const useUserProfile = (token) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const data = await fetchUserProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getUserProfile();
    }
  }, [token]);

  return { profile, loading, error };
};
