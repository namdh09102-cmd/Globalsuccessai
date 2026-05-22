const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const pptxPath = "D:\\tài liệu tiếng anh\\lớp 1\\Mind map lớp 1 Global Success.pptx";
const zip = new AdmZip(pptxPath);
const zipEntries = zip.getEntries();

// Extract all rels for slides
const slideRels = zipEntries.filter(e => e.entryName.startsWith("ppt/slides/_rels/slide"));

console.log(`Found ${slideRels.length} slides.`);

// We want to find which images are on which slides
const slideImageMap = {};

slideRels.forEach(relEntry => {
    // entryName: ppt/slides/_rels/slide1.xml.rels
    const slideNumMatch = relEntry.entryName.match(/slide(\d+)\.xml\.rels/);
    if (!slideNumMatch) return;
    const slideNum = parseInt(slideNumMatch[1]);
    
    const content = relEntry.getData().toString("utf8");
    // Find all Target="../media/imageX.png"
    const imageMatches = [...content.matchAll(/Target="\.\.\/media\/(image[^"]+)"/g)];
    const images = imageMatches.map(m => m[1]);
    
    slideImageMap[slideNum] = images;
});

// Sort by slide number
const sortedSlides = Object.keys(slideImageMap).sort((a,b) => parseInt(a) - parseInt(b));

sortedSlides.forEach(slideNum => {
    console.log(`Slide ${slideNum} has ${slideImageMap[slideNum].length} images:`, slideImageMap[slideNum].slice(0, 3), "...");
    
    // Find the sizes of these images
    const imgSizes = slideImageMap[slideNum].map(img => {
        const entry = zipEntries.find(e => e.entryName === `ppt/media/${img}`);
        return { name: img, size: entry ? entry.header.size : 0 };
    });
    
    imgSizes.sort((a,b) => b.size - a.size);
    if(imgSizes.length > 0) {
        console.log(`  Largest image: ${imgSizes[0].name} (${(imgSizes[0].size/1024).toFixed(1)} KB)`);
    }
});
