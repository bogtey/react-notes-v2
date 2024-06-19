// components/StudentDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import {jwtDecode} from 'jwt-decode';
import { Container, Row, Col, Form, Button, Modal, FormControl } from 'react-bootstrap';

const StudentDetails = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedSurvey, setEditedSurvey] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newName, setNewName] = useState('');
  const [updatedTitlesToRemove, setUpdatedTitlesToRemove] = useState([]);
  const { token, checkTokenValidity } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        await checkTokenValidity();
        const token = localStorage.getItem('jwt');
        const decoded = jwtDecode(token);
        const response = await axiosInstance.get(`/admin/get/surveys/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurvey(response.data);
        setEditedSurvey(response.data);
      } catch (error) {
        console.error('Error fetching survey details:', error);
      }
    };

    fetchSurveyDetails();
  }, [id, checkTokenValidity]);

  const handleEditClick = () => {
    setShowModal(true);
    setNewName(editedSurvey.question);
    setNewNote('');
    setUpdatedTitlesToRemove([]);
  };

  const closeModal = () => {
    setShowModal(false);
    setUpdatedTitlesToRemove([]);
  };

  const updateSurvey = async () => {
    try {
      await checkTokenValidity();
      const token = localStorage.getItem('jwt');
      const updatedSurvey = {
        ...editedSurvey,
        question: newName,
        title: editedSurvey.title
          .split(', ')
          .filter((note) => !updatedTitlesToRemove.includes(note))
          .join(', '),
      };
      await axiosInstance.post(`/admin/update/survey/${editedSurvey.surveyId}`, updatedSurvey, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurvey(updatedSurvey);
      setEditedSurvey(updatedSurvey);
      closeModal();
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      const updatedSurvey = {
        ...editedSurvey,
        title: editedSurvey.title ? `${editedSurvey.title}, ${newNote}` : newNote,
      };
      setEditedSurvey(updatedSurvey);
      setNewNote('');
    }
  };

  const handleRemoveNote = (note) => {
    const updatedTitles = editedSurvey.title
      .split(', ')
      .filter((item) => item !== note)
      .join(', ');
    const updatedSurvey = {
      ...editedSurvey,
      title: updatedTitles,
    };
    setEditedSurvey(updatedSurvey);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  return (
    <Container>
      {survey ? (
        <>
          <h2>Страница студента</h2>
          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>ФИО</Form.Label>
                <Form.Control type="text" value={survey.question} readOnly />
              </Form.Group>
              <Form.Group>
                <br />
                <Form.Label>Основная информация</Form.Label>
                <Form.Control as="textarea" rows={5} value={survey.note} readOnly />
              </Form.Group>
              <Form.Group>
                <br />
                <Form.Label>Заметки</Form.Label>
                {survey.title &&
                  survey.title.split(', ').map((note, index) => (
                    <div key={index}>
                      {index + 1}. {note}
                    </div>
                  ))}
              </Form.Group>
              <br />
              <Button variant="primary" onClick={handleEditClick}>
              Оставить\Убрать заметку
              </Button>
            </Col>
          </Row>
          <br />
          <Button variant="primary" onClick={() => navigate('/student-feed')}>
            Назад к списку студентов
          </Button>

          <Modal show={showModal} onHide={closeModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Оставить\Убрать заметку</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editedSurvey && (
                <>
                  <Form.Group>
                    <br />
                    <Form.Label>Новая заметка</Form.Label>
                    <Form.Control
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleAddNote} className="mt-3">
                      Добавить заметку
                    </Button>
                  </Form.Group>
                  <Form.Group>
                    <br />
                    <Form.Label>Все заметки:</Form.Label>
                    {editedSurvey.title &&
                      editedSurvey.title.split(', ').map((note, index) => (
                        <div key={index} className="mb-2">
                          {note}
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleRemoveNote(note)}
                          >
                            Убрать
                          </Button>
                        </div>
                      ))}
                  </Form.Group>
                  <Button variant="primary" onClick={updateSurvey} className="mt-3">
                    Сохранить
                  </Button>
                </>
              )}
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </Container>
  );
};

export default StudentDetails;
