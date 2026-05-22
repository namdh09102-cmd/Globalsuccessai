const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');
const gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

// Dựa vào file test mẫu, tạo mảng questions
const examQuestions = [
  // Listening
  { id: "e1-l1", section: "Listening", text: "Listen and choose: A. Truck / B. Teddy bear", options: ["A. Truck", "B. Teddy bear"], correctAnswer: "A" },
  { id: "e1-l2", section: "Listening", text: "Listen and choose the letter", options: ["A. w", "B. o", "C. u", "D. v"], correctAnswer: "A" },
  { id: "e1-l3", section: "Listening", text: "Listen and match: What is it?", options: ["A. Tiger", "B. Noodles", "C. Monkey", "D. Bear"], correctAnswer: "B" },
  { id: "e1-l4", section: "Listening", text: "Listen and tick (True) or cross (False): The lake is big.", options: ["A. True", "B. False"], correctAnswer: "A" },

  // Reading
  { id: "e1-r1", section: "Reading", text: "Read and match: It's a monkey.", options: ["A. Image of Monkey", "B. Image of Foot", "C. Image of Hand"], correctAnswer: "A" },
  { id: "e1-r2", section: "Reading", text: "Read and circle: I like bananas.", options: ["A. Bananas", "B. Apples", "C. Nick", "D. Jack"], correctAnswer: "A" },
  { id: "e1-r3", section: "Reading", text: "Read and match: Point to your foot.", options: ["A. Pointing foot", "B. Pointing hand", "C. It's a mouse"], correctAnswer: "A" },

  // Writing
  { id: "e1-w1", section: "Writing", text: "Look and write the missing letter: f_otball", options: ["A. o", "B. a", "C. i", "D. e"], correctAnswer: "A" },
  { id: "e1-w2", section: "Writing", text: "Reorder the letters: w - i - d - o - n - w", options: ["A. window", "B. widnow", "C. downiw", "D. winwod"], correctAnswer: "A" },
  { id: "e1-w3", section: "Writing", text: "Reorder the letters: r - a - f - e - t - h", options: ["A. father", "B. faterh", "C. ftaher", "D. rafter"], correctAnswer: "A" },
];

const examUnit = {
  id: "l1-exam-final",
  number: 17,
  title: "ĐỀ THI HỌC KỲ 2 (2020-2021)",
  status: "locked",
  progress: 0,
  grade: "Lớp 1",
  lessons: [
    {
      id: "l1-exam-final-test",
      title: "The Final Term Test - Đề số 1",
      type: "exam",
      completed: false,
      examDuration: 35,
      examAudio: "/audio/l1/exam/test1.mp3",
      examQuestions: examQuestions
    }
  ]
};

// Xóa đề thi cũ nếu có
const filteredData = gradeData.filter(u => u.id !== "l1-exam-final");
filteredData.push(examUnit);

fs.writeFileSync(SEED_PATH, JSON.stringify(filteredData, null, 2));
console.log("Đã bổ sung Đề Thi Học Kỳ vào seed data.");
