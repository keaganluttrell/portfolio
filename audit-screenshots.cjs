const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const pages = [
    { url: 'http://localhost:4321', name: 'home' },
    { url: 'http://localhost:4321/about', name: 'about' },
    { url: 'http://localhost:4321/projects', name: 'projects' },
  ];

  for (const page of pages) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(page.url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);
    
    // Screenshot of the full page
    const fullPath = path.join(__dirname, `screenshot-${page.name}-full.png`);
    await p.screenshot({ path: fullPath, fullPage: true });
    
    // Screenshot of just the nav area
    const navPath = path.join(__dirname, `screenshot-${page.name}-nav.png`);
    const navEl = await p.$('.site-header, header, nav');
    if (navEl) {
      await navEl.screenshot({ path: navPath });
    }
    
    // Get the computed styles of nav links
    const navLinks = await p.$$eval('.nav-link, nav a', links => {
      return links.map(link => {
        const style = window.getComputedStyle(link);
        return {
          text: link.textContent.trim(),
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
        };
      });
    });
    
    console.log(`\n=== ${page.name} nav links ===`);
    console.log(JSON.stringify(navLinks, null, 2));
    
    await ctx.close();
  }

  await browser.close();
})();
