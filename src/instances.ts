const puppeteer = require("puppeteer-extra");

export const getBrowser = async () => {
  return await puppeteer.launch({
    headless: false,
    args: ["--disable-notifications"],
    slowMo: 50,
    devtools: true,
    protocolTimeout: 6000000,
  });
};
