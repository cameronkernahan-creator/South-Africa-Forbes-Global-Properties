const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const inputFile = process.argv[2] || 'thanda-sales-process.html';
const outputFile = process.argv[3] || inputFile.replace('.html', '.pdf');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, inputFile);
  const html = fs.readFileSync(filePath, 'utf8');

  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.pdf({
    path: path.resolve(__dirname, outputFile),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: false
  });

  await browser.close();
  console.log('PDF generated: ' + outputFile);
})();
