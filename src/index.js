import puppeteer from "puppeteer";

(async () => {
  const wait = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.facebook.com/");

  // Log in
  await page.type("#email", "soybarney666@hotmail.com");
  await page.type("#pass", "SPARTAN1998");
  await page.click("button[name='login']");
  await wait(5000);

  // Go to profile page
  const profileUrl = "https://www.facebook.com/esau.gonzalezsoto";
  await page.goto(profileUrl);
  await wait(5000);

  let found = false;
  while (!found) {
    // Go to friends page
    await page.goto(`${profileUrl}&sk=friends`);
    await wait(5000);

    // body scroll
    await page.evaluate(() => {
      // get height of html
      let scrollHeight = 0;

      const scroll = () => {
        const element = document.querySelector("html");
        if (element) element.scrollTop = element.scrollHeight;
      };

      let maxScrolls = 1000;
      const scrollLoop = async () => {
        while (scrollHeight !== document.documentElement.scrollHeight) {
          scrollHeight = document.documentElement.scrollHeight;
          scroll();
          if (maxScrolls-- === 0) break;

          await wait(1000);
        }

        await wait(10000);
      };

      scrollLoop();
    });


    // const friendsSelector = "body div div div div div[role=main] div div div div div div div div div:has( label input[aria-label='Label for text input'] )";
    // await page.waitForSelector(friendsSelector);
    // await page.evaluate((selector) => {
    //   const element = document.querySelector(selector);
    //   if (!element) {
    //     console.error(`Element ${selector} not found`);
    //     return;
    //   }

    //   element.scrollTop = element.scrollHeight;
    // }, friendsSelector);

    // Search for John Doe
    // const johnDoeSelector = 'a[data-gt*="John Doe"]';
    // const johnDoeLink = await page.$(johnDoeSelector);

    // if (johnDoeLink) {
    //   const johnDoeName = await page.evaluate(
    //     (link) => link.textContent,
    //     johnDoeLink
    //   );
    //   // @ts-ignore
    //   const johnDoeUrl = await page.evaluate((link) => link.href, johnDoeLink);

    //   console.log(`Found John Doe: ${johnDoeName} (${johnDoeUrl})`);
    //   found = true;
    // } else {
    //   // Go to another profile from the friends list
    //   const friendLinks = await page.$$('a[data-gt*="ProfilePictureWrapper"]');
    //   const randomFriendLink =
    //     friendLinks[Math.floor(Math.random() * friendLinks.length)];
    //   const friendName = await page.evaluate(
    //     (link) => link.getAttribute("aria-label"),
    //     randomFriendLink
    //   );
    //   console.log(`Going to ${friendName}'s profile...`);
    //   await randomFriendLink.click();
    // }
  }

  //   await browser.close();
})();
