import puppeteer, { Browser, Page } from "puppeteer";
import generateUser from "../factories/userFactory";
import generateSession from "../factories/sessionFactory";
export type CustomPageType = Page & Browser & CustomPage;
class CustomPage {
  private page: Page;
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    });
    const [page] = await browser.pages();
    const customPage = new CustomPage(page);

    return new Proxy<CustomPageType>(customPage as CustomPageType, {
      get: function (target, property, receiver) {
        if (target[property]) {
          return target[property];
        }
        let value = browser[property];
        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? browser : this, args);
          };
        }
        value = page[property];
        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? page : this, args);
          };
        }

        return value;
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await generateUser();
    const { session, sig } = generateSession(user);
    await this.page.browser().setCookie({
      name: "session",
      value: session,
      domain: "localhost:3000",
    });
    await this.page.browser().setCookie({
      name: "session.sig",
      value: sig,
      domain: "localhost:3000",
    });
    await this.page.reload();
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitForSelector("a[href='/auth/logout']");
    return 
  }
  async getContentsOf(selector: string) {
    return await this.page.$eval(selector, (el) => el.innerHTML);
  }
}

export default CustomPage;
