import { Browser, Page } from "puppeteer";
const { puppeteerScroll } = require("./scroll");

export const friendsSearch = async (page: Page, name: String) => {
  await page.waitForSelector('input[placeholder="Buscar"]');
  await page.type('input[placeholder="Buscar"]', name.toString());
  await page.keyboard.press("Enter");
  await page.waitForSelector("div[role='main']", { timeout: 1000 });

  const profiles = await retrieveFriends(page);

  const result = profiles.find((profile) => profile.name == name);

  if (result) {
    console.log("FOUND: ", result);
  } else {
    console.log("NOT FOUND");
  }

  return result;
};

export const retrieveFriends = async (page: Page) => {
  let friends: Profile[] = [];
  await puppeteerScroll(page, { timeout: 1000 });

  friends = await page.evaluate(() => {
    const searchInput = document.querySelector("input[placeholder='Buscar']");
    if (!searchInput) return [];
    const friendsContainer =
      searchInput.parentNode?.parentNode?.parentNode?.parentNode?.parentNode
        ?.parentNode;
    if (!friendsContainer) return [];

    return Array.from(
      friendsContainer.querySelectorAll("div > div > div > a > span")
    )
      .filter((span) => {
        const _span = span as HTMLSpanElement;
        return _span.innerText;
      })
      .map((span) => {
        const _span = span as HTMLSpanElement;
        const parent = _span.parentElement as HTMLAnchorElement;
        return {
          name: _span.innerText,
          url: parent.href,
        };
      });
  });

  return friends;
};
