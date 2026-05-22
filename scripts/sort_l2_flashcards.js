const fs = require('fs');
const path = require('path');

const MISC_DIR = path.join(__dirname, '..', 'public', 'flashcards', 'l2', 'misc');
const L2_DIR = path.join(__dirname, '..', 'public', 'flashcards', 'l2');

if (fs.existsSync(MISC_DIR)) {
    const files = fs.readdirSync(MISC_DIR);
    for (const file of files) {
        // file: U1_L1_img0.png, FT1_L1_img0.png, R1_L1_img0.png, U10_Lesson_1_img0.png
        let unitFolder = 'misc';
        const uMatch = file.match(/^U(\d+)_/i);
        if (uMatch) {
            unitFolder = `u${uMatch[1]}`;
        } else {
            // Keep R1, FT1 in their own folders or map them?
            // R1 = Review 1 (usually after U3 or U4)
            // Let's just create folders r1, ft1
            const otherMatch = file.match(/^([A-Z]+\d+)_/i);
            if (otherMatch) {
                unitFolder = otherMatch[1].toLowerCase();
            }
        }
        
        if (unitFolder !== 'misc') {
            const destDir = path.join(L2_DIR, unitFolder);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            
            fs.renameSync(path.join(MISC_DIR, file), path.join(destDir, file));
            console.log(`Moved ${file} to ${unitFolder}`);
        }
    }
}
