import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Wallet as WalletIcon, 
  QrCode, 
  Copy, 
  Send, 
  Download,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator,
  History,
  XCircle,
  Filter
} from 'lucide-react';
import type { Transaction } from '../types';

export const Wallet: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [depositType, setDepositType] = useState<'rub' | 'usdt'>('rub');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  // Commission rate for RUB deposits
  const COMMISSION_RATE = 0.0085; // 0.85%

  useEffect(() => {
    loadTransactionHistory();
  }, [user]);

  const loadTransactionHistory = () => {
    if (!user) return;
    
    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = allTransactions
      .filter((tx: Transaction) => tx.userId === user.id)
      .filter((tx: Transaction) => tx.type === 'deposit' || tx.type === 'withdrawal')
      .sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setTransactions(userTransactions);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (historyFilter === 'all') return true;
    return tx.type === historyFilter;
  });

  const calculateCommission = (amount: number) => {
    return amount * COMMISSION_RATE;
  };

  const calculateNetAmount = (amount: number) => {
    return amount - calculateCommission(amount);
  };

  const handleDeposit = async () => {
    if (!depositAmount || !user) return;
    
    setIsLoading(true);
    
    const amount = parseFloat(depositAmount);
    
    // Create deposit transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userEmail: user.email,
      type: 'deposit',
      fromCurrency: depositType.toUpperCase(),
      toCurrency: depositType.toUpperCase(),
      amount: amount,
      status: 'completed',
      createdAt: new Date(),
      processedAt: new Date()
    };
    
    // Save transaction to localStorage
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    existingTransactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
    
    // Simulate deposit process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (depositType === 'rub') {
      const commission = calculateCommission(amount);
      const netAmount = calculateNetAmount(amount);
      
      updateUser({
        balances: {
          ...user.balances,
          rub: user.balances.rub + netAmount
        }
      });
      
      console.log('=== ПОПОЛНЕНИЕ РУБЛЕВОГО БАЛАНСА ===');
      console.log(`Пользователь: ${user.email}`);
      console.log(`Сумма пополнения: ₽${amount.toLocaleString()}`);
      console.log(`Комиссия (0.85%): ₽${commission.toFixed(2)}`);
      console.log(`К зачислению: ₽${netAmount.toFixed(2)}`);
      console.log(`Время: ${new Date().toLocaleString()}`);
      console.log('==================================');
      
      alert(`Пополнение успешно!\n\nСумма: ₽${amount.toLocaleString()}\nКомиссия: ₽${commission.toFixed(2)} (0.85%)\nЗачислено: ₽${netAmount.toFixed(2)}`);
    } else {
      updateUser({
        balances: {
          ...user.balances,
          usdt: user.balances.usdt + amount
        }
      });
      
      alert(`USDT успешно зачислен!\nСумма: ${amount} USDT`);
    }
    
    setDepositAmount('');
    setIsLoading(false);
    loadTransactionHistory(); // Reload transaction history
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress || !user) return;
    
    const amount = parseFloat(withdrawAmount);
    
    if (amount < 10) {
      alert('Минимальная сумма вывода: 10 USDT');
      return;
    }
    
    if (user.balances.usdt < amount) {
      alert('Недостаточно средств на балансе');
      return;
    }
    
    setIsLoading(true);
    
    // Create withdrawal transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userEmail: user.email,
      type: 'withdrawal',
      fromCurrency: 'USDT',
      toCurrency: 'USDT',
      amount: amount,
      status: 'pending',
      createdAt: new Date(),
      withdrawalAddress: withdrawAddress
    };
    
    // Save transaction to localStorage for admin processing
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    existingTransactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
    
    // Deduct amount from user balance (will be returned if rejected)
    updateUser({
      balances: {
        ...user.balances,
        usdt: user.balances.usdt - amount
      }
    });
    
    console.log('=== ЗАЯВКА НА ВЫВОД USDT ===');
    console.log(`Пользователь: ${user.email}`);
    console.log(`Сумма: ${amount} USDT`);
    console.log(`Адрес: ${withdrawAddress}`);
    console.log(`ID заявки: ${transaction.id}`);
    console.log(`Статус: Ожидает обработки администратором`);
    console.log('============================');
    
    alert(`Заявка на вывод ${amount} USDT создана!\n\nID заявки: ${transaction.id}\n\nЗаявка будет обработана администратором в течение 24 часов.`);
    
    setWithdrawAmount('');
    setWithdrawAddress('');
    setIsLoading(false);
    loadTransactionHistory(); // Reload transaction history
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
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
      case 'deposit': return 'Пополнение';
      case 'withdrawal': return 'Вывод';
      default: return type;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return ArrowDownRight;
      case 'withdrawal': return ArrowUpRight;
      default: return ArrowUpRight;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-green-600';
      case 'withdrawal': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <WalletIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Кошелек</h1>
        <p className="text-gray-400">
          Управляйте своими средствами и проводите операции
        </p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Рублевый баланс</h3>
            <CreditCard className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold mb-2">₽{(user?.balances.rub || 0).toLocaleString()}</p>
          <p className="text-green-100 text-sm">Доступно для обмена</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">USDT Баланс</h3>
            <WalletIcon className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold mb-2">{(user?.balances.usdt || 0).toFixed(2)} USDT</p>
          <p className="text-purple-100 text-sm">TRC-20 сеть</p>
        </div>
      </div>

      {/* Wallet Address - Always shown for regular users */}
      {user?.walletAddress && user.role !== 'admin' && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Ваш личный TRC-20 кошелек</h3>
            <div className="flex items-center space-x-2 bg-green-600 bg-opacity-20 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Активен</span>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Адрес для пополнения USDT:</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-400">Автоматически создан</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
              <code className="flex-1 text-sm font-mono text-gray-300 break-all">
                {user.walletAddress}
              </code>
              <button
                onClick={() => copyToClipboard(user.walletAddress!, 'wallet')}
                className={`p-2 rounded transition-colors ${
                  copySuccess === 'wallet' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'wallet' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="mt-3 p-3 bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-300">
                  <p className="font-medium mb-1">💡 Важная информация:</p>
                  <ul className="space-y-1">
                    <li>• Отправляйте только USDT в сети TRC-20</li>
                    <li>• Минимальная сумма пополнения: 10 USDT</li>
                    <li>• Средства поступят после 1 подтверждения сети</li>
                    <li>• Время зачисления: 5-15 минут</li>
                    <li>• <strong>Верификация НЕ требуется для USDT операций</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'deposit'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="h-5 w-5 inline mr-2" />
            Пополнение
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'withdraw'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="h-5 w-5 inline mr-2" />
            Вывод
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="h-5 w-5 inline mr-2" />
            История
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'deposit' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Пополнение баланса</h3>
                <p className="text-gray-400 mb-6">
                  Выберите способ пополнения: рубли (требует верификации) или USDT на криптокошелек
                </p>
              </div>

              {/* Deposit Type Selector */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setDepositType('rub')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors relative ${
                    depositType === 'rub'
                      ? 'border-green-500 bg-green-500 bg-opacity-20 text-green-400'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <CreditCard className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">Рубли (RUB)</p>
                  <p className="text-xs opacity-75">СБП, банковская карта</p>
                  {!user?.isVerified && (
                    <div className="absolute top-2 right-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => setDepositType('usdt')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors relative ${
                    depositType === 'usdt'
                      ? 'border-purple-500 bg-purple-500 bg-opacity-20 text-purple-400'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <WalletIcon className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">USDT</p>
                  <p className="text-xs opacity-75">TRC-20 сеть</p>
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </button>
              </div>

              {depositType === 'rub' ? (
                <div className="space-y-6">
                  {!user?.isVerified ? (
                    <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-yellow-400 font-medium mb-2">Требуется полная верификация</h4>
                          <p className="text-yellow-300 text-sm mb-4">
                            Для пополнения рублевого баланса необходимо пройти полную верификацию личности. 
                            Это включает подтверждение email, телефона, документов и биометрии.
                          </p>
                          <button
                            onClick={() => window.location.href = '/verification'}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                          >
                            Пройти верификацию
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Сумма пополнения (₽)
                        </label>
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="1000"
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          Минимум: ₽100, Максимум: ₽500,000
                        </p>
                        
                        {/* Commission Calculator */}
                        {depositAmount && parseFloat(depositAmount) > 0 && (
                          <div className="mt-4 p-4 bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg">
                            <div className="flex items-center space-x-2 mb-3">
                              <Calculator className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-400 font-medium text-sm">Расчет комиссии</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-300">Сумма пополнения:</span>
                                <span className="text-white font-medium">₽{parseFloat(depositAmount).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-300">Комиссия (0.85%):</span>
                                <span className="text-red-400 font-medium">-₽{calculateCommission(parseFloat(depositAmount)).toFixed(2)}</span>
                              </div>
                              <div className="border-t border-blue-600 pt-2">
                                <div className="flex justify-between">
                                  <span className="text-blue-300 font-medium">К зачислению:</span>
                                  <span className="text-green-400 font-bold">₽{calculateNetAmount(parseFloat(depositAmount)).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center bg-gray-700 rounded-lg p-6">
                        <div className="text-center">
                          <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-400">QR-код для СБП</p>
                          <p className="text-xs text-gray-500 mt-1">Будет сгенерирован после указания суммы</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {user?.walletAddress ? (
                    <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded-lg p-6">
                      <div className="text-center mb-4">
                        <WalletIcon className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Пополнение USDT через криптокошелек
                        </h4>
                        <p className="text-purple-300 text-sm">
                          Отправьте USDT на ваш личный адрес в сети TRC-20
                        </p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Ваш адрес TRC-20:</span>
                          <span className="text-xs text-purple-400 bg-purple-600 bg-opacity-20 px-2 py-1 rounded">
                            Только USDT
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-700 p-3 rounded">
                          <code className="flex-1 text-sm font-mono text-gray-300 break-all">
                            {user.walletAddress}
                          </code>
                          <button
                            onClick={() => copyToClipboard(user.walletAddress!, 'deposit-wallet')}
                            className={`p-2 rounded transition-colors ${
                              copySuccess === 'deposit-wallet' 
                                ? 'bg-green-600 text-white' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-600'
                            }`}
                          >
                            {copySuccess === 'deposit-wallet' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {copySuccess === 'deposit-wallet' && (
                          <p className="text-green-400 text-xs mt-2 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Адрес скопирован в буфер обмена
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Shield className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-medium">Без верификации</span>
                          </div>
                          <ul className="text-gray-300 space-y-1 text-xs">
                            <li>• Мгновенное пополнение</li>
                            <li>• Автоматическое зачисление</li>
                            <li>• Защищенные транзакции</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">Важно</span>
                          </div>
                          <ul className="text-gray-300 space-y-1 text-xs">
                            <li>• Минимум: 10 USDT</li>
                            <li>• Время: 5-15 минут</li>
                            <li>• Комиссия сети: ~1 USDT</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span className="text-red-400 font-medium">
                          Ошибка: Кошелек не найден
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {depositType === 'rub' && user?.isVerified && (
                <>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Реквизиты для перевода:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Получатель:</span>
                        <span>ООО "White Capital"</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Банк:</span>
                        <span>Сбербанк</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Номер карты:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">2202 2020 2020 2020</span>
                          <button
                            onClick={() => copyToClipboard('2202202020202020', 'card')}
                            className={`p-1 rounded transition-colors ${
                              copySuccess === 'card' 
                                ? 'bg-green-600 text-white' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {copySuccess === 'card' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-600 bg-opacity-20 border border-orange-600 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Calculator className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-orange-400 font-medium mb-1">Комиссия за пополнение</h4>
                        <p className="text-orange-300 text-sm">
                          С каждого пополнения рублевого баланса взимается комиссия в размере <strong>0.85%</strong> от суммы пополнения.
                          Комиссия автоматически вычитается при зачислении средств.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDeposit}
                    disabled={!depositAmount || isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Обработка...</span>
                      </div>
                    ) : (
                      'Подтвердить пополнение'
                    )}
                  </button>
                </>
              )}
            </div>
          ) : activeTab === 'withdraw' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Вывод USDT</h3>
                <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-green-400 font-medium mb-1">Вывод без верификации</h4>
                      <p className="text-green-300 text-sm">
                        Вы можете выводить USDT без прохождения верификации личности. 
                        Все заявки обрабатываются администратором в течение 24 часов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Адрес кошелька TRC-20
                  </label>
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="TQn9Y2khEsLMG4..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Убедитесь, что адрес поддерживает сеть TRC-20
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Сумма вывода (USDT)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="100"
                    min="10"
                    max={user?.balances.usdt || 0}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Доступно: {user?.balances.usdt || 0} USDT
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Информация о выводе:</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Комиссия сети:</span>
                    <span>1 USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Минимальный вывод:</span>
                    <span>10 USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Время обработки:</span>
                    <span>До 24 часов</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Верификация:</span>
                    <span className="text-green-400">Не требуется</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-2">Процесс вывода:</p>
                    <ol className="space-y-1 list-decimal list-inside">
                      <li>Создание заявки на вывод</li>
                      <li>Заморозка средств на балансе</li>
                      <li>Проверка администратором (до 24 часов)</li>
                      <li>Отправка USDT на указанный адрес</li>
                      <li>Подтверждение транзакции в блокчейне</li>
                    </ol>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={
                  !withdrawAmount || 
                  !withdrawAddress || 
                  isLoading || 
                  parseFloat(withdrawAmount) < 10 ||
                  parseFloat(withdrawAmount) > (user?.balances.usdt || 0)
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Создание заявки...</span>
                  </div>
                ) : (
                  'Создать заявку на вывод'
                )}
              </button>
            </div>
          ) : (
            /* Transaction History Tab */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <History className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">История операций</h3>
                  <div className="bg-blue-600 bg-opacity-20 px-3 py-1 rounded-full">
                    <span className="text-blue-400 text-sm font-medium">{filteredTransactions.length}</span>
                  </div>
                </div>
                
                {/* Filter Buttons */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setHistoryFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        historyFilter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Все
                    </button>
                    <button
                      onClick={() => setHistoryFilter('deposit')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        historyFilter === 'deposit'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Пополнения
                    </button>
                    <button
                      onClick={() => setHistoryFilter('withdrawal')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        historyFilter === 'withdrawal'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Выводы
                    </button>
                  </div>
                </div>
              </div>
              
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">
                    {historyFilter === 'all' ? 'История операций пуста' :
                     historyFilter === 'deposit' ? 'Нет пополнений' :
                     'Нет выводов'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {historyFilter === 'all' ? 'Ваши пополнения и выводы будут отображаться здесь' :
                     historyFilter === 'deposit' ? 'Ваши пополнения будут отображаться здесь' :
                     'Ваши выводы будут отображаться здесь'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => {
                    const StatusIcon = getStatusIcon(transaction.status);
                    const TransactionIcon = getTransactionIcon(transaction.type);
                    const transactionColor = getTransactionColor(transaction.type);
                    
                    return (
                      <div key={transaction.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transactionColor}`}>
                              <TransactionIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">
                                {getTransactionTypeText(transaction.type)} {transaction.fromCurrency}
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
                            <p className={`font-medium ${
                              transaction.type === 'deposit' ? 'text-green-400' : 'text-purple-400'
                            }`}>
                              {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString()} {transaction.fromCurrency}
                            </p>
                          </div>
                          
                          {transaction.type === 'deposit' && transaction.fromCurrency === 'RUB' && (
                            <>
                              <div>
                                <span className="text-gray-400">Комиссия (0.85%):</span>
                                <p className="text-red-400 font-medium">
                                  -₽{calculateCommission(transaction.amount).toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">К зачислению:</span>
                                <p className="text-green-400 font-medium">
                                  ₽{calculateNetAmount(transaction.amount).toFixed(2)}
                                </p>
                              </div>
                            </>
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
          )}
        </div>
      </div>
    </div>
  );
};