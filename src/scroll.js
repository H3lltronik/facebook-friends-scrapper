exports.puppeteerScroll = async function (page) {
  let found = false;
  while (!found) {
    // @ts-ignore
    await page.evaluate(async () => {
      let scrollHeight = 0;

      const scroll = () => {
        const element = document.querySelector("html");
        if (element) element.scrollTop = element.scrollHeight;
      };

      let maxScrolls = 1000;
      while (scrollHeight !== document.documentElement.scrollHeight) {
        scrollHeight = document.documentElement.scrollHeight;
        scroll();
        if (maxScrolls-- === 0) break;

        await page.waitForTimeout(1000);
      }

      console.log("finished scrolling");
    });
  }
};
