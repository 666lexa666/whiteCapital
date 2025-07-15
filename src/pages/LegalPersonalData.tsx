import React from 'react';
import { Database, Shield, UserCheck, FileText, Lock } from 'lucide-react';

export const LegalPersonalData: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Database className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Политика в отношении обработки персональных данных</h1>
        <p className="text-gray-400">
          Подробная информация о том, как мы обрабатываем ваши персональные данные
        </p>
      </div>

      {/* Key Principles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded-xl p-4 text-center">
          <Shield className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Законность</h3>
          <p className="text-purple-300 text-xs">Соблюдение ФЗ-152</p>
        </div>
        
        <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-xl p-4 text-center">
          <UserCheck className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Согласие</h3>
          <p className="text-blue-300 text-xs">Обработка с согласия</p>
        </div>
        
        <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-xl p-4 text-center">
          <Lock className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Безопасность</h3>
          <p className="text-green-300 text-xs">Защита от утечек</p>
        </div>
        
        <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-xl p-4 text-center">
          <FileText className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <h3 className="font-semibold text-white text-sm mb-1">Прозрачность</h3>
          <p className="text-yellow-300 text-xs">Открытая политика</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-white mb-6">1. Основные понятия</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              1.1. <strong>Персональные данные</strong> — любая информация, относящаяся к прямо или 
              косвенно определенному или определяемому физическому лицу (субъекту персональных данных).
            </p>
            
            <p>
              1.2. <strong>Обработка персональных данных</strong> — любое действие (операция) или 
              совокупность действий (операций), совершаемых с использованием средств автоматизации 
              или без использования таких средств с персональными данными.
            </p>
            
            <p>
              1.3. <strong>Оператор</strong> — ООО "White Capital", которое самостоятельно или 
              совместно с другими лицами организует и (или) осуществляет обработку персональных данных.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">2. Правовые основания обработки</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>2.1. Обработка персональных данных осуществляется на основании:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
              <li>Федерального закона от 27.07.2006 № 149-ФЗ «Об информации, информационных технологиях и о защите информации»</li>
              <li>Согласия субъекта персональных данных</li>
              <li>Необходимости исполнения договора</li>
              <li>Требований законодательства о противодействии легализации доходов</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">3. Категории обрабатываемых данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">3.1. Общие персональные данные:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Фамилия, имя, отчество</li>
              <li>Адрес электронной почты</li>
              <li>Номер телефона</li>
              <li>Дата рождения</li>
              <li>Пол</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">3.2. Данные документов:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Серия и номер паспорта</li>
              <li>Дата выдачи документа</li>
              <li>Код подразделения</li>
              <li>Кем выдан документ</li>
              <li>Место рождения</li>
              <li>Адрес регистрации</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">3.3. Биометрические данные:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Фотографии лица (для верификации)</li>
              <li>Изображения документов</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">3.4. Технические данные:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP-адрес</li>
              <li>Данные браузера и устройства</li>
              <li>Cookies и аналогичные технологии</li>
              <li>Логи действий пользователя</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">4. Цели обработки персональных данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>4.1. Персональные данные обрабатываются в следующих целях:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Регистрация и аутентификация пользователей</li>
              <li>Предоставление услуг криптовалютного обмена</li>
              <li>Идентификация и верификация личности</li>
              <li>Соблюдение требований законодательства о ПОД/ФТ</li>
              <li>Обеспечение безопасности и предотвращение мошенничества</li>
              <li>Техническая поддержка пользователей</li>
              <li>Анализ и улучшение качества услуг</li>
              <li>Маркетинговые коммуникации (с согласия)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">5. Способы обработки персональных данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">5.1. Автоматизированная обработка:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Сбор, запись, систематизация</li>
              <li>Накопление, хранение</li>
              <li>Уточнение (обновление, изменение)</li>
              <li>Извлечение, использование</li>
              <li>Передача (распространение, предоставление, доступ)</li>
              <li>Обезличивание, блокирование, удаление</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">5.2. Неавтоматизированная обработка:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ручная проверка документов</li>
              <li>Анализ заявок на верификацию</li>
              <li>Обработка обращений в службу поддержки</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">6. Сроки обработки и хранения</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>6.1. Сроки обработки персональных данных:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Данные аккаунта: в течение действия договора + 5 лет</li>
              <li>Документы верификации: 5 лет с момента окончания отношений</li>
              <li>Данные транзакций: 5 лет в соответствии с требованиями ПОД/ФТ</li>
              <li>Технические логи: 1 год</li>
              <li>Маркетинговые данные: до отзыва согласия</li>
            </ul>
            
            <p>
              6.2. По истечении сроков хранения персональные данные подлежат уничтожению 
              или обезличиванию.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">7. Меры защиты персональных данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">7.1. Технические меры:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Шифрование данных при передаче (TLS/SSL)</li>
              <li>Шифрование данных при хранении (AES-256)</li>
              <li>Многофакторная аутентификация</li>
              <li>Системы обнаружения вторжений</li>
              <li>Регулярное резервное копирование</li>
              <li>Антивирусная защита</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">7.2. Организационные меры:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Назначение ответственного за обработку ПДн</li>
              <li>Разграничение доступа к персональным данным</li>
              <li>Обучение сотрудников</li>
              <li>Внутренние политики и процедуры</li>
              <li>Регулярный аудит систем</li>
              <li>Журналирование доступа к данным</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">8. Права субъектов персональных данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>8.1. Субъект персональных данных имеет право:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>На получение информации об обработке его персональных данных</li>
              <li>На доступ к своим персональным данным</li>
              <li>На уточнение, блокирование или уничтожение неточных данных</li>
              <li>На отзыв согласия на обработку персональных данных</li>
              <li>На обжалование действий оператора</li>
              <li>На защиту своих прав в судебном порядке</li>
            </ul>
            
            <p>
              8.2. Для реализации своих прав субъект может обратиться к оператору 
              через систему поддержки или по электронной почте.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">9. Передача персональных данных</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>9.1. Персональные данные могут передаваться:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Уполномоченным государственным органам по их запросу</li>
              <li>Поставщикам технических услуг (при соблюдении конфиденциальности)</li>
              <li>Третьим лицам с согласия субъекта</li>
            </ul>
            
            <p>
              9.2. При передаче данных за пределы РФ обеспечивается адекватный уровень защиты.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">10. Ответственность</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              10.1. Оператор несет ответственность за нарушение требований законодательства 
              о персональных данных в соответствии с действующим законодательством РФ.
            </p>
            
            <p>
              10.2. В случае нарушения прав субъектов персональных данных оператор 
              принимает меры по устранению нарушений и возмещению ущерба.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Контакты ответственного за обработку персональных данных</h3>
        <div className="text-purple-300 space-y-2">
          <p>Email: dpo@whitecapital.com</p>
          <p>Почтовый адрес: г. Москва, ул. Примерная, д. 1</p>
          <p>Или обратитесь через систему поддержки на платформе</p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Дополнительные разделы</h3>
          <p className="text-gray-400 text-sm">
            Здесь будут размещены дополнительные разделы политики, которые вы добавите позже
          </p>
        </div>
      </div>
    </div>
  );
};