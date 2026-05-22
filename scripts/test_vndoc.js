const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
    const url = 'https://vndoc.com/trac-nghiem-tieng-anh-lop-4-unit-1-my-friends-global-success-297920';
    try {
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(res.data);
        fs.writeFileSync('vndoc.html', res.data);
        console.log("Saved vndoc.html");
    } catch (e) {
        console.error(e.message);
    }
}
scrape();
