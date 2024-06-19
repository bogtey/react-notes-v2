import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, ListGroup, FormControl } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

const StudentList = () => {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { token, checkTokenValidity } = useContext(AuthContext);

  const fetchSurveys = useCallback(async () => {
    try {
      await checkTokenValidity();
      const token = localStorage.getItem('jwt');
      const decoded = jwtDecode(token);
      const response = await axiosInstance.get(`/admin/get/surveys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setSurveys([]);
    }
  }, [token, checkTokenValidity]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSurveys = surveys.filter((survey) =>
    survey.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Мой список студентов</h2>
      <FormControl
        type="text"
        placeholder="Поиск студента по ФИО"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-3"
      />
      <Button variant="primary" onClick={fetchSurveys} className="mt-3">
        Обновить список
      </Button>
      <ListGroup>
        <br />
        {filteredSurveys.length > 0 ? (
          filteredSurveys.map((survey) => (
            <ListGroup.Item key={survey.surveyId} action className="list-group-item">
              <Link
                to={`/student/${survey.surveyId}`}
                className="d-flex justify-content-between align-items-center text-decoration-none"
              >
                <strong>{survey.question}</strong>
              </Link>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Нет доступных студентов</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default StudentList;
