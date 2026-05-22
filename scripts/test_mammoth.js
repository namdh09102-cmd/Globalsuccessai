const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const docxPath = "D:\\tài liệu tiếng anh\\lớp 3\\BÀI TẬP THEO UNIT GLOBAL 3\\Unit 1.docx";

if (fs.existsSync(docxPath)) {
    mammoth.extractRawText({path: docxPath})
        .then(function(result){
            const text = result.value; 
            fs.writeFileSync("unit1_text.txt", text);
            console.log("Extracted text saved to unit1_text.txt");
        })
        .done();
} else {
    console.log("Unit 1.docx not found");
}
