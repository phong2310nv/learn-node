const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require('../../models/planet.model');
const { redisClient } = require('../../services/redis');

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await redisClient.connect();
    await loadPlanetsData();

  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test the GET /api/v1/launches", () => {
    test("It should return 200", async () => {
      const res = await request(app)
        .get("/api/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test the POST /api/v1/launches", () => {
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
        .post("/api/v1/launches")
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
        .post("/api/v1/launches")
        .send(completeLaunchDataWithNoDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body).toStrictEqual({ error: "Missing Data" });
    });
    test("It should catch invalid date", async () => {
      const res = await request(app)
        .post("/api/v1/launches")
        .send(completeLaunchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });
});
