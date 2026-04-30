// Top 100 most common Mandarin Chinese characters
// Based on frequency data from modern Chinese text corpora
export const characters = [
  { id: 1, character: '的', pinyin: 'de', tone: 'neutral', meaning: 'possessive particle; structural particle' },
  { id: 2, character: '一', pinyin: 'yī', tone: '1', meaning: 'one; a; an', aliases: ['1'] },
  { id: 3, character: '是', pinyin: 'shì', tone: '4', meaning: 'to be; is; are; yes' },
  { id: 4, character: '不', pinyin: 'bù', tone: '4', meaning: 'not; no; negative prefix' },
  { id: 5, character: '了', pinyin: 'le', tone: 'neutral', meaning: 'completed action particle; change of state particle' },
  { id: 6, character: '人', pinyin: 'rén', tone: '2', meaning: 'person; people; human' },
  { id: 7, character: '我', pinyin: 'wǒ', tone: '3', meaning: 'I; me; my' },
  { id: 8, character: '在', pinyin: 'zài', tone: '4', meaning: 'at; in; on; to be present' },
  { id: 9, character: '有', pinyin: 'yǒu', tone: '3', meaning: 'to have; there is; there are' },
  { id: 10, character: '他', pinyin: 'tā', tone: '1', meaning: 'he; him' },
  { id: 11, character: '这', pinyin: 'zhè', tone: '4', meaning: 'this; these' },
  { id: 12, character: '中', pinyin: 'zhōng', tone: '1', meaning: 'middle; center; China; in the process of' },
  { id: 13, character: '大', pinyin: 'dà', tone: '4', meaning: 'big; large; great' },
  { id: 14, character: '来', pinyin: 'lái', tone: '2', meaning: 'to come; to arrive' },
  { id: 15, character: '上', pinyin: 'shàng', tone: '4', meaning: 'above; on; up; to go up' },
  { id: 16, character: '国', pinyin: 'guó', tone: '2', meaning: 'country; nation; state' },
  { id: 17, character: '个', pinyin: 'gè', tone: '4', meaning: 'general measure word; individual' },
  { id: 18, character: '到', pinyin: 'dào', tone: '4', meaning: 'to arrive; to reach; until' },
  { id: 19, character: '说', pinyin: 'shuō', tone: '1', meaning: 'to say; to speak; to talk' },
  { id: 20, character: '们', pinyin: 'men', tone: 'neutral', meaning: 'plural suffix for pronouns/people' },
  { id: 21, character: '为', pinyin: 'wèi', tone: '4', meaning: 'for; because of; to act as' },
  { id: 22, character: '子', pinyin: 'zǐ', tone: '3', meaning: 'child; son; small thing; noun suffix' },
  { id: 23, character: '和', pinyin: 'hé', tone: '2', meaning: 'and; together with; peace; harmony' },
  { id: 24, character: '你', pinyin: 'nǐ', tone: '3', meaning: 'you (singular)' },
  { id: 25, character: '地', pinyin: 'de', tone: 'neutral', meaning: 'adverbial particle; earth; ground; land' },
  { id: 26, character: '出', pinyin: 'chū', tone: '1', meaning: 'to go out; to exit; to produce' },
  { id: 27, character: '道', pinyin: 'dào', tone: '4', meaning: 'road; way; path; doctrine; to say' },
  { id: 28, character: '也', pinyin: 'yě', tone: '3', meaning: 'also; too; as well' },
  { id: 29, character: '时', pinyin: 'shí', tone: '2', meaning: 'time; hour; season; when' },
  { id: 30, character: '年', pinyin: 'nián', tone: '2', meaning: 'year' },
  { id: 31, character: '得', pinyin: 'de', tone: 'neutral', meaning: 'complement particle; to obtain; to get' },
  { id: 32, character: '那', pinyin: 'nà', tone: '4', meaning: 'that; those' },
  { id: 33, character: '要', pinyin: 'yào', tone: '4', meaning: 'to want; to need; important; will' },
  { id: 34, character: '下', pinyin: 'xià', tone: '4', meaning: 'below; under; down; to go down' },
  { id: 35, character: '以', pinyin: 'yǐ', tone: '3', meaning: 'by means of; with; according to' },
  { id: 36, character: '生', pinyin: 'shēng', tone: '1', meaning: 'life; to be born; to grow; raw' },
  { id: 37, character: '会', pinyin: 'huì', tone: '4', meaning: 'can; to be able to; meeting; will' },
  { id: 38, character: '自', pinyin: 'zì', tone: '4', meaning: 'self; from; since' },
  { id: 39, character: '着', pinyin: 'zhe', tone: 'neutral', meaning: 'ongoing action particle; wearing; touching' },
  { id: 40, character: '去', pinyin: 'qù', tone: '4', meaning: 'to go; to leave; past' },
  { id: 41, character: '之', pinyin: 'zhī', tone: '1', meaning: "possessive particle (literary); it; this" },
  { id: 42, character: '过', pinyin: 'guò', tone: '4', meaning: 'to pass; through; past; experienced action particle' },
  { id: 43, character: '家', pinyin: 'jiā', tone: '1', meaning: 'home; family; house; expert' },
  { id: 44, character: '学', pinyin: 'xué', tone: '2', meaning: 'to study; to learn; school' },
  { id: 45, character: '对', pinyin: 'duì', tone: '4', meaning: 'correct; right; facing; toward; pair' },
  { id: 46, character: '可', pinyin: 'kě', tone: '3', meaning: 'can; may; but; however' },
  { id: 47, character: '她', pinyin: 'tā', tone: '1', meaning: 'she; her' },
  { id: 48, character: '里', pinyin: 'lǐ', tone: '3', meaning: 'inside; within; li (unit of distance)' },
  { id: 49, character: '后', pinyin: 'hòu', tone: '4', meaning: 'behind; after; later; back' },
  { id: 50, character: '小', pinyin: 'xiǎo', tone: '3', meaning: 'small; little; young' },
  { id: 51, character: '么', pinyin: 'me', tone: 'neutral', meaning: 'interrogative/emphatic suffix; what' },
  { id: 52, character: '心', pinyin: 'xīn', tone: '1', meaning: 'heart; mind; center' },
  { id: 53, character: '多', pinyin: 'duō', tone: '1', meaning: 'many; much; more; how much' },
  { id: 54, character: '天', pinyin: 'tiān', tone: '1', meaning: 'sky; heaven; day' },
  { id: 55, character: '而', pinyin: 'ér', tone: '2', meaning: 'and yet; but; however; (literary conjunction)' },
  { id: 56, character: '能', pinyin: 'néng', tone: '2', meaning: 'can; to be able; ability; energy' },
  { id: 57, character: '好', pinyin: 'hǎo', tone: '3', meaning: 'good; well; fine; nice' },
  { id: 58, character: '都', pinyin: 'dōu', tone: '1', meaning: 'all; both; even; already' },
  { id: 59, character: '然', pinyin: 'rán', tone: '2', meaning: 'so; thus; correct; like this' },
  { id: 60, character: '没', pinyin: 'méi', tone: '2', meaning: 'not; have not; without' },
  { id: 61, character: '日', pinyin: 'rì', tone: '4', meaning: 'sun; day; date; Japan' },
  { id: 62, character: '于', pinyin: 'yú', tone: '2', meaning: 'at; in; on; than; (literary preposition)' },
  { id: 63, character: '起', pinyin: 'qǐ', tone: '3', meaning: 'to rise; to get up; since; from' },
  { id: 64, character: '还', pinyin: 'hái', tone: '2', meaning: 'still; yet; also; even more' },
  { id: 65, character: '发', pinyin: 'fā', tone: '1', meaning: 'to send out; to issue; to develop; hair' },
  { id: 66, character: '成', pinyin: 'chéng', tone: '2', meaning: 'to become; to succeed; completed; one-tenth' },
  { id: 67, character: '事', pinyin: 'shì', tone: '4', meaning: 'matter; affair; event; thing; accident' },
  { id: 68, character: '只', pinyin: 'zhǐ', tone: '3', meaning: 'only; just; merely; measure word for one of a pair' },
  { id: 69, character: '作', pinyin: 'zuò', tone: '4', meaning: 'to do; to make; to write; to act as' },
  { id: 70, character: '当', pinyin: 'dāng', tone: '1', meaning: 'to serve as; to be; when; ought to' },
  { id: 71, character: '想', pinyin: 'xiǎng', tone: '3', meaning: 'to think; to want; to miss; to suppose' },
  { id: 72, character: '看', pinyin: 'kàn', tone: '4', meaning: 'to look; to watch; to read; to see' },
  { id: 73, character: '文', pinyin: 'wén', tone: '2', meaning: 'writing; language; culture; literary' },
  { id: 74, character: '无', pinyin: 'wú', tone: '2', meaning: 'without; nothing; no; not having' },
  { id: 75, character: '开', pinyin: 'kāi', tone: '1', meaning: 'to open; to start; to drive; to boil' },
  { id: 76, character: '手', pinyin: 'shǒu', tone: '3', meaning: 'hand; expert; skill' },
  { id: 77, character: '十', pinyin: 'shí', tone: '2', meaning: 'ten; tenth', aliases: ['10'] },
  { id: 78, character: '用', pinyin: 'yòng', tone: '4', meaning: 'to use; with; by means of; expense' },
  { id: 79, character: '主', pinyin: 'zhǔ', tone: '3', meaning: 'master; host; main; to hold; God' },
  { id: 80, character: '行', pinyin: 'xíng', tone: '2', meaning: 'to walk; to travel; okay; capable; profession; row' },
  { id: 81, character: '方', pinyin: 'fāng', tone: '1', meaning: 'square; direction; method; place; just' },
  { id: 82, character: '又', pinyin: 'yòu', tone: '4', meaning: 'again; also; both ... and ...' },
  { id: 83, character: '如', pinyin: 'rú', tone: '2', meaning: 'if; as if; like; as; such as' },
  { id: 84, character: '前', pinyin: 'qián', tone: '2', meaning: 'front; before; forward; previous' },
  { id: 85, character: '所', pinyin: 'suǒ', tone: '3', meaning: 'place; that which; a measure of buildings; so' },
  { id: 86, character: '本', pinyin: 'běn', tone: '3', meaning: 'root; basis; origin; this; measure for books' },
  { id: 87, character: '见', pinyin: 'jiàn', tone: '4', meaning: 'to see; to meet; to appear; view' },
  { id: 88, character: '经', pinyin: 'jīng', tone: '1', meaning: 'to pass through; classic; scripture; longitude; menstruation' },
  { id: 89, character: '头', pinyin: 'tóu', tone: '2', meaning: 'head; top; first; noun suffix' },
  { id: 90, character: '面', pinyin: 'miàn', tone: '4', meaning: 'face; surface; side; aspect; noodles' },
  { id: 91, character: '公', pinyin: 'gōng', tone: '1', meaning: 'public; fair; male; duke; grandfather' },
  { id: 92, character: '同', pinyin: 'tóng', tone: '2', meaning: 'same; together; alike; with' },
  { id: 93, character: '三', pinyin: 'sān', tone: '1', meaning: 'three', aliases: ['3'] },
  { id: 94, character: '已', pinyin: 'yǐ', tone: '3', meaning: 'already; to stop; too; extremely' },
  { id: 95, character: '老', pinyin: 'lǎo', tone: '3', meaning: 'old; aged; experienced; very; always' },
  { id: 96, character: '从', pinyin: 'cóng', tone: '2', meaning: 'from; since; to follow; through' },
  { id: 97, character: '动', pinyin: 'dòng', tone: '4', meaning: 'to move; to act; movement; emotion' },
  { id: 98, character: '两', pinyin: 'liǎng', tone: '3', meaning: 'two (of a kind); both; a few; liang (unit)' },
  { id: 99, character: '长', pinyin: 'cháng', tone: '2', meaning: 'long; length; to excel in; chief' },
  { id: 100, character: '知', pinyin: 'zhī', tone: '1', meaning: 'to know; to be aware of; knowledge' },
];

export const getToneColor = (tone) => {
  switch (tone) {
    case '1': return '#E74C3C'; // first tone - red
    case '2': return '#27AE60'; // second tone - green
    case '3': return '#2980B9'; // third tone - blue
    case '4': return '#8E44AD'; // fourth tone - purple
    default: return '#7F8C8D'; // neutral tone - gray
  }
};

export const getToneName = (tone) => {
  switch (tone) {
    case '1': return '1st tone (flat)';
    case '2': return '2nd tone (rising)';
    case '3': return '3rd tone (dip)';
    case '4': return '4th tone (falling)';
    default: return 'Neutral tone';
  }
};
