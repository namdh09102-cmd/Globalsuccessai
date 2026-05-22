const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');
let gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

// Xóa toàn bộ lesson có type="worksheet"
gradeData = gradeData.map(unit => {
    unit.lessons = unit.lessons.filter(l => l.type !== "worksheet");
    return unit;
});

// Xóa luôn Unit 18 (BÀI TẬP CUỐI TUẦN E-BOOK) nếu nó rỗng hoặc id là "l1-weekend-hw"
gradeData = gradeData.filter(unit => unit.id !== "l1-weekend-hw");

// Ghi lại file
fs.writeFileSync(SEED_PATH, JSON.stringify(gradeData, null, 2));
console.log("Đã gỡ bỏ toàn bộ tài liệu Worksheet/HTML/PDF không tương tác khỏi Lớp 1!");
