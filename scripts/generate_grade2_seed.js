const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade2.json');

const units = [];
for (let i = 1; i <= 16; i++) {
    units.push({
        id: `l2-u${i}`,
        number: i,
        title: `Unit ${i}`,
        status: i === 1 ? "in_progress" : "locked",
        progress: 0,
        grade: "Lớp 2",
        lessons: [
            {
                id: `l2-u${i}-mindmap`,
                title: `Vocabulary Flashcards Unit ${i}`,
                type: "visual",
                completed: false,
                imageUrl: "" // Chỉ dùng để load flashcard carousel
            },
            {
                id: `l2-u${i}-speak`,
                title: "Speaking & Pronunciation",
                type: "speaking",
                completed: false,
                expectedText: "Hello"
            },
            {
                id: `l2-u${i}-dict`,
                title: "Listening & Dictation",
                type: "dictation",
                completed: false,
                expectedWord: "apple"
            },
            {
                id: `l2-u${i}-quiz`,
                title: "Quiz",
                type: "quiz",
                completed: false,
                quizQuestions: [
                    {
                        question: "What is this?",
                        options: ["apple", "banana", "cat"],
                        correctAnswer: "apple"
                    }
                ]
            }
        ]
    });
}

// Thêm Unit chứa sách Mindmap
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
console.log("Đã cập nhật grade2.json với Flashcard và Mindmap E-Book!");
