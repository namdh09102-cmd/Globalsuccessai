const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const TESTS_DIR = "D:\\tài liệu tiếng anh\\lớp 1\\FULL TEST GLOBAL 1";
const OUT_HTML_DIR = path.join(__dirname, '..', 'public', 'worksheets', 'l1', 'tests');
const OUT_AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio', 'l1', 'exam');
const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

if (!fs.existsSync(OUT_HTML_DIR)) fs.mkdirSync(OUT_HTML_DIR, { recursive: true });
if (!fs.existsSync(OUT_AUDIO_DIR)) fs.mkdirSync(OUT_AUDIO_DIR, { recursive: true });

const gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

async function processTests() {
    console.log("Bắt đầu trích xuất 7 Đề Thi...");
    const folders = fs.readdirSync(TESTS_DIR).filter(f => fs.statSync(path.join(TESTS_DIR, f)).isDirectory());
    
    let testCounter = 2; // Test 1 đã có dạng interactive

    for (const folder of folders) {
        if (folder === "ĐỀ SỐ 1 KÌ 2 LOP 1") continue; // Bỏ qua đề 1 đã làm
        
        const folderPath = path.join(TESTS_DIR, folder);
        const files = fs.readdirSync(folderPath);
        
        const docxFile = files.find(f => f.toLowerCase().endsWith('.docx') && !f.startsWith('~'));
        const mp3File = files.find(f => f.toLowerCase().endsWith('.mp3'));
        
        if (docxFile) {
            try {
                const docxPath = path.join(folderPath, docxFile);
                const result = await mammoth.convertToHtml({ path: docxPath });
                
                const htmlPath = path.join(OUT_HTML_DIR, `test${testCounter}.html`);
                const styledHtml = `
                <style>
                    body { font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6; padding: 20px; }
                    img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; border: 1px solid #e2e8f0; }
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    td, th { border: 1px solid #cbd5e1; padding: 8px; }
                    p { margin-bottom: 12px; }
                    .audio-wrapper { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; }
                </style>
                ${result.value}
                `;
                fs.writeFileSync(htmlPath, styledHtml);
                
                let audioUrl = "";
                if (mp3File) {
                    const mp3Src = path.join(folderPath, mp3File);
                    const mp3Dest = path.join(OUT_AUDIO_DIR, `test${testCounter}.mp3`);
                    fs.copyFileSync(mp3Src, mp3Dest);
                    audioUrl = `/audio/l1/exam/test${testCounter}.mp3`;
                }

                // Append to grade1.json examUnit
                const examUnit = gradeData.find(u => u.id === "l1-exam-final");
                if (examUnit) {
                    examUnit.lessons.push({
                        id: `l1-exam-html-${testCounter}`,
                        title: folder,
                        type: "worksheet",
                        completed: false,
                        worksheetUrl: `/worksheets/l1/tests/test${testCounter}.html`,
                        mainAudio: audioUrl || undefined
                    });
                }
                
                console.log(`✅ Đã xử lý ${folder}`);
                testCounter++;
            } catch (e) {
                console.error(`❌ Lỗi xử lý ${folder}:`, e.message);
            }
        }
    }

    fs.writeFileSync(SEED_PATH, JSON.stringify(gradeData, null, 2));
    console.log("Đã cập nhật grade1.json với các đề thi mới!");
}

processTests();
