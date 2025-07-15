import React from 'react';
import { Users, Shield, TrendingUp, Clock, Award, Globe } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">О нас</h1>
        <p className="text-gray-400">
          Узнайте больше о White Capital и наших принципах работы
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-white mb-6">White Capital — Ваш надежный партнер в мире криптовалют</h2>
          
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <p>
              White Capital — это современная криптовалютная биржа, специализирующаяся на обмене российских рублей на USDT. 
              Мы создали платформу, которая объединяет в себе простоту использования, высокий уровень безопасности и 
              профессиональный подход к обслуживанию клиентов.
            </p>
            
            <p>
              Наша миссия — сделать криптовалютные операции доступными и безопасными для каждого пользователя. 
              Мы понимаем важность доверия в финансовой сфере и прикладываем максимум усилий для обеспечения 
              надежности и прозрачности всех операций.
            </p>
            
            <p>
              Команда White Capital состоит из опытных специалистов в области финансовых технологий, 
              кибербезопасности и блокчейн-разработки. Мы постоянно совершенствуем нашу платформу, 
              внедряя новые технологии и улучшая пользовательский опыт.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Безопасность</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Многоуровневая система защиты, включая двухфакторную аутентификацию и шифрование данных
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Выгодные курсы</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Конкурентные курсы обмена и минимальные комиссии для максимальной выгоды наших клиентов
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-8 w-8 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Быстрые операции</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Мгновенные обмены и быстрая обработка заявок на вывод средств
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-8 w-8 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Надежность</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Проверенная временем платформа с высоким уровнем доверия пользователей
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Поддержка 24/7</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Круглосуточная техническая поддержка для решения любых вопросов
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-8 w-8 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Простота</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Интуитивно понятный интерфейс, подходящий как для новичков, так и для опытных трейдеров
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Свяжитесь с нами</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Техническая поддержка</h4>
            <p className="text-blue-100 text-sm mb-4">
              Наша команда поддержки готова помочь вам 24 часа в сутки, 7 дней в неделю
            </p>
            <p className="text-blue-200 text-sm">
              Время ответа: обычно в течение 1 часа
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Безопасность</h4>
            <p className="text-blue-100 text-sm mb-4">
              Если у вас есть вопросы по безопасности или вы заметили подозрительную активность
            </p>
            <p className="text-blue-200 text-sm">
              Сообщите нам немедленно через систему поддержки
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder for future content */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Дополнительная информация</h3>
          <p className="text-gray-400 text-sm">
            Здесь будет размещена дополнительная информация о компании, которую вы добавите позже
          </p>
        </div>
      </div>
    </div>
  );
};