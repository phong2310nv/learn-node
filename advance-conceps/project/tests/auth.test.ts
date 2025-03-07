import CustomPage, { CustomPageType } from "./helper/page";
import keys = require("../config/keys.js");
import mongoose from "mongoose";
describe.skip("Test the website", () => {
  let page: CustomPageType;
  beforeAll(async () => {
    await mongoose.connect(keys.mongoURI);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  beforeEach(async () => {
    page = await CustomPage.build();
    await page.goto("http://localhost:3000");
  });
  afterEach(async () => {
    await page.close();
    page = undefined;
  });
  test("It should login as google", async () => {
    await page.goto("http://localhost:3000");
    await page.click("a[href='/auth/google']");
    expect(await page.url()).toMatch(/accounts\.google\.com/);
  });
  test("When signed in, shows logout button", async () => {
    await page.login();
    const logoutText = page.$eval("a[href='/auth/logout']", (e) => e);
    expect(logoutText).toBe("Logout");
  });
});
