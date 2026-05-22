const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const folderPath = "D:\\tài liệu tiếng anh\\lớp 3\\BÀI TẬP THEO UNIT GLOBAL 3";
const files = fs.readdirSync(folderPath);

console.log("Starting conversion...");

for (const file of files) {
    if (file.toLowerCase().endsWith('.doc')) {
        const fullPath = path.join(folderPath, file);
        const docxPath = fullPath + 'x';
        if (!fs.existsSync(docxPath)) {
            console.log(`Converting: ${file}`);
            const psScript = `
                $word = New-Object -ComObject Word.Application
                $word.Visible = $false
                $doc = $word.Documents.Open('${fullPath}')
                $doc.SaveAs([ref] '${docxPath}', [ref] 16)
                $doc.Close()
                $word.Quit()
            `;
            try {
                fs.writeFileSync('temp.ps1', '\uFEFF' + psScript, 'utf8');
                execSync('powershell -ExecutionPolicy Bypass -File temp.ps1', { stdio: 'inherit' });
            } catch (e) {
                console.error(`Error converting ${file}:`, e.message);
                // Make sure to kill Word if it fails
                try { execSync('taskkill /F /IM WINWORD.EXE'); } catch(e){}
            }
        } else {
            console.log(`Already converted: ${file}`);
        }
    }
}
console.log("Conversion complete.");
if (fs.existsSync('temp.ps1')) fs.unlinkSync('temp.ps1');
