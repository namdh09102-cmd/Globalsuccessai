const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

const grade1Dict = [
  { unit: 1, letter: 'b', words: ['ball', 'bike', 'book', 'boy', 'bill'] },
  { unit: 2, letter: 'c', words: ['cake', 'car', 'cup', 'cat', 'cow'] },
  { unit: 3, letter: 'a', words: ['apple', 'ant', 'axe', 'arm', 'animal'] },
  { unit: 4, letter: 'd', words: ['dog', 'duck', 'desk', 'door', 'doll'] },
  { unit: 5, letter: 'e', words: ['elephant', 'egg', 'eraser', 'eye', 'ear'] },
  { unit: 6, letter: 'f', words: ['father', 'fan', 'face', 'fish', 'foot'] },
  { unit: 7, letter: 'g', words: ['goat', 'girl', 'gate', 'game', 'guitar'] },
  { unit: 8, letter: 'h', words: ['hair', 'hand', 'horse', 'hat', 'house'] },
  { unit: 9, letter: 'i', words: ['ink', 'insect', 'igloo', 'iguana', 'island'] },
  { unit: 10, letter: 'j', words: ['jam', 'juice', 'jelly', 'jacket', 'jump'] },
  { unit: 11, letter: 'k', words: ['kite', 'kitten', 'kangaroo', 'key', 'king'] },
  { unit: 12, letter: 'l', words: ['lake', 'leaf', 'lemon', 'lion', 'lamp'] },
  { unit: 13, letter: 'm', words: ['milk', 'mother', 'mouse', 'monkey', 'moon'] },
  { unit: 14, letter: 'n', words: ['nut', 'nose', 'nine', 'nest', 'net'] },
  { unit: 15, letter: 'o', words: ['ox', 'orange', 'ostrich', 'octopus', 'onion'] },
  { unit: 16, letter: 'p', words: ['pen', 'pig', 'pencil', 'pizza', 'pink'] }
];

function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getWrongWords(correctWord, currentUnit, count = 3) {
  let allOtherWords = [];
  grade1Dict.forEach(dict => {
    if (dict.unit !== currentUnit) {
      allOtherWords = allOtherWords.concat(dict.words);
    }
  });
  let shuffled = shuffleArray(allOtherWords);
  return shuffled.slice(0, count);
}

function generateUnitQuestions(dict, count = 15) {
  let questions = [];
  for (let i = 0; i < count; i++) {
    const word = dict.words[i % dict.words.length];
    const wrongWords = getWrongWords(word, dict.unit);
    const qType = i % 4;
    let questionText = "";
    let correctAns = "";
    let options = [];
    
    if (qType === 0) {
      questionText = `What is this? It's a/an _______.`;
      correctAns = word;
      options = shuffleArray([word, ...wrongWords]);
    } else if (qType === 1) {
      questionText = `Choose the correct spelling:`;
      correctAns = word;
      let wrongSpelling1 = word.split('').reverse().join('');
      let wrongSpelling2 = word.substring(1) + word[0];
      let wrongSpelling3 = word[0] + word[0] + word.substring(1);
      if (wrongSpelling1 === word) wrongSpelling1 = word + 's';
      options = shuffleArray([word, wrongSpelling1, wrongSpelling2, wrongSpelling3]);
    } else if (qType === 2) {
      questionText = `Which word starts with the letter "${dict.letter.toUpperCase()}"?`;
      correctAns = word;
      options = shuffleArray([word, ...wrongWords]);
    } else {
      questionText = `Is this a ${word}?`;
      correctAns = "Yes, it is.";
      options = shuffleArray(["Yes, it is.", "No, it isn't.", "Yes, I do.", "No, I don't."]);
    }
    
    const optionLabels = ["A. ", "B. ", "C. ", "D. "];
    const formattedOptions = options.map((opt, index) => optionLabels[index] + opt);
    const correctIndex = options.indexOf(correctAns);
    const correctLabel = String.fromCharCode(65 + correctIndex);
    
    questions.push({
      question: questionText,
      options: formattedOptions,
      correctAnswer: correctLabel
    });
  }
  return questions;
}

function processExpansion() {
  if (!fs.existsSync(seedPath)) return;
  let gradeData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

  gradeData.forEach(unit => {
    const dict = grade1Dict.find(d => d.unit === unit.number);
    if (!dict) return;

    // Giữ lại Visual lesson
    const visualLesson = unit.lessons.find(l => l.type === "visual") || {
      id: `l1_u${unit.number}_visual`,
      title: `Mindmap - ${unit.title}`,
      type: "visual",
      imageUrl: "/images/placeholders/mindmap.jpg"
    };

    let newLessons = [];
    
    // 1. Gắn Visual vào vị trí đầu
    newLessons.push(visualLesson);

    // 2. Tạo 5 bài Speaking
    dict.words.forEach((word, index) => {
      newLessons.push({
        id: `l1_u${unit.number}_speak_${index}`,
        title: `Speaking: ${word.charAt(0).toUpperCase() + word.slice(1)}`,
        type: "speaking",
        expectedText: `It is a ${word}.`
      });
    });

    // 3. Tạo 5 bài Dictation (Nghe chép)
    // Cố tình tạo câu trống với ngoặc vuông để DictationRoom TTS đọc và bắt học viên điền
    dict.words.forEach((word, index) => {
      newLessons.push({
        id: `l1_u${unit.number}_dict_${index}`,
        title: `Dictation: Word ${index + 1}`,
        type: "dictation",
        expectedText: `I have a [${word}].` // TTS sẽ đọc mượt phần này
      });
    });

    // 4. Bài Quiz & Test (15 câu)
    const questions = generateUnitQuestions(dict, 15);
    newLessons.push({
      id: `l1_u${unit.number}_test`,
      title: `Quiz & Unit Test (15 Questions)`,
      type: "quiz",
      quizQuestions: questions
    });

    unit.lessons = newLessons;
  });

  fs.writeFileSync(seedPath, JSON.stringify(gradeData, null, 2));
  console.log(`[Thành công] Đã bành trướng nội dung: 12 lessons / unit!`);
}

processExpansion();
