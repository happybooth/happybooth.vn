// The wedding invitation site (invite.happybooth.vn) is linked from every menu and from the home page.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function htmlFiles(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

const MENU_LINK = '<a href="https://invite.happybooth.vn/" class="vi-only" lang="vi">Thiệp cưới</a>';
const sharedHeaderPages = ['index.html', ...htmlFiles('pages')]
  .filter(file => read(file).includes('data-i18n="common.nav.frame"'));

test('the nine shared-header pages each link to the invite site three times', () => {
  assert.strictEqual(sharedHeaderPages.length, 9);
  for (const file of sharedHeaderPages) {
    const html = read(file);
    const at = [];
    for (let i = html.indexOf(MENU_LINK); i !== -1; i = html.indexOf(MENU_LINK, i + 1)) at.push(i);
    assert.strictEqual(at.length, 3, file + ' has ' + at.length + ' invite menu links');
    for (const i of at) {
      const before = html.slice(html.lastIndexOf('href="/', i), i);
      const after = html.slice(html.indexOf('href="/', i));
      assert.ok(before.startsWith('href="/frame"'), file + ': the link before the invite link is not /frame');
      assert.ok(after.startsWith('href="/price"'), file + ': the link after the invite link is not /price');
    }
  }
});

test('English mode hides vi-only content', () => {
  assert.match(read('assets/css/style.css'), /html\[lang="en"\] \.vi-only\s*\{\s*display:\s*none;?\s*\}/);
});

const home = read('index.html');
const BAND_OPEN = '<section class="home-section invite-band vi-only" lang="vi"';

test('home invite band sits between services and reviews', () => {
  const services = home.indexOf('data-i18n="home.services.title"');
  const start = home.indexOf(BAND_OPEN);
  const reviews = home.indexOf('data-i18n="home.reviews.title"');
  assert.ok(start !== -1, 'no invite band');
  assert.ok(services < start && start < reviews, 'invite band is not between services and reviews');
  const band = home.slice(start, home.indexOf('</section>', start));
  for (const text of ['249.000đ', '5.500.000đ', 'https://invite.happybooth.vn/#mau', 'https://invite.happybooth.vn/#gia',
    '/mau-son-son/', '/mau-dai-phim/', '/mau-ep-hoa/']) {
    assert.ok(band.includes(text), 'invite band lacks ' + text);
  }
  assert.ok(!band.includes('target='), 'invite band links must open in the same tab');
});

test('services list and price band mention the invite', () => {
  const rowStart = home.indexOf('<li class="services__row vi-only" lang="vi">');
  assert.ok(rowStart !== -1, 'no invite services row');
  const row = home.slice(rowStart, home.indexOf('</li>', rowStart));
  assert.ok(row.includes('Thiệp cưới online') && row.includes('Từ 249.000đ'), 'services row copy');
  const noteStart = home.indexOf('class="price-band__invite vi-only" lang="vi"');
  assert.ok(noteStart !== -1, 'no price band invite note');
  assert.ok(home.slice(noteStart, home.indexOf('</p>', noteStart)).includes('5.500.000đ'), 'price note lacks 5.500.000đ');
});

test('invite images exist and declare their size', () => {
  const imgs = [...home.matchAll(/<img [^>]*src="(assets\/images\/invite\/[^"]+)"[^>]*>/g)];
  assert.ok(imgs.length >= 4, 'expected 3 band images and 1 services image, got ' + imgs.length);
  for (const [tag, src] of imgs) {
    assert.ok(fs.existsSync(path.join(root, src)), src + ' does not exist');
    assert.match(tag, /width="\d+"/, src + ' has no width');
    assert.match(tag, /height="\d+"/, src + ' has no height');
  }
});
