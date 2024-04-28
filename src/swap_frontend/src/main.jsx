import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.scss';
import '../app/globals.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvestorPage from './pages/Investor';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/investor" element={<InvestorPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
