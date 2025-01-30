import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import React from "react";
import CompositionAPIWeb from "./CompositionAPIWeb";
import CustomPortPage from "./CustomPortPage";

function App() {
  const [baseUrl, setBaseUrl] = useState(() => {
    const savedIP = localStorage.getItem('serverIP') || '192.168.100.10';
    const savedPort = localStorage.getItem('serverPort') || '8080';
    return `http://${savedIP}:${savedPort}`;
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CompositionAPIWeb baseUrl={baseUrl} />} />
        <Route path="/custom-port" element={<CustomPortPage />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;