const fs = require('fs');
const path = require('path');

const extractedImagesDir = path.join(__dirname, '..', 'scratch', 'mindmaps');
const publicMindmapsDir = path.join(__dirname, '..', 'public', 'images', 'mindmaps', 'l1');
const seedPath = path.join(__dirname, '..', 'public', 'seeds', 'grade1.json');

function processVisuals() {
  if (!fs.existsSync(publicMindmapsDir)) {
    fs.mkdirSync(publicMindmapsDir, { recursive: true });
  }

  if (!fs.existsSync(seedPath)) {
    console.error("Không tìm thấy file grade1.json.");
    return;
  }

  let gradeData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  let availableImages = [];

  if (fs.existsSync(extractedImagesDir)) {
    availableImages = fs.readdirSync(extractedImagesDir).filter(f => f.match(/\.(png|jpe?g)$/i));
  }

  // Shuffle images to distribute them randomly
  let shuffledImages = [...availableImages];
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
  }

  gradeData.forEach((unit, index) => {
    // Pick 1 random image for the unit (if available)
    let imageUrl = "";
    if (shuffledImages.length > index) {
      const sourceFile = path.join(extractedImagesDir, shuffledImages[index]);
      const ext = path.extname(sourceFile);
      const destFileName = `u${unit.number}_mindmap${ext}`;
      const destFile = path.join(publicMindmapsDir, destFileName);
      
      try {
        fs.copyFileSync(sourceFile, destFile);
        imageUrl = `/images/mindmaps/l1/${destFileName}`;
        console.log(`Đã copy hình ảnh cho Unit ${unit.number}: ${destFileName}`);
      } catch (err) {
        console.error(`Lỗi copy ảnh Unit ${unit.number}: ${err.message}`);
      }
    }

    const visualLesson = {
      id: `l1_u${unit.number}_visual`,
      title: `Mindmap - ${unit.title}`,
      type: "visual",
      imageUrl: imageUrl || "/images/placeholders/mindmap.jpg"
    };

    // Filter out old visual lessons and add the new one
    unit.lessons = unit.lessons.filter(l => l.type !== "visual");
    // Chèn nó lên đầu hoặc sau vocabulary/speaking
    unit.lessons.splice(1, 0, visualLesson); // Đứng ở vị trí thứ 2 (sau speaking)
  });

  fs.writeFileSync(seedPath, JSON.stringify(gradeData, null, 2));
  console.log(`[Thành công] Đã bổ sung phòng Visual/Mindmap vào 16 Units!`);
}

processVisuals();
