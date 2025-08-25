import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check credentials
    const validCredentials = 
      (username === 'shay053713' && password === 'admin123') ||
      (username === 'TALI' && password === '1234ADMIN');
    
    if (validCredentials && login(username)) {
      onClose();
      setUsername('');
      setPassword('');
      setError('');
      navigate('/admin');
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Lock className="w-5 h-5 ml-2" />
            כניסת מנהל
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              שם משתמש
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-800 text-white py-2 px-4 rounded-lg hover:bg-orange-900 transition-colors duration-200"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;