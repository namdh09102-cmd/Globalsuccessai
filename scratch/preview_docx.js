const mammoth = require('mammoth');
const path = require('path');

const docxPath = "D:\\tài liệu tiếng anh\\lớp 1\\CÁC LOẠI BT BỔ TRỢ GLOBAL 1\\GS 1- BT UNIT\\_ GS 1- BT UNIT\\Unit 1.docx";

mammoth.extractRawText({ path: docxPath }).then(result => {
  const text = result.value;
  console.log("=== PREVIEW UNIT 1 (first 3000 chars) ===");
  console.log(text.substring(0, 3000));
  console.log("\n=== TOTAL CHARS:", text.length, "===");
}).catch(err => {
  console.error("LỖI:", err.message);
});
