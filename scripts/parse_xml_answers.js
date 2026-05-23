const fs = require('fs');

const xml = fs.readFileSync('d:\\Antigravity_Projects\\Globalsuccess\\scripts\\key_docx_unzipped\\word\\document.xml', 'utf8');

// A very basic regex based parser for w:p and w:r
const paragraphs = xml.match(/<w:p\b[^>]*>.*?<\/w:p>/g) || [];

let fullText = "";

for (const p of paragraphs) {
    let pText = "";
    const runs = p.match(/<w:r\b[^>]*>.*?<\/w:r>/g) || [];
    for (const r of runs) {
        // extract text
        const tMatch = r.match(/<w:t[^>]*>(.*?)<\/w:t>/);
        if (tMatch) {
            let text = tMatch[1];
            // Check if there is shading with fill color
            // or if there is highlight
            const hasShading = /<w:shd[^>]*w:fill="([0-9a-fA-F]{6})"[^>]*>/.test(r);
            const hasHighlight = /<w:highlight/.test(r);
            const hasUnderline = /<w:u[^>]*w:val="single"/.test(r);
            const isBold = /<w:b\/>/.test(r); // maybe? 
            
            if (hasShading || hasHighlight) {
                text = `[ANS]${text}[/ANS]`;
            }
            pText += text;
        }
    }
    // basic entity decode
    pText = pText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    if (pText.trim().length > 0) {
        fullText += pText + "\n";
    }
}

fs.writeFileSync("d:\\Antigravity_Projects\\Globalsuccess\\scripts\\dump_key_answers.txt", fullText);
console.log("Extracted paragraphs to dump_key_answers.txt");
