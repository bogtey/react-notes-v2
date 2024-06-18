import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './VotePage.css';

const VotePage = () => {
  const { id } = useParams(); // Получаем параметр id из URL
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Состояние выбранного пользователем варианта
  const [loading, setLoading] = useState(true); // Добавляем состояние для отслеживания загрузки

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axiosInstance.get(`/admin/get/surveys/${id}`);
        setPoll(response.data);
        setLoading(false); // Устанавливаем loading в false после загрузки данных
      } catch (error) {
        console.error('Error fetching poll:', error);
      }
    };

    fetchPoll();
  }, [id]);

  console.log("Poll data:", poll);

  const handleVote = async () => {
    try {
      await axiosInstance.post('/authorized/vote/${id}', { selectedOption });
      setPoll(prevPoll => ({
        ...prevPoll,
        title: prevPoll.title.map(title => {
          if (title.text === selectedOption) {
            return { ...title, count: (title.count || 0) + 1 };
          } else {
            return title;
          }
        })
      }));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };
  

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : poll ? (
        <div>
          <h2>{poll.question}</h2>
          <ul>
          {poll.title.split(',').map((title, index) => (
  <li key={index}>
    <label>
      <input
        type="radio"
        name="option"
        value={title.trim()}
        checked={selectedOption === title.trim()}
        onChange={() => setSelectedOption(title.trim())}
      />
      {title.trim()} ({(poll.title[index].count || 0)} голосов)
    </label>
  </li>
))}
          </ul>
          <button onClick={handleVote}>Голосовать</button>
        </div>
      ) : (
        <p>No poll data available</p>
      )}
    </div>
  );
};

export default VotePage;
