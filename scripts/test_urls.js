const axios = require('axios');

async function testUrls() {
    const urls = [
        'https://vietjack.com/tieng-anh-4-global-success/trac-nghiem-tieng-anh-lop-4-unit-1.jsp',
        'https://vietjack.com/tieng-anh-4-global-success/trac-nghiem-tieng-anh-4-unit-1.jsp',
        'https://vietjack.com/tieng-anh-4-global-success/bai-tap-trac-nghiem-tieng-anh-lop-4-unit-1.jsp',
        'https://vietjack.com/tieng-anh-4-global-success/trac-nghiem-unit-1-tieng-anh-4.jsp',
        'https://loigiaihay.com/bai-tap-trac-nghiem-unit-1-tieng-anh-4-global-success-a131804.html'
    ];

    for (let url of urls) {
        try {
            console.log("Trying: " + url);
            const res = await axios.head(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
            console.log("SUCCESS: " + url);
        } catch(e) {
            console.log("FAILED: " + url + " - " + e.message);
        }
    }
}
testUrls();
