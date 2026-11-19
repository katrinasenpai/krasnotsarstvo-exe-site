// src/components/FeaturesTabs.tsx

import { useState } from 'react';
import { FaComments, FaPuzzlePiece, FaBriefcase, FaBookDead, FaBoxOpen, FaKey, FaHandshake, FaMagic, FaLandmark, FaGem, FaTree } from 'react-icons/fa';

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
        <button aria-pressed={activeTab === 'mechanics'} onClick={() => setActiveTab('mechanics')} className={tabButtonClasses('mechanics')}>Механики</button>
        <button aria-pressed={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} className={tabButtonClasses('inventory')}>Артефакты</button>
        <button aria-pressed={activeTab === 'world'} onClick={() => setActiveTab('world')} className={tabButtonClasses('world')}>Мир и квесты</button>
      </div>

      {/* --- Контент вкладок --- */}
      <div className="bg-shadow-grey/30 p-8 rounded-b-lg rounded-tr-lg min-h-[24rem]">
        
        {/* === Контент для "Основных механик" (ОБНОВЛЕНО) === */}
        {activeTab === 'mechanics' && (
          <div className="animate-fade-in flex flex-col lg:flex-row gap-12 items-start">
            {/* Левая, главная колонка */}
            <div className="lg:w-1/2">
              <div className="flex items-start gap-4">
                <FaComments className="text-gold-leaf text-3xl shrink-0" />
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-3">Диалоги с выбором</h3>
                  <p className="text-off-white/80">
                    Решайте, кому помочь, что спросить и какие находки взять с собой. Реплики меняют реакции собеседников, награды и доступные действия. У первой главы три исхода: путь зависит от ваших решений и собранных предметов.
                  </p>
                  <p className="text-off-white/80 mt-4">Поступки и артефакты влияют на храбрость, магию, мудрость и запас монет. Иногда найденная вещь открывает новый способ справиться с трудностью.</p>
                </div>
              </div>
            </div>
            {/* Правая колонка со списком остальных механик */}
            <div className="lg:w-1/2 w-full">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <FaPuzzlePiece className="text-gold-leaf/80 mt-1 text-xl shrink-0" />
                  <div>
                    <h4 className="font-serif text-xl font-bold">Мини-игры и загадки</h4>
                    <p className="text-base text-off-white/70">Отвечайте на загадки Горынычей, восстанавливайте узор жёрнова в Катакомбах, проходите четыре испытания чаепития в Квартале и помогайте живому багажу на Станции дирижаблей.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <FaBriefcase className="text-gold-leaf/80 mt-1 text-xl shrink-0" />
                  <div>
                    <h4 className="font-serif text-xl font-bold">Инвентарь и предметы</h4>
                    <p className="text-base text-off-white/70">Храните находки в сундуке, читайте описания и используйте вещи в диалогах, обменах и испытаниях. Оттуда же можно открыть карту.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <FaBookDead className="text-gold-leaf/80 mt-1 text-xl shrink-0" />
                  <div>
                    <h4 className="font-serif text-xl font-bold">Заклятие как механика</h4>
                    <p className="text-base text-off-white/70">Заклятие Забвения стирает записи, нарушает работу порталов и затрагивает память Искина. Внимательное чтение помогает замечать его следы.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <FaMagic className="text-gold-leaf/80 mt-1 text-xl shrink-0" />
                  <div>
                    <h4 className="font-serif text-xl font-bold">Хронокарты у гадалки</h4>
                    <p className="text-base text-off-white/70">Вытяните три карты из колоды, выберите одну и получите книгу в дорогу. В сюжетном визите останется закладка, которая пригодится у жёрнова.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* === Контент для "Предметов и Артефактов" (ОБНОВЛЕНО) === */}
        {activeTab === 'inventory' && (
          <div className="animate-fade-in">
            <p className="text-off-white/80 mb-8 text-center max-w-2xl mx-auto">У находок есть история и применение. Кувшин из драконьего стекла превращает речную воду в молоко, а дорожный складень открывает путь к гадалке.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Карточка 1 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaBoxOpen className="text-3xl text-gold-leaf mb-3" />
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Стартовые предметы</h4>
                  <p className="text-base text-off-white/70">Рюкзак хранит Жар-перо в потайном кармане, а шоппер с вышитым бобром откликается на чары в Лавке древних артефактов.</p>
                </div>
              </div>
              {/* Карточка 2 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaKey className="text-3xl text-gold-leaf mb-3" />
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Ключевые предметы</h4>
                  <p className="text-base text-off-white/70">Раздобудьте лодку или дирижабль, чтобы добраться до Уткиной Гавани. Фонарь поможет в тёмных Катакомбах.</p>
                </div>
              </div>
              {/* Карточка 3 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaHandshake className="text-3xl text-gold-leaf mb-3" />
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Обменные предметы</h4>
                  <p className="text-base text-off-white/70">Договаривайтесь с жителями рынка: верёвка, ведро и мешок становятся звеньями цепочки, которая приведёт к зерну и кормушке для утки.</p>
                </div>
              </div>
              {/* Карточка 4 */}
              <div className="p-6 bg-shadow-grey/10 rounded-lg border border-transparent hover:border-gold-leaf/30 transition-colors duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaMagic className="text-3xl text-gold-leaf mb-3" />
                  <h4 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Редкие артефакты</h4>
                  <p className="text-base text-off-white/70">Яйцо Восстановления входит в зелье против Заклятия. С каждым значимым артефактом приходит строка заклинания, которое пробудит зелье.</p>
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
                <p className="text-off-white/80 mb-10">Маршрут первой главы проходит через фэнтезийную «Ржевскую», Крепость-Стакан или Катакомбы, Молочные берега и Уткину Гавань. Искин помогает сравнить места КрасноЦарства с их прототипами в Петербурге. На карте показан весь мир; его история продолжится во второй части.</p>
              </div>
              <div>
                <h4 className="font-serif text-2xl text-center text-gold-leaf mb-6">Побочные квесты первой главы</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Карточка 1 */}
                  <div className="p-6 bg-shadow-grey/10 rounded-lg text-center">
                    <FaLandmark className="text-4xl text-gold-leaf/50 mb-4 mx-auto" />
                    <h5 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Квартал Четырёх Дураков</h5>
                    <p className="text-base text-off-white/70">Одно чаепитие, четыре хозяина и четыре испытания: ритм, ложки, печенье и чашки. Жетоны выдаются за успешное прохождение.</p>
                  </div>
                  {/* Карточка 2 */}
                   <div className="p-6 bg-shadow-grey/10 rounded-lg text-center">
                    <FaGem className="text-4xl text-gold-leaf/50 mb-4 mx-auto" />
                    <h5 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Катакомбы</h5>
                    <p className="text-base text-off-white/70">Знакомство с Большой Крысой и Летучей Мышью, восстановление узора жёрнова и поиск пути в Лавку древних артефактов.</p>
                  </div>
                  {/* Карточка 3 */}
                   <div className="p-6 bg-shadow-grey/10 rounded-lg text-center">
                    <FaTree className="text-4xl text-gold-leaf/50 mb-4 mx-auto" />
                    <h5 className="font-serif text-xl font-bold text-gold-leaf/90 mb-2">Станция дирижаблей</h5>
                    <p className="text-base text-off-white/70">«Заблудившийся багаж»: восстановите записи Сильвера, охладите трюм и договоритесь с упрямым живым сундуком.</p>
                  </div>
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
