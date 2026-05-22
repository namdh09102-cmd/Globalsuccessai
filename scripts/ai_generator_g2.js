const fs = require('fs');
const path = require('path');

const grade2Syllabus = [
    { number: 1, title: 'At my birthday party', words: ['pasta', 'pizza', 'popcorn', 'party'] },
    { number: 2, title: 'In the backyard', words: ['kite', 'bike', 'kitten', 'yard'] },
    { number: 3, title: 'At the seaside', words: ['sail', 'sand', 'sea', 'sun'] },
    { number: 4, title: 'In the countryside', words: ['river', 'road', 'rainbow', 'tree'] },
    { number: 5, title: 'In the classroom', words: ['board', 'bin', 'book', 'desk'] },
    { number: 6, title: 'On the farm', words: ['cow', 'pig', 'duck', 'farm'] },
    { number: 7, title: 'In the kitchen', words: ['juice', 'jam', 'jelly', 'kitchen'] },
    { number: 8, title: 'In the village', words: ['van', 'village', 'volleyball', 'view'] },
    { number: 9, title: 'In the grocery store', words: ['grapes', 'guava', 'green', 'store'] },
    { number: 10, title: 'At the zoo', words: ['zebra', 'zebu', 'zoo', 'animal'] },
    { number: 11, title: 'In the playground', words: ['slide', 'swing', 'see-saw', 'play'] },
    { number: 12, title: 'At the cafe', words: ['cake', 'cup', 'cat', 'cafe'] },
    { number: 13, title: 'In the maths class', words: ['number', 'eleven', 'twelve', 'maths'] },
    { number: 14, title: 'At home', words: ['brother', 'sister', 'father', 'mother'] },
    { number: 15, title: 'In the clothes shop', words: ['shirt', 'shorts', 'shoes', 'shop'] },
    { number: 16, title: 'At the campsite', words: ['tent', 'teapot', 'blanket', 'camp'] }
];

const VN_DICT = {
    'pasta': 'mì ống', 'pizza': 'bánh pizza', 'popcorn': 'bỏng ngô', 'party': 'bữa tiệc',
    'kite': 'cái diều', 'bike': 'xe đạp', 'kitten': 'mèo con', 'yard': 'cái sân',
    'sail': 'cánh buồm', 'sand': 'cát', 'sea': 'biển', 'sun': 'mặt trời',
    'river': 'dòng sông', 'road': 'con đường', 'rainbow': 'cầu vồng', 'tree': 'cái cây',
    'board': 'cái bảng', 'bin': 'thùng rác', 'book': 'quyển sách', 'desk': 'cái bàn',
    'cow': 'con bò sữa', 'pig': 'con lợn', 'duck': 'con vịt', 'farm': 'nông trại',
    'juice': 'nước ép', 'jam': 'mứt', 'jelly': 'thạch', 'kitchen': 'nhà bếp',
    'van': 'xe tải nhỏ', 'village': 'ngôi làng', 'volleyball': 'bóng chuyền', 'view': 'phong cảnh',
    'grapes': 'nho', 'guava': 'ổi', 'green': 'màu xanh lá', 'store': 'cửa hàng',
    'zebra': 'ngựa vằn', 'zebu': 'bò u', 'zoo': 'sở thú', 'animal': 'động vật',
    'slide': 'cầu trượt', 'swing': 'xích đu', 'see-saw': 'bập bênh', 'play': 'chơi',
    'cake': 'cái bánh', 'cup': 'cái cốc', 'cat': 'con mèo', 'cafe': 'quán cà phê',
    'number': 'con số', 'eleven': 'số 11', 'twelve': 'số 12', 'maths': 'toán học',
    'brother': 'anh/em trai', 'sister': 'chị/em gái', 'father': 'bố', 'mother': 'mẹ',
    'shirt': 'áo sơ mi', 'shorts': 'quần đùi', 'shoes': 'đôi giày', 'shop': 'cửa hàng',
    'tent': 'cái lều', 'teapot': 'ấm trà', 'blanket': 'cái chăn', 'camp': 'cắm trại'
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
    
    grade2Syllabus.forEach((unitData) => {
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
            id: `l2-u${unitData.number}`,
            number: unitData.number,
            title: unitData.title,
            grade: "Lớp 2",
            status: "locked",
            progress: 0,
            lessons: [
                { id: `u${unitData.number}-l1`, title: "Lesson 1: Vocabulary", type: "vocabulary", completed: false, score: 0, questions: questions.slice(0, 10) },
                { id: `u${unitData.number}-l2`, title: "Lesson 2: Speaking", type: "speaking", completed: false, score: 0, questions: questions.slice(10, 15) },
                { id: `u${unitData.number}-l3`, title: "Lesson 3: Grammar", type: "dictation", completed: false, score: 0, questions: questions.slice(15, 25) }
            ]
        });
    });

    const outputPath = path.join(__dirname, '..', 'public', 'seeds', 'grade2.json');
    fs.writeFileSync(outputPath, JSON.stringify(units, null, 4));
    console.log("Successfully generated grade2.json with " + units.length + " units.");
}

generateGradeData();
