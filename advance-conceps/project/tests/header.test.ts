import CustomPage, { CustomPageType } from "./helper/page";

describe.skip("Test the website", () => {
  let page: CustomPageType;
  beforeEach(async () => {
    page = await CustomPage.build();
    await page.goto("http://localhost:3000");
  });
  afterEach(async () => {
    await page.close();
    page = undefined;
  });
  test("It should show correct header for google", async () => {
    await page.goto("https://www.google.com");
    expect(await page.title()).toBe("Google");
  });
  test("It should show correct header for post", async () => {
    await page.goto("http://localhost:3000/");
    const headerText = await page.getContentsOf(
      "#root > div > div > nav > div > a"
    );
    expect(headerText).toBe("Blogster");
    expect(await page.title()).toBe("Blog App");
  });
});
