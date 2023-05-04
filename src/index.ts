const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
import { Browser, Page } from "puppeteer";
import { friendsSearch, retrieveFriends } from "./friends";
import { getBrowser } from "./instances";
import { saveToFile, log, LOG_TYPES } from "./logger";

puppeteer.use(StealthPlugin());

const url = "https://www.facebook.com/";
const profileUrl = "https://www.facebook.com/esau.gonzalezsoto";
const nameSearch = "Helen De Anda Salmerón";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const main = async () => {
  await log("Starting process");
  const browser: Browser = await getBrowser();

  const rootPage = (await browser.pages())[0];
  await blockResources(rootPage);
  await rootPage.goto(url, { waitUntil: "networkidle2" });

  await login(rootPage);

  const pageFound = await goToFriendsPage(rootPage, profileUrl);
  if (!pageFound) {
    await log(`Could not find the friends page of ${profileUrl}`);
    return;
  }

  const rootProfiles = await retrieveFriends(rootPage);
  await log(`Found ${rootProfiles.length} profiles`);
  const foundInProfiles = [];
  let index = 0;

  try {
    for (const profile of rootProfiles) {
      if (index > 0) await log("---------------------------------");
      await log(
        `Searching ${profile.name}, number ${++index} of ${rootProfiles.length}`
      );
      const page = await browser.newPage();
      await blockResources(page);

      const pageFound = await goToFriendsPage(page, profile.url);
      if (!pageFound) {
        await log(`Could not find the friends page of ${profile.name}`);
        page.close();
        continue;
      }

      const results = await friendsSearch(page, nameSearch);

      if (results) {
        await log(JSON.stringify(results), { prettyPrint: true });
        await saveToFile(results, true);
        foundInProfiles.push(profile);
      }

      page.close();
    }
  } catch (error) {
    await log(`The process failed at index ${index}`, { type: LOG_TYPES.ERROR});
    await log(`Saved calculated profiles to file`);
    await saveToFile(foundInProfiles, true);
  }

  await log(`Profiles that have ${nameSearch} as a friend:`);
  await log(JSON.stringify(foundInProfiles), { prettyPrint: true });

  await wait(10000);
  await browser.close();
};

const login = async (page: Page) => {
  await page.type("#email", "soybarney666@hotmail.com");
  await page.type("#pass", "SPARTAN1998");
  await page.click("button[name='login']");

  await page.waitForNetworkIdle();
};

const checkNotPageFound = async (page: Page) => {
  const contentUnavailable = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll("span"));
    return spans.some((span) =>
      span.innerText.includes(
        "Este contenido no está disponible en este momento"
      )
    );
  });
  return contentUnavailable;
};

const blockResources = async (page: Page) => {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    // block all unnecessary requests
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet" ||
      request.resourceType() === "font" ||
      request.resourceType() === "media" ||
      request.resourceType() === "websocket"
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
};

const goToFriendsPage = async (page: Page, profileUrl: String) => {
  await page.goto(`${profileUrl}/friends`, { waitUntil: "networkidle2" });

  if (await checkNotPageFound(page))
    await page.goto(`${profileUrl}&sk=friends`, {
      waitUntil: "networkidle2",
    });

  if (await checkNotPageFound(page)) return false;

  return true;
};

main();
