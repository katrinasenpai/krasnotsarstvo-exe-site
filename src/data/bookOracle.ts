import archiveLantern from '../assets/images/oracle-deck/archive-lantern.webp';
import canalBridge from '../assets/images/oracle-deck/canal-bridge.webp';
import crownedCat from '../assets/images/oracle-deck/crowned-cat.webp';
import draftReconciliation from '../assets/images/oracle-deck/draft-reconciliation.webp';
import echoCatalogue from '../assets/images/oracle-deck/echo-catalogue.webp';
import editorialJudgment from '../assets/images/oracle-deck/editorial-judgment.webp';
import fateBinding from '../assets/images/oracle-deck/fate-binding.webp';
import forbiddenTome from '../assets/images/oracle-deck/forbidden-tome.webp';
import foxCourier from '../assets/images/oracle-deck/fox-courier.webp';
import hiddenKey from '../assets/images/oracle-deck/hidden-key.webp';
import inkGarden from '../assets/images/oracle-deck/ink-garden.webp';
import keeperMargins from '../assets/images/oracle-deck/keeper-margins.webp';
import lastChapter from '../assets/images/oracle-deck/last-chapter.webp';
import paperMoon from '../assets/images/oracle-deck/paper-moon.webp';
import quietWindow from '../assets/images/oracle-deck/quiet-window.webp';
import readerThreshold from '../assets/images/oracle-deck/reader-threshold.webp';
import storyCompass from '../assets/images/oracle-deck/story-compass.webp';
import sunPage from '../assets/images/oracle-deck/sun-page.webp';
import suspendedBookmark from '../assets/images/oracle-deck/suspended-bookmark.webp';
import suspendedLine from '../assets/images/oracle-deck/suspended-line.webp';
import tamerLetters from '../assets/images/oracle-deck/tamer-letters.webp';
import violetPortal from '../assets/images/oracle-deck/violet-portal.webp';
import {
  oracleDeck,
  type OracleBookRecommendation,
  type OracleCardDefinition,
  type OraclePosition,
} from './bookOracleDeck';

export { oraclePositionLabels, type OraclePosition } from './bookOracleDeck';

const images: Record<string, string> = {
  'reader-threshold': readerThreshold,
  'hidden-key': hiddenKey,
  'keeper-margins': keeperMargins,
  'ink-garden': inkGarden,
  'crowned-cat': crownedCat,
  'echo-catalogue': echoCatalogue,
  'canal-bridge': canalBridge,
  'fox-courier': foxCourier,
  'tamer-letters': tamerLetters,
  'archive-lantern': archiveLantern,
  'fate-binding': fateBinding,
  'editorial-judgment': editorialJudgment,
  'suspended-line': suspendedLine,
  'last-chapter': lastChapter,
  'draft-reconciliation': draftReconciliation,
  'forbidden-tome': forbiddenTome,
  'quiet-window': quietWindow,
  'suspended-bookmark': suspendedBookmark,
  'paper-moon': paperMoon,
  'sun-page': sunPage,
  'story-compass': storyCompass,
  'violet-portal': violetPortal,
};

export type OracleCard = OracleCardDefinition & { image: string };

export interface OracleReadingEntry {
  position: OraclePosition;
  card: OracleCard;
  interpretation: string;
}

export interface OracleReading {
  cards: OracleCard[];
  entries: OracleReadingEntry[];
  summary: string;
  book: OracleBookRecommendation & { sourceCard: string; sourcePosition: OraclePosition };
}

export const oracleCards: OracleCard[] = oracleDeck.map((card) => ({
  ...card,
  image: images[card.imageId],
}));

function hashCards(cards: OracleCard[]) {
  return cards.reduce((total, card, index) => total + card.number * (index + 5) + card.id.length, 0);
}

function pickPhrase(card: OracleCard, position: OraclePosition, index: number, seed: number) {
  const prefix = card.phrasing[(seed + index + card.number) % card.phrasing.length];
  return `${prefix} ${card.interpretations[position]}`;
}

export function drawOracleCards(): OracleCard[] {
  const available = [...oracleCards];
  const draw: OracleCard[] = [];

  for (let index = 0; index < 3; index += 1) {
    const cardIndex = Math.floor(Math.random() * available.length);
    draw.push(available.splice(cardIndex, 1)[0]);
  }

  return draw;
}

export function createOracleReading(cards: OracleCard[]): OracleReading {
  const positions: OraclePosition[] = ['past', 'present', 'future'];
  const seed = hashCards(cards);
  const entries = cards.map((card, index) => ({
    position: positions[index],
    card,
    interpretation: pickPhrase(card, positions[index], index, seed),
  }));
  const bookSourceIndex = seed % cards.length;
  const bookSource = cards[bookSourceIndex];
  const summaryOpeners = [
    'Искин сводит потоки без торжественных предсказаний:',
    'После удаления нескольких дружелюбных артефактов получается такой контур:',
    'Колода не спорит с реальностью, но складывает для неё полезную сноску:',
  ];
  const summary = `${summaryOpeners[seed % summaryOpeners.length]} «${cards[0].title}» говорит ${cards[0].link}, «${cards[1].title}» отвечает ${cards[1].link}, а «${cards[2].title}» ведёт ${cards[2].link}. Выберите один спокойный ориентир из этих трёх, а не пытайтесь немедленно переписать всю библиотеку.`;

  return {
    cards,
    entries,
    summary,
    book: {
      ...bookSource.recommendation,
      sourceCard: bookSource.title,
      sourcePosition: positions[bookSourceIndex],
    },
  };
}
