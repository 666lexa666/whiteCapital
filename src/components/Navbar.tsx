import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Wallet, 
  TrendingUp, 
  Settings, 
  Shield 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // If user is admin, show only admin navigation
  if (user.role === 'admin') {
    return (
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/admin" className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">White Capital Admin</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {user.email}
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">Администратор</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Regular user navigation
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">White Capital</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Панель
              </Link>
              <Link 
                to="/exchange" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Обмен
              </Link>
              <Link 
                to="/wallet" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Кошелек
              </Link>
              <Link 
                to="/verification" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Верификация
              </Link>
              <Link 
                to="/security" 
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
              >
                <Shield className="h-4 w-4" />
                <span>Безопасность</span>
                {user.twoFactorAuth?.enabled && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              {user.email}
            </div>
            <div className="flex items-center space-x-2">
              {user.isVerified ? (
                <Shield className="h-4 w-4 text-green-400" />
              ) : (
                <Shield className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm">
                {user.isVerified ? 'Верифицирован' : 'Не верифицирован'}
              </span>
              {user.twoFactorAuth?.enabled && (
                <div className="flex items-center space-x-1 bg-green-600 bg-opacity-20 px-2 py-1 rounded">
                  <Shield className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">2FA</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};