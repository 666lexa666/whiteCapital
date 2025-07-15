import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  CheckCircle, 
  Upload, 
  Mail, 
  Phone, 
  User, 
  FileText,
  AlertCircle,
  AlertTriangle,
  Wallet,
  Clock,
  XCircle,
  Save,
  Calendar,
  UserCheck
} from 'lucide-react';
import type { VerificationRequest } from '../types';

export const Verification: React.FC = () => {
  const { user, updateUser, saveEmailAddress, savePhoneNumber, submitDocumentVerification } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  
  // Personal data fields
  const [lastName, setLastName] = useState(user?.personalData?.lastName || '');
  const [firstName, setFirstName] = useState(user?.personalData?.firstName || '');
  const [middleName, setMiddleName] = useState(user?.personalData?.middleName || '');
  const [birthYear, setBirthYear] = useState(user?.personalData?.birthYear || '');

  useEffect(() => {
    loadVerificationRequests();
  }, [user]);

  useEffect(() => {
    // Update email field when user changes
    if (user?.email) {
      setEmailAddress(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    // Update phone field when user changes
    if (user?.phone) {
      setPhoneNumber(user.phone);
    }
  }, [user?.phone]);

  useEffect(() => {
    // Update personal data fields when user changes
    if (user?.personalData) {
      setLastName(user.personalData.lastName || '');
      setFirstName(user.personalData.firstName || '');
      setMiddleName(user.personalData.middleName || '');
      setBirthYear(user.personalData.birthYear || '');
    }
  }, [user?.personalData]);

  const loadVerificationRequests = () => {
    if (!user) return;
    
    const allRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
    const userRequests = allRequests.filter((req: VerificationRequest) => req.userId === user.id);
    setVerificationRequests(userRequests);
  };

  const getRequestStatus = (type: 'email' | 'phone' | 'document' | 'personal') => {
    const request = verificationRequests
      .filter(req => req.type === type)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];
    
    if (!request) return null;
    
    // Check if request is expired
    if (new Date() > new Date(request.expiresAt) && request.status === 'pending') {
      return { ...request, status: 'expired' as const };
    }
    
    return request;
  };

  const handleSavePersonalData = async () => {
    if (!lastName.trim() || !firstName.trim() || !birthYear.trim()) {
      alert('Заполните все обязательные поля (Фамилия, Имя, Год рождения)');
      return;
    }

    const currentYear = new Date().getFullYear();
    const year = parseInt(birthYear);
    
    if (isNaN(year) || year < 1900 || year > currentYear - 14) {
      alert('Введите корректный год рождения (возраст должен быть не менее 14 лет)');
      return;
    }

    setIsLoading(true);
    try {
      // Update user personal data
      const personalData = {
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        birthYear: birthYear.trim()
      };

      const updatedUser = {
        ...user!,
        personalData
      };

      updateUser(updatedUser);

      // Update in all users storage
      const savedUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
      savedUsers[user!.email] = updatedUser;
      localStorage.setItem('allUsers', JSON.stringify(savedUsers));

      // Create verification request for personal data
      const request: VerificationRequest = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user!.id,
        userEmail: user!.email,
        type: 'personal' as any,
        status: 'pending',
        data: {
          personalData,
          userAccountLink: `/admin/users/${user!.id}`
        },
        submittedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };

      // Save to localStorage for admin processing
      const existingRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]');
      existingRequests.push(request);
      localStorage.setItem('verificationRequests', JSON.stringify(existingRequests));

      console.log('=== ПЕРСОНАЛЬНЫЕ ДАННЫЕ ОТПРАВЛЕНЫ АДМИНИСТРАТОРУ ===');
      console.log(`Пользователь: ${user!.email}`);
      console.log(`ID пользователя: ${user!.id}`);
      console.log(`ФИО: ${lastName} ${firstName} ${middleName}`);
      console.log(`Год рождения: ${birthYear}`);
      console.log(`ID заявки: ${request.id}`);
      console.log(`Время: ${new Date().toLocaleString()}`);
      console.log(`Статус: Автоматически отправлено администратору для проверки`);
      console.log('====================================================');

      setTimeout(loadVerificationRequests, 1000);
      
      alert(`Персональные данные сохранены и отправлены на верификацию!\n\nФИО: ${lastName} ${firstName} ${middleName}\nГод рождения: ${birthYear}\n\nДанные автоматически направлены администратору для проверки.\nВремя рассмотрения: до 24 часов.`);
    } catch (error) {
      console.error('Failed to save personal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmailAddress = async () => {
    if (!emailAddress.trim()) {
      alert('Введите email адрес');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      alert('Введите корректный email адрес');
      return;
    }

    setIsLoading(true);
    try {
      await saveEmailAddress(emailAddress);
      setTimeout(loadVerificationRequests, 1000);
    } catch (error) {
      console.error('Failed to save email address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePhoneNumber = async () => {
    if (!phoneNumber.trim()) {
      alert('Введите номер телефона');
      return;
    }

    setIsLoading(true);
    try {
      await savePhoneNumber(phoneNumber);
      setTimeout(loadVerificationRequests, 1000);
    } catch (error) {
      console.error('Failed to save phone number:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async () => {
    if (!documentFile) {
      alert('Выберите файл документа');
      return;
    }

    setIsLoading(true);
    try {
      await submitDocumentVerification(documentFile);
      setDocumentFile(null);
      setTimeout(loadVerificationRequests, 1000);
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'expired': return 'text-gray-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'expired': return 'Истекло';
      default: return 'На рассмотрении';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'expired': return Clock;
      default: return Clock;
    }
  };

  const steps = [
    { 
      id: 'personal', 
      title: 'Персональные данные', 
      icon: UserCheck, 
      completed: user?.verificationStatus?.personal || false 
    },
    { 
      id: 'email', 
      title: 'Email верификация', 
      icon: Mail, 
      completed: user?.verificationStatus.email || false 
    },
    { 
      id: 'phone', 
      title: 'Телефон', 
      icon: Phone, 
      completed: user?.verificationStatus.phone || false 
    },
    { 
      id: 'document', 
      title: 'Документы', 
      icon: FileText, 
      completed: user?.verificationStatus.document || false 
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Верификация аккаунта</h1>
        <p className="text-gray-400">
          Завершите верификацию для доступа к пополнению рублевого баланса
        </p>
      </div>

      {/* Wallet Status */}
      {user?.walletAddress && (
        <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Wallet className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">TRC-20 кошелек активен</h3>
              <p className="text-green-300">Вы можете пополнять и выводить USDT без верификации</p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Адрес кошелька:</p>
            <p className="font-mono text-sm text-green-400 break-all">{user.walletAddress}</p>
          </div>
        </div>
      )}

      {/* Verification Process Info */}
      <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Процесс верификации</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-blue-300">Пополнение рублевого баланса</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-blue-300">Обмен RUB → USDT</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span className="text-blue-300">Время рассмотрения: до 24 часов</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300">Автоматическая отправка администратору</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                step.completed ? 'bg-green-600' : 'bg-gray-600'
              }`}>
                {step.completed ? (
                  <CheckCircle className="h-6 w-6 text-white" />
                ) : (
                  <step.icon className="h-6 w-6 text-white" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-24 h-1 ml-4 ${
                  step.completed ? 'bg-green-600' : 'bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="text-center">
              <p className={`text-sm font-medium ${
                step.completed ? 'text-green-400' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Data Verification */}
        <div className="md:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Персональные данные</h3>
            </div>
            {user?.verificationStatus?.personal ? (
              <CheckCircle className="h-6 w-6 text-green-400" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            )}
          </div>
          
          {user?.verificationStatus?.personal ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Персональные данные подтверждены</span>
              </div>
              {user?.personalData && (
                <div className="text-xs text-gray-400 space-y-1">
                  <p>ФИО: {user.personalData.lastName} {user.personalData.firstName} {user.personalData.middleName}</p>
                  <p>Год рождения: {user.personalData.birthYear}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Фамилия <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Иванов"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Имя <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Иван"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Отчество
                  </label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Иванович"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Год рождения <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="1990"
                      min="1900"
                      max={new Date().getFullYear() - 14}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Минимальный возраст: 14 лет
                  </p>
                </div>
              </div>

              {(() => {
                const personalRequest = getRequestStatus('personal' as any);
                if (personalRequest) {
                  const StatusIcon = getStatusIcon(personalRequest.status);
                  return (
                    <div className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
                      personalRequest.status === 'approved' ? 'border-green-500' :
                      personalRequest.status === 'rejected' ? 'border-red-500' :
                      personalRequest.status === 'expired' ? 'border-gray-500' :
                      'border-yellow-500'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(personalRequest.status)}`} />
                        <span className={`text-sm font-medium ${getStatusColor(personalRequest.status)}`}>
                          {getStatusText(personalRequest.status)}
                        </span>
                      </div>
                      {personalRequest.data.personalData && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>ФИО: {personalRequest.data.personalData.lastName} {personalRequest.data.personalData.firstName} {personalRequest.data.personalData.middleName}</p>
                          <p>Год рождения: {personalRequest.data.personalData.birthYear}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400">
                        Подано: {new Date(personalRequest.submittedAt).toLocaleString()}
                      </p>
                      {personalRequest.status === 'pending' && (
                        <p className="text-xs text-yellow-300 mt-1">
                          Истекает: {new Date(personalRequest.expiresAt).toLocaleString()}
                        </p>
                      )}
                      {personalRequest.adminNotes && (
                        <p className="text-xs text-gray-300 mt-2 italic">
                          Примечание: {personalRequest.adminNotes}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <UserCheck className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-purple-300">
                    <p className="font-medium mb-1">Автоматическая верификация:</p>
                    <p>1. Заполните все обязательные поля и нажмите "Сохранить"</p>
                    <p>2. Данные автоматически отправляются администратору</p>
                    <p>3. Проверка администратором (до 24 часов)</p>
                    <p>4. Данные будут подтверждены при одобрении</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePersonalData}
                disabled={isLoading || !lastName.trim() || !firstName.trim() || !birthYear.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Сохранить персональные данные</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Email Verification */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Email верификация</h3>
            </div>
            {user?.verificationStatus.email ? (
              <CheckCircle className="h-6 w-6 text-green-400" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            )}
          </div>
          
          {user?.verificationStatus.email ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Email подтвержден</span>
              </div>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email адрес
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {(() => {
                const emailRequest = getRequestStatus('email');
                if (emailRequest) {
                  const StatusIcon = getStatusIcon(emailRequest.status);
                  return (
                    <div className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
                      emailRequest.status === 'approved' ? 'border-green-500' :
                      emailRequest.status === 'rejected' ? 'border-red-500' :
                      emailRequest.status === 'expired' ? 'border-gray-500' :
                      'border-yellow-500'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(emailRequest.status)}`} />
                        <span className={`text-sm font-medium ${getStatusColor(emailRequest.status)}`}>
                          {getStatusText(emailRequest.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Email: {emailRequest.data.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        Подано: {new Date(emailRequest.submittedAt).toLocaleString()}
                      </p>
                      {emailRequest.status === 'pending' && (
                        <p className="text-xs text-yellow-300 mt-1">
                          Истекает: {new Date(emailRequest.expiresAt).toLocaleString()}
                        </p>
                      )}
                      {emailRequest.adminNotes && (
                        <p className="text-xs text-gray-300 mt-2 italic">
                          Примечание: {emailRequest.adminNotes}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-300">
                    <p className="font-medium mb-1">Автоматическая верификация:</p>
                    <p>1. Введите email адрес и нажмите "Сохранить"</p>
                    <p>2. Данные автоматически отправляются администратору</p>
                    <p>3. Проверка администратором (до 24 часов)</p>
                    <p>4. Email будет подтвержден при одобрении</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveEmailAddress}
                disabled={isLoading || !emailAddress.trim() || emailAddress === user?.email}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Сохранение...</span>
                  </>
                ) : emailAddress === user?.email ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Email сохранен</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Сохранить email</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Phone Verification */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Телефон</h3>
            </div>
            {user?.verificationStatus.phone ? (
              <CheckCircle className="h-6 w-6 text-green-400" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            )}
          </div>
          
          {user?.verificationStatus.phone ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Телефон подтвержден</span>
              </div>
              <p className="text-xs text-gray-400">{user?.phone}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {(() => {
                const phoneRequest = getRequestStatus('phone');
                if (phoneRequest) {
                  const StatusIcon = getStatusIcon(phoneRequest.status);
                  return (
                    <div className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
                      phoneRequest.status === 'approved' ? 'border-green-500' :
                      phoneRequest.status === 'rejected' ? 'border-red-500' :
                      phoneRequest.status === 'expired' ? 'border-gray-500' :
                      'border-yellow-500'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(phoneRequest.status)}`} />
                        <span className={`text-sm font-medium ${getStatusColor(phoneRequest.status)}`}>
                          {getStatusText(phoneRequest.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Номер: {phoneRequest.data.phone}
                      </p>
                      <p className="text-xs text-gray-400">
                        Подано: {new Date(phoneRequest.submittedAt).toLocaleString()}
                      </p>
                      {phoneRequest.adminNotes && (
                        <p className="text-xs text-gray-300 mt-2 italic">
                          Примечание: {phoneRequest.adminNotes}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-green-300">
                    <p className="font-medium mb-1">Автоматическая верификация:</p>
                    <p>1. Введите номер телефона и нажмите "Сохранить"</p>
                    <p>2. Данные автоматически отправляются администратору</p>
                    <p>3. Проверка администратором (до 24 часов)</p>
                    <p>4. Номер будет подтвержден при одобрении</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePhoneNumber}
                disabled={isLoading || !phoneNumber.trim() || phoneNumber === user?.phone}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Сохранение...</span>
                  </>
                ) : phoneNumber === user?.phone ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Номер сохранен</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Сохранить номер</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Document Verification - Full Width */}
        <div className="md:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Документы</h3>
            </div>
            {user?.verificationStatus.document ? (
              <CheckCircle className="h-6 w-6 text-green-400" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            )}
          </div>
          
          {user?.verificationStatus.document ? (
            <div className="text-green-400 text-sm">
              ✓ Документы проверены
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Загрузите фото паспорта (первая страница)
              </p>

              {(() => {
                const docRequest = getRequestStatus('document');
                if (docRequest) {
                  const StatusIcon = getStatusIcon(docRequest.status);
                  return (
                    <div className={`bg-gray-700 rounded-lg p-3 border-l-4 ${
                      docRequest.status === 'approved' ? 'border-green-500' :
                      docRequest.status === 'rejected' ? 'border-red-500' :
                      docRequest.status === 'expired' ? 'border-gray-500' :
                      'border-yellow-500'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(docRequest.status)}`} />
                        <span className={`text-sm font-medium ${getStatusColor(docRequest.status)}`}>
                          {getStatusText(docRequest.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Файл: {docRequest.data.fileName || 'Документ загружен'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Подано: {new Date(docRequest.submittedAt).toLocaleString()}
                      </p>
                      {docRequest.adminNotes && (
                        <p className="text-xs text-gray-300 mt-2 italic">
                          Примечание: {docRequest.adminNotes}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-purple-300">
                    <p className="font-medium mb-1">Автоматическая верификация:</p>
                    <p>1. Выберите файл документа и нажмите "Загрузить"</p>
                    <p>2. Документ автоматически отправляется администратору</p>
                    <p>3. Проверка администратором (до 24 часов)</p>
                    <p>4. Документы будут подтверждены при одобрении</p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <p className="text-gray-400 text-sm">
                    {documentFile ? documentFile.name : 'Перетащите файл или нажмите для выбора'}
                  </p>
                </label>
              </div>

              <button
                onClick={handleDocumentUpload}
                disabled={isLoading || !documentFile}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Загрузка...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Загрузить документ</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Completion Status */}
      {user?.isVerified && (
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <CheckCircle className="h-8 w-8" />
            <div>
              <h3 className="text-xl font-semibold">Верификация завершена!</h3>
              <p className="text-green-100">Теперь вы можете пополнять рублевый баланс и обменивать RUB на USDT</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};