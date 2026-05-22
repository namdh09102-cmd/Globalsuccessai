const fs = require('fs');
const path = require('path');

const AUDIO_DIR = "D:\\tài liệu tiếng anh\\lớp 1\\AUDIO  GLOBAL 1\\Audio Tieng anh 1\\TIENG ANH 1 - STUDENT BOOK AUDIO";
const OUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'l1');
const SEED_PATH = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

const gradeData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

for (let i = 1; i <= 16; i++) {
    const unitAudioDir = path.join(AUDIO_DIR, `Unit ${i}`);
    if (!fs.existsSync(unitAudioDir)) {
        console.log(`⚠️ Không tìm thấy thư mục audio cho Unit ${i}`);
        continue;
    }

    const outUnitDir = path.join(OUT_DIR, `u${i}`);
    if (!fs.existsSync(outUnitDir)) {
        fs.mkdirSync(outUnitDir, { recursive: true });
    }

    const mp3Files = fs.readdirSync(unitAudioDir).filter(f => f.toLowerCase().endsWith('.mp3'));
    
    if (mp3Files.length === 0) {
        console.log(`⚠️ Unit ${i} không có file mp3`);
        continue;
    }

    // Lọc và sắp xếp file track để lấy track đầu tiên (ví dụ Track 002)
    mp3Files.sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));
    
    // Copy tất cả các track
    const tracks = [];
    for (const file of mp3Files) {
        const srcPath = path.join(unitAudioDir, file);
        const destFileName = file.replace(/\s+/g, '_');
        const destPath = path.join(outUnitDir, destFileName);
        
        fs.copyFileSync(srcPath, destPath);
        tracks.push(`/audio/l1/u${i}/${destFileName}`);
    }

    console.log(`✅ Copy ${tracks.length} track audio cho Unit ${i}`);

    // Update seed data
    const unit = gradeData.find(u => u.number === i);
    if (unit) {
        const visualLesson = unit.lessons.find(l => l.type === 'visual');
        if (visualLesson) {
            visualLesson.audioTracks = tracks; // mảng các track
            visualLesson.mainAudio = tracks[0]; // Track chính
        }
    }
}

fs.writeFileSync(SEED_PATH, JSON.stringify(gradeData, null, 2));
console.log("Cập nhật grade1.json với audio paths.");
