const fs = require('fs');
const path = require('path');
const { exiftool } = require('exiftool-vendored');

const folderPath = path.join(__dirname, '2022-06-11_CampusPack');
const outputFile = path.join(__dirname, '2022-06-11_CampusPack.json');

async function generateJson() {
  try {
    const files = fs.readdirSync(folderPath).filter(file => /\.(jpe?g|png|mp4|mov|webm)$/i.test(file));

    const data = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      let dateTaken = null;

      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        try {
          const exif = await exiftool.read(path.join(folderPath, file));
          if (exif.DateTimeOriginal) {
            const dt = new Date(exif.DateTimeOriginal);
            dateTaken = {
              year: dt.getFullYear(),
              month: dt.getMonth() + 1,
              day: dt.getDate(),
              hour: dt.getHours(),
              minute: dt.getMinutes(),
              second: dt.getSeconds()
            };
          }
        } catch (err) {
          console.warn(`No EXIF data for ${file}:`, err.message);
        }
      }

      data.push({ file, dateTaken });
    }

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`${outputFile} generated successfully!`);

    await exiftool.end();
  } catch (err) {
    console.error('Error generating JSON:', err);
  }
}

generateJson();
