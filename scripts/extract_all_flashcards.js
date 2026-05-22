const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const PPT_DIR = "D:\\tài liệu tiếng anh\\lớp 1\\BÀI GIẢNG PPT  GLOBAL 1";
const OUT_DIR = path.join(__dirname, '..', 'public', 'flashcards', 'l1');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

function processPptxFolder(dirPath) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            processPptxFolder(fullPath);
        } else if (item.toLowerCase().endsWith('.pptx') && !item.toLowerCase().includes('audio')) {
            extractImagesFromPptx(fullPath);
        }
    }
}

let imageCounter = 0;

function extractImagesFromPptx(pptxPath) {
    try {
        const zip = new AdmZip(pptxPath);
        const entries = zip.getEntries();
        const mediaEntries = entries.filter(e => e.entryName.startsWith('ppt/media/image') && !e.entryName.endsWith('.emf') && !e.entryName.endsWith('.wmf'));
        
        console.log(`Processing: ${path.basename(pptxPath)} (${mediaEntries.length} images)`);
        
        // Chỉ lấy các ảnh có kích thước > 50KB để loại bỏ các icon nhỏ lẻ
        const validImages = mediaEntries.filter(e => e.header.size > 50000);
        
        // Lấy unit name từ tên file (vd: Unit 1_Lesson 1 -> u1)
        const match = pptxPath.match(/Unit\s+(\d+)/i);
        const unitNum = match ? match[1] : 'unknown';
        
        const unitOutDir = path.join(OUT_DIR, `u${unitNum}`);
        if (!fs.existsSync(unitOutDir)) fs.mkdirSync(unitOutDir, { recursive: true });

        for (let i = 0; i < validImages.length; i++) {
            const entry = validImages[i];
            const ext = path.extname(entry.entryName);
            const outName = `${path.basename(pptxPath, '.pptx').replace(/\s+/g, '_')}_img${i}${ext}`;
            const outPath = path.join(unitOutDir, outName);
            
            fs.writeFileSync(outPath, entry.getData());
            imageCounter++;
        }
    } catch(e) {
        console.error(`Error processing ${pptxPath}:`, e.message);
    }
}

console.log("Bắt đầu giải nén Flashcards từ PPTX...");
processPptxFolder(PPT_DIR);
console.log(`Đã trích xuất thành công tổng cộng ${imageCounter} hình ảnh chất lượng cao!`);
