const mammoth = require("mammoth");
const fs = require("fs");

var options = {
    styleMap: [
        "u => u",
        "strike => s",
        "i => i",
        "b => b"
    ]
};

mammoth.convertToHtml({path: "D:\\tai lieu english\\lop 10\\BÀI TẬP BỔ TRỢ GLOBAL 10\\Bổ trợ theo unit\\btbt 10 key.docx"}, options)
    .then(function(result){
        const html = result.value;
        fs.writeFileSync("d:\\Antigravity_Projects\\Globalsuccess\\scripts\\dump_key_styles.html", html);
        console.log("Extracted HTML successfully.");
    })
    .catch(function(error) {
        console.error(error);
    });
