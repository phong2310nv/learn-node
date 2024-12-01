const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test the GET /launches", () => {
    test("It should return 200", async () => {
      const res = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test the POST /launches", () => {
    const completeLaunchData = {
      mission: "AAAAA",
      rocket: "Rocket YYY",
      target: "Kepler-1410 b",
      launchDate: "January 4, 2028",
    };
    const completeLaunchDataWithNoDate = {
      mission: "AAAAA",
      rocket: "Rocket YYY",
      target: "Kepler-1410 b",
    };
    const completeLaunchDataWithInvalidDate = {
      mission: "AAAAA",
      rocket: "Rocket YYY",
      target: "Kepler-1410 b",
      launchDate: "zzzz",
    };
    test("It should return 201", async () => {
      const res = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(res.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(res.body).toMatchObject(completeLaunchDataWithNoDate);
    });
    test("It should catch missing required properties", async () => {
      const res = await request(app)
        .post("/launches")
        .send(completeLaunchDataWithNoDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body).toStrictEqual({ error: "Missing Data" });
    });
    test("It should catch invalid date", async () => {
      const res = await request(app)
        .post("/launches")
        .send(completeLaunchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });
});
