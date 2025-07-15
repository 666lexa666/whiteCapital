import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Smartphone, 
  QrCode, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Key,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

export const Security: React.FC = () => {
  const { user, setup2FA, verify2FA, disable2FA, updateUser } = useAuth();
  const [activeStep, setActiveStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSetup2FA = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await setup2FA();
      setQrCode(result.qrCode);
      setSecret(result.secret);
      setBackupCodes(result.backupCodes);
      setActiveStep('verify');
    } catch (error: any) {
      setError(error.message || 'Ошибка настройки 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await verify2FA(verificationCode, secret);
      if (success) {
        setActiveStep('complete');
        setError('');
      } else {
        setError('Неверный код. Проверьте время на устройстве и попробуйте снова.');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка верификации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword.trim()) {
      setError('Введите пароль для отключения 2FA');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await disable2FA(disablePassword);
      if (success) {
        setDisablePassword('');
        alert('Двухфакторная аутентификация отключена');
      } else {
        setError('Неверный пароль');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка отключения 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyAllBackupCodes = async () => {
    const codesText = backupCodes.join('\n');
    await copyToClipboard(codesText);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Безопасность аккаунта</h1>
        <p className="text-gray-400">
          Настройте двухфакторную аутентификацию для защиты вашего аккаунта
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              user.twoFactorAuth?.enabled ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Двухфакторная аутентификация
              </h3>
              <p className={`text-sm ${
                user.twoFactorAuth?.enabled ? 'text-green-400' : 'text-gray-400'
              }`}>
                {user.twoFactorAuth?.enabled ? 'Включена' : 'Отключена'}
              </p>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-lg ${
            user.twoFactorAuth?.enabled 
              ? 'bg-green-600 bg-opacity-20 text-green-400' 
              : 'bg-red-600 bg-opacity-20 text-red-400'
          }`}>
            {user.twoFactorAuth?.enabled ? 'Защищен' : 'Уязвим'}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      {!user.twoFactorAuth?.enabled ? (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {activeStep === 'setup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Настройка двухфакторной аутентификации
                </h3>
                <p className="text-gray-400 mb-6">
                  Двухфакторная аутентификация добавляет дополнительный уровень безопасности к вашему аккаунту.
                  Вам потребуется приложение-аутентификатор, такое как Google Authenticator или Authy.
                </p>
              </div>

              <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-2">Перед началом убедитесь, что у вас установлено одно из приложений:</p>
                    <ul className="space-y-1">
                      <li>• Google Authenticator (рекомендуется)</li>
                      <li>• Microsoft Authenticator</li>
                      <li>• Authy</li>
                      <li>• 1Password</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSetup2FA}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Настройка...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Начать настройку</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeStep === 'verify' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Сканирование QR-кода
                </h3>
                <p className="text-gray-400 mb-6">
                  Отсканируйте QR-код с помощью приложения-аутентификатора и введите полученный код.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <div className="text-center">
                    <QrCode className="h-32 w-32 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">QR-код для сканирования</p>
                    <p className="text-xs text-gray-500 mt-2">
                      (В реальном приложении здесь будет настоящий QR-код)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Секретный ключ (если не можете отсканировать QR-код)
                    </label>
                    <div className="flex items-center space-x-2 bg-gray-700 p-3 rounded-lg">
                      <code className="flex-1 text-sm font-mono text-gray-300 break-all">
                        {secret}
                      </code>
                      <button
                        onClick={() => copyToClipboard(secret)}
                        className={`p-2 rounded transition-colors ${
                          copySuccess 
                            ? 'bg-green-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-600'
                        }`}
                      >
                        {copySuccess ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Код подтверждения
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Введите 6-значный код из приложения
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveStep('setup')}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={handleVerify2FA}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Проверка...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Подтвердить</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeStep === 'complete' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  2FA успешно настроена!
                </h3>
                <p className="text-gray-400">
                  Ваш аккаунт теперь защищен двухфакторной аутентификацией
                </p>
              </div>

              <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Key className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">Резервные коды</h4>
                    <p className="text-yellow-300 text-sm mb-3">
                      Сохраните эти коды в безопасном месте. Они помогут восстановить доступ к аккаунту, 
                      если вы потеряете устройство с аутентификатором.
                    </p>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Резервные коды:</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowBackupCodes(!showBackupCodes)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            {showBackupCodes ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={copyAllBackupCodes}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {showBackupCodes && (
                        <div className="grid grid-cols-2 gap-2">
                          {backupCodes.map((code, index) => (
                            <code key={index} className="text-sm font-mono text-gray-300 bg-gray-700 p-2 rounded">
                              {code}
                            </code>
                          ))}
                        </div>
                      )}
                      
                      {!showBackupCodes && (
                        <p className="text-gray-400 text-sm">
                          Нажмите на глаз, чтобы показать коды
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={copyAllBackupCodes}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Скопировать все коды</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Управление 2FA
              </h3>
              <p className="text-gray-400 mb-6">
                Двухфакторная аутентификация активна. Ваш аккаунт защищен.
              </p>
            </div>

            <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <div>
                  <h4 className="text-green-400 font-medium">2FA активна</h4>
                  <p className="text-green-300 text-sm">
                    При входе в аккаунт потребуется код из приложения-аутентификатора
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-3">Отключить 2FA</h4>
              <p className="text-red-300 text-sm mb-4">
                ⚠️ Отключение двухфакторной аутентификации снизит безопасность вашего аккаунта
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Введите пароль для подтверждения
                  </label>
                  <input
                    type="password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder="Ваш пароль"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <button
                  onClick={handleDisable2FA}
                  disabled={isLoading || !disablePassword.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Отключение...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      <span>Отключить 2FA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tips */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Советы по безопасности</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Используйте уникальный пароль</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Включите 2FA для максимальной защиты</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Сохраните резервные коды</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Не делитесь кодами с другими</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Регулярно проверяйте активность аккаунта</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Выходите из аккаунта на чужих устройствах</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};