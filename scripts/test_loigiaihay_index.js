const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeIndex() {
    const url = 'https://loigiaihay.com/tieng-anh-4-global-success-c1468.html';
    try {
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(res.data);
        
        const links = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            if (href && text && text.toLowerCase().includes('unit')) {
                links.push({ text, href });
            }
        });
        
        fs.writeFileSync('loigiaihay_links.json', JSON.stringify(links, null, 2));
        console.log("Extracted links to loigiaihay_links.json");
    } catch (e) {
        console.error(e.message);
    }
}
scrapeIndex();
