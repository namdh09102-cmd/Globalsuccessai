const mammoth = require("mammoth");
const fs = require("fs");

mammoth.extractRawText({path: "D:\\tai lieu english\\lop 10\\HỌC TỐT TIẾN ANH 10 GLOBAL\\UNIT 1 - FAMILY LIFE.docx"})
    .then(function(result){
        const text = result.value;
        fs.writeFileSync("d:\\Antigravity_Projects\\Globalsuccess\\scripts\\dump.txt", text.substring(0, 5000));
        console.log("Extracted successfully.");
    })
    .catch(function(error) {
        console.error(error);
    });
