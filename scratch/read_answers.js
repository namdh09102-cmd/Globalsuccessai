const fs = require('fs');
const pdf = require('pdf-parse');

async function readAnswers() {
  const p1 = "D:\\tài liệu tiếng anh\\lớp 1\\FULL TEST GLOBAL 1\\BỘ ĐỀ TEST GLOBAL 1\\answerkeys.pdf";
  const p2 = "D:\\tài liệu tiếng anh\\lớp 1\\FULL TEST GLOBAL 1\\BỘ ĐỀ TEST GLOBAL 1\\answerkeys2.pdf";
  
  if (fs.existsSync(p1)) {
    const data = await pdf(fs.readFileSync(p1));
    console.log("=== ANSWER KEYS 1 ===");
    console.log(data.text.substring(0, 1000));
  }
  
  if (fs.existsSync(p2)) {
    const data2 = await pdf(fs.readFileSync(p2));
    console.log("=== ANSWER KEYS 2 ===");
    console.log(data2.text.substring(0, 1000));
  }
}

readAnswers();
