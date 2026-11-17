import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { quizQuestions, quizResults, quizTypes, scoreAnswers, QuizResultType } from '../data/quiz';
import './QuizInvitation.css';
type Screen = 'start' | 'question' | 'tie' | 'result';
export function Quiz() {
  const [screen, setScreen] = useState<Screen>('start');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultType, setResultType] = useState<QuizResultType>('iskin');
  const [candidates, setCandidates] = useState<QuizResultType[]>([]);
  const title = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  useEffect(() => { if (interacted.current) { title.current?.focus({ preventScroll: true }); title.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); } }, [screen, current]);
  const start = () => { interacted.current = true; setAnswers([]); setCurrent(0); setScreen('question'); };
  const next = () => {
    if (answers[current] === undefined) return;
    if (current < quizQuestions.length - 1) { setCurrent(current + 1); return; }
    const winners = scoreAnswers(answers);
    setCandidates(winners);
    if (winners.length === 1) { setResultType(winners[0]); setScreen('result'); }
    else setScreen('tie');
  };
  const question = quizQuestions[current];
  const result = quizResults[resultType];
  return <div className={`quiz-shell${screen === 'start' ? ' quiz-shell--invitation' : ''}`}>
    {screen === 'start' && <div className="quiz-invitation">
      <div className="quiz-invitation__letter">
        <p className="quiz-invitation__eyebrow">ПРИГЛАШЕНИЕ ОТ ИСКИНА</p>
        <h3 ref={title} tabIndex={-1}>Кто вы по ту<br />сторону книги?</h3>
        <div className="quiz-invitation__ornament" aria-hidden="true">✦</div>
        <p className="quiz-invitation__lead">Портал уже открыт. Что вы возьмёте с собой: любопытство, решительность или умение слышать других?</p>
        <p className="quiz-invitation__description">Пройдите небольшой путь из восьми ситуаций и узнайте, с кем из жителей КрасноЦарства вам легче найти общий язык.</p>
        <button type="button" className="quiz-primary" onClick={start}>Начать свою историю<ArrowRight size={19} /></button>
        <p className="quiz-invitation__meta">8 вопросов · около 3 минут · без спойлеров</p>
      </div>
      <div className="quiz-invitation__portrait"><span className="quiz-invitation__arch" aria-hidden="true" /><img src="/characters/iskin.webp" alt="Искин приглашает в КрасноЦарство" loading="lazy" /><p>Искин<span>Ваш проводник по ту сторону книги</span></p></div>
    </div>}
    {screen === 'question' && <div>
      <p className="quiz-eyebrow">ВОПРОС {current + 1} ИЗ {quizQuestions.length}</p>
      <progress className="quiz-progress" value={current + 1} max={quizQuestions.length} aria-label="Прогресс теста" />
      <h3 ref={title} tabIndex={-1}>{question.title}</h3><p className="quiz-question">{question.text}</p>
      <div className="quiz-answers" role="group" aria-label="Варианты ответа">{question.answers.map((answer, index) => <button type="button" key={index} aria-pressed={answers[current] === index} onClick={() => setAnswers(previous => { const updated = [...previous]; updated[current] = index; return updated; })}><span>{index + 1}</span>{answer.text}</button>)}</div>
      <div className="quiz-navigation"><button type="button" onClick={() => current ? setCurrent(current - 1) : setScreen('start')}><ArrowLeft size={17} /> Назад</button><button type="button" className="quiz-primary" disabled={answers[current] === undefined} onClick={next}>{current === quizQuestions.length - 1 ? 'Узнать результат' : 'Дальше'}<ArrowRight size={17} /></button></div>
    </div>}
    {screen === 'tie' && <div><p className="quiz-eyebrow">ЕЩЁ ОДИН ШТРИХ</p><h3 ref={title} tabIndex={-1}>Вам близки несколько характеров</h3><p className="quiz-question">Ответы разделились поровну. Что из этого точнее описывает вас?</p><div className="quiz-answers">{candidates.map(id => <button key={id} type="button" onClick={() => { setResultType(id); setScreen('result'); }}>{quizResults[id].trait}</button>)}</div><button className="quiz-back" type="button" onClick={() => setScreen('question')}><ArrowLeft size={17} /> Вернуться к ответам</button></div>}
    {screen === 'result' && <div className="quiz-result"><p className="quiz-eyebrow">ВАШ СОБЕСЕДНИК В КРАСНОЦАРСТВЕ</p><h3 ref={title} tabIndex={-1}>{result.name}</h3><img src={result.img} alt={result.name} /><p>{result.desc}</p><div className="quiz-navigation"><button type="button" onClick={start}><RotateCcw size={17} /> Пройти ещё раз</button><a href="#characters" className="quiz-primary">Познакомиться с героями<ArrowRight size={17} /></a></div><small>Один из {quizTypes.length} характеров. Ваш результат описывает предпочтения в этих ситуациях.</small></div>}
  </div>;
}
