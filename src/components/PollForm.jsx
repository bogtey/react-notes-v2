import React, { useState, useContext } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PollForm = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "" }]);
  const [note, setNote] = useState(""); // Добавлено состояние для основной информации
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { token, checkTokenValidity } = useContext(AuthContext);

  const handleAddOption = () => setOptions([...options, { id: options.length + 1, text: "" }]);
  const handleRemoveOption = (id) => setOptions(options.filter(option => option.id !== id));
  const handleOptionChange = (id, text) => setOptions(options.map(option => option.id === id ? { ...option, text } : option));

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!pollQuestion || !note || options.some(option => !option.text)) {
      setError("Название голосования, основная информация и все варианты ответов должны быть заполнены");
      return;
    }

    try {
      const optionsString = options.map(option => option.text).join(", ");
      await checkTokenValidity();
      const token = localStorage.getItem('jwt');
      const decoded = jwtDecode(token);
      const response = await axiosInstance.post(
        "/admin/create/survey/",
        {
          question: pollQuestion,
          title: optionsString,
          note: note, // Добавлено в тело запроса
          man: {
            manId: decoded.id
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Голосование успешно создано:", response.data);
      setSuccess(true);
      setPollQuestion("");
      setOptions([{ id: 1, text: "" }]);
      setNote(""); // Очистка поля основной информации
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Ошибка при создании голосования: неавторизован");
      } else {
        setError("Ошибка при создании голосования");
      }
    }
  };

  return (
    <div className="container">
      <h2>Добавление студента</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Студента</Form.Label>
          <Form.Control
            type="text"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Вопрос"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Основная информация</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Введите основную информацию"
          />
        </Form.Group>
        <Form.Label>Заметки</Form.Label>
        <ListGroup>
          {options.map((option, index) => (
            <ListGroup.Item key={option.id}>
              <Form.Control
                type="text"
                placeholder={`Вариант ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
              />
              <Button
                variant="danger"
                onClick={() => handleRemoveOption(option.id)}
                className="mt-2"
              >
                Убрать
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Button variant="secondary" onClick={handleAddOption} className="mt-3">
          Добавить
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="mt-3 ms-3">
          Сохранить
        </Button>
        {success && (
          <div className="mt-3 ms-3" style={{ backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
            Successfully
          </div>
        )}
      </Form>
      <br />
      <Link to="/students">
        <button type="button" className="btn btn-primary">Перейти к списку</button>
      </Link>
    </div>
  );
};

export default PollForm;
