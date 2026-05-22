const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade2.json');

const grade2Data = [
  { unit: 1, title: "At my birthday party", vocab: ["pizza", "popcorn", "pasta", "party"], letter: "P" },
  { unit: 2, title: "In the backyard", vocab: ["kite", "bike", "kitten"], letter: "K" },
  { unit: 3, title: "At the seaside", vocab: ["sail", "sand", "sea"], letter: "S" },
  { unit: 4, title: "In the countryside", vocab: ["rainbow", "river", "road"], letter: "R" },
  { unit: 5, title: "In the classroom", vocab: ["question", "square", "quiz"], letter: "Q" },
  { unit: 6, title: "On the farm", vocab: ["fox", "box", "ox"], letter: "X" },
  { unit: 7, title: "In the kitchen", vocab: ["juice", "jelly", "jam"], letter: "J" },
  { unit: 8, title: "In the village", vocab: ["van", "village", "volleyball"], letter: "V" },
  { unit: 9, title: "In the grocery store", vocab: ["yam", "yogurt", "yoyo"], letter: "Y" },
  { unit: 10, title: "At the zoo", vocab: ["zoo", "zebra", "zebu"], letter: "Z" },
  { unit: 11, title: "In the playground", vocab: ["riding", "playing", "skating"], letter: "ng" },
  { unit: 12, title: "At the cafe", vocab: ["grapes", "cake", "table"], letter: "a_e" },
  { unit: 13, title: "In the maths class", vocab: ["number", "circle", "square"], letter: "math" },
  { unit: 14, title: "At home", vocab: ["brother", "mother", "father"], letter: "th" },
  { unit: 15, title: "In the clothes shop", vocab: ["shirt", "shorts", "shoes"], letter: "sh" },
  { unit: 16, title: "At the campsite", vocab: ["tent", "teapot", "blanket"], letter: "t" }
];

const generateQuiz = (vocab) => {
  return [
    {
      question: `Choose the correct word for the image:`,
      options: [vocab[0], vocab[1] || "apple", vocab[2] || "cat"],
      correctAnswer: vocab[0]
    },
    {
      question: `How do you spell: ${vocab[1] || vocab[0]}?`,
      options: [vocab[1] || vocab[0], (vocab[1] || vocab[0]) + "s", (vocab[1] || vocab[0]).substring(1)],
      correctAnswer: vocab[1] || vocab[0]
    },
    {
      question: `Which word starts with the same sound?`,
      options: [vocab[0], "dog", "elephant"],
      correctAnswer: vocab[0]
    },
    {
      question: `I like eating _______.`,
      options: [vocab[0], "book", "pencil"],
      correctAnswer: vocab[0]
    },
    {
      question: `Translate into Vietnamese: ${vocab[0]}`,
      options: ["Từ vựng đúng", "Con mèo", "Ngôi nhà"],
      correctAnswer: "Từ vựng đúng"
    }
  ];
};

const units = grade2Data.map((data, i) => {
  const number = i + 1;
  return {
    id: `l2-u${number}`,
    number: number,
    title: `Unit ${number}: ${data.title}`,
    status: number === 1 ? "in_progress" : "locked",
    progress: 0,
    grade: "Lớp 2",
    lessons: [
      {
        id: `l2-u${number}-mindmap`,
        title: `Vocabulary Flashcards Unit ${number}`,
        type: "visual",
        completed: false,
        imageUrl: "" // Load carousel từ l2_index.json
      },
      {
        id: `l2-u${number}-speak`,
        title: "Speaking & Pronunciation",
        type: "speaking",
        completed: false,
        expectedText: `I have a ${data.vocab[0]}`
      },
      {
        id: `l2-u${number}-dict`,
        title: "Listening & Dictation",
        type: "dictation",
        completed: false,
        expectedWord: data.vocab[0]
      },
      {
        id: `l2-u${number}-quiz`,
        title: "Vocabulary Quiz",
        type: "quiz",
        completed: false,
        quizQuestions: generateQuiz(data.vocab)
      }
    ]
  };
});

// Thêm Unit chứa sách Mindmap Ebook
units.push({
    id: "l2-mindmap-book",
    number: 17,
    title: "MINDMAP TOÀN TẬP (E-BOOK)",
    status: "in_progress",
    progress: 0,
    grade: "Lớp 2",
    lessons: [
        {
            id: "l2-mindmap-all",
            title: "Sơ Đồ Tư Duy Tiếng Anh 2",
            type: "worksheet",
            completed: false,
            worksheetUrl: "/worksheets/l2/mindmap.pdf"
        }
    ]
});

fs.writeFileSync(SEED_PATH, JSON.stringify(units, null, 2));
console.log("Đã cập nhật grade2.json với Nội dung thực tế AI-generated!");
