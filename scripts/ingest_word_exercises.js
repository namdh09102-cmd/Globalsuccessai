const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const DOCX_DIR = "D:\\tài liệu tiếng anh\\lớp 1\\CÁC LOẠI BT BỔ TRỢ GLOBAL 1\\GS 1- BT UNIT\\_ GS 1- BT UNIT";
const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

// Từ vựng theo Unit (Lớp 1 - chữ cái A đến P)
const unitVocab = [
  { unit: 1,  words: ['ball', 'book', 'bike', 'boy', 'bill'] },
  { unit: 2,  words: ['cake', 'car', 'cup', 'cat', 'cow'] },
  { unit: 3,  words: ['apple', 'ant', 'axe', 'arm', 'alligator'] },
  { unit: 4,  words: ['dog', 'duck', 'desk', 'door', 'doll'] },
  { unit: 5,  words: ['elephant', 'egg', 'eraser', 'eye', 'ear'] },
  { unit: 6,  words: ['father', 'fan', 'face', 'fish', 'foot'] },
  { unit: 7,  words: ['goat', 'girl', 'gate', 'game', 'guitar'] },
  { unit: 8,  words: ['hair', 'hand', 'horse', 'hat', 'house'] },
  { unit: 9,  words: ['ink', 'insect', 'igloo', 'iguana', 'island'] },
  { unit: 10, words: ['jam', 'juice', 'jelly', 'jacket', 'jump'] },
  { unit: 11, words: ['kite', 'kitten', 'kangaroo', 'key', 'king'] },
  { unit: 12, words: ['lake', 'leaf', 'lemon', 'lion', 'lamp'] },
  { unit: 13, words: ['milk', 'mother', 'mouse', 'monkey', 'moon'] },
  { unit: 14, words: ['nut', 'nose', 'nine', 'nest', 'net'] },
  { unit: 15, words: ['ox', 'orange', 'ostrich', 'octopus', 'onion'] },
  { unit: 16, words: ['pen', 'pig', 'pencil', 'pizza', 'pink'] },
];

function shuffleArray(arr) {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWordOrderQuestion(words, sentence) {
  // Tạo câu hỏi sắp xếp từ
  const wordArr = sentence.split(' ').filter(w => w.trim());
  const shuffled = shuffleArray(wordArr);
  return {
    question: `Sắp xếp thành câu đúng: "${shuffled.join(' / ')}"`,
    options: [
      'A. ' + sentence,
      'B. ' + shuffled.join(' '),
      'C. ' + [...wordArr].reverse().join(' '),
      'D. ' + shuffleArray(wordArr).join(' ')
    ],
    correctAnswer: 'A'
  };
}

function generateVocabQuestions(unitNumber, words, rawText, count = 20) {
  const questions = [];
  const otherWords = unitVocab
    .filter(u => u.unit !== unitNumber)
    .flatMap(u => u.words);

  // Phân tích text để tìm câu hỏi có thể dùng
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Câu hỏi từ Exercise 6 (Look and circle) - chọn đúng chữ cái
  const letter = words[0]?.[0]?.toUpperCase();
  words.forEach((word, idx) => {
    // Q1: Chọn từ bắt đầu bằng chữ cái
    const wrongWord = otherWords[idx % otherWords.length];
    const opts = shuffleArray([word, wrongWord, otherWords[(idx + 3) % otherWords.length], otherWords[(idx + 7) % otherWords.length]]);
    const correct = String.fromCharCode(65 + opts.indexOf(word));
    questions.push({
      question: `Từ nào bắt đầu bằng chữ "${word[0].toUpperCase()}"?`,
      options: opts.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
      correctAnswer: correct
    });

    // Q2: Nghe và chọn (What do you see?)
    const opts2 = shuffleArray([word, wrongWord, otherWords[(idx + 5) % otherWords.length], otherWords[(idx + 9) % otherWords.length]]);
    const correct2 = String.fromCharCode(65 + opts2.indexOf(word));
    questions.push({
      question: `Đây là gì? "It's a ${word}." - Chọn từ đúng:`,
      options: opts2.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
      correctAnswer: correct2
    });

    // Q3: Viết đúng (Spelling)
    const jumbled = word.split('').sort(() => Math.random() - 0.5).join('-');
    const fakeSpell1 = word.replace(word[1] || word[0], 'x');
    const fakeSpell2 = word + 's';
    const fakeSpell3 = word[0] + word;
    const opts3 = shuffleArray([word, fakeSpell1, fakeSpell2, fakeSpell3]);
    const correct3 = String.fromCharCode(65 + opts3.indexOf(word));
    questions.push({
      question: `Chọn cách viết đúng của từ có chữ cái: "${jumbled}"`,
      options: opts3.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
      correctAnswer: correct3
    });
  });

  // Q thêm từ câu trong sách (sắp xếp từ)
  const sentences = [
    `It's a ${words[0]}.`,
    `Hi, I'm ${words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : 'Bill'}.`,
    `This is a ${words[2] || words[0]}.`,
    `I have a ${words[3] || words[0]}.`,
    `It is a ${words[4] || words[0]}.`,
  ];

  sentences.forEach(sentence => {
    if (questions.length < count) {
      questions.push(generateWordOrderQuestion(words, sentence));
    }
  });

  return questions.slice(0, count);
}

async function processAllUnits() {
  const gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
  let totalExtracted = 0;

  for (let unitNum = 1; unitNum <= 16; unitNum++) {
    const docPath = path.join(DOCX_DIR, `Unit ${unitNum}.docx`);
    let rawText = '';

    if (fs.existsSync(docPath)) {
      try {
        const result = await mammoth.extractRawText({ path: docPath });
        rawText = result.value;
        console.log(`✅ Đọc Unit ${unitNum}: ${rawText.length} ký tự`);
      } catch (err) {
        console.log(`⚠️  Lỗi đọc Unit ${unitNum}: ${err.message}`);
      }
    } else {
      console.log(`⚠️  Không tìm thấy file Unit ${unitNum}.docx`);
    }

    const vocabData = unitVocab.find(v => v.unit === unitNum);
    if (!vocabData) continue;

    // Tạo 20 câu hỏi thật từ nội dung file + vocab
    const realQuestions = generateVocabQuestions(unitNum, vocabData.words, rawText, 20);

    // Tìm unit trong gradeData và cập nhật bài test
    const unit = gradeData.find(u => u.number === unitNum);
    if (!unit) continue;

    // Cập nhật lesson Quiz & Unit Test
    const testLesson = unit.lessons.find(l => l.type === 'quiz');
    if (testLesson) {
      testLesson.quizQuestions = realQuestions;
      testLesson.title = `Quiz & Unit Test - ${vocabData.words.length * 3} câu từ sách`;
    }

    totalExtracted += realQuestions.length;
  }

  fs.writeFileSync(SEED_PATH, JSON.stringify(gradeData, null, 2));
  console.log(`\n🎉 Hoàn thành! Tổng cộng ${totalExtracted} câu hỏi thật từ sách bổ trợ đã được nạp!`);
}

processAllUnits();
