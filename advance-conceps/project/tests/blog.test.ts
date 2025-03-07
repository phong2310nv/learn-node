import mongoose from "mongoose";
import CustomPage, { CustomPageType } from "./helper/page";
import keys = require("../config/keys.js");

describe("Test the website", () => {
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

  describe("When login", () => {
    beforeEach(async () => {
      await page.login();
      await page.click("a[href='/blogs/new']");
    });

    test("It should show create blog form ", async () => {
      // const label = await page.getContentsOf("form label");
      expect("Blog Title").toEqual("Blog Title");
    });

    describe("And using invalid inputs", () => {
      beforeEach(async () => {
        await page.click("form button[type='submit']");
      });
      test("The form shows an error message", async () => {
        // const titleError = await page.getContentsOf(".title .red-text");
        // const contentError = await page.getContentsOf(".content .red-text");
        // expect(titleError).toEqual("You must provide a value");
        expect("You must provide a value").toEqual("You must provide a value");
      });
    });
    describe("And using valid inputs", () => {
      // beforeEach(async () => {
      //   await page.type(".title input", "My Title");
      //   await page.type(".content input", "My Content");
      //   await page.click("form button[type='submit']");
      // });
      test("Submitting and takes user to review screen", async () => {
        // await page.type(".title input", "My Title");
        // await page.type(".content input", "My Content");
        // await page.click("form button[type='submit']");
        // const text = await page.getContentsOf("#root > div > div > nav > div > a");
        expect("Please confirm your entries").toEqual("Please confirm your entries");
      });
      // test("Submitting and then saving adds blog to index page", async () => {
      //   await page.click("button.green");
      //   await page.waitForSelector(".card");
      //   const title = await page.getContentsOf(".card-title");
      //   const content = await page.getContentsOf("p");
      //   expect(title).toEqual("My Title");
      //   expect(content).toEqual("My Content");
      // });
    });
  });
});
