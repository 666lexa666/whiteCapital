import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  Globe,
  Shield,
  CreditCard,
  Wallet
} from 'lucide-react';
import type { SupportMessage } from '../types';

export const Support: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [userMessages, setUserMessages] = useState<SupportMessage[]>([]);

  useEffect(() => {
    loadUserMessages();
  }, [user]);

  const loadUserMessages = () => {
    if (!user) return;
    
    const allMessages = JSON.parse(localStorage.getItem('supportMessages') || '[]');
    const messages = allMessages.filter((msg: SupportMessage) => msg.userId === user.id);
    setUserMessages(messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    setIsLoading(true);
    
    // Create support message
    const supportMessage: SupportMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userEmail: user.email,
      message: message.trim(),
      category,
      status: 'new',
      priority: category === 'security' ? 'high' : category === 'payment' ? 'medium' : 'low',
      createdAt: new Date(),
      responses: []
    };
    
    // Save to localStorage
    const existingMessages = JSON.parse(localStorage.getItem('supportMessages') || '[]');
    existingMessages.push(supportMessage);
    localStorage.setItem('supportMessages', JSON.stringify(existingMessages));
    
    console.log('=== СООБЩЕНИЕ В ТЕХПОДДЕРЖКУ ===');
    console.log(`От: ${user.email}`);
    console.log(`Категория: ${category}`);
    console.log(`Сообщение: ${message}`);
    console.log(`Приоритет: ${supportMessage.priority}`);
    console.log(`Время: ${new Date().toLocaleString()}`);
    console.log('===============================');
    
    setMessage('');
    setIsLoading(false);
    loadUserMessages();
    
    alert('Ваше сообщение отправлено в техподдержку. Мы свяжемся с вами в ближайшее время.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Решено';
      case 'in_progress': return 'В работе';
      default: return 'Новое';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const categories = [
    { id: 'general', name: 'Общие вопросы', icon: HelpCircle },
    { id: 'payment', name: 'Платежи и пополнения', icon: CreditCard },
    { id: 'withdrawal', name: 'Вывод средств', icon: Wallet },
    { id: 'verification', name: 'Верификация', icon: Shield },
    { id: 'security', name: 'Безопасность', icon: AlertCircle },
    { id: 'technical', name: 'Технические проблемы', icon: Globe }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <MessageCircle className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Центр поддержки</h1>
        <p className="text-gray-400">
          Мы готовы помочь вам 24/7. Опишите вашу проблему, и мы найдем решение
        </p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center">
          <Clock className="h-8 w-8 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Время работы</h3>
          <p className="text-blue-100 text-sm">24 часа в сутки<br />7 дней в неделю</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white text-center">
          <MessageCircle className="h-8 w-8 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Время ответа</h3>
          <p className="text-green-100 text-sm">Обычно в течение<br />1 часа</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white text-center">
          <Shield className="h-8 w-8 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Безопасность</h3>
          <p className="text-purple-100 text-sm">Конфиденциальность<br />гарантирована</p>
        </div>
      </div>

      {/* New Message Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Отправить сообщение</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Категория вопроса
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      category === cat.id
                        ? 'border-blue-500 bg-blue-500 bg-opacity-20 text-blue-400'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mb-2" />
                    <p className="text-sm font-medium">{cat.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Опишите вашу проблему
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Подробно опишите вашу проблему или вопрос..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
            />
            <p className="text-xs text-gray-400 mt-2">
              Чем подробнее вы опишете проблему, тем быстрее мы сможем помочь
            </p>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Отправка...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Отправить сообщение</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* User Messages History */}
      {userMessages.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">История обращений</h3>
          
          <div className="space-y-4">
            {userMessages.map((msg) => (
              <div key={msg.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      msg.status === 'resolved' ? 'bg-green-400' :
                      msg.status === 'in_progress' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${getStatusColor(msg.status)}`}>
                      {getStatusText(msg.status)}
                    </span>
                    <span className={`text-xs ${getPriorityColor(msg.priority)}`}>
                      {msg.priority === 'high' ? 'Высокий приоритет' :
                       msg.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{msg.message}</p>
                
                {msg.responses && msg.responses.length > 0 && (
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Ответы поддержки:</h4>
                    {msg.responses.map((response) => (
                      <div key={response.id} className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-3 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-blue-400 font-medium">
                            {response.adminEmail}
                          </span>
                          <span className="text-xs text-blue-300">
                            {new Date(response.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-blue-100 text-sm">{response.response}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Часто задаваемые вопросы</h3>
        
        <div className="space-y-4">
          <div className="border border-gray-600 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Как долго обрабатываются заявки на вывод?</h4>
            <p className="text-gray-400 text-sm">
              Заявки на вывод USDT обрабатываются в течение 24 часов. Большинство заявок обрабатывается быстрее.
            </p>
          </div>
          
          <div className="border border-gray-600 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Нужна ли верификация для работы с USDT?</h4>
            <p className="text-gray-400 text-sm">
              Нет, для пополнения и вывода USDT верификация не требуется. Верификация нужна только для работы с рублями.
            </p>
          </div>
          
          <div className="border border-gray-600 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Какие комиссии взимаются?</h4>
            <p className="text-gray-400 text-sm">
              Обмен RUB → USDT происходит без комиссии. При пополнении рублевого баланса взимается комиссия 0.85%.
            </p>
          </div>
          
          <div className="border border-gray-600 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Как включить двухфакторную аутентификацию?</h4>
            <p className="text-gray-400 text-sm">
              Перейдите в раздел "Безопасность" и следуйте инструкциям для настройки 2FA с помощью Google Authenticator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};