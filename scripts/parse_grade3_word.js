const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const SRC_DIR = "D:\\tài liệu tiếng anh\\lớp 3\\BÀI TẬP THEO UNIT GLOBAL 3";
const DEST_FILE = path.join(__dirname, '..', 'public', 'seeds', 'grade3.json');

const STOP_WORDS = new Set(["the", "and", "is", "are", "am", "in", "on", "at", "to", "for", "with", "a", "an", "this", "that", "it", "he", "she", "they"]);
const VIETNAMESE_WORDS = new Set(["bài", "tập", "câu", "hỏi", "đáp", "án", "điền", "trống", "chữ", "cái", "thiếu", "đọc", "nối", "khoanh", "tròn", "từ", "vựng"]);

function isEnglishSentence(text) {
    if (text.length < 10 || text.length > 50) return false;
    if (/_/.test(text)) return false; // Reject fill-in-the-blank underscores
    if (/[úùụủũáàạảãíìịỉĩóòọỏõéèẹẻẽýỳỵỷỹđ]/i.test(text)) return false; // Reject Vietnamese
    if (/[0-9]/.test(text)) return false; // Reject numbers like "Câu 1"
    return /^[A-Z][A-Za-z \',\?]+[\.\?\!]$/.test(text.trim());
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

async function processUnits() {
    const unitsData = [];
    
    for (let i = 1; i <= 20; i++) {
        const docxPath = path.join(SRC_DIR, `Unit ${i}.docx`);
        let text = "";
        
        if (fs.existsSync(docxPath)) {
            console.log(`Extracting text from Unit ${i}.docx...`);
            const result = await mammoth.extractRawText({path: docxPath});
            text = result.value;
        } else {
            console.log(`Unit ${i}.docx not found. Generating basic content...`);
            text = "Hello. How are you? I am fine. What is your name? My name is student. Nice to meet you.";
        }

        // Clean text
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // Extract sentences
        const sentences = new Set();
        const words = new Set();
        
        for (const line of lines) {
            // Split by punctuation for sentences
            const parts = line.split(/(?<=[.?!])\s+/);
            for (let part of parts) {
                part = part.trim();
                if (isEnglishSentence(part)) {
                    sentences.add(part);
                }
            }
            
            // Extract words
            const wMatches = line.match(/\b[a-zA-Z]{3,10}\b/g);
            if (wMatches) {
                for (const w of wMatches) {
                    const wl = w.toLowerCase();
                    if (!STOP_WORDS.has(wl) && !VIETNAMESE_WORDS.has(wl)) {
                        words.add(wl);
                    }
                }
            }
        }
        
        const sentenceList = Array.from(sentences);
        const wordList = Array.from(words);
        
        if (sentenceList.length === 0) sentenceList.push("Hello.", "How are you?", "Nice to meet you.");
        if (wordList.length < 4) wordList.push("apple", "banana", "cat", "dog", "elephant", "fish", "grape");
        
        // Generate Quiz Questions
        const quizQuestions = [];
        
        // 1. Reorder sentences
        for (let j = 0; j < Math.min(10, sentenceList.length); j++) {
            const s = sentenceList[j];
            const sWords = s.replace(/[\.\?\!]/g, '').trim().split(/\s+/);
            if (sWords.length >= 2) {
                const shuffledWords = shuffle([...sWords]);
                const shuffledStr = shuffledWords.join(' / ');
                
                // Create distractor options by making other wrong shuffles
                const wrongOption1 = shuffle([...sWords]).join(' ') + (s.endsWith('?') ? '?' : '.');
                const wrongOption2 = shuffle([...sWords]).join(' ') + (s.endsWith('?') ? '?' : '.');
                
                let options = [s, wrongOption1, wrongOption2];
                // Remove duplicates in options
                options = Array.from(new Set(options));
                // Add padding if duplicates removed
                if (options.length < 3) options.push(s.toLowerCase());
                
                quizQuestions.push({
                    question: `Put the words in the correct order: ${shuffledStr}`,
                    options: options,
                    correctAnswer: s
                });
            }
        }
        
        // 2. Odd one out
        for (let j = 0; j < Math.min(10, Math.floor(wordList.length / 4)); j++) {
            const w1 = wordList[j*4];
            const w2 = wordList[j*4+1];
            const w3 = wordList[j*4+2];
            quizQuestions.push({
                question: `Find the word that belongs to the Unit:`,
                options: [w1, w2 + "x", "chrysanthemum"],
                correctAnswer: w1
            });
        }
        
        // 3. Fill missing letter
        for (let j = 0; j < Math.min(15, wordList.length); j++) {
            const w = wordList[j];
            if (w.length > 3) {
                const missing = w.substring(0, 1) + "_" + w.substring(2);
                quizQuestions.push({
                    question: `Complete the word: ${missing}`,
                    options: [w, w.substring(0, w.length-1), w + "s"],
                    correctAnswer: w
                });
            }
        }

        if (quizQuestions.length === 0) {
            quizQuestions.push({
                question: "Read the unit text?",
                options: ["Yes", "No", "Maybe"],
                correctAnswer: "Yes"
            });
        }

        unitsData.push({
            id: `l3-u${i}`,
            number: i,
            title: `Unit ${i}`,
            status: i === 1 ? "in_progress" : "locked",
            progress: 0,
            grade: "Lớp 3",
            lessons: [
                {
                    id: `l3-u${i}-speak`,
                    title: "Speaking & Pronunciation",
                    type: "speaking",
                    completed: false,
                    expectedText: sentenceList[0] || "Hello"
                },
                {
                    id: `l3-u${i}-dict`,
                    title: "Listening & Dictation",
                    type: "dictation",
                    completed: false,
                    expectedWord: sentenceList[1] || sentenceList[0] || "Hello"
                },
                {
                    id: `l3-u${i}-quiz`,
                    title: "Multiple Choice Quiz",
                    type: "quiz",
                    completed: false,
                    quizQuestions: quizQuestions
                }
            ]
        });
    }

    fs.writeFileSync(DEST_FILE, JSON.stringify(unitsData, null, 2));
    console.log("Đã cập nhật grade3.json với Dữ liệu cào từ file Word Lớp 3!");
}

processUnits().catch(console.error);
