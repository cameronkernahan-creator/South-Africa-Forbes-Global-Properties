const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, 'sa-forbes-introduction.html');
  // Set content directly to avoid network timeout on external font requests
  const fs = require('fs');
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace Google Fonts link with safe system fallbacks for PDF
  html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com[^"]*" rel="stylesheet">/,
    `<style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
    </style>`
  );

  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Small delay to let any rendering settle
  await new Promise(r => setTimeout(r, 2000));

  await page.pdf({
    path: path.resolve(__dirname, 'SA-Forbes-Global-Properties-Introduction.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: false
  });

  await browser.close();
  console.log('PDF generated: SA-Forbes-Global-Properties-Introduction.pdf');
})();
