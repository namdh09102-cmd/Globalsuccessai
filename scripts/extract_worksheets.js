const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const DOCX_DIR = "D:\\tài liệu tiếng anh\\lớp 1\\CÁC LOẠI BT BỔ TRỢ GLOBAL 1\\GS 1- BT UNIT\\_ GS 1- BT UNIT";
const OUT_DIR = path.join(__dirname, '..', 'public', 'worksheets', 'l1');
const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

const gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

async function processWorksheets() {
    console.log("Bắt đầu convert các file Bài tập bổ trợ sang HTML...");
    const files = fs.readdirSync(DOCX_DIR).filter(f => f.toLowerCase().endsWith('.docx'));
    
    for (const file of files) {
        // Tên file thường có dạng "UNIT 1.docx" hoặc "UNIT 16.docx"
        const match = file.match(/UNIT\s+(\d+)/i);
        if (!match) continue;
        
        const unitNum = parseInt(match[1]);
        const fullPath = path.join(DOCX_DIR, file);
        const outPath = path.join(OUT_DIR, `u${unitNum}.html`);
        
        try {
            const result = await mammoth.convertToHtml({ path: fullPath });
            // Add some basic styling
            const styledHtml = `
            <style>
                body { font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6; }
                img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                td, th { border: 1px solid #cbd5e1; padding: 8px; }
                p { margin-bottom: 12px; }
            </style>
            ${result.value}
            `;
            fs.writeFileSync(outPath, styledHtml);
            console.log(`✅ Đã convert xong Unit ${unitNum}`);

            // Cập nhật seed
            const unit = gradeData.find(u => u.number === unitNum);
            if (unit) {
                // Thêm lesson loại worksheet
                const existing = unit.lessons.find(l => l.id === `u${unitNum}-worksheet`);
                if (!existing) {
                    unit.lessons.push({
                        id: `u${unitNum}-worksheet`,
                        title: `Phiếu Bài Tập Unit ${unitNum}`,
                        type: "worksheet",
                        completed: false,
                        worksheetUrl: `/worksheets/l1/u${unitNum}.html`
                    });
                }
            }
        } catch (e) {
            console.error(`❌ Lỗi convert Unit ${unitNum}:`, e.message);
        }
    }

    fs.writeFileSync(SEED_PATH, JSON.stringify(gradeData, null, 2));
    console.log("Đã cập nhật grade1.json thành công!");
}

processWorksheets();
