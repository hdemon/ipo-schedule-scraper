const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const scrape = (async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.traders.co.jp/ipo_info/schedule/schedule.asp');
  const schedule = await page.evaluate(() => {
    const table = document.querySelector('#middle_contents_820 > table:nth-child(3) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3)');
    const rows = Array.from(table.querySelectorAll('tr:nth-child(2n)'));
    return rows.map((row) => {
        const bb_term = row.querySelector('td:nth-child(2)').innerHTML;
        return {
            name: row.querySelector('td:nth-child(3)').innerText,
            main_manager: row.querySelector('td:nth-child(6)').innerHTML,
            bb_term_start: bb_term.split('-')[0],
            bb_term_end: bb_term.split('-')[1],
            temporary_condition: row.querySelector('td:nth-child(7)').innerHTML,
        }
    })
  });
  
  await browser.close();
  return schedule;
});
  
scrape().then((result) => console.log(result));
