import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, DollarSign, TrendingUp, Wallet, AlertTriangle, Clock, CheckCircle, XCircle, History } from 'lucide-react';
import type { Transaction } from '../types';

export const Exchange: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const exchangeRate = 78.5; // RUB to USDT
  const receiveAmount = (parseFloat(amount) || 0) / exchangeRate;
  const currentRubBalance = user?.balances.rub || 0;
  const maxAmount = currentRubBalance;

  useEffect(() => {
    loadTransactionHistory();
  }, [user]);

  const loadTransactionHistory = () => {
    if (!user) return;
    
    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = allTransactions
      .filter((tx: Transaction) => tx.userId === user.id)
      .sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setTransactions(userTransactions);
  };

  const handleExchange = async () => {
    if (!amount || !user) return;
    
    const amountNum = parseFloat(amount);
    
    if (amountNum > currentRubBalance) {
      alert('Недостаточно средств на балансе');
      return;
    }

    if (amountNum < 100) {
      alert('Минимальная сумма обмена: ₽100');
      return;
    }

    setIsLoading(true);
    
    // Create exchange transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userEmail: user.email,
      type: 'exchange',
      fromCurrency: 'RUB',
      toCurrency: 'USDT',
      amount: amountNum,
      rate: exchangeRate,
      status: 'completed',
      createdAt: new Date(),
      processedAt: new Date()
    };
    
    // Save transaction to localStorage
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    existingTransactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
    
    // Simulate exchange process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateUser({
      balances: {
        rub: user.balances.rub - amountNum,
        usdt: user.balances.usdt + receiveAmount
      }
    });
    
    setAmount('');
    setIsLoading(false);
    loadTransactionHistory(); // Reload transaction history
    
    alert(`Обмен успешно выполнен!\nСписано: ₽${amountNum.toLocaleString()}\nПолучено: ${receiveAmount.toFixed(6)} USDT`);
  };

  const handleMaxAmount = () => {
    setAmount(maxAmount.toString());
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (maxAmount * percentage / 100);
    setAmount(quickAmount.toString());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'pending': return 'В обработке';
      case 'failed': return 'Ошибка';
      case 'rejected': return 'Отклонено';
      default: return 'Неизвестно';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'exchange': return 'Обмен';
      case 'deposit': return 'Пополнение';
      case 'withdrawal': return 'Вывод';
      default: return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 p-4 rounded-full">
            <ArrowRight className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Обмен RUB → USDT</h1>
        <p className="text-gray-400">
          Обменивайте рубли на USDT по выгодному курсу
        </p>
      </div>

      {/* Current Balance Display */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-medium">Ваш рублевый баланс</h3>
              <p className="text-green-100 text-sm">Доступно для обмена</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">₽{currentRubBalance.toLocaleString()}</p>
            <p className="text-green-100 text-sm">
              ≈ {(currentRubBalance / exchangeRate).toFixed(2)} USDT
            </p>
          </div>
        </div>
      </div>

      {/* Exchange Rate */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <span className="text-white font-medium">Текущий курс</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">₽{exchangeRate}</p>
            <p className="text-sm text-gray-400">за 1 USDT</p>
          </div>
        </div>
      </div>

      {/* Exchange Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="space-y-6">
          {/* From Currency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Отдаете
              </label>
              <button
                onClick={handleMaxAmount}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Максимум
              </button>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseFloat(value) <= maxAmount || value === '') {
                      setAmount(value);
                    }
                  }}
                  placeholder="0.00"
                  max={maxAmount}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2 bg-green-600 px-4 py-3 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
                <span className="text-white font-medium">RUB</span>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleQuickAmount(25)}
                className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
              >
                25%
              </button>
              <button
                onClick={() => handleQuickAmount(50)}
                className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
              >
                50%
              </button>
              <button
                onClick={() => handleQuickAmount(75)}
                className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
              >
                75%
              </button>
              <button
                onClick={() => handleQuickAmount(100)}
                className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
              >
                100%
              </button>
            </div>
            
            <p className="text-sm text-gray-400 mt-2">
              Доступно: ₽{currentRubBalance.toLocaleString()}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600 rounded-full">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Получаете
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={receiveAmount.toFixed(6)}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl font-medium cursor-not-allowed"
                />
              </div>
              <div className="flex items-center space-x-2 bg-purple-600 px-4 py-3 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
                <span className="text-white font-medium">USDT</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              TRC-20 сеть
            </p>
          </div>

          {/* Validation Messages */}
          {amount && parseFloat(amount) > 0 && (
            <div className="space-y-2">
              {parseFloat(amount) > currentRubBalance && (
                <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm">
                      Недостаточно средств. Максимум: ₽{currentRubBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              
              {parseFloat(amount) < 100 && parseFloat(amount) > 0 && (
                <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">
                      Минимальная сумма обмена: ₽100
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Exchange Button */}
          <button
            onClick={handleExchange}
            disabled={
              !amount || 
              isLoading || 
              parseFloat(amount) > currentRubBalance ||
              parseFloat(amount) < 100 ||
              currentRubBalance === 0
            }
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Обмен...</span>
              </div>
            ) : currentRubBalance === 0 ? (
              'Пополните рублевый баланс'
            ) : (
              'Обменять RUB → USDT'
            )}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <History className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">История транзакций</h3>
          <div className="bg-blue-600 bg-opacity-20 px-3 py-1 rounded-full">
            <span className="text-blue-400 text-sm font-medium">{transactions.length}</span>
          </div>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-lg mb-2">История транзакций пуста</p>
            <p className="text-gray-500 text-sm">
              Ваши операции обмена, пополнения и вывода будут отображаться здесь
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const StatusIcon = getStatusIcon(transaction.status);
              return (
                <div key={transaction.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'exchange' ? 'bg-blue-600' :
                        transaction.type === 'deposit' ? 'bg-green-600' :
                        'bg-purple-600'
                      }`}>
                        {transaction.type === 'exchange' ? (
                          <ArrowRight className="h-5 w-5 text-white" />
                        ) : transaction.type === 'deposit' ? (
                          <ArrowRight className="h-5 w-5 text-white transform rotate-180" />
                        ) : (
                          <ArrowRight className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {getTransactionTypeText(transaction.type)}
                          {transaction.type === 'exchange' && ` ${transaction.fromCurrency} → ${transaction.toCurrency}`}
                          {transaction.type === 'deposit' && ` ${transaction.toCurrency}`}
                          {transaction.type === 'withdrawal' && ` ${transaction.fromCurrency}`}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          ID: {transaction.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(transaction.status)}`} />
                        <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Сумма:</span>
                      <p className="text-white font-medium">
                        {transaction.amount.toLocaleString()} {transaction.fromCurrency}
                      </p>
                    </div>
                    
                    {transaction.type === 'exchange' && transaction.rate && (
                      <div>
                        <span className="text-gray-400">Курс:</span>
                        <p className="text-white font-medium">
                          ₽{transaction.rate} за 1 USDT
                        </p>
                      </div>
                    )}
                    
                    {transaction.type === 'exchange' && (
                      <div>
                        <span className="text-gray-400">Получено:</span>
                        <p className="text-green-400 font-medium">
                          {(transaction.amount / (transaction.rate || exchangeRate)).toFixed(6)} {transaction.toCurrency}
                        </p>
                      </div>
                    )}
                    
                    {transaction.withdrawalAddress && (
                      <div className="md:col-span-3">
                        <span className="text-gray-400">Адрес вывода:</span>
                        <p className="text-white font-mono text-xs break-all">
                          {transaction.withdrawalAddress}
                        </p>
                      </div>
                    )}
                    
                    {transaction.txHash && (
                      <div className="md:col-span-3">
                        <span className="text-gray-400">Хеш транзакции:</span>
                        <p className="text-blue-400 font-mono text-xs break-all">
                          {transaction.txHash}
                        </p>
                      </div>
                    )}
                    
                    {transaction.adminNotes && (
                      <div className="md:col-span-3">
                        <span className="text-gray-400">Примечание администратора:</span>
                        <p className="text-yellow-300 text-sm italic">
                          {transaction.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {transaction.processedAt && transaction.processedBy && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Обработано: {new Date(transaction.processedAt).toLocaleString()}</span>
                        <span>Администратор: {transaction.processedBy}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exchange Info */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Информация об обмене</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Направление обмена:</span>
            <span className="text-white">Только RUB → USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Минимальная сумма обмена:</span>
            <span className="text-white">₽100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Максимальная сумма обмена:</span>
            <span className="text-white">Ваш текущий баланс</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Комиссия:</span>
            <span className="text-white">0%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Время обработки:</span>
            <span className="text-white">Мгновенно</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Курс обновляется:</span>
            <span className="text-white">В реальном времени</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Требования:</span>
            <span className="text-white">Рублевый баланс {'>'} 0</span>
          </div>
        </div>
      </div>

      {/* Balance Warning */}
      {currentRubBalance === 0 && (
        <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">Нулевой баланс</h4>
              <p className="text-yellow-300 text-sm mb-3">
                У вас нет рублей для обмена. Пополните рублевый баланс, чтобы начать обмен на USDT.
                Обратите внимание: для пополнения рублевого баланса требуется полная верификация личности.
              </p>
              <button
                onClick={() => window.location.href = '/wallet'}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
              >
                Пополнить баланс
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};