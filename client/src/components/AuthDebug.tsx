import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();

  const handleTestLogin = async () => {
    console.log('Testing login...');
    try {
      await login({
        email: 'admin@lofi-cafe.com',
        password: 'admin123'
      });
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleTestLogout = () => {
    console.log('Testing logout...');
    logout();
    console.log('Logout successful!');
  };

  return (
    <div className="fixed top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="text-sm space-y-1 mb-4">
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.username : 'None'}</p>
        <p><strong>Role:</strong> {user ? user.role : 'None'}</p>
        {error && <p><strong>Error:</strong> {error}</p>}
      </div>
      <div className="space-y-2">
        <button
          onClick={handleTestLogin}
          className="w-full px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Test Login
        </button>
        <button
          onClick={handleTestLogout}
          className="w-full px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Test Logout
        </button>
      </div>
    </div>
  );
};

export default AuthDebug; 