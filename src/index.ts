const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
import { Browser, Page } from "puppeteer";
import { friendsSearch, retrieveFriends } from "./friends";
import { getBrowser } from "./instances";

puppeteer.use(StealthPlugin());

const url = "https://www.facebook.com/";
const profileUrl = "https://www.facebook.com/profile.php?id=100052777428396";
const nameSearch = "BeTito Reyes";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const date = new Date();
const fileName = `results-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.json`;
const main = async () => {
  await saveToFile("Starting process");
  const browser: Browser = await getBrowser();

  const rootPage = await browser.newPage();
  await blockResources(rootPage);
  await rootPage.goto(url, { waitUntil: "networkidle2" });

  await login(rootPage);

  const pageFound = await goToFriendsPage(rootPage, profileUrl);
  if (!pageFound) {
    console.log(`Could not find the friends page of ${profileUrl}`);
    return;
  }

  const rootProfiles = await retrieveFriends(rootPage);
  console.log(`Found ${rootProfiles.length} profiles`);
  const foundInProfiles = [];
  let index = 0;

  try {
    for (const profile of rootProfiles) {
      console.log(
        `Searching ${profile.name}, number ${++index} of ${rootProfiles.length}`
      );
      const page = await browser.newPage();
      await blockResources(page);

      const pageFound = await goToFriendsPage(page, profile.url);
      if (!pageFound) {
        console.log(`Could not find the friends page of ${profile.name}`);
        page.close();
        continue;
      }

      const results = await friendsSearch(page, nameSearch);

      if (results) {
        console.log(results);
        await saveToFile(results, true);
        foundInProfiles.push(profile);
      }

      page.close();
    }
  } catch (error) {
    console.log(`The process failed at index ${index}`);
    console.log(`Saved calculated profiles to file`);
    await saveToFile(foundInProfiles, true);
  }

  console.log(`Profiles that have ${nameSearch} as a friend:`);
  console.log(foundInProfiles);

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

const saveToFile = (data: any, prettyPrint: boolean = false) => {
  return new Promise((resolve, reject) => {
    const fs = require("fs");

    let jsonData;
    if (prettyPrint) {
      jsonData = JSON.stringify(data, null, 2);
    } else {
      jsonData = JSON.stringify(data);
    }
    fs.appendFile(fileName, jsonData, (err: any) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

main();
