import { Mail, Newspaper, Users } from 'lucide-react';
import './ContactSection.css';

const email = 'brzh@kr-cbs.ru';
const letter = (subject:string) => `mailto:${email}?subject=${encodeURIComponent(`КрасноЦарство.exe: ${subject}`)}`;

export function ContactSection() {
  return <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="container">
    <p className="contact-section__eyebrow">ДАВАЙТЕ СОЗДАВАТЬ ИСТОРИИ ВМЕСТЕ</p>
    <h2 id="contact-title">Сотрудничество и пресса</h2>
    <p className="contact-section__intro">КрасноЦарство открыто новым знакомствам. Если у вас есть идея совместного проекта или вы хотите рассказать о новелле, напишите команде.</p>
    <div className="contact-section__columns">
      <article><Users aria-hidden="true" size={28} /><h3>Предложить сотрудничество</h3><p>Совместные события, творческие коллаборации и проекты о книгах, городе и его историях. Расскажите о своей идее, формате и предполагаемых сроках.</p><a href={letter('Предложение о сотрудничестве')} className="contact-section__button"><Mail size={18} aria-hidden="true" /> Обсудить идею</a></article>
      <article><Newspaper aria-hidden="true" size={28} /><h3>Для журналистов и авторов</h3><p>Готовите публикацию, обзор или интервью? Свяжитесь с нами, чтобы запросить информацию и иллюстрации. Пресс-релиз и материалы для скачивания появятся здесь.</p><a href={letter('Запрос материалов для публикации')} className="contact-section__button contact-section__button--outline">Запросить материалы</a></article>
    </div>
    <p className="contact-section__email">Команда проекта в библиотеке «Ржевская» <a href={`mailto:${email}`}>{email}</a></p>
  </div></section>;
}
