import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PollForm from './components/PollForm';
import PollList from './components/PollList';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import AdminPanel from './components/AdminPanel';
import VotePage from './components/VotePage'; // Импортируем компонент VotePage
import { AuthProvider } from './contexts/AuthContext';
import Cookies from 'js-cookie';

function App() {
  Cookies.set('jwt', '', { expires: 7, path: '/' });

  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/poll" element={<PollForm />} />
              <Route path="/polls" element={<PollList />} />
              <Route path="/vote/:id" element={<VotePage />} /> {/* Добавляем маршрут для страницы VotePage */}
              <Route path="/admin" element={<AdminPanel/>} />
              <Route path="/students" element={<StudentList/>} />
              <Route path="/add-student" component={<AddStudent/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
