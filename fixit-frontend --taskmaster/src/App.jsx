import React from 'react';
import './App.css';
import App2 from './App2';
import LoginSignupPage from './components/LoginSignupPage';
import { AuthProvider, useAuth } from './context/Logincontextprovider';
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom'


function MainApp() {
  const { loggedIn } = useAuth();
  return <>{loggedIn ? <App2 /> : <LoginSignupPage />}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
      <MainApp />
      </Router>
    </AuthProvider>
  );
}