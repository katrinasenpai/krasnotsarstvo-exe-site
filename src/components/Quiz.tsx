import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { quizQuestions, quizResults, quizTypes, scoreAnswers, QuizResultType } from '../data/quiz';
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
  return <div className="quiz-shell">
    {screen === 'start' && <div className="quiz-start">
      <p className="quiz-eyebrow">8 СИТУАЦИЙ · 10 ХАРАКТЕРОВ · ОКОЛО 3 МИНУТ</p>
      <h3 ref={title} tabIndex={-1}>Кому вы близки по духу?</h3>
      <p>В КрасноЦарстве нужны и решительность, и любопытство, и умение заботиться. Выберите, как поступили бы вы, и найдите близкого по характеру собеседника.</p>
      <div className="quiz-faces" aria-hidden="true">{['iskin', 'cow', 'pilot', 'apprentice', 'fool'].map(id => <img key={id} src={quizResults[id as QuizResultType].img} alt="" loading="lazy" />)}</div>
      <button type="button" className="quiz-primary" onClick={start}><Sparkles size={18} /> Начать тест</button>
      <small>Без правильных ответов и сюжетных спойлеров. Развлекательный тест.</small>
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
