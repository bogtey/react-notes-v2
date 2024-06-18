import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const checkTokenValidity = async () => {
    if (!token) return;}
  
  //   try {
  //     const response = await axiosInstance.post('/auth/refresh-token', { token });
  //     const newToken = response.data.token;
  //     document.cookie = `token=${tokenFromCookie};`; // Set the cookie with the token value
  //     setToken(newToken);
  //     localStorage.setItem('token', newToken);
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       logout();
  //     }
  //   }
  // };
  
  function getTokenFromCookie() {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const [name, value] = cookie.split('=');
  
      if (name === 'token') {
        return value;
      }
    }
  
    return null;
  }

  const tokenFromCookie = getTokenFromCookie();
  // console.log(tokenFromCookie); // Should log the token value

  useEffect(() => {
    if (token) {
      checkTokenValidity();
    }
  },);

  const login = (token) => {
    setToken(token);
    localStorage.setItem('jwt', token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwt');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, checkTokenValidity }}>
      {children}
    </AuthContext.Provider>
  );
};
