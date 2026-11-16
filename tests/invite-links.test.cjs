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

const MENU_LINK = /<a href="\/thiep-cuoi-online" class="(?:active )?vi-only" lang="vi">Thiệp cưới<\/a>/g;
const sharedHeaderPages = ['index.html', ...htmlFiles('pages')]
  .filter(file => read(file).includes('data-i18n="common.nav.frame"'));

test('the shared-header pages each link to the invite page three times', () => {
  assert.strictEqual(sharedHeaderPages.length, 10);
  for (const file of sharedHeaderPages) {
    const html = read(file);
    const at = [...html.matchAll(MENU_LINK)].map(m => m.index);
    assert.strictEqual(at.length, 3, file + ' has ' + at.length + ' invite menu links');
    for (const i of at) {
      const before = html.slice(html.lastIndexOf('href="/', i - 1), i);
      const after = html.slice(html.indexOf('href="/', html.indexOf('</a>', i)));
      assert.ok(before.startsWith('href="/frame"'), file + ': the link before the invite link is not /frame');
      assert.ok(after.startsWith('href="/price"'), file + ': the link after the invite link is not /price');
    }
  }
  assert.ok(!sharedHeaderPages.some(file => read(file).includes('<a href="https://invite.happybooth.vn/" class="vi-only"')),
    'a menu still links straight to the invite site');
});

const INVITE_PAGE = 'pages/services/thiep-cuoi-online.html';
const TEMPLATES = ['son-son', 'dai-phim', 'gom-lam', 'thu-tay', 'tap-chi', 'dem-trang', 'ep-hoa', 'pho-hoi', 'cat-set', 'nang-som'];

test('the invite page is a registered public page', () => {
  assert.ok(fs.existsSync(path.join(root, INVITE_PAGE)), INVITE_PAGE + ' does not exist');
  const page = read(INVITE_PAGE);
  assert.ok(page.startsWith('---\npermalink: /thiep-cuoi-online.html\n---\n'), 'permalink front matter');
  assert.ok(page.includes('<link rel="canonical" href="https://happybooth.vn/thiep-cuoi-online">'), 'canonical');
  assert.ok(page.includes('data-page="thiep-cuoi-online"'), 'data-page');
  assert.ok(page.includes('<a href="/thiep-cuoi-online" class="active vi-only" lang="vi">Thiệp cưới</a>'), 'menu item marked active');
  assert.ok(read('assets/js/router.js').includes("'thiep-cuoi-online': '/thiep-cuoi-online'"), 'router path');
  assert.ok(read('assets/js/router.js').includes("'/thiep-cuoi-online'];"), 'preloaded with the main nav pages');
  assert.ok(read('sitemap.xml').includes('<loc>https://happybooth.vn/thiep-cuoi-online</loc>'), 'sitemap');
  for (const lang of ['vi', 'en']) {
    assert.ok(JSON.parse(read('assets/lang/' + lang + '.json'))['meta.title.thiep-cuoi-online'], lang + '.json title');
  }
  const og = page.match(/<meta property="og:image" content="https:\/\/happybooth\.vn\/([^"]+)">/);
  assert.ok(og && fs.existsSync(path.join(root, og[1])), 'share image exists');
});

test('the invite page sends visitors on with a "Xem chi tiết" button', () => {
  const page = read(INVITE_PAGE);
  assert.match(page, /<a class="btn btn--pink" href="https:\/\/invite\.happybooth\.vn\/">Xem chi tiết<\/a>/);
  for (const t of TEMPLATES) {
    assert.ok(page.includes('href="https://invite.happybooth.vn/mau-' + t + '/"'), 'no link to template ' + t);
    assert.ok(fs.existsSync(path.join(root, 'assets/images/invite/' + t + '.webp')), 'no image for ' + t);
  }
});

test('the invite page FAQ matches its JSON-LD', () => {
  const page = read(INVITE_PAGE);
  const ld = JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const faq = ld['@graph'].find(node => node['@type'] === 'FAQPage');
  const names = faq.mainEntity.map(q => q.name);
  const summaries = [...page.matchAll(/<summary>([^<]+)<\/summary>/g)].map(m => m[1]);
  assert.deepStrictEqual(summaries, names);
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
