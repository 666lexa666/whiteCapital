import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const SupportWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
    // Create support message
    const supportMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userEmail: user.email,
      message: message.trim(),
      status: 'new' as const,
      priority: 'medium' as const,
      createdAt: new Date(),
      responses: []
    };
    
    // Save to localStorage (in real app, this would be sent to server)
    const existingMessages = JSON.parse(localStorage.getItem('supportMessages') || '[]');
    existingMessages.push(supportMessage);
    localStorage.setItem('supportMessages', JSON.stringify(existingMessages));
    
    console.log('=== СООБЩЕНИЕ В ТЕХПОДДЕРЖКУ ===');
    console.log(`От: ${user.email}`);
    console.log(`Сообщение: ${message}`);
    console.log(`Время: ${new Date().toLocaleString()}`);
    console.log('===============================');
    
    alert('Ваше сообщение отправлено в техподдержку. Мы свяжемся с вами в ближайшее время.');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Support Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-medium">Техподдержка</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-3 mb-3">
                <p className="text-blue-300 text-sm">
                  👋 Здравствуйте! Как мы можем вам помочь?
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите вашу проблему..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Отправить</span>
              </button>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Время ответа: обычно в течение 1 часа
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Support Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
};