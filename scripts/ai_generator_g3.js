const fs = require('fs');
const path = require('path');

const grade3Syllabus = [
    { number: 1, title: 'Hello', words: ['hello', 'hi', 'how', 'fine'] },
    { number: 2, title: 'Our names', words: ['what', 'name', 'your', 'spell'] },
    { number: 3, title: 'Our friends', words: ['friend', 'this', 'that', 'yes'] },
    { number: 4, title: 'Our bodies', words: ['face', 'hand', 'ear', 'eye'] },
    { number: 5, title: 'My hobbies', words: ['sing', 'swim', 'cook', 'draw'] },
    { number: 6, title: 'Our school', words: ['school', 'library', 'gym', 'big'] },
    { number: 7, title: 'Classroom instructions', words: ['open', 'close', 'stand', 'sit'] },
    { number: 8, title: 'My school things', words: ['pen', 'ruler', 'book', 'bag'] },
    { number: 9, title: 'Colours', words: ['red', 'blue', 'green', 'yellow'] },
    { number: 10, title: 'Break time activities', words: ['chess', 'football', 'badminton', 'basketball'] },
    { number: 11, title: 'My family', words: ['father', 'mother', 'brother', 'sister'] },
    { number: 12, title: 'Jobs', words: ['teacher', 'doctor', 'nurse', 'student'] },
    { number: 13, title: 'My house', words: ['house', 'living room', 'bedroom', 'kitchen'] },
    { number: 14, title: 'My bedroom', words: ['bed', 'desk', 'chair', 'door'] },
    { number: 15, title: 'At the dining table', words: ['chicken', 'fish', 'rice', 'water'] },
    { number: 16, title: 'My pets', words: ['dog', 'cat', 'bird', 'parrot'] },
    { number: 17, title: 'Our toys', words: ['kite', 'doll', 'ball', 'robot'] },
    { number: 18, title: 'Playing and doing', words: ['reading', 'writing', 'dancing', 'singing'] },
    { number: 19, title: 'Outdoor activities', words: ['cycling', 'skating', 'flying', 'playing'] },
    { number: 20, title: 'At the summer camp', words: ['tent', 'fire', 'game', 'song'] }
];

const VN_DICT = {
    'hello': 'xin chào', 'hi': 'chào', 'how': 'như thế nào', 'fine': 'khỏe',
    'what': 'cái gì', 'name': 'tên', 'your': 'của bạn', 'spell': 'đánh vần',
    'friend': 'người bạn', 'this': 'đây là', 'that': 'đó là', 'yes': 'vâng/đúng',
    'face': 'khuôn mặt', 'hand': 'bàn tay', 'ear': 'cái tai', 'eye': 'con mắt',
    'sing': 'hát', 'swim': 'bơi', 'cook': 'nấu ăn', 'draw': 'vẽ',
    'school': 'trường học', 'library': 'thư viện', 'gym': 'phòng thể dục', 'big': 'to lớn',
    'open': 'mở ra', 'close': 'đóng lại', 'stand': 'đứng', 'sit': 'ngồi',
    'pen': 'cái bút', 'ruler': 'thước kẻ', 'book': 'quyển sách', 'bag': 'cái cặp',
    'red': 'màu đỏ', 'blue': 'màu xanh dương', 'green': 'màu xanh lá', 'yellow': 'màu vàng',
    'chess': 'cờ vua', 'football': 'bóng đá', 'badminton': 'cầu lông', 'basketball': 'bóng rổ',
    'father': 'bố', 'mother': 'mẹ', 'brother': 'anh/em trai', 'sister': 'chị/em gái',
    'teacher': 'giáo viên', 'doctor': 'bác sĩ', 'nurse': 'y tá', 'student': 'học sinh',
    'house': 'ngôi nhà', 'living room': 'phòng khách', 'bedroom': 'phòng ngủ', 'kitchen': 'nhà bếp',
    'bed': 'cái giường', 'desk': 'cái bàn', 'chair': 'cái ghế', 'door': 'cái cửa',
    'chicken': 'thịt gà', 'fish': 'con cá/thịt cá', 'rice': 'cơm', 'water': 'nước uống',
    'dog': 'con chó', 'cat': 'con mèo', 'bird': 'con chim', 'parrot': 'con vẹt',
    'kite': 'cái diều', 'doll': 'búp bê', 'ball': 'quả bóng', 'robot': 'người máy',
    'reading': 'đang đọc', 'writing': 'đang viết', 'dancing': 'đang nhảy múa', 'singing': 'đang hát',
    'cycling': 'đạp xe', 'skating': 'trượt patin', 'flying': 'đang bay', 'playing': 'đang chơi',
    'tent': 'cái lều', 'fire': 'lửa', 'game': 'trò chơi', 'song': 'bài hát'
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

function generateGradeData() {
    const units = [];
    
    grade3Syllabus.forEach((unitData) => {
        const questions = [];
        let idCounter = 1;
        
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
            id: `l3-u${unitData.number}`,
            number: unitData.number,
            title: unitData.title,
            grade: "Lớp 3",
            status: "locked",
            progress: 0,
            lessons: [
                { id: `u${unitData.number}-l1`, title: "Lesson 1: Vocabulary", type: "vocabulary", completed: false, score: 0, questions: questions.slice(0, 10) },
                { id: `u${unitData.number}-l2`, title: "Lesson 2: Speaking", type: "speaking", completed: false, score: 0, questions: questions.slice(10, 15) },
                { id: `u${unitData.number}-l3`, title: "Lesson 3: Grammar", type: "dictation", completed: false, score: 0, questions: questions.slice(15, 25) }
            ]
        });
    });

    const outputPath = path.join(__dirname, '..', 'public', 'seeds', 'grade3.json');
    fs.writeFileSync(outputPath, JSON.stringify(units, null, 4));
    console.log("Successfully generated grade3.json with " + units.length + " units.");
}

generateGradeData();
