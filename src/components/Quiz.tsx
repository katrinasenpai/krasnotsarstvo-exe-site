// src/components/Quiz.tsx
// Тест «Кто ты из КрасноЦарства?»

import { useState } from 'react';
import { FaHatWizard, FaRedo, FaGamepad } from 'react-icons/fa';
import { quizQuestions, quizResults, QuizResultType } from '../data/quiz';

type QuizScreen = 'start' | 'question' | 'loading' | 'result';

const initialScores: Record<QuizResultType, number> = {
  iskin: 0,
  pilot: 0,
  merchant: 0,
  alchemist: 0,
  rat: 0,
  fool: 0,
};

export function Quiz() {
  const [screen, setScreen] = useState<QuizScreen>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [resultType, setResultType] = useState<QuizResultType>('iskin');

  const startTest = () => {
    setScores(initialScores);
    setCurrentQuestion(0);
    setScreen('question');
  };

  const selectAnswer = (type: QuizResultType) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Определяем победителя и показываем анимацию «инициализации профиля»
      const winner = (Object.keys(newScores) as QuizResultType[]).reduce((a, b) =>
        newScores[a] >= newScores[b] ? a : b
      );
      setResultType(winner);
      setScreen('loading');
      setTimeout(() => setScreen('result'), 2200);
    }
  };

  const question = quizQuestions[currentQuestion];
  const result = quizResults[resultType];

  return (
    <div className="max-w-3xl mx-auto bg-midnight-ink/70 backdrop-blur-sm border border-gold-leaf/40 rounded-xl p-6 sm:p-10 shadow-[0_0_35px_rgba(240,182,90,0.12)]">

      {/* СТАРТОВЫЙ ЭКРАН */}
      {screen === 'start' && (
        <div className="text-center animate-fade-in">
          <p className="text-lg md:text-xl text-off-white/80 leading-relaxed italic mb-8">
            «Экран выбора персонажа активирован. Перед вами — туманные очертания Красногвардейского района, ставшего фэнтези-миром. Но Проклятие Забвения уже близко… Кем вы проснетесь в этой реальности?»
          </p>
          <button
            onClick={startTest}
            className="inline-flex items-center gap-3 bg-gold-leaf hover:bg-gold-leaf/90 text-black font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaHatWizard />
            <span>Начать игру</span>
          </button>
        </div>
      )}

      {/* ЭКРАН ВОПРОСА */}
      {screen === 'question' && (
        <div key={currentQuestion} className="animate-fade-in">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-gold-leaf/80 mb-3">
            Вопрос {currentQuestion + 1} из {quizQuestions.length}
          </p>

          {/* Прогресс-бар */}
          <div className="h-1 bg-shadow-grey/50 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gold-leaf rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          <h3 className="text-center font-serif text-2xl md:text-3xl text-gold-leaf mb-4">
            {question.title}
          </h3>
          <p className="text-off-white/80 leading-relaxed mb-8">
            {question.text}
          </p>

          <div className="flex flex-col gap-3">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(answer.type)}
                className="text-left bg-shadow-grey/20 border border-gold-leaf/30 rounded-lg py-3 px-5 text-off-white/90 hover:bg-gold-leaf hover:text-black hover:border-gold-leaf transition-all duration-300"
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ЭКРАН ЗАГРУЗКИ */}
      {screen === 'loading' && (
        <div className="flex flex-col items-center py-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full border-4 border-shadow-grey/50 border-t-gold-leaf animate-spin mb-8"></div>
          <p className="font-serif text-2xl md:text-3xl text-gold-leaf text-center animate-pulse">
            Анализ ответов...<br />Инициализация профиля...
          </p>
        </div>
      )}

      {/* ЭКРАН РЕЗУЛЬТАТА */}
      {screen === 'result' && (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <h3 className="font-serif text-2xl md:text-3xl text-gold-leaf mb-2">
            Инициализация завершена!
          </h3>
          <p className="text-off-white/70 mb-6">Твоя роль в КрасноЦарстве:</p>

          <img
            src={result.img}
            alt={result.name}
            className="w-52 md:w-60 rounded-lg border-2 border-gold-leaf shadow-[0_0_25px_rgba(240,182,90,0.35)] mb-6"
          />

          <p className="font-serif text-3xl md:text-4xl text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] mb-4">
            {result.name}
          </p>
          <p className="text-off-white/80 leading-relaxed italic border-t border-shadow-grey/50 pt-5 mb-8">
            {result.desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={startTest}
              className="inline-flex items-center justify-center gap-2 border border-gold-leaf text-gold-leaf hover:bg-gold-leaf hover:text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <FaRedo />
              <span>Пройти ещё раз</span>
            </button>
            <a
              href="https://vkplay.ru/play/game/krasnocarstvoexe/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gold-leaf hover:bg-gold-leaf/90 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaGamepad />
              <span>Играть в демо на VK Play</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
