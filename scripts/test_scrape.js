const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeVietjack() {
    try {
        const url = 'https://vietjack.com/tieng-anh-4-global-success/unit-1-bai-tap-trac-nghiem.jsp';
        console.log("Fetching: " + url);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        fs.writeFileSync("vietjack_html.txt", response.data);
        console.log("Saved to vietjack_html.txt");
        
        const $ = cheerio.load(response.data);
        // Let's try to find questions. Usually they are in <p> tags or specific divs.
        const questions = [];
        $('.question, p').each((i, el) => {
            const text = $(el).text().trim();
            if (text.match(/^(Câu \d+:|\d+\.)/)) {
                questions.push(text);
            }
        });
        
        console.log("Found possible questions:", questions.slice(0, 5));
    } catch (e) {
        console.error("Error scraping:", e.message);
    }
}

scrapeVietjack();
