exports.puppeteerScroll = async function (page, params) {
  const { timeout } = params;

  await page.evaluate(async (timeout) => {
    const process = () => {
      return new Promise((resolve, reject) => {
        try {
          const searchInput = document.querySelector(
            "input[placeholder='Buscar']"
          );
          const friendsContainer =
            searchInput.parentNode?.parentNode?.parentNode?.parentNode
              ?.parentNode?.parentNode;

          const html = document.querySelector("html");
          if (!html) return;

          const wait = (ms) =>
            new Promise((resolve) => setTimeout(resolve, ms));
          const scroll = () => {
            if (!html) return;
            html.scrollTop = html.scrollHeight;
          };

          let timer = null;

          const observer = new MutationObserver(async () => {
            scroll();
            clearTimeout(timer);

            timer = setTimeout(() => {
              observer.disconnect();
              resolve();
            }, timeout);
          });
          observer.observe(friendsContainer, {
            childList: true,
            subtree: true,
          });
          scroll();
        } catch (error) {
          reject(error);
        }
      });
    };

    await process();
  }, timeout);
};
