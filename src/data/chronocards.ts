import records from './chronocards.json';

export const chronocards = records.map((record, number) => ({
  ...record, number, image: `/chronocards/cards/${String(number).padStart(2, '0')}.webp`,
}));
export const cardBack = '/chronocards/cards/22.webp';
export const positions = ['След прошлого', 'Ключ настоящего', 'Дорога впереди'];
export const questions = ['Что привело тебя сюда?', 'На что ты можешь опереться сейчас?', 'Какой шаг ты хочешь сделать дальше?'];
export const readingPrompts = [
  'При чтении найди деталь из начала, которая позже приобретёт другой смысл.',
  'Отметь поступок, который меняет ход разговора. Что из этого ты можешь попробовать?',
  'Остановись перед трудным выбором в книге. Какой следующий шаг предложишь ты?',
];

export type ChronicleState = { hand: number[]; spread: number[]; phase: 'choose' | 'read' | 'select' | 'book'; position: number; shuffles: number };
export type ChronicleAction = { type: 'draw'; card: number } | { type: 'next' } | { type: 'book'; position: number } | { type: 'select' } | { type: 'shuffle' | 'reset'; hand: number[] };

// Only closed cards move. Revealed cards retain their slots, as in the novel.
export function shuffleRemaining(hand: number[], spread: number[], random = Math.random): number[] {
  const remaining = hand.filter(card => !spread.includes(card));
  const shuffled = [...remaining];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (shuffled.length > 1 && shuffled.every((card, index) => card === remaining[index])) shuffled.push(shuffled.shift()!);
  let next = 0;
  return hand.map(card => spread.includes(card) ? card : shuffled[next++]);
}

export function createChronicleState(): ChronicleState {
  return { hand: shuffleRemaining(chronocards.map(card => card.number), []), spread: [], phase: 'choose', position: 0, shuffles: 0 };
}

const validHand = (hand: number[]) => hand.length === chronocards.length && new Set(hand).size === chronocards.length && hand.every(card => Number.isInteger(card) && card >= 0 && card < chronocards.length);

export function chronicleReducer(state: ChronicleState, action: ChronicleAction): ChronicleState {
  switch (action.type) {
    case 'draw':
      if (state.phase !== 'choose' || state.spread.length >= 3 || !state.hand.includes(action.card) || state.spread.includes(action.card)) return state;
      return { ...state, spread: [...state.spread, action.card], position: state.spread.length, phase: 'read' };
    case 'next':
      return state.phase === 'read' ? { ...state, phase: state.spread.length === 3 ? 'select' : 'choose' } : state;
    case 'book':
      return state.phase === 'select' && Number.isInteger(action.position) && action.position >= 0 && action.position < state.spread.length
        ? { ...state, phase: 'book', position: action.position } : state;
    case 'select':
      return state.phase === 'book' ? { ...state, phase: 'select' } : state;
    case 'shuffle':
      if (state.phase !== 'choose' || !validHand(action.hand) || state.hand.some((card, index) => state.spread.includes(card) && action.hand[index] !== card)) return state;
      return { ...state, hand: [...action.hand], shuffles: state.shuffles + 1 };
    case 'reset':
      return validHand(action.hand) ? { hand: [...action.hand], spread: [], phase: 'choose', position: 0, shuffles: 0 } : state;
  }
}
