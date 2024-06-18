// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import { Button, ListGroup, FormControl, Modal, Row, Col, Form } from 'react-bootstrap';
// import axiosInstance from '../axiosInstance';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import { jwtDecode } from 'jwt-decode';

// const StudentList = () => {
//   const [surveys, setSurveys] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editedSurvey, setEditedSurvey] = useState(null); // Состояние для временного хранения изменений
//   const [showSurveyDetails, setShowSurveyDetails] = useState(null); // Состояние для отображения расширенных деталей
//   const [newNote, setNewNote] = useState(''); // Состояние для новой заметки
//   const { token, checkTokenValidity } = useContext(AuthContext);

//   const fetchSurveys = useCallback(async () => {
//     try {
//       await checkTokenValidity();
//       const token = localStorage.getItem('jwt');
//       const decoded = jwtDecode(token);
//       const response = await axiosInstance.get(`/admin/get/all/surveys/${decoded.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSurveys(response.data);
//     } catch (error) {
//       console.error('Error fetching surveys:', error);
//       setSurveys([]); // Reset surveys on error to avoid undefined state
//     }
//   }, [token, checkTokenValidity]);

//   useEffect(() => {
//     fetchSurveys();
//   }, [fetchSurveys]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleEditClick = () => {
//     setShowModal(true); // Открываем модальное окно для редактирования
//   };

//   const handleSurveyClick = (survey) => {
//     setShowSurveyDetails(survey.surveyId); // Показываем расширенные детали выбранного опроса
//     setEditedSurvey({ ...survey }); // Копия опроса для редактирования
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setShowSurveyDetails(null); // Сбрасываем выбранный опрос при закрытии модального окна
//     setEditedSurvey(null); // Сбрасываем состояние редактирования
//     setNewNote(''); // Очищаем состояние новой заметки при закрытии окна
//   };

//   const updateSurvey = async () => {
//     try {
//       await checkTokenValidity();
//       const token = localStorage.getItem('jwt');

//       // Добавляем новую заметку к массиву существующих заметок (если она есть)
//       if (newNote.trim() !== '') {
//         const updatedNotes = editedSurvey.note ? `${editedSurvey.note}, ${newNote}` : newNote;
//         setEditedSurvey({ ...editedSurvey, note: updatedNotes });
//       }

//       // Приводим заметки к массиву и удаляем выбранную заметку (если она была выбрана)
//       const updatedNotes = editedSurvey.note.split(', ').filter((note) => note !== note);

//       await axiosInstance.post(`/admin/update/survey/${editedSurvey.surveyId}`, editedSurvey, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       fetchSurveys(); // Обновляем список опросов после успешного обновления
//       closeModal(); // Закрываем модальное окно
//     } catch (error) {
//       console.error('Error updating survey:', error);
//     }
//   };

//   const handleAddNote = () => {
//     if (newNote.trim() !== '') {
//       setEditedSurvey({ ...editedSurvey, note: editedSurvey.note ? `${editedSurvey.note}, ${newNote}` : newNote });
//       setNewNote(''); // Очищаем поле новой заметки после добавления
//     }
//   };

//   const handleRemoveNote = (note) => {
//     const updatedNotes = editedSurvey.note.split(', ').filter((item) => item !== note).join(', ');
//     setEditedSurvey({ ...editedSurvey, note: updatedNotes });
//   };

//   const filteredSurveys = surveys.filter((survey) =>
//     survey.question.toLowerCase().includes(searchTerm ? searchTerm.toLowerCase() : '')
//   );

//   return (
//     <div className="container">
//       <h2>Список опросов</h2>
//       <FormControl
//         type="text"
//         placeholder="Поиск по вопросу"
//         value={searchTerm}
//         onChange={handleSearchChange}
//         className="mb-3"
//       />
//       <Button variant="primary" onClick={fetchSurveys} className="mt-3">
//         Обновить список
//       </Button>
//       <ListGroup>
//         <br />
//         {filteredSurveys.length > 0 ? (
//           filteredSurveys.map((survey) => (
//             <ListGroup.Item key={survey.surveyId} action onClick={() => handleSurveyClick(survey)}>
//               <strong>{survey.question}</strong>
//               {showSurveyDetails === survey.surveyId && (
//                 <>
//                   <Row className="mt-3">
//                     <Col md={8}>
//                       {survey.note && (
//                         <div>
//                           <Form.Label className="font-weight-bold">Основная информация:</Form.Label>
//                           <Form.Control
//                             as="textarea"
//                             rows={5}
//                             value={survey.note}
//                             readOnly
//                             className="mb-3"
//                           />
//                         </div>
//                       )}
//                       {survey.title && (
//                         <div>
//                           <Form.Label>Заметки:</Form.Label>
//                           {survey.title.split(', ').map((option, index) => (
//                             <div key={index}>
//                               {index + 1}. {option}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </Col>
//                     <Col md={4}>
//                       <Button variant="primary" onClick={handleEditClick} className="mt-3">
//                         Изменить
//                       </Button>
//                     </Col>
//                   </Row>
//                 </>
//               )}
//             </ListGroup.Item>
//           ))
//         ) : (
//           <ListGroup.Item>Нет доступных опросов</ListGroup.Item>
//         )}
//       </ListGroup>

//       {/* Модальное окно для редактирования опроса */}
//       <Modal show={showModal} onHide={closeModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Детали опроса</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editedSurvey && (
//             <>
//               <Form.Group>
//                 <br />
//                 <Form.Label>ФИО</Form.Label>
//                 <FormControl
//                   type="text"
//                   value={editedSurvey.question}
//                   onChange={(e) => setEditedSurvey({ ...editedSurvey, question: e.target.value })}
//                 />
//               </Form.Group>
//               <Form.Group>
//                 <br />
//                 <Form.Label>Основная информация</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={5}
//                   value={editedSurvey.note}
//                   onChange={(e) => setEditedSurvey({ ...editedSurvey, note: e.target.value })}
//                   />
//                   </Form.Group>
//                   <Form.Group>
//                     <br />
//                     <Form.Label>Новая заметка</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={3}
//                       value={newNote}
//                       onChange={(e) => setNewNote(e.target.value)}
//                     />
//                     <Button variant="primary" onClick={handleAddNote} className="mt-3">
//                       Добавить заметку
//                     </Button>
//                   </Form.Group>
//                   <Form.Group>
//                     <br />
//                     <Form.Label>Заметки</Form.Label>
//                     {editedSurvey.note && editedSurvey.note.split(', ').map((note, index) => (
//                       <div key={index} className="mb-2">
//                         {note}
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           className="ms-2"
//                           onClick={() => handleRemoveNote(note)}
//                         >
//                           Удалить
//                         </Button>
//                       </div>
//                     ))}
//                   </Form.Group>
//                   <Button variant="primary" onClick={updateSurvey} className="mt-3">
//                     Сохранить
//                   </Button>
//                 </>
//               )}
//           </Modal.Body>
//         </Modal>
  
//         <Link to="/poll">
//           <Button variant="primary" className="mt-3">
//             Создать новый опрос
//           </Button>
//         </Link>
//       </div>
//     );
//   };
  
//   export default StudentList;
  import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, ListGroup, FormControl, Modal, Row, Col, Form } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

const StudentList = () => {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editedSurvey, setEditedSurvey] = useState(null); // Состояние для временного хранения изменений
  const [showSurveyDetails, setShowSurveyDetails] = useState(null); // Состояние для отображения расширенных деталей
  const [newTitle, setNewTitle] = useState(''); // Состояние для нового заголовка
  const { token, checkTokenValidity } = useContext(AuthContext);

  const fetchSurveys = useCallback(async () => {
    try {
      await checkTokenValidity();
      const token = localStorage.getItem('jwt');
      const decoded = jwtDecode(token);
      const response = await axiosInstance.get(`/admin/get/all/surveys/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setSurveys([]); // Reset surveys on error to avoid undefined state
    }
  }, [token, checkTokenValidity]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = () => {
    setShowModal(true); // Открываем модальное окно для редактирования
  };

  const handleSurveyClick = (survey) => {
    setShowSurveyDetails(survey.surveyId); // Показываем расширенные детали выбранного опроса
    setEditedSurvey({ ...survey }); // Копия опроса для редактирования
  };

  const closeModal = () => {
    setShowModal(false);
    setShowSurveyDetails(null); // Сбрасываем выбранный опрос при закрытии модального окна
    setEditedSurvey(null); // Сбрасываем состояние редактирования
    setNewTitle(''); // Очищаем состояние нового заголовка при закрытии окна
  };

  const updateSurvey = async () => {
    try {
      await checkTokenValidity();
      const token = localStorage.getItem('jwt');

      // Добавляем новый заголовок к массиву существующих заголовков (если он есть)
      if (newTitle.trim() !== '') {
        const updatedTitles = editedSurvey.title ? `${editedSurvey.title}, ${newTitle}` : newTitle;
        setEditedSurvey({ ...editedSurvey, title: updatedTitles });
      }

      // Приводим заголовки к массиву и удаляем выбранный заголовок (если он был выбран)
      const updatedTitles = editedSurvey.title.split(', ').filter((title) => title !== newTitle).join(', ');

      await axiosInstance.post(`/admin/update/survey/${editedSurvey.surveyId}`, editedSurvey, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchSurveys(); // Обновляем список опросов после успешного обновления
      closeModal(); // Закрываем модальное окно
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  };

  const handleAddTitle = () => {
    if (newTitle.trim() !== '') {
      setEditedSurvey({ ...editedSurvey, title: editedSurvey.title ? `${editedSurvey.title}, ${newTitle}` : newTitle });
      setNewTitle(''); // Очищаем поле нового заголовка после добавления
    }
  };

  const handleRemoveTitle = (title) => {
    const updatedTitles = editedSurvey.title.split(', ').filter((item) => item !== title).join(', ');
    setEditedSurvey({ ...editedSurvey, title: updatedTitles });
  };

  const filteredSurveys = surveys.filter((survey) =>
    survey.question.toLowerCase().includes(searchTerm ? searchTerm.toLowerCase() : '')
  );

  return (
    <div className="container">
      <h2>Список студентов</h2>
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
            <ListGroup.Item key={survey.surveyId} action onClick={() => handleSurveyClick(survey)}>
              <strong>{survey.question}</strong>
              {showSurveyDetails === survey.surveyId && (
                <>
                  <Row className="mt-3">
                    <Col md={8}>
                    {survey.note && (
                        <div>
                          <Form.Label className="font-weight-bold">Основная информация:</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            value={survey.note}
                            readOnly
                            className="mb-3"
                          />
                        </div>
                      )}
                      {survey.title && (
                        <div>
                          <Form.Label className="font-weight-bold">Заметки:</Form.Label>
                          {survey.title.split(', ').map((title, index) => (
                            <div key={index}>
                              {index + 1}. {title}
                            </div>
                          ))}
                        </div>
                      )}
                    </Col>
                    <Col md={4}>
                      <Button variant="primary" onClick={handleEditClick} className="mt-3">
                        Изменить
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Нет доступных студентов</ListGroup.Item>
        )}
      </ListGroup>

      {/* Модальное окно для редактирования опроса */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Редактировать</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedSurvey && (
            <>
              <Form.Group>
                <br />
                <Form.Label>ФИО</Form.Label>
                <FormControl
                  type="text"
                  value={editedSurvey.question}
                  onChange={(e) => setEditedSurvey({ ...editedSurvey, question: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <br />
                <Form.Label>Основная информация</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={editedSurvey.note}
                  onChange={(e) => setEditedSurvey({ ...editedSurvey, note: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <br />
                <Form.Label>Новая заметка</Form.Label>
                <Form.Control
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Button variant="primary" onClick={handleAddTitle} className="mt-3">
                  Добавить заметку
                </Button>
              </Form.Group>
              <Form.Group>
                <br />
                <Form.Label>Заметки</Form.Label>
                {editedSurvey.title && editedSurvey.title.split(', ').map((title, index) => (
                  <div key={index} className="mb-2">
                    {title}
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleRemoveTitle(title)}
                    >
                      Удалить
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

      <Link to="/poll">
        <Button variant="primary" className="mt-3">
          Добавить студента
        </Button>
      </Link>
    </div>
  );
};

export default StudentList;