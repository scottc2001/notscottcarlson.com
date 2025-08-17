const fs = require('fs');
const path = require('path');
const { exiftool } = require('exiftool-vendored');

const folderPath = path.join(__dirname, 'Repairs');
const outputFile = path.join(__dirname, 'repairs.json');

async function generateJson() {
  try {
    const files = fs.readdirSync(folderPath).filter(file => /\.(jpe?g|png)$/i.test(file));

    const data = [];
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const exif = await exiftool.read(filePath);
      data.push({
        file: file,
        dateTaken: exif.DateTimeOriginal || null // capture date
      });
    }

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log('repairs.json generated with EXIF dates!');
    await exiftool.end();
  } catch (err) {
    console.error('Error generating JSON:', err);
  }
}

generateJson();
