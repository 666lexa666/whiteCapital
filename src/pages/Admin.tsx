import React, { useState } from 'react';

export const Admin = () => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const respondToSupport = () => {
    setIsLoading(true);
    // Логика отправки...
    setIsLoading(false);
    setSelectedMessage(null);
    setResponseText('');
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Админ-панель</h2>
          
          <div className="space-y-4">
            {/* Основной контент админ-панели */}
          </div>

          {/* Модальное окно ответа */}
          {selectedMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Ответ пользователю {selectedMessage.userEmail}
                </h3>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm">{selectedMessage.message}</p>
                </div>

                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Введите ваш ответ..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={respondToSupport}
                    disabled={!responseText.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {isLoading ? 'Отправка...' : 'Отправить ответ'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMessage(null);
                      setResponseText('');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Убедитесь, что нет дублирующего экспорта
// Только один экспорт - именованный