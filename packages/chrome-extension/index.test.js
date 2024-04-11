const puppeteer = require('puppeteer');

const EXTENSION_PATH = process.cwd();
const EXTENSION_ID = 'pblabbkdbmokefeklifcaodebhebpfhg';

let browser;

beforeEach(async () => {
    browser = await puppeteer.launch({
        // Set to 'new' to hide Chrome if running as part of an automated build.
        headless: false,
        args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`,
        ],
    });
});

afterEach(async () => {
    await browser.close();
    browser = undefined;
});

test('popup has two buttons', async () => {
    const page = await browser.newPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`);

    const list = await page.$('form');
    const children = await list.$$('button');

    expect(children.length).toBe(2);
});
