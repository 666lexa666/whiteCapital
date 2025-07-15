import React from 'react';
import { FileText, Calendar, User, Building } from 'lucide-react';

export const LegalOffer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Публичная оферта</h1>
        <p className="text-gray-400">
          Договор оказания услуг криптовалютного обмена
        </p>
      </div>

      {/* Document Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Building className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="font-semibold text-white">Исполнитель</h3>
              <p className="text-gray-400 text-sm">ООО "White Capital"</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-green-400" />
            <div>
              <h3 className="font-semibold text-white">Дата вступления в силу</h3>
              <p className="text-gray-400 text-sm">01 января 2024 года</p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-white mb-6">1. Общие положения</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              1.1. Настоящая публичная оферта (далее — «Оферта») является официальным предложением 
              ООО "White Capital" (далее — «Исполнитель») заключить договор оказания услуг 
              криптовалютного обмена на изложенных ниже условиях.
            </p>
            
            <p>
              1.2. Акцептом настоящей Оферты является совершение Заказчиком действий по регистрации 
              на платформе White Capital и/или использованию услуг Исполнителя.
            </p>
            
            <p>
              1.3. Договор считается заключенным с момента акцепта настоящей Оферты Заказчиком.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">2. Предмет договора</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              2.1. Исполнитель обязуется оказать Заказчику услуги по обмену российских рублей (RUB) 
              на криптовалюту USDT в сети TRC-20, а Заказчик обязуется принять и оплатить эти услуги.
            </p>
            
            <p>
              2.2. Услуги оказываются через веб-платформу, доступную по адресу в сети Интернет.
            </p>
            
            <p>
              2.3. Исполнитель предоставляет Заказчику личный кабинет для управления операциями 
              и мониторинга состояния счетов.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">3. Права и обязанности сторон</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <h3 className="text-lg font-semibold text-white">3.1. Исполнитель обязуется:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Обеспечить функционирование платформы 24/7</li>
              <li>Обрабатывать заявки на обмен в течение указанного времени</li>
              <li>Обеспечить безопасность персональных данных Заказчика</li>
              <li>Предоставить техническую поддержку</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">3.2. Заказчик обязуется:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Предоставить достоверную информацию при регистрации</li>
              <li>Соблюдать правила использования платформы</li>
              <li>Своевременно оплачивать услуги согласно тарифам</li>
              <li>Не использовать платформу в противоправных целях</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">4. Стоимость услуг и порядок расчетов</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              4.1. Стоимость услуг определяется согласно действующим тарифам, размещенным на платформе.
            </p>
            
            <p>
              4.2. При пополнении рублевого баланса взимается комиссия в размере 0.85% от суммы пополнения.
            </p>
            
            <p>
              4.3. Обмен RUB на USDT осуществляется без дополнительных комиссий.
            </p>
            
            <p>
              4.4. Курсы обмена устанавливаются Исполнителем и могут изменяться в режиме реального времени.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">5. Ответственность сторон</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              5.1. Стороны несут ответственность за неисполнение или ненадлежащее исполнение 
              своих обязательств в соответствии с действующим законодательством.
            </p>
            
            <p>
              5.2. Исполнитель не несет ответственности за убытки, возникшие вследствие 
              изменения курсов криптовалют.
            </p>
            
            <p>
              5.3. Заказчик несет полную ответственность за сохранность своих учетных данных.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">6. Заключительные положения</h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              6.1. Настоящий договор регулируется законодательством Российской Федерации.
            </p>
            
            <p>
              6.2. Все споры разрешаются путем переговоров, а при недостижении согласия — 
              в судебном порядке.
            </p>
            
            <p>
              6.3. Исполнитель вправе в одностороннем порядке изменять условия настоящей Оферты, 
              уведомив об этом Заказчика путем размещения новой редакции на платформе.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Контактная информация</h3>
        <div className="text-blue-300 space-y-2">
          <p>ООО "White Capital"</p>
          <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
          <p>ИНН: 1234567890</p>
          <p>ОГРН: 1234567890123</p>
          <p>Email: legal@whitecapital.com</p>
        </div>
      </div>

      {/* Placeholder for additional content */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Дополнительные разделы</h3>
          <p className="text-gray-400 text-sm">
            Здесь будут размещены дополнительные разделы договора, которые вы добавите позже
          </p>
        </div>
      </div>
    </div>
  );
};