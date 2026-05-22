const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade3.json');

const units = [];
for (let i = 1; i <= 20; i++) {
    units.push({
        id: `l3-u${i}`,
        number: i,
        title: `Unit ${i}`,
        status: i === 1 ? "in_progress" : "locked",
        progress: 0,
        grade: "Lớp 3",
        lessons: [
            {
                id: `l3-u${i}-quiz`,
                title: `Multiple Choice Quiz (Unit ${i})`,
                type: "quiz",
                completed: false,
                quizQuestions: [] // Sẽ được nạp tự động từ tool parse Word
            }
        ]
    });
}

fs.writeFileSync(SEED_PATH, JSON.stringify(units, null, 2));
console.log("Đã tạo grade3.json skeleton thành công!");
