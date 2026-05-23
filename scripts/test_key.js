const mammoth = require("mammoth");
const fs = require("fs");

mammoth.extractRawText({path: "D:\\tai lieu english\\lop 10\\BÀI TẬP BỔ TRỢ GLOBAL 10\\Bổ trợ theo unit\\btbt 10 key.docx"})
    .then(function(result){
        const text = result.value;
        fs.writeFileSync("d:\\Antigravity_Projects\\Globalsuccess\\scripts\\dump_key.txt", text);
        console.log("Extracted successfully.");
    })
    .catch(function(error) {
        console.error(error);
    });
