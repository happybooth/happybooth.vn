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
