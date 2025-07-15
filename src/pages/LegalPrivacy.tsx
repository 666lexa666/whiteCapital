import React from 'react';
import { Lock, Shield, Eye, Database, UserCheck } from 'lucide-react';

export const LegalPrivacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Lock className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Политика конфиденциальности</h1>
        <p className="text-gray-400">
          Защита ваших персональных данных — наш приоритет
        </p>
      </div>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-xl p-6 text-center">
          <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Безопасность</h3>
          <p className="text-green-300 text-sm">Шифрование всех данных</p>
        </div>
        
        <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-xl p-6 text-center">
          <Eye className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Прозрачность</h3>
          <p className="text-blue-300 text-sm">Открытая политика использования</p>
        </div>
        
        <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded-xl p-6 text-center">
          <UserCheck className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Контроль</h3>
          <p className="text-purple-300 text-sm">Вы управляете своими данными</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-white mb-6">1. Общие положения</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              1.1. Настоящая Политика конфиденциальности определяет порядок обработки и защиты 
              персональных данных пользователей платформы White Capital.
            </p>
            
            <p>
              1.2. Используя наши услуги, вы соглашаетесь с условиями данной Политики конфиденциальности.
            </p>
            
            <p>
              1.3. Мы обязуемся защищать конфиденциальность ваших персональных данных и обеспечивать 
              их безопасность в соответствии с требованиями действующего законодательства.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">2. Какие данные мы собираем</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">2.1. Обязательные данные:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email адрес для регистрации и связи</li>
              <li>Пароль (хранится в зашифрованном виде)</li>
              <li>IP-адрес и данные об устройстве для безопасности</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">2.2. Данные для верификации:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Номер телефона</li>
              <li>Документы, удостоверяющие личность</li>
              <li>Фотографии документов</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">2.3. Автоматически собираемые данные:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Информация о браузере и операционной системе</li>
              <li>Данные о действиях на платформе</li>
              <li>Cookies и аналогичные технологии</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">3. Как мы используем ваши данные</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">3.1. Основные цели использования:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Предоставление услуг криптовалютного обмена</li>
              <li>Верификация личности в соответствии с требованиями законодательства</li>
              <li>Обеспечение безопасности платформы и предотвращение мошенничества</li>
              <li>Техническая поддержка пользователей</li>
              <li>Соблюдение требований регулирующих органов</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">3.2. Дополнительные цели:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Улучшение качества услуг</li>
              <li>Анализ использования платформы</li>
              <li>Информирование о новых возможностях (с вашего согласия)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">4. Защита персональных данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">4.1. Технические меры защиты:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Шифрование данных при передаче и хранении</li>
              <li>Многоуровневая система аутентификации</li>
              <li>Регулярное обновление систем безопасности</li>
              <li>Мониторинг несанкционированного доступа</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">4.2. Организационные меры:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ограниченный доступ к персональным данным</li>
              <li>Обучение сотрудников вопросам конфиденциальности</li>
              <li>Регулярный аудит систем безопасности</li>
              <li>Политики и процедуры обработки данных</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">5. Передача данных третьим лицам</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              5.1. Мы не продаем, не сдаем в аренду и не передаем ваши персональные данные 
              третьим лицам без вашего согласия, за исключением случаев, предусмотренных законом.
            </p>
            
            <p>
              5.2. Данные могут быть переданы третьим лицам в следующих случаях:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>По требованию уполномоченных государственных органов</li>
              <li>Для предотвращения мошенничества и обеспечения безопасности</li>
              <li>Поставщикам технических услуг (с соблюдением конфиденциальности)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">6. Ваши права</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>6.1. Вы имеете право:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Получать информацию о обработке ваших персональных данных</li>
              <li>Требовать исправления неточных данных</li>
              <li>Требовать удаления данных (при соблюдении законных оснований)</li>
              <li>Ограничить обработку данных</li>
              <li>Отозвать согласие на обработку данных</li>
              <li>Обратиться с жалобой в надзорный орган</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">7. Хранение данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              7.1. Мы храним ваши персональные данные только в течение времени, необходимого 
              для достижения целей обработки или в соответствии с требованиями законодательства.
            </p>
            
            <p>
              7.2. После прекращения необходимости в обработке данные подлежат уничтожению 
              или обезличиванию.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">8. Изменения в политике</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              8.1. Мы можем обновлять данную Политику конфиденциальности. О существенных 
              изменениях мы уведомим вас заранее.
            </p>
            
            <p>
              8.2. Рекомендуем периодически просматривать данную страницу для ознакомления 
              с актуальной версией Политики.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Контакты по вопросам конфиденциальности</h3>
        <div className="text-green-300 space-y-2">
          <p>Если у вас есть вопросы о нашей Политике конфиденциальности:</p>
          <p>Email: privacy@whitecapital.com</p>
          <p>Или обратитесь через систему поддержки на платформе</p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Дополнительная информация</h3>
          <p className="text-gray-400 text-sm">
            Здесь будет размещена дополнительная информация о защите данных, которую вы добавите позже
          </p>
        </div>
      </div>
    </div>
  );
};