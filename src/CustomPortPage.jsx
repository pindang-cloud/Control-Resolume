import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomPortPage = () => {
  const [ip, setIp] = useState(() => localStorage.getItem('serverIP') || '192.168.100.10');
  const [port, setPort] = useState(() => localStorage.getItem('serverPort') || '8080');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('serverIP', ip);
    localStorage.setItem('serverPort', port);
    
    // Navigate to home page and refresh
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Server Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">IP Address</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Port</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              pattern="^\d+$"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Save & Refresh
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomPortPage;