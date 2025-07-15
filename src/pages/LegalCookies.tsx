import React from 'react';
import { Cookie, Settings, Eye, Shield, ToggleLeft } from 'lucide-react';

export const LegalCookies: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Cookie className="h-16 w-16 text-orange-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Политика обработки файлов куки</h1>
        <p className="text-gray-400">
          Как мы используем cookies и аналогичные технологии
        </p>
      </div>

      {/* Cookie Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-xl p-4 text-center">
          <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Необходимые</h3>
          <p className="text-green-300 text-xs">Для работы сайта</p>
        </div>
        
        <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-xl p-4 text-center">
          <Settings className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Функциональные</h3>
          <p className="text-blue-300 text-xs">Для удобства</p>
        </div>
        
        <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded-xl p-4 text-center">
          <Eye className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Аналитические</h3>
          <p className="text-purple-300 text-xs">Для анализа</p>
        </div>
        
        <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-xl p-4 text-center">
          <ToggleLeft className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Маркетинговые</h3>
          <p className="text-yellow-300 text-xs">С согласия</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-white mb-6">1. Что такое cookies</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              1.1. Cookies (куки) — это небольшие текстовые файлы, которые сохраняются на вашем 
              устройстве при посещении веб-сайтов. Они помогают сайтам запоминать информацию 
              о вашем визите.
            </p>
            
            <p>
              1.2. Мы используем cookies для улучшения функциональности нашей платформы, 
              обеспечения безопасности и анализа использования сервиса.
            </p>
            
            <p>
              1.3. Большинство веб-браузеров автоматически принимают cookies, но вы можете 
              изменить настройки браузера для управления ими.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">2. Типы используемых cookies</h2>
          
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <div className="bg-green-600 bg-opacity-10 border border-green-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-3">2.1. Необходимые cookies</h3>
              <p className="mb-3">
                Эти cookies необходимы для работы платформы и не могут быть отключены:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Аутентификация пользователей</li>
                <li>Сохранение настроек безопасности</li>
                <li>Поддержание сессии</li>
                <li>Защита от CSRF-атак</li>
                <li>Балансировка нагрузки</li>
              </ul>
            </div>

            <div className="bg-blue-600 bg-opacity-10 border border-blue-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">2.2. Функциональные cookies</h3>
              <p className="mb-3">
                Эти cookies улучшают функциональность и персонализацию:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Запоминание языковых предпочтений</li>
                <li>Сохранение настроек интерфейса</li>
                <li>Автозаполнение форм</li>
                <li>Предпочтения отображения</li>
              </ul>
            </div>

            <div className="bg-purple-600 bg-opacity-10 border border-purple-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">2.3. Аналитические cookies</h3>
              <p className="mb-3">
                Эти cookies помогают нам понять, как используется платформа:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Анализ посещаемости страниц</li>
                <li>Отслеживание пользовательских путей</li>
                <li>Измерение производительности</li>
                <li>Выявление ошибок и проблем</li>
              </ul>
            </div>

            <div className="bg-yellow-600 bg-opacity-10 border border-yellow-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">2.4. Маркетинговые cookies</h3>
              <p className="mb-3">
                Эти cookies используются только с вашего согласия:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Персонализация рекламы</li>
                <li>Отслеживание эффективности кампаний</li>
                <li>Ретаргетинг</li>
                <li>Социальные медиа интеграции</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">3. Сроки хранения cookies</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">3.1. Сессионные cookies:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Удаляются при закрытии браузера</li>
              <li>Используются для поддержания сессии</li>
              <li>Обеспечивают безопасность во время сессии</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">3.2. Постоянные cookies:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Настройки интерфейса: до 1 года</li>
              <li>Аналитические данные: до 2 лет</li>
              <li>Маркетинговые cookies: до 1 года</li>
              <li>Функциональные cookies: до 6 месяцев</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">4. Третьи стороны</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>4.1. Мы можем использовать сервисы третьих сторон, которые устанавливают свои cookies:</p>
            
            <div className="bg-gray-700 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-white mb-2">Аналитические сервисы:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Google Analytics (анализ трафика)</li>
                <li>Yandex.Metrica (веб-аналитика)</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-white mb-2">Безопасность:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Cloudflare (защита от DDoS)</li>
                <li>reCAPTCHA (защита от ботов)</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-white mb-2">Поддержка:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Системы онлайн-чата</li>
                <li>Виджеты обратной связи</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">5. Управление cookies</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">5.1. Настройки браузера:</h3>
            <p>Вы можете управлять cookies через настройки вашего браузера:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Chrome:</strong> Настройки → Конфиденциальность и безопасность → Файлы cookie</li>
              <li><strong>Firefox:</strong> Настройки → Приватность и защита → Куки и данные сайтов</li>
              <li><strong>Safari:</strong> Настройки → Конфиденциальность → Управление данными веб-сайта</li>
              <li><strong>Edge:</strong> Настройки → Файлы cookie и разрешения сайта</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">5.2. Настройки на платформе:</h3>
            <p>
              Мы предоставляем возможность управления некоторыми типами cookies 
              через настройки вашего аккаунта.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">5.3. Последствия отключения:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Отключение необходимых cookies может нарушить работу платформы</li>
              <li>Функциональные cookies влияют на удобство использования</li>
              <li>Аналитические cookies не влияют на функциональность</li>
              <li>Маркетинговые cookies можно отключить без последствий</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">6. Согласие на использование cookies</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              6.1. При первом посещении платформы мы запрашиваем ваше согласие на использование 
              необязательных cookies.
            </p>
            
            <p>
              6.2. Вы можете в любое время изменить свои предпочтения относительно cookies 
              через настройки аккаунта или браузера.
            </p>
            
            <p>
              6.3. Продолжение использования платформы означает согласие с использованием 
              необходимых cookies.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">7. Безопасность cookies</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>7.1. Меры защиты cookies:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Использование флагов Secure и HttpOnly</li>
              <li>Шифрование чувствительных данных</li>
              <li>Ограничение срока действия</li>
              <li>Регулярная ротация идентификаторов</li>
            </ul>
            
            <p>
              7.2. Мы не храним в cookies персональные данные в открытом виде, 
              пароли или финансовую информацию.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">8. Изменения в политике</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              8.1. Мы можем обновлять данную политику cookies. О существенных изменениях 
              мы уведомим вас через платформу или по электронной почте.
            </p>
            
            <p>
              8.2. Рекомендуем периодически просматривать данную страницу для ознакомления 
              с актуальной версией политики.
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Settings Panel */}
      <div className="bg-orange-600 bg-opacity-20 border border-orange-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Управление cookies</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Необходимые cookies</h4>
              <p className="text-gray-400 text-sm">Требуются для работы платформы</p>
            </div>
            <div className="text-green-400 font-medium">Всегда включены</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Функциональные cookies</h4>
              <p className="text-gray-400 text-sm">Улучшают удобство использования</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Включены
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Аналитические cookies</h4>
              <p className="text-gray-400 text-sm">Помогают улучшать платформу</p>
            </div>
            <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Отключены
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
            Сохранить настройки
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Вопросы о cookies</h3>
        <div className="text-gray-300 space-y-2">
          <p>Если у вас есть вопросы о нашем использовании cookies:</p>
          <p>Email: privacy@whitecapital.com</p>
          <p>Или обратитесь через систему поддержки на платформе</p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Дополнительная информация</h3>
          <p className="text-gray-400 text-sm">
            Здесь будет размещена дополнительная информация о cookies, которую вы добавите позже
          </p>
        </div>
      </div>
    </div>
  );
};