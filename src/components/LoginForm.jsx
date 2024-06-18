// LoginForm.jsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import Cookies from 'js-cookie';



const auth = "/auth/signin"; // Используйте относительный URL
// document.cookie = "jwt=; SameSite=None; Secure";
const LoginForm = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 


  const handleSubmit = async () => {
    try {
      if (!name || !surname) {
        setError("Введите логин и пароль");
        return;
      }

      const userData = { name, surname };
      const response = await axiosInstance.post(auth, userData).then(response=>{
        console.log(response.data);
        Cookies.set("jwt",  response.data);
        localStorage.setItem('jwt', response.data);
        navigate('/poll');
      //  document.setEl
      //   const setJwt =document.getElementsByName("jwt")
      }).catch(response=>{
        setError("Пользователь не существует");
      }) // Используйте экземпляр Axios
      // console.log(response.data);
      
      

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Ошибка при отправке данных");
      } else {
        setError("Ошибка при отправке данных");
      }
    }
  };

  return (
    <div className="container">
      <h2>Авторизация</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Логин</label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="surname" className="form-label">Пароль</label>
          <input type="password" className="form-control" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Войти</button>
      </form>
      <br />
    </div>
  );
};

export default LoginForm;
