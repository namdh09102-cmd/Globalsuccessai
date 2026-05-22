const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const PPT_DIR = "D:\\tài liệu tiếng anh\\lớp 1\\BÀI GIẢNG PPT  GLOBAL 1";
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'mindmaps', 'l1');
const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

function findPptxForUnit(unitNum) {
    // 1. Kiểm tra trực tiếp trong root PPT_DIR
    const filesInRoot = fs.readdirSync(PPT_DIR);
    let targetInRoot = filesInRoot.find(f => f.toLowerCase().includes(`unit ${unitNum}_lesson 1`) && f.endsWith('.pptx'));
    if (!targetInRoot) {
        targetInRoot = filesInRoot.find(f => f.toLowerCase().includes(`unit ${unitNum}`) && f.endsWith('.pptx') && !f.includes('audio'));
    }
    if (targetInRoot) {
        return path.join(PPT_DIR, targetInRoot);
    }

    // 2. Tìm trong sub-folder
    const folders = filesInRoot.filter(f => {
        try { return fs.statSync(path.join(PPT_DIR, f)).isDirectory(); } catch(e) { return false; }
    });
    const unitFolder = folders.find(f => f.toLowerCase() === `unit ${unitNum}` || f.toLowerCase().startsWith(`unit ${unitNum} `));
    
    if (unitFolder) {
        const searchDir = path.join(PPT_DIR, unitFolder);
        const files = fs.readdirSync(searchDir);
        let target = files.find(f => f.toLowerCase().includes(`unit ${unitNum}_lesson 1`) && f.endsWith('.pptx'));
        if (!target) {
            target = files.find(f => f.toLowerCase().includes(`unit ${unitNum}`) && f.endsWith('.pptx'));
        }
        if (target) {
            return path.join(searchDir, target);
        }
    }
    return null;
}

const gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

for (let i = 1; i <= 16; i++) {
    const pptxPath = findPptxForUnit(i);
    if (!pptxPath) {
        console.log(`Unit ${i}: No PPTX found.`);
        continue;
    }
    
    console.log(`Unit ${i}: Found ${path.basename(pptxPath)}`);
    try {
        const zip = new AdmZip(pptxPath);
        const entries = zip.getEntries();
        const mediaEntries = entries.filter(e => e.entryName.startsWith('ppt/media/image') && !e.entryName.endsWith('.emf') && !e.entryName.endsWith('.wmf'));
        
        if (mediaEntries.length === 0) {
            console.log(`  No images found.`);
            continue;
        }
        
        // Sort by size descending
        mediaEntries.sort((a,b) => b.header.size - a.header.size);
        const largestImage = mediaEntries[0];
        
        const ext = path.extname(largestImage.entryName);
        const outName = `u${i}_real_visual${ext}`;
        const outPath = path.join(OUT_DIR, outName);
        
        fs.writeFileSync(outPath, largestImage.getData());
        console.log(`  Extracted largest image (${(largestImage.header.size/1024).toFixed(1)} KB) -> ${outName}`);
        
        // Update seed
        const unit = gradeData.find(u => u.number === i);
        if (unit) {
            const visualLesson = unit.lessons.find(l => l.type === 'visual');
            if (visualLesson) {
                visualLesson.imageUrl = `/images/mindmaps/l1/${outName}`;
            }
        }
        
    } catch(e) {
        console.error(`  Error processing ${pptxPath}:`, e.message);
    }
}

fs.writeFileSync(SEED_PATH, JSON.stringify(gradeData, null, 2));
console.log("Updated grade1.json with new image paths.");
