document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const logoLink = document.querySelector('.nav-logo');

    // --- HTML-ШАБЛОНЫ ДЛЯ КАЖДОЙ СЕКЦИИ ---
    // Этот код создаёт контент, который будет вставляться в <div id="root"></div>
    // Вы можете легко менять здесь тексты и прочее.

    const pages = {
        home: `
            <section class="story-section" id="home">
                <div class="container">
                    <h2 class="section-title">
                        <i class="fas fa-scroll"></i>
                        История начинается
                        <i class="fas fa-scroll"></i>
                    </h2>
                    <p class="story-intro">
                        В тишине вековой пыли, где время замерло на пожелтевших страницах, скрывается нечто большее, чем просто слова. Каждая книга — дверь. Каждый шелест — шёпот. Готовы ли вы услышать его?
                    </p>
                    <div class="story-details">
                        <div class="story-item">
                            <h3>Забытый Фолиант</h3>
                            <p>В самой дальней секции университетской библиотеки, куда не заглядывал даже солнечный свет, вы находите книгу, которой нет ни в одном каталоге.</p>
                        </div>
                        <div class="story-item">
                            <h3>Пробуждение Тени</h3>
                            <p>Едва ваши пальцы касаются старинного переплёта, древняя магия пробуждается. Печати, сдерживающие тысячелетнее проклятие, слабеют.</p>
                        </div>
                        <div class="story-item">
                            <h3>Ваш Выбор</h3>
                            <p>Теперь судьба библиотеки и её тайн в ваших руках. Каждое решение определит исход истории. Доверитесь ли вы шёпоту со страниц или попытаетесь запереть зло вновь?</p>
                        </div>
                    </div>
                </div>
            </section>
        `,
        story: `
            <section class="story-section" id="story">
                <div class="container">
                     <h2 class="section-title"><i class="fas fa-book-open"></i> Сюжет <i class="fas fa-book-open"></i></h2>
                     <p class="story-intro">Здесь будет ваше подробное описание сюжета. Расскажите о мире, о главных конфликтах и о том, что ждёт игрока.</p>
                </div>
            </section>
        `,
        characters: `
            <section class="characters-section" id="characters">
                <div class="container">
                    <h2 class="section-title"><i class="fas fa-users"></i> Персонажи <i class="fas fa-users"></i></h2>
                    <div class="characters-grid">
                        <div class="character-card">
                            <div class="character-avatar"><i class="fas fa-user-graduate"></i></div>
                            <h3>Протагонист</h3>
                            <p class="character-role">Студент-архивариус</p>
                            <p>Любопытный и немного наивный. Именно он находит проклятую книгу.</p>
                        </div>
                        <div class="character-card">
                            <div class="character-avatar"><i class="fas fa-ghost"></i></div>
                            <h3>Хранитель</h3>
                            <p class="character-role">Дух Библиотеки</p>
                            <p>Древняя сущность, связанная с библиотекой. Может быть как союзником, так и врагом.</p>
                        </div>
                        <div class="character-card">
                            <div class="character-avatar"><i class="fas fa-user-secret"></i></div>
                            <h3>Соперник</h3>
                            <p class="character-role">Охотник за артефактами</p>
                            <p>Знает о силе книги и готов пойти на всё, чтобы заполучить её.</p>
                        </div>
                    </div>
                </div>
            </section>
        `,
        gallery: `
            <section class="gallery-section" id="gallery">
                <div class="container">
                    <h2 class="section-title"><i class="fas fa-images"></i> Галерея <i class="fas fa-images"></i></h2>
                    <div class="gallery-grid">
                        <div class="gallery-item"><div class="placeholder-image"><i class="fas fa-image"></i><p>Арт #1</p></div></div>
                        <div class="gallery-item"><div class="placeholder-image"><i class="fas fa-image"></i><p>Арт #2</p></div></div>
                        <div class="gallery-item"><div class="placeholder-image"><i class="fas fa-image"></i><p>Арт #3</p></div></div>
                        <div class="gallery-item"><div class="placeholder-image"><i class="fas fa-image"></i><p>Арт #4</p></div></div>
                    </div>
                </div>
            </section>
        `,
        download: `
            <section class="download-section" id="download">
                <div class="container">
                    <h2 class="section-title"><i class="fas fa-download"></i> Скачать игру <i class="fas fa-download"></i></h2>
                    <div class="download-content">
                         <div class="system-requirements">
                            <h3>Системные требования</h3>
                            <div class="requirements-grid">
                                <div class="req-column">
                                    <h4>Минимальные</h4>
                                    <ul>
                                        <li>ОС: Windows 7/8/10</li>
                                        <li>Процессор: 2.0 GHz</li>
                                        <li>Память: 2 GB RAM</li>
                                        <li>Место на диске: 500 MB</li>
                                    </ul>
                                </div>
                                <div class="req-column">
                                    <h4>Рекомендуемые</h4>
                                    <ul>
                                        <li>ОС: Windows 10/11</li>
                                        <li>Процессор: 3.0 GHz</li>
                                        <li>Память: 4 GB RAM</li>
                                        <li>Место на диске: 1 GB</li>
                                    </ul>
                                </div>
                            </div>
                         </div>
                         <div class="download-buttons">
                            <a href="#" class="btn-download">Скачать для Windows</a>
                            <a href="#" class="btn-download">Скачать для MacOS</a>
                            <div class="price-info"><p class="price">Цена: <span class="free">Бесплатно</span></p></div>
                         </div>
                    </div>
                </div>
            </section>
        `
    };

    // --- ЛОГИКА РЕНДЕРА (ОТОБРАЖЕНИЯ) ---
    const renderPage = (pageId) => {
        root.innerHTML = pages[pageId] || pages.home;
    };

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.getAttribute('href').substring(1);
            renderPage(pageId);
            // Для мобильной версии - закрываем меню после клика
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Клик по логотипу всегда ведет на главную
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderPage('home');
    });

    // Логика для гамбургер-меню
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- ИНИЦИАЛИЗАЦИЯ ---
    // При первой загрузке показываем главную страницу
    renderPage('home');
});