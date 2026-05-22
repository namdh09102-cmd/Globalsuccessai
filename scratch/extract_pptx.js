const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const pptxPath = "D:\\tài liệu tiếng anh\\lớp 1\\Mind map lớp 1 Global Success.pptx";
const outDir = path.join(__dirname, '..', 'scratch', 'mindmaps');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

try {
  const zip = new AdmZip(pptxPath);
  const zipEntries = zip.getEntries();
  
  let imageCount = 0;
  zipEntries.forEach(function(zipEntry) {
    if (zipEntry.entryName.startsWith("ppt/media/")) {
        console.log(`Extracting: ${zipEntry.entryName}`);
        zip.extractEntryTo(zipEntry.entryName, outDir, false, true);
        imageCount++;
    }
  });
  console.log(`[Success] Extracted ${imageCount} images to scratch/mindmaps`);
} catch (e) {
  console.error("Error:", e.message);
}
