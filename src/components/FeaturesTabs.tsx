// src/components/FeaturesTabs.tsx

import React, { useState } from 'react';

type Tab = 'mechanics' | 'inventory' | 'world';

export function FeaturesTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('mechanics');

  const tabButtonClasses = (tabName: Tab) => 
    `w-full py-3 px-4 font-serif text-lg rounded-t-lg transition-colors duration-300 ${
      activeTab === tabName 
        ? 'bg-shadow-grey/30 text-gold-leaf' 
        : 'bg-transparent text-off-white/50 hover:bg-shadow-grey/20 hover:text-off-white'
    }`;

  return (
    <div>
      {/* --- Переключатели вкладок --- */}
      <div className="grid grid-cols-3 gap-2 max-w-3xl mx-auto">
        <button onClick={() => setActiveTab('mechanics')} className={tabButtonClasses('mechanics')}>Основные механики</button>
        <button onClick={() => setActiveTab('inventory')} className={tabButtonClasses('inventory')}>Предметы и Артефакты</button>
        <button onClick={() => setActiveTab('world')} className={tabButtonClasses('world')}>Мир и Квесты</button>
      </div>

      {/* --- Контент вкладок --- */}
      <div className="bg-shadow-grey/30 p-8 rounded-b-lg rounded-tr-lg min-h-[24rem]">
        
        {/* === Контент для "Основных механик" (ОБНОВЛЕНО) === */}
        {activeTab === 'mechanics' && (
          <div className="animate-fade-in flex flex-col lg:flex-row gap-12 items-start">
            {/* Левая, главная колонка */}
            <div className="lg:w-1/2">
              <div className="flex items-start gap-4">
                <i className="fas fa-comments text-gold-leaf text-3xl"></i>
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-3">Диалоги с выбором</h3>
                  <p className="text-off-white/80">
                    Основа геймплея — это общение. Ваши реплики напрямую влияют на ход квеста, реакции и судьбу персонажей, а также на то, какие предметы вы получите или потеряете. Каждое слово имеет вес, и иногда хитрость оказывается важнее прямолинейности.
                  </p>
                </div>
              </div>
            </div>
            {/* Правая колонка со списком остальных механик */}
            <div className="lg:w-1/2 w-full">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <i className="fas fa-puzzle-piece text-gold-leaf/80 mt-1 text-xl"></i>
                  <div>
                    <h4 className="font-serif text-xl font-bold">Мини-игры и загадки</h4>
                    <p className="text-sm text-off-white/70">Решайте головоломки: от загадок дракончиков в Крепости-Стакан до квеста на заброшенном пиратском дирижабле.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <i className="fas fa-briefcase text-gold-leaf/80 mt-1 text-xl"></i>
                  <div>
                    <h4 className="font-serif text-xl font-bold">Инвентарь и предметы</h4>
                    <p className="text-sm text-off-white/70">Собирайте десятки артефактов, которые применяются в диалогах, для решения загадок или обмена.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <i className="fas fa-book-skull text-gold-leaf/80 mt-1 text-xl"></i>
                  <div>
                    <h4 className="font-serif text-xl font-bold">Проклятие как механика</h4>
                    <p className="text-sm text-off-white/70">Проклятие Забвения — не просто фон, а активный элемент, делающий порталы нестабильными и вызывающий сбои в работе гида Искина.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* === Контент для "Предметов и Артефактов" (ОБНОВЛЕНО) === */}
        {activeTab === 'inventory' && (
          <div className="animate-fade-in">
            <p className="text-off-white/80 mb-8 text-center max-w-2xl mx-auto">Соберите свою коллекцию уникальных предметов, чтобы раскрыть все тайны КрасноЦарства. Каждый артефакт имеет свою историю и предназначение.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Карточка 1 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <i className="fas fa-box-open text-3xl text-gold-leaf mb-3"></i>
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Стартовые предметы</h4>
                  <p className="text-sm text-off-white/70">Выберите рюкзак, подкидывающий артефакты, или шоппер, усиливающий свойства вещей.</p>
                </div>
              </div>
              {/* Карточка 2 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <i className="fas fa-key text-3xl text-gold-leaf mb-3"></i>
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Ключевые предметы</h4>
                  <p className="text-sm text-off-white/70">Соберите лодку или раздобудьте дирижабль, чтобы открыть доступ к новым локациям.</p>
                </div>
              </div>
              {/* Карточка 3 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <i className="fas fa-handshake text-3xl text-gold-leaf mb-3"></i>
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Обменные предметы</h4>
                  <p className="text-sm text-off-white/70">Используйте зерно, чтобы приманить утку, но сначала обменяйте ведро у купца.</p>
                </div>
              </div>
              {/* Карточка 4 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <i className="fas fa-wand-sparkles text-3xl text-gold-leaf mb-3"></i>
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Редкие артефакты</h4>
                  <p className="text-sm text-off-white/70">Получите коготь грифона или зеркало истинных намерений, чтобы получить уникальные возможности.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === Контент для "Мира и Квестов" (ОБНОВЛЕНО) === */}
        {activeTab === 'world' && (
           <div className="animate-fade-in">
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="font-serif text-2xl text-gold-leaf mb-3">Переходы и связи</h3>
                <p className="text-off-white/80 mb-10">Все основные локации связаны порталами, которые становятся активными по мере прохождения сюжета. Некоторые из них нестабильны из-за Проклятия и требуют особых артефактов для использования. Ваш гид Искин всегда объяснит связь каждой локации с реальным миром.</p>
              </div>
              <div>
                <h4 className="font-serif text-2xl text-center text-gold-leaf mb-6">Тематические зоны</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Карточка 1 */}
                  <div className="p-6 bg-shadow-grey/10 rounded-lg text-center">
                    <i className="fas fa-landmark text-4xl text-gold-leaf/50 mb-4"></i>
                    <h5 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Библиотечные узлы</h5>
                    <p className="text-sm text-off-white/70">Ржевская, Гоголя, Сфера, ШКАФ, НОТА</p>
                  </div>
                  {/* Карточка 2 */}
                   <div className="p-6 bg-shadow-grey/10 rounded-lg text-center">
                    <i className="fas fa-gem text-4xl text-gold-leaf/50 mb-4"></i>
                    <h5 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Артефактные зоны</h5>
                    <p className="text-sm text-off-white/70">Крепость-Стакан, Хранилище (Ладожская)</p>
                  </div>
                  {/* Карточка 3 */}
                   <div className="p-6 bg-shadow-grey/10 rounded-lg text-center">
                    <i className="fas fa-tree text-4xl text-gold-leaf/50 mb-4"></i>
                    <h5 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Мирные / сельские</h5>
                    <p className="text-sm text-off-white/70">Молочные берега, Верфь, Рынок</p>
                  </div>
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}