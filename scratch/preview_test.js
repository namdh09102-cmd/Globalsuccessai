const mammoth = require('mammoth');

const docxPath = "D:\\tài liệu tiếng anh\\lớp 1\\FULL TEST GLOBAL 1\\ĐỀ SỐ 1 KÌ 2 LOP 1\\ĐỀ 1 KÌ 2 LOP 1 ( 2020-2021).docx";

mammoth.extractRawText({ path: docxPath }).then(result => {
  const text = result.value;
  console.log("=== PREVIEW TEST 1 ===");
  console.log(text.substring(0, 3000));
}).catch(err => {
  console.error("LỖI:", err.message);
});
