import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SimpleAuthTest: React.FC = () => {
  const { login, logout, user, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState('admin@lofi-cafe.com');
  const [password, setPassword] = useState('admin123');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password });
    try {
      await login({ email, password });
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    console.log('Logout successful!');
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-4">Simple Auth Test</h3>
      
      <div className="mb-4 text-sm">
        <p><strong>Status:</strong> {isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.username : 'None'}</p>
        <p><strong>Role:</strong> {user ? user.role : 'None'}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="admin@lofi-cafe.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="admin123"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="text-sm">
            <p><strong>Welcome, {user?.username}!</strong></p>
            <p>Role: {user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600">
        <p><strong>Test Credentials:</strong></p>
        <p>Admin: admin@lofi-cafe.com / admin123</p>
        <p>User: user@lofi-cafe.com / user123</p>
      </div>
    </div>
  );
};

export default SimpleAuthTest; 