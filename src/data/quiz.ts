import { charactersData } from './characters';
export const quizTypes = ['iskin', 'pilot', 'merchant', 'alchemist', 'rat', 'fool', 'apprentice', 'cow', 'mechanic', 'okhtenka'] as const;
export type QuizResultType = typeof quizTypes[number];
export type QuizAnswer = { text: string; type: QuizResultType; secondary?: QuizResultType };
export type QuizQuestion = { title: string; text: string; answers: QuizAnswer[] };
export type QuizResult = { name: string; img: string; desc: string; trait: string };
const descriptions: Record<QuizResultType, [string, string]> = {
  iskin: ['Наблюдать и связывать факты', 'Вам близок Искин. Вы замечаете детали и умеете превратить разрозненные сведения в понятный маршрут. В трудную минуту ваши наблюдения помогают всей компании, а сухая шутка снимает напряжение.'],
  pilot: ['Решиться на первый шаг', 'Вам близок Пилот-корсар. Неизвестность скорее манит вас, чем останавливает. Вы готовы взять ответственность за первый шаг и собрать спутников в дорогу, даже когда маршрут ещё приходится уточнять.'],
  merchant: ['Найти взаимную выгоду', 'Вам близка Хозяйка Лавки. Вы умеете оценить полезную вещь и задать точный вопрос. Лучшее решение для вас учитывает интересы обеих сторон: так договорённость становится началом долгого знакомства.'],
  alchemist: ['Понять, как это устроено', 'Вам близок Алхимик. Любопытство ведёт вас от наблюдения к опыту. Вы готовы проверить красивую догадку и изменить мнение, если результат оказался неожиданным.'],
  rat: ['Сохранить достоинство и порядок', 'Вам близка Большая Крыса. Вы цените такт и ясные правила. Ваша собранность помогает чувствовать себя увереннее тем, кто оказался рядом в непривычной обстановке.'],
  fool: ['Попробовать неожиданное', 'Вам близок Энтузиастус. Вы видите возможности там, где другие уже решили, что всё известно. Умеете увлечь затеей и разрешаете себе пробовать, ошибаться и пробовать снова.'],
  apprentice: ['Учиться, помогая другим', 'Вам близок Подмастерье. Вы не ждёте, пока узнаете абсолютно всё, чтобы быть полезным человеком. Умеете попросить совета и взять на себя посильную часть большого дела.'],
  cow: ['Замечать, кому нужна забота', 'Вам близка Мудрая бурёнка. Вы замечаете хрупкое и важное: молодые ростки, чужую усталость, неприметный след. Ваше спокойствие даёт другим время оглядеться и сделать более бережный выбор.'],
  mechanic: ['Починить и проверить', 'Вам близок Механик. Вам нравится, когда замысел начинает работать. Вы замечаете слабое соединение, находите подходящий инструмент и обязательно проверяете результат перед общей дорогой.'],
  okhtenka: ['Связать людей общим делом', 'Вам близка Охтенка. Вы умеете слушать, помнить просьбы и находить того, кто может помочь. Из небольших добрых дел вокруг вас постепенно складывается целое сообщество.'],
};
export const quizResults = Object.fromEntries(quizTypes.map(id => {
  const character = charactersData.find(c => c.id === id)!;
  return [id, { name: character.name, img: character.image, trait: descriptions[id][0], desc: descriptions[id][1] }];
})) as Record<QuizResultType, QuizResult>;
export const quizQuestions: QuizQuestion[] = [
  { title: 'На пороге Узла миров', text: 'За стеллажом открывается незнакомый зал. Портал мерцает, а на столе лежит карта. С чего начнёте?', answers: [
    { text: 'Сопоставлю карту с тем, что видно вокруг.', type: 'iskin', secondary: 'mechanic' },
    { text: 'Позову спутников и предложу вместе осмотреть зал.', type: 'pilot', secondary: 'apprentice' },
    { text: 'Выясню, что понадобится в дороге и где это раздобыть.', type: 'merchant', secondary: 'okhtenka' },
    { text: 'Попробую понять, отчего меняется свет портала.', type: 'alchemist', secondary: 'fool' },
    { text: 'Сперва поздороваюсь с хозяевами и узнаю местные правила.', type: 'rat', secondary: 'cow' },
  ]},
  { title: 'Не всё есть в инструкции', text: 'Подмастерье ищет нужную страницу, но часть записи исчезла. Как помочь?', answers: [
    { text: 'Предложу вместе восстановить то, что он ещё помнит.', type: 'apprentice', secondary: 'rat' },
    { text: 'Дам ему передохнуть. Так легче вспомнить важное.', type: 'cow', secondary: 'alchemist' },
    { text: 'Проверю оставшиеся шаги на простом примере.', type: 'mechanic', secondary: 'iskin' },
    { text: 'Узнаю, кто ещё пользовался этой записью.', type: 'okhtenka', secondary: 'merchant' },
    { text: 'Предложу другой способ решить ту же задачу.', type: 'fool', secondary: 'pilot' },
  ]},
  { title: 'У печи Горынычей', text: 'Три головы спорят, в какой момент продолжать работу со стеклом. Что ближе вам?', answers: [
    { text: 'Выслушать каждого и собрать общую последовательность.', type: 'iskin', secondary: 'apprentice' },
    { text: 'Предложить небольшой пробный шаг, чтобы выйти из спора.', type: 'pilot', secondary: 'mechanic' },
    { text: 'Узнать, какой результат устроит всех троих.', type: 'merchant', secondary: 'cow' },
    { text: 'Понаблюдать за жаром и проверить, когда стекло податливее.', type: 'alchemist', secondary: 'fool' },
    { text: 'Договориться говорить по очереди, не перебивая.', type: 'rat', secondary: 'okhtenka' },
  ]},
  { title: 'След на берегу', text: 'На тропе виднеется перо. Рядом растут молодые Огненные Чаши, а впереди сгущается туман.', answers: [
    { text: 'Спрошу у хранительницы берега, как пройти дальше.', type: 'apprentice', secondary: 'merchant' },
    { text: 'Сначала найду путь, на котором не задену ростки.', type: 'cow', secondary: 'rat' },
    { text: 'Проверю фонарь и помогу всем подготовиться к туману.', type: 'mechanic', secondary: 'alchemist' },
    { text: 'Поинтересуюсь, не нужна ли помощь тем, кто живёт у воды.', type: 'okhtenka', secondary: 'iskin' },
    { text: 'Пригляжусь к необычным следам. Может, разгадка совсем рядом.', type: 'fool', secondary: 'pilot' },
  ]},
  { title: 'Чужой багаж', text: 'На станции перепутались бирки. До отправления нужно вернуть вещи владельцам.', answers: [
    { text: 'Составлю список примет и сверю его с записями.', type: 'iskin', secondary: 'cow' },
    { text: 'Соберу команду и распределю поиски по платформе.', type: 'pilot', secondary: 'fool' },
    { text: 'Расспрошу пассажиров, что именно каждый ищет.', type: 'merchant', secondary: 'apprentice' },
    { text: 'Выясню, почему бирки стали нечитаемыми.', type: 'alchemist', secondary: 'mechanic' },
    { text: 'Организую выдачу, чтобы снова ничего не перепутать.', type: 'rat', secondary: 'okhtenka' },
  ]},
  { title: 'Один свободный час', text: 'Общее дело закончено. До следующей встречи есть час. На что его потратите?', answers: [
    { text: 'Попрошу мастера научить меня небольшому приёму.', type: 'apprentice', secondary: 'alchemist' },
    { text: 'Погуляю у реки и спокойно посмотрю по сторонам.', type: 'cow', secondary: 'iskin' },
    { text: 'Закончу маленькую починку, которую давно откладывали.', type: 'mechanic', secondary: 'pilot' },
    { text: 'Зайду к знакомым узнать, как у них дела.', type: 'okhtenka', secondary: 'rat' },
    { text: 'Загляну в незнакомый двор. Вдруг там что-нибудь интересное.', type: 'fool', secondary: 'merchant' },
  ]},
  { title: 'Слова на полях', text: 'В старой книге находится оборванная записка. Почерк кажется знакомым. Что важнее всего?', answers: [
    { text: 'Не спутать догадку с тем, что действительно известно.', type: 'iskin', secondary: 'rat' },
    { text: 'Найти автора и узнать продолжение из первых уст.', type: 'pilot', secondary: 'merchant' },
    { text: 'Понять, кому записка может сейчас пригодиться.', type: 'merchant', secondary: 'mechanic' },
    { text: 'Исследовать бумагу и чернила: они тоже могут рассказать историю.', type: 'alchemist', secondary: 'cow' },
    { text: 'Бережно сохранить находку и спросить разрешения читать дальше.', type: 'rat', secondary: 'apprentice' },
  ]},
  { title: 'Что останется после вас', text: 'Пора отправляться дальше. Какой след вам хотелось бы оставить в КрасноЦарстве?', answers: [
    { text: 'Начатое вместе дело, которое теперь смогут продолжить другие.', type: 'apprentice', secondary: 'pilot' },
    { text: 'Место, где кому-то стало спокойнее и безопаснее.', type: 'cow', secondary: 'okhtenka' },
    { text: 'Полезную вещь, которая снова работает.', type: 'mechanic', secondary: 'alchemist' },
    { text: 'Знакомство людей, которым было нужно встретиться.', type: 'okhtenka', secondary: 'merchant' },
    { text: 'Новую идею, которую захочется испытать вместе.', type: 'fool', secondary: 'iskin' },
  ]},
];
export function scoreAnswers(answers: number[]) {
  const scores = Object.fromEntries(quizTypes.map(type => [type, 0])) as Record<QuizResultType, number>;
  answers.forEach((index, q) => {
    const answer = quizQuestions[q]?.answers[index];
    if (!answer) return;
    scores[answer.type] += 2;
    if (answer.secondary) scores[answer.secondary] += 1;
  });
  const max = Math.max(...Object.values(scores));
  return quizTypes.filter(type => scores[type] === max);
}
