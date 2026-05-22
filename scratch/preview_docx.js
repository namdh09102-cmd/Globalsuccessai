const mammoth = require('mammoth');

const docxPath = "D:\\tài liệu tiếng anh\\lớp 1\\CÁC LOẠI BT BỔ TRỢ GLOBAL 1\\GS 1- BT UNIT\\_ GS 1- BT UNIT\\UNIT 1.docx";

mammoth.extractRawText({ path: docxPath }).then(result => {
  console.log("=== PREVIEW UNIT 1 EXERCISE ===");
  console.log(result.value.substring(0, 1500));
}).catch(err => {
  console.error("LỖI:", err.message);
});
