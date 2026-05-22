const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

const SRC_DIR = 'D:\\tài liệu tiếng anh\\lớp 2\\BÀI GIẢNG GLOBAL 2';
const DEST_DIR = path.join(__dirname, '..', 'public', 'flashcards', 'l2');

if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

let imageCount = 0;

function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.toLowerCase().endsWith('.pptx')) {
            console.log(`Đang xử lý: ${item}`);
            extractImagesFromPptx(fullPath);
        }
    }
}

function extractImagesFromPptx(pptxPath) {
    try {
        const zip = new AdmZip(pptxPath);
        const zipEntries = zip.getEntries();
        
        // Cố gắng tìm số Unit từ tên file, nếu không có thì cho vào thư mục chung 'misc'
        const match = pptxPath.match(/unit[\s_]*(\d+)/i);
        const unitFolder = match ? `u${match[1]}` : 'misc';
        const unitDir = path.join(DEST_DIR, unitFolder);
        
        if (!fs.existsSync(unitDir)) {
            fs.mkdirSync(unitDir, { recursive: true });
        }

        const baseName = path.basename(pptxPath, '.pptx').replace(/\s+/g, '_');

        let imgIdx = 0;
        zipEntries.forEach((entry) => {
            if (entry.entryName.startsWith('ppt/media/') && entry.entryName.match(/\.(png|jpe?g)$/i)) {
                const ext = path.extname(entry.entryName);
                if (entry.header.size > 20000) { // Bỏ qua icon nhỏ
                    const destPath = path.join(unitDir, `${baseName}_img${imgIdx}${ext}`);
                    fs.writeFileSync(destPath, entry.getData());
                    imgIdx++;
                    imageCount++;
                }
            }
        });
    } catch (e) {
        console.error(`Lỗi giải nén file ${pptxPath}:`, e.message);
    }
}

console.log("Bắt đầu trích xuất Flashcard từ PPTX Lớp 2...");
processDirectory(SRC_DIR);
console.log(`Hoàn thành! Đã trích xuất ${imageCount} hình ảnh vào ${DEST_DIR}`);
