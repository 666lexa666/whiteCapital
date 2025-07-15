import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Info,
  FileText,
  MessageCircle,
  ExternalLink,
  Users,
  Scale,
  Lock,
  Cookie,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const mockChartData = [
  { name: 'Янв', value: 75.5 },
  { name: 'Фев', value: 76.2 },
  { name: 'Мар', value: 77.8 },
  { name: 'Апр', value: 76.9 },
  { name: 'Май', value: 78.1 },
  { name: 'Июн', value: 79.3 },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const totalBalance = user?.balances.rub || 0 + (user?.balances.usdt || 0) * 78.5;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Добро пожаловать, {user?.email}
          </h1>
          <p className="text-gray-400">Управляйте своими активами и торгуйте криптовалютой</p>
        </div>
        {user?.isVerified ? (
          <div className="bg-green-600 bg-opacity-20 border border-green-600 text-green-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Пользователь верифицирован</span>
          </div>
        ) : (
          <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Требуется верификация</span>
          </div>
        )}
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8" />
            <TrendingUp className="h-5 w-5 text-blue-200" />
          </div>
          <h3 className="text-lg font-medium mb-2">Общий баланс</h3>
          <p className="text-3xl font-bold">₽{totalBalance.toLocaleString()}</p>
          <p className="text-blue-200 text-sm mt-2">+5.2% за неделю</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            <ArrowUpRight className="h-5 w-5 text-green-200" />
          </div>
          <h3 className="text-lg font-medium mb-2">Рублевый баланс</h3>
          <p className="text-3xl font-bold">₽{(user?.balances.rub || 0).toLocaleString()}</p>
          <p className="text-green-200 text-sm mt-2">Доступно для обмена</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8" />
            <ArrowDownRight className="h-5 w-5 text-purple-200" />
          </div>
          <h3 className="text-lg font-medium mb-2">USDT Баланс</h3>
          <p className="text-3xl font-bold">{(user?.balances.usdt || 0).toFixed(2)} USDT</p>
          <p className="text-purple-200 text-sm mt-2">≈ ₽{((user?.balances.usdt || 0) * 78.5).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">График курса RUB/USDT</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Последние операции</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Пополнение</p>
                  <p className="text-gray-400 text-sm">Сегодня, 14:30</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-medium">+₽5,000</p>
                <p className="text-gray-400 text-sm">Завершено</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Обмен RUB → USDT</p>
                  <p className="text-gray-400 text-sm">Вчера, 16:45</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-400 font-medium">+63.7 USDT</p>
                <p className="text-gray-400 text-sm">Завершено</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Вывод USDT</p>
                  <p className="text-gray-400 text-sm">2 дня назад, 10:20</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-medium">-25.0 USDT</p>
                <p className="text-gray-400 text-sm">В обработке</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* About Us Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-blue-200" />
            <h3 className="text-xl font-semibold">О нас</h3>
          </div>
          <p className="text-blue-100 text-sm mb-6 leading-relaxed">
            White Capital — надежная криптовалютная биржа для обмена рублей на USDT. 
            Мы обеспечиваем безопасные и быстрые транзакции с полной защитой ваших средств.
          </p>
          <Link 
            to="/about"
            className="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            <Info className="h-4 w-4" />
            <span>Узнать больше</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Legal Information Section */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="h-8 w-8 text-gray-300" />
            <h3 className="text-xl font-semibold">Правовая информация</h3>
          </div>
          <div className="space-y-3">
            <Link 
              to="/legal/offer"
              className="flex items-center justify-between p-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-300" />
                <span className="text-sm">Публичная оферта</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
            </Link>
            
            <Link 
              to="/legal/privacy"
              className="flex items-center justify-between p-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-300" />
                <span className="text-sm">Политика конфиденциальности</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
            </Link>
            
            <Link 
              to="/legal/personal-data"
              className="flex items-center justify-between p-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-300" />
                <span className="text-sm">Обработка персональных данных</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
            </Link>
            
            <Link 
              to="/legal/cookies"
              className="flex items-center justify-between p-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <Cookie className="h-4 w-4 text-gray-300" />
                <span className="text-sm">Политика обработки файлов куки</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="h-8 w-8 text-green-200" />
            <h3 className="text-xl font-semibold">Поддержка</h3>
          </div>
          <p className="text-green-100 text-sm mb-6 leading-relaxed">
            Нужна помощь? Наша служба поддержки работает 24/7 и готова ответить на все ваши вопросы 
            по работе с платформой.
          </p>
          <div className="space-y-3">
            <Link 
              to="/support"
              className="flex items-center justify-between p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Центр поддержки</span>
              </div>
              <ExternalLink className="h-4 w-4 group-hover:text-green-100" />
            </Link>
            
            <div className="bg-green-700 bg-opacity-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-green-200" />
                <span className="text-sm font-medium text-green-200">Время ответа</span>
              </div>
              <p className="text-xs text-green-100">Обычно в течение 1 часа</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};