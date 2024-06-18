import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegisterForm.css'; // Подключаем свои дополнительные стили
import axios from 'axios';

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Используем useNavigate вместо useHistory

  const handleSubmit = async () => {
    // Проверка наличия введенных данных
    if (!name || !surname) {
      setError("Все поля должны быть заполнены");
      return;
    }

    try {
      const userData = { name, surname };
      const response = await axios.post("http://localhost:3333/auth/signup", userData);
      console.log("Регистрация прошла успешно:", response.data);
      navigate('/login'); // Используем navigate для перехода на страницу авторизации после успешной регистрации
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
      <h2>Регистрация</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Имя пользователя</label>
          <input type="text" className="form-control" id="username" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="surname" className="form-label">Пароль</label>
          <input type="password" className="form-control" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Зарегистрироваться</button>
      </form>
      <br />
    </div>
  );
};

export default RegisterForm;
