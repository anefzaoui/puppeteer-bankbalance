'use strict'

const puppeteer = require('puppeteer');
const CONFIG = require('./config');
const SELECTORS = require('./selectors');

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(CONFIG.BANK_URL);

  const typeInField = async(selector, text) => {
    await page.focus(selector);
    await page.type(text);
  };

  const forceTypeInField = async(selector, text) => {
    await page.evaluate((s, t) => {
      var passElement = document.querySelector(s);
      passElement.value = t;
    }, selector, text);
  };

  await typeInField(SELECTORS.USERNAME_INPUT, CONFIG.USERNAME);
  await forceTypeInField(SELECTORS.PASSWORD_INPUT, CONFIG.PASSWORD);

  await page.click(SELECTORS.SUBMIT);
  await page.waitFor(SELECTORS.WAIT_FOR_SELECTOR);

  const moneyText = await page.evaluate(s => {
    let moneyElement = document.querySelector(s.MONEY_VALUE);
    return moneyElement.textContent;
  }, SELECTORS);

  console.log("Your account balance is: " + moneyText);

  browser.close();

})();
