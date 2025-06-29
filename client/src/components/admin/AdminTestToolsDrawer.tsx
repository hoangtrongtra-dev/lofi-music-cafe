import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronLeft, Wrench } from 'lucide-react';
import SimpleAuthTest from '../SimpleAuthTest';

const demoCredentials = (
  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
    <div className="text-xs text-gray-600 space-y-1">
      <p><strong>Admin:</strong> admin@lofi-cafe.com / admin123</p>
      <p><strong>User:</strong> user@lofi-cafe.com / user123</p>
    </div>
  </div>
);

const AdminTestToolsDrawer: React.FC = () => {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isAdmin()) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed top-1/2 right-0 z-50 bg-blue-600 text-white p-2 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors"
        style={{ transform: 'translateY(-50%)' }}
        onClick={() => setOpen(true)}
        aria-label="Open Admin Test Tools"
      >
        <Wrench className="w-5 h-5" />
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          {/* Sidebar */}
          <aside className="relative w-96 max-w-full h-full bg-white shadow-2xl p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                Admin Test Tools
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-8">
              <SimpleAuthTest />
              {demoCredentials}
              {/* Thêm các tool test khác ở đây nếu cần */}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminTestToolsDrawer; 