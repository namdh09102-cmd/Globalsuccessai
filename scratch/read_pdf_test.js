const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = "D:\\tài liệu tiếng anh\\lớp 1\\FULL TEST GLOBAL 1\\BỘ ĐỀ TEST GLOBAL 1\\unit test 1.pdf";

let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    console.log(data.text.substring(0, 1000));
}).catch(function(error) {
    console.error("Lỗi:", error);
});
