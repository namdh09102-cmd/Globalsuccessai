const fs = require('fs');
const path = require('path');

const grade1Syllabus = [
    { number: 1, title: 'In the school playground', words: ['apple', 'ant', 'bag', 'book'] },
    { number: 2, title: 'In the dining room', words: ['ball', 'bike', 'bird', 'boy'] },
    { number: 3, title: 'At the street market', words: ['cat', 'car', 'cup', 'cake'] },
    { number: 4, title: 'In the bedroom', words: ['dog', 'door', 'duck', 'desk'] },
    { number: 5, title: 'At the fish stand', words: ['egg', 'elephant', 'pen', 'bed'] },
    { number: 6, title: 'In the classroom', words: ['fan', 'fish', 'friend', 'father'] },
    { number: 7, title: 'In the garden', words: ['goat', 'gate', 'girl', 'garden'] },
    { number: 8, title: 'In the park', words: ['hat', 'hair', 'hand', 'horse'] },
    { number: 9, title: 'In the shop', words: ['insect', 'ink', 'in', 'igloo'] },
    { number: 10, title: 'At the zoo', words: ['jam', 'juice', 'jelly', 'jump'] },
    { number: 11, title: 'At the bus stop', words: ['kite', 'king', 'key', 'kick'] },
    { number: 12, title: 'At the lake', words: ['lake', 'leaf', 'lemon', 'lion'] },
    { number: 13, title: 'In the math class', words: ['monkey', 'mother', 'mouse', 'map'] },
    { number: 14, title: 'In the toy shop', words: ['nut', 'nest', 'nose', 'nine'] },
    { number: 15, title: 'At the football match', words: ['ox', 'orange', 'octopus', 'on'] },
    { number: 16, title: 'At home', words: ['pig', 'pink', 'pen', 'pencil'] }
];

const VN_DICT = {
    'apple': 'quả táo', 'ant': 'con kiến', 'bag': 'cái cặp', 'book': 'quyển sách',
    'ball': 'quả bóng', 'bike': 'xe đạp', 'bird': 'con chim', 'boy': 'cậu bé',
    'cat': 'con mèo', 'car': 'ô tô', 'cup': 'cái cốc', 'cake': 'cái bánh',
    'dog': 'con chó', 'door': 'cái cửa', 'duck': 'con vịt', 'desk': 'cái bàn',
    'egg': 'quả trứng', 'elephant': 'con voi', 'pen': 'cái bút', 'bed': 'cái giường',
    'fan': 'cái quạt', 'fish': 'con cá', 'friend': 'bạn bè', 'father': 'bố',
    'goat': 'con dê', 'gate': 'cái cổng', 'girl': 'cô bé', 'garden': 'khu vườn',
    'hat': 'cái mũ', 'hair': 'tóc', 'hand': 'bàn tay', 'horse': 'con ngựa',
    'insect': 'côn trùng', 'ink': 'mực', 'in': 'ở trong', 'igloo': 'lều tuyết',
    'jam': 'mứt', 'juice': 'nước ép', 'jelly': 'thạch', 'jump': 'nhảy',
    'kite': 'cái diều', 'king': 'nhà vua', 'key': 'chìa khóa', 'kick': 'đá',
    'lake': 'cái hồ', 'leaf': 'chiếc lá', 'lemon': 'quả chanh', 'lion': 'con sư tử',
    'monkey': 'con khỉ', 'mother': 'mẹ', 'mouse': 'con chuột', 'map': 'bản đồ',
    'nut': 'hạt dẻ', 'nest': 'cái tổ', 'nose': 'cái mũi', 'nine': 'số 9',
    'ox': 'con bò đực', 'orange': 'quả cam', 'octopus': 'bạch tuộc', 'on': 'ở trên',
    'pig': 'con lợn', 'pink': 'màu hồng', 'pencil': 'bút chì'
};

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateDistractors(correctWord, type) {
    const allWords = Object.keys(VN_DICT);
    const distractors = new Set();
    while (distractors.size < 3) {
        const word = allWords[Math.floor(Math.random() * allWords.length)];
        if (word !== correctWord) {
            distractors.add(type === 'vn' ? VN_DICT[word] : word);
        }
    }
    return Array.from(distractors);
}

function generateGrade1Data() {
    const units = [];
    
    grade1Syllabus.forEach((unitData) => {
        const questions = [];
        let idCounter = 1;
        
        // Sinh 20 câu trắc nghiệm từ vựng
        for(let i=0; i<20; i++) {
            const word = unitData.words[Math.floor(Math.random() * unitData.words.length)];
            const qType = Math.random() > 0.5 ? 'en2vn' : 'vn2en';
            
            let questionText, correctOpt, distractors;
            if (qType === 'en2vn') {
                questionText = `Nghĩa của từ "${word}" là gì?`;
                correctOpt = VN_DICT[word];
                distractors = generateDistractors(word, 'vn');
            } else {
                questionText = `Từ tiếng Anh của "${VN_DICT[word]}" là gì?`;
                correctOpt = word;
                distractors = generateDistractors(word, 'en');
            }
            
            const options = shuffle([correctOpt, ...distractors]);
            const correctAnswer = ['A', 'B', 'C', 'D'][options.indexOf(correctOpt)];
            
            questions.push({
                id: `q-${unitData.number}-${idCounter++}`,
                question: questionText,
                options: { A: options[0], B: options[1], C: options[2], D: options[3] },
                correctAnswer: correctAnswer,
                explanation: `Đáp án đúng là ${correctOpt} (${qType === 'en2vn' ? 'nghĩa tiếng Việt' : 'tiếng Anh'} của ${qType === 'en2vn' ? word : VN_DICT[word]}).`
            });
        }
        
        // Sinh 5 câu sắp xếp chữ cái
        for(let i=0; i<5; i++) {
            const word = unitData.words[Math.floor(Math.random() * unitData.words.length)];
            const letters = word.split('');
            const shuffledLetters = shuffle([...letters]).join('-');
            
            const distractors = [];
            let attempts = 0;
            while(distractors.length < 3 && attempts < 50) {
                const fake = shuffle([...letters]).join('');
                if (fake !== word && !distractors.includes(fake)) {
                    distractors.push(fake);
                }
                attempts++;
            }
            while(distractors.length < 3) {
                distractors.push(word + Math.floor(Math.random()*10));
            }
            const options = shuffle([word, ...distractors]);
            const correctAnswer = ['A', 'B', 'C', 'D'][options.indexOf(word)];
            
            questions.push({
                id: `q-${unitData.number}-${idCounter++}`,
                question: `Sắp xếp các chữ cái sau để tạo thành từ đúng: ${shuffledLetters}`,
                options: { A: options[0], B: options[1], C: options[2], D: options[3] },
                correctAnswer: correctAnswer,
                explanation: `Từ đúng là ${word}.`
            });
        }

        units.push({
            id: `l1-u${unitData.number}`,
            number: unitData.number,
            title: unitData.title,
            grade: "Lớp 1",
            status: "locked",
            progress: 0,
            lessons: [
                { id: `u${unitData.number}-l1`, title: "Lesson 1: Vocabulary", type: "vocabulary", completed: false, score: 0, questions: questions.slice(0, 10) },
                { id: `u${unitData.number}-l2`, title: "Lesson 2: Speaking", type: "speaking", completed: false, score: 0, questions: questions.slice(10, 15) },
                { id: `u${unitData.number}-l3`, title: "Lesson 3: Grammar", type: "dictation", completed: false, score: 0, questions: questions.slice(15, 25) }
            ]
        });
    });

    const outputPath = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');
    fs.writeFileSync(outputPath, JSON.stringify(units, null, 4));
    console.log("Successfully generated grade1.json with " + units.length + " units.");
}

generateGrade1Data();
