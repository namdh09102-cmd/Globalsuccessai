const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

async function scrape() {
    const url = 'https://loigiaihay.com/bai-tap-trac-nghiem-unit-1-tieng-anh-4-global-success-a131804.html';
    const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    fs.writeFileSync('loigiaihay.html', res.data);
    
    const $ = cheerio.load(res.data);
    
    // Loigiaihay usually puts questions in specific div/p
    const questions = [];
    $('.box-content p').each((i, el) => {
        const text = $(el).text().trim();
        if (text) questions.push(text);
    });
    
    fs.writeFileSync('loigiaihay_extracted.txt', questions.join('\n'));
    console.log("Extracted to loigiaihay_extracted.txt");
}
scrape();
