const WordExtractor = require("word-extractor");
const extractor = new WordExtractor();
const extracted = extractor.extract("D:\\tài liệu tiếng anh\\lớp 1\\GIÁO ÁN GLOBAL 1\\TA1_GA_Unit 1.DOC");

extracted.then(function(doc) {
  console.log(doc.getBody());
}).catch(e => console.error(e));
