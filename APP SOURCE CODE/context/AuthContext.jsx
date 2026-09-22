import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedDoctor = await AsyncStorage.getItem('doctor');

      if (storedToken) {
        setToken(storedToken);
        setDoctor(JSON.parse(storedDoctor));
      }
    } catch (e) {
      console.log('Auth load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (newToken, doctorData) => {
    await AsyncStorage.setItem('token', newToken);
    await AsyncStorage.setItem('doctor', JSON.stringify(doctorData));

    setToken(newToken);
    setDoctor(doctorData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('doctor');

    setToken(null);
    setDoctor(null);
  };

  const updateDoctor = async (updatedData) => {
    try {
      const newDoctor = { ...doctor, ...updatedData };

      setDoctor(newDoctor);
      await AsyncStorage.setItem(
        'doctor',
        JSON.stringify(newDoctor)
      );
    } catch (e) {
      console.log('Update doctor error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        doctor,
        login,
        logout,
        loading,
        setDoctor,
        updateDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);