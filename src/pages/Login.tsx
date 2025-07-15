import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Mail, Lock, Shield, Smartphone } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, requires2FA, setRequires2FA } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password, twoFactorCode);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.message === 'REQUIRES_2FA') {
        // 2FA is required, form will show 2FA input
        setError('');
      } else {
        setError(error.message || 'Ошибка входа');
        setRequires2FA(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setRequires2FA(false);
    setTwoFactorCode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">White Capital</h1>
          <p className="text-gray-400">
            {requires2FA ? 'Введите код аутентификации' : 'Войдите в свой аккаунт'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {requires2FA && (
          <div className="mb-6 p-4 bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Двухфакторная аутентификация</span>
            </div>
            <p className="text-blue-200 text-sm">
              Откройте приложение Google Authenticator и введите 6-значный код для аккаунта {email}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!requires2FA ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Код аутентификации
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Введите 6-значный код из приложения Google Authenticator
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            {requires2FA && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Назад
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading || (requires2FA && twoFactorCode.length !== 6)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : requires2FA ? (
                'Подтвердить'
              ) : (
                'Войти'
              )}
            </button>
          </div>
        </form>

        {!requires2FA && (
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        )}

        {!requires2FA && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Демо-аккаунты:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Пользователь: user@test.com (любой пароль)</p>
              <p>Админ: admin@whitecapital.com</p>
              <p>Пароль админа: anita2021</p>
              <p className="text-blue-400 mt-2">2FA коды для демо: 123456, 654321, или любой код начинающийся с 1</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};