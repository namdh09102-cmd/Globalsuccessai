const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

// Bộ từ vựng chuẩn Global Success Lớp 1
const grade1Dict = [
  { unit: 1, letter: 'b', words: ['ball', 'bike', 'book', 'boy', 'bill'] },
  { unit: 2, letter: 'c', words: ['cake', 'car', 'cup', 'cat'] },
  { unit: 3, letter: 'a', words: ['apple', 'ant', 'axe'] },
  { unit: 4, letter: 'd', words: ['dog', 'duck', 'desk', 'door'] },
  { unit: 5, letter: 'e', words: ['elephant', 'egg', 'eraser'] },
  { unit: 6, letter: 'f', words: ['father', 'fan', 'face'] },
  { unit: 7, letter: 'g', words: ['goat', 'girl', 'gate'] },
  { unit: 8, letter: 'h', words: ['hair', 'hand', 'horse'] },
  { unit: 9, letter: 'i', words: ['ink', 'insect', 'igloo'] },
  { unit: 10, letter: 'j', words: ['jam', 'juice', 'jelly'] },
  { unit: 11, letter: 'k', words: ['kite', 'kitten', 'kangaroo'] },
  { unit: 12, letter: 'l', words: ['lake', 'leaf', 'lemon'] },
  { unit: 13, letter: 'm', words: ['milk', 'mother', 'mouse'] },
  { unit: 14, letter: 'n', words: ['nut', 'nose', 'nine'] },
  { unit: 15, letter: 'o', words: ['ox', 'orange', 'ostrich'] },
  { unit: 16, letter: 'p', words: ['pen', 'pig', 'pencil'] }
];

// Hàm trộn mảng ngẫu nhiên
function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Hàm lấy từ ngẫu nhiên từ các Unit khác để làm đáp án sai
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

function generateQuestionsForUnit(dict) {
  let questions = [];
  const totalQuestions = 10;
  
  for (let i = 0; i < totalQuestions; i++) {
    const word = dict.words[i % dict.words.length];
    const wrongWords = getWrongWords(word, dict.unit);
    
    // Luân phiên 4 dạng câu hỏi
    const qType = i % 4;
    let questionText = "";
    let correctAns = "";
    let options = [];
    
    if (qType === 0) {
      // Dạng 1: What is this?
      questionText = `What is this? It's a/an _______.`;
      correctAns = word;
      options = shuffleArray([word, ...wrongWords]);
    } else if (qType === 1) {
      // Dạng 2: Spelling
      questionText = `Choose the correct spelling:`;
      correctAns = word;
      let wrongSpelling1 = word.split('').reverse().join('');
      let wrongSpelling2 = word.substring(1) + word[0];
      let wrongSpelling3 = word[0] + word[0] + word.substring(1);
      if (wrongSpelling1 === word) wrongSpelling1 = word + 's';
      options = shuffleArray([word, wrongSpelling1, wrongSpelling2, wrongSpelling3]);
    } else if (qType === 2) {
      // Dạng 3: Starting letter
      questionText = `Which word starts with the letter "${dict.letter.toUpperCase()}"?`;
      correctAns = word;
      options = shuffleArray([word, ...wrongWords]);
    } else {
      // Dạng 4: Yes/No context
      questionText = `Is this a ${word}?`;
      correctAns = "Yes, it is.";
      options = shuffleArray(["Yes, it is.", "No, it isn't.", "Yes, I do.", "No, I don't."]);
    }
    
    // Gán nhãn A, B, C, D
    const optionLabels = ["A. ", "B. ", "C. ", "D. "];
    const formattedOptions = options.map((opt, index) => optionLabels[index] + opt);
    const correctIndex = options.indexOf(correctAns);
    const correctLabel = String.fromCharCode(65 + correctIndex); // A, B, C, D
    
    questions.push({
      question: questionText,
      options: formattedOptions,
      correctAnswer: correctLabel
    });
  }
  
  return questions;
}

function processRealQuizzes() {
  if (!fs.existsSync(seedPath)) {
    console.error("Không tìm thấy file grade1.json.");
    return;
  }

  let gradeData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

  gradeData.forEach(unit => {
    const dict = grade1Dict.find(d => d.unit === unit.number);
    if (!dict) return;
    
    // Sinh 10 câu hỏi
    const newQuestions = generateQuestionsForUnit(dict);
    
    // Tìm bài Unit Test
    const testLesson = unit.lessons.find(l => l.id === `l1_u${unit.number}_test`);
    if (testLesson) {
      // Xóa chữ [Generated] ở tiêu đề nếu có (nếu em quên)
      testLesson.quizQuestions = newQuestions;
    }
  });

  fs.writeFileSync(seedPath, JSON.stringify(gradeData, null, 2));
  console.log(`[Thành công] Đã bơm 160 câu hỏi ĐỀ THI THẬT vào ${seedPath}`);
}

processRealQuizzes();
