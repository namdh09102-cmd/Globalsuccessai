const fs = require('fs');
const path = require('path');
const WordExtractor = require('word-extractor');

const dirPath = "D:\\tài liệu tiếng anh\\lớp 1\\GIÁO ÁN GLOBAL 1";
const outPath = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

async function processAllFiles() {
  const files = fs.readdirSync(dirPath);
  const extractor = new WordExtractor();
  let gradeData = [];

  for (let i = 1; i <= 16; i++) {
    const fileName = `TA1_GA_Unit ${i}.DOC`;
    const fullPath = path.join(dirPath, fileName);
    
    let text = "";
    let topic = `Unit ${i}`;
    let words = [];

    if (fs.existsSync(fullPath)) {
      try {
        const doc = await extractor.extract(fullPath);
        text = doc.getBody();
        
        // Cố gắng trích xuất Topic bằng Regex: "Unit: 1. In the school playground"
        const topicMatch = text.match(/Unit:\s*\d+\.\s*([^\n\r]+)/i);
        if (topicMatch && topicMatch[1]) {
          topic = `Unit ${i}: ${topicMatch[1].trim()}`;
        }
        
        // Cố gắng tìm các từ vựng xuất hiện nhiều nhất hoặc trong bảng.
        // Đối với Grade 1, giáo án thường hay liệt kê "a ball", "a bike", v.v..
        // Ta dùng Regex cào các cụm từ phổ biến (rất thủ công nhưng hiệu quả tương đối)
        const wordMatches = text.match(/\b(a|an) ([a-z]{2,8})\b/gi);
        if (wordMatches) {
            // Đếm tần suất
            const freq = {};
            wordMatches.forEach(w => {
                const clean = w.toLowerCase().replace(/^(a|an)\s+/, '');
                freq[clean] = (freq[clean] || 0) + 1;
            });
            // Lấy top 4 từ vựng
            words = Object.keys(freq).sort((a,b) => freq[b] - freq[a]).slice(0, 4);
        }
      } catch (e) {
        console.log(`Lỗi đọc file Unit ${i}: ${e.message}`);
      }
    }

    // Fallback nếu Regex cào thất bại
    if (words.length < 3) {
      words = ["apple", "book", "cat", "dog"].map(w => w + i); // Mock
    }

    // Khởi tạo bài Speaking
    const speakingExpectedText = `Hello. I have a ${words[0]} and a ${words[1]}.`;

    // Khởi tạo bài Quiz (3 câu)
    const quizQuestions = [
      {
        id: `l1_u${i}_q1`,
        question: `What is this? It's a _____.`,
        options: [
          `A. ${words[0]}`,
          `B. ${words[1] || 'car'}`,
          `C. ${words[2] || 'bus'}`,
          `D. ${words[3] || 'train'}`
        ],
        correctAnswer: "A",
        explanation: `Từ vựng cốt lõi Unit ${i}: ${words[0]}`
      },
      {
        id: `l1_u${i}_q2`,
        question: `Look and choose: ______`,
        options: [
          `A. ${words[1] || 'book'}`,
          `B. ${words[0]}`,
          `C. pen`,
          `D. ruler`
        ],
        correctAnswer: "A",
        explanation: `Từ vựng mở rộng Unit ${i}: ${words[1] || 'book'}`
      }
    ];

    gradeData.push({
      id: `unit-${i}`,
      number: i,
      title: topic,
      grade: "Lớp 1",
      lessons: [
        {
          id: `l1_u${i}_speak`,
          title: `Speaking - ${topic}`,
          type: "speaking",
          expectedText: speakingExpectedText
        },
        {
          id: `l1_u${i}_quiz`,
          title: `Quiz - ${topic}`,
          type: "quiz",
          quizQuestions: quizQuestions
        }
      ]
    });
    console.log(`Đã phân tích xong Unit ${i}`);
  }

  // Đảm bảo thư mục seeds tồn tại
  const seedsDir = path.dirname(outPath);
  if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(gradeData, null, 2));
  console.log(`[Thành công] Đã xuất dữ liệu 16 Units ra file: ${outPath}`);
}

processAllFiles();
