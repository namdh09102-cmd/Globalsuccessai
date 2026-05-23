const fs = require('fs');

const lines = fs.readFileSync('d:\\Antigravity_Projects\\Globalsuccess\\scripts\\dump_key_answers.txt', 'utf8').split('\n');

const units = [];

let currentUnitIndex = 0;
let currentSection = "";
let currentQuestion = null;
let currentUnit = null;

const letters = ["A", "B", "C", "D"];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    
    // Check for unit delimiter (A. PHONETIC)
    if (line.includes("A. PHONETIC")) {
        currentUnitIndex++;
        currentSection = "PHONETIC";
        
        currentUnit = {
            id: `l10-u${currentUnitIndex}`,
            number: currentUnitIndex,
            title: `Unit ${currentUnitIndex}`,
            grade: "Lớp 10",
            status: currentUnitIndex === 1 ? "unlocked" : "locked",
            progress: 0,
            lessons: [
                {
                    id: `u${currentUnitIndex}-l1`,
                    title: "Vocabulary & Grammar",
                    type: "grammar",
                    completed: false,
                    score: 0,
                    questions: []
                }
            ]
        };
        units.push(currentUnit);
        continue;
    }
    
    // Check for section headers
    if (line.includes("B. VOCABULARY & GRAMMAR") || line.includes("B. VOCABULARY AND GRAMMAR") || line.includes("VOCABULARY & GRAMMAR")) {
        currentSection = "VOCABULARY & GRAMMAR";
        continue;
    } else if (line.match(/C\.\s*READING/)) {
        currentSection = "READING";
        continue;
    } else if (line.match(/D\.\s*WRITING/)) {
        currentSection = "WRITING";
        continue;
    } else if (line.match(/E\.\s*LISTENING/)) {
        currentSection = "LISTENING";
        continue;
    }
    
    if (currentSection !== "VOCABULARY & GRAMMAR" && currentSection !== "PHONETIC") {
        continue;
    }
    
    // Check if it's a multiple choice question
    const qMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (qMatch) {
        currentQuestion = {
            id: `q-${currentUnitIndex}-${qMatch[1]}-${Math.random().toString(36).substr(2, 5)}`,
            question: qMatch[2],
            options: {},
            correctAnswer: null,
            explanation: ""
        };
        continue;
    }
    
    // Check if it's an option line
    if (currentQuestion && (line.includes("A.") || line.includes("[ANS]A.") || line.includes("B.") || line.includes("[ANS]B."))) {
        const opts = [...line.matchAll(/(?:\[ANS\])?([A-D])\.(?:\[\/ANS\])?\s*(.*?)(?=(?:\[ANS\])?[A-D]\.|$)/g)];
        if (opts.length > 0) {
            for (const opt of opts) {
                let letter = opt[1];
                let text = opt[2].trim();
                let isAnswer = line.substring(opt.index).startsWith("[ANS]");
                
                // cleanup trailing tags
                text = text.replace(/\[\/ANS\]/g, '').replace(/\[ANS\]/g, '').trim();
                
                currentQuestion.options[letter] = text;
                
                if (isAnswer || text.includes("[ANS]")) {
                    currentQuestion.correctAnswer = letter;
                    currentQuestion.explanation = `Đáp án đúng là ${letter}: ${text.replace(/\[ANS\]/g, '').replace(/\[\/ANS\]/g, '').trim()}`;
                }
            }
        }
        
        // If we have 4 options
        if (Object.keys(currentQuestion.options).length >= 4) {
            if (currentQuestion.correctAnswer) {
                if (currentUnit) {
                    currentUnit.lessons[0].questions.push(currentQuestion);
                }
            }
            currentQuestion = null;
        }
    } else {
        if (currentQuestion && Object.keys(currentQuestion.options).length === 0) {
             currentQuestion.question += " " + line.replace(/\[\/?ANS\]/g, '').trim();
        }
    }
}

// Write to json
fs.writeFileSync('d:\\Antigravity_Projects\\Globalsuccess\\scripts\\grade10.json', JSON.stringify(units, null, 2));
console.log("Written grade10.json");
