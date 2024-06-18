import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button, ListGroup, FormControl } from 'react-bootstrap'; // Add FormControl here
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Add searchTerm state
  const [sharedPollId, setSharedPollId] = useState(null); // Состояние для хранения идентификатора опроса, для которого была нажата кнопка "Share"
  const [sharedLink, setSharedLink] = useState('');
  const { token, checkTokenValidity } = useContext(AuthContext);

  const fetchPolls = useCallback(async () => {
    try {
      await checkTokenValidity();
      const token = localStorage.getItem('jwt');
      const decoded = jwtDecode(token);
      const response = await axiosInstance.get('/admin/get/all/surveys/' + decoded.id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setPolls([]); // Reset polls on error to avoid undefined state
    }
  }, [token, checkTokenValidity]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const deletePoll = async (id) => {
    if (!id) {
      console.error('Invalid poll ID');
      return;
    }

    try {
      await checkTokenValidity();
      await axiosInstance.post(`/admin/delete/survey/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolls(); // Refresh poll list after deletion
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  const generatePollLink = (pollId) => {
    return `${window.location.origin}/vote/${pollId}`;
  };

  const handleShareClick = (pollId) => {
    const link = generatePollLink(pollId);
    setSharedLink(link);
    setSharedPollId(pollId); // Устанавливаем идентификатор опроса для кнопки "Share"
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPolls = polls.filter((poll) =>
    poll.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Список студентов</h2>
      <FormControl
        type="text"
        placeholder="Поиск опроса по вопросу"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-3"
      />
      <Button variant="primary" onClick={fetchPolls} className="mt-3">
        Обновить список
      </Button>
      <ListGroup>
        <br />
        {filteredPolls && filteredPolls.length > 0 ? (
          filteredPolls.map((poll) => (
            <ListGroup.Item key={poll.surveyId}>
              <strong>{poll.question}</strong>
              <br />
              
              <Button
                variant="danger"
                onClick={() => deletePoll(poll.surveyId)}
                className="mt-2 me-2"
              >
                Удалить
              </Button>
              
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Нет доступных опросов</ListGroup.Item>
        )}
      </ListGroup>
      <Link to="/poll">
        <Button variant="primary" className="mt-3">
          Создать новое голосование
        </Button>
      </Link>
    </div>
  );
};

export default PollList;
