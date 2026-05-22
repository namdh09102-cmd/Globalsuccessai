const mammoth = require('mammoth');
const fs = require('fs');

const docxPath = "D:\\tài liệu tiếng anh\\lớp 1\\CÁC LOẠI BT BỔ TRỢ GLOBAL 1\\GS 1- BT UNIT\\_ GS 1- BT UNIT\\UNIT 1.docx";

mammoth.convertToHtml({ path: docxPath })
  .then(function(result){
      const html = result.value; 
      fs.writeFileSync("d:\\Antigravity_Projects\\Globalsuccess\\public\\worksheet1.html", html);
      console.log("Extracted HTML successfully. Size: " + html.length);
  })
  .catch(function(err){
      console.log(err);
  });
