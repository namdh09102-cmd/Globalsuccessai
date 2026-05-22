const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');
const gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

// Tìm unit "Bài Tập Cuối Tuần" hoặc tạo mới
let hwUnit = gradeData.find(u => u.id === "l1-weekend-hw");
if (!hwUnit) {
    hwUnit = {
        id: "l1-weekend-hw",
        number: 18,
        title: "BÀI TẬP CUỐI TUẦN (E-BOOK)",
        status: "in_progress",
        progress: 0,
        grade: "Lớp 1",
        lessons: [
            {
                id: "l1-hw-all",
                title: "Phiếu Bài Tập Cuối Tuần (Cả năm)",
                type: "worksheet",
                completed: false,
                worksheetUrl: "/worksheets/l1/baitap_cuoituan.pdf"
            }
        ]
    };
    gradeData.push(hwUnit);
}

fs.writeFileSync(SEED_PATH, JSON.stringify(gradeData, null, 2));
console.log("Đã bổ sung Bài Tập Cuối Tuần vào grade1.json!");
