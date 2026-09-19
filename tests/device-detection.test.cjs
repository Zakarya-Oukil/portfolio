const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/utils/deviceDetection.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function load(overrides = {}) {
  const exports = {};
  const window = { innerWidth: 1440, innerHeight: 900, navigator: { userAgent: 'Desktop Browser', platform: 'Win32', maxTouchPoints: 0, vendor: '' }, ...overrides };
  vm.runInNewContext(compiled, { exports, window });
  return exports;
}
test('desktop starts with the desktop workspace', () => assert.equal(load().detectInitialOS(), 'desktop'));
test('iPhone starts with iOS', () => assert.equal(load({ innerWidth: 430, navigator: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', maxTouchPoints: 5 } }).detectInitialOS(), 'ios'));
test('Android starts with Material You', () => assert.equal(load({ innerWidth: 412, navigator: { userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel)', maxTouchPoints: 5 } }).detectInitialOS(), 'android'));
test('iPad desktop-class user agent still selects iOS', () => assert.equal(load({ navigator: { userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 5 } }).detectInitialOS(), 'ios'));
test('small touch device uses a mobile layout', () => assert.equal(load({ innerWidth: 390, navigator: { userAgent: 'Unknown', maxTouchPoints: 1, vendor: '' } }).detectInitialOS(), 'android'));
test('a narrow desktop window is not mistaken for a touch phone', () => assert.equal(load({ innerWidth: 430 }).detectInitialOS(), 'desktop'));
test('a large touch laptop still selects desktop', () => assert.equal(load({ navigator: { userAgent: 'Windows', maxTouchPoints: 10, platform: 'Win32' } }).detectInitialOS(), 'desktop'));
test('server rendering safely defaults to desktop', () => { const exports = {}; vm.runInNewContext(compiled, { exports }); assert.equal(exports.detectInitialOS(), 'desktop'); });
