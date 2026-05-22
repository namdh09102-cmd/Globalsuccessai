const fs = require('fs');
const path = require('path');

const audioSourceDir = "D:\\tài liệu tiếng anh\\lớp 1\\AUDIO  GLOBAL 1\\Audio Tieng anh 1\\TIENG ANH 1 - STUDENT BOOK AUDIO";
const publicAudioDir = path.join(__dirname, '..', 'public', 'audio', 'l1');
const seedPath = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

async function processAudio() {
  if (!fs.existsSync(publicAudioDir)) {
    fs.mkdirSync(publicAudioDir, { recursive: true });
  }

  if (!fs.existsSync(seedPath)) {
    console.error("Không tìm thấy file grade1.json. Vui lòng chạy script ingest_grade1.js trước.");
    return;
  }

  let gradeData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

  for (let i = 1; i <= 16; i++) {
    const unitFolder = path.join(audioSourceDir, `Unit ${i}`);
    let selectedAudioFile = null;

    if (fs.existsSync(unitFolder)) {
      const files = fs.readdirSync(unitFolder).filter(f => f.toLowerCase().endsWith('.mp3'));
      if (files.length > 0) {
        // Ưu tiên track thứ 2 nếu có, nếu không thì lấy track 1
        selectedAudioFile = files.length > 1 ? files[1] : files[0];
      }
    }

    let audioUrl = "";
    if (selectedAudioFile) {
      const sourceFile = path.join(unitFolder, selectedAudioFile);
      const destFileName = `u${i}_dictation.mp3`;
      const destFile = path.join(publicAudioDir, destFileName);
      
      try {
        fs.copyFileSync(sourceFile, destFile);
        audioUrl = `/audio/l1/${destFileName}`;
        console.log(`Đã copy audio cho Unit ${i}: ${destFileName}`);
      } catch (err) {
        console.error(`Lỗi copy audio Unit ${i}: ${err.message}`);
      }
    } else {
      console.log(`[Cảnh báo] Unit ${i} không có file audio nào.`);
    }

    // Cập nhật JSON
    const unitIndex = gradeData.findIndex(u => u.number === i);
    if (unitIndex >= 0) {
      const unit = gradeData[unitIndex];
      // Tìm từ vựng từ bài Speaking (cấu trúc cũ: "Hello. I have a ball and a bike.")
      const speakLesson = unit.lessons.find(l => l.type === 'speaking');
      let dictationText = "Hello. I have a [book] and a [pen]."; // fallback
      
      if (speakLesson && speakLesson.expectedText) {
        const text = speakLesson.expectedText;
        const words = text.match(/a ([a-zA-Z]+)/g);
        if (words && words.length >= 2) {
          const w1 = words[0].replace('a ', '');
          const w2 = words[1].replace('a ', '');
          dictationText = `Hello. I have a [${w1}] and a [${w2}].`;
        }
      }

      // Thêm bài Dictation
      const dictationLesson = {
        id: `l1_u${i}_dictation`,
        title: `Dictation - ${unit.title}`,
        type: "dictation",
        audioUrl: audioUrl,
        expectedText: dictationText
      };

      // Xóa dictation cũ nếu đã chạy lại
      unit.lessons = unit.lessons.filter(l => l.type !== 'dictation');
      unit.lessons.push(dictationLesson);
    }
  }

  fs.writeFileSync(seedPath, JSON.stringify(gradeData, null, 2));
  console.log(`[Thành công] Đã bổ sung 16 bài Dictation vào ${seedPath}`);
}

processAudio();
