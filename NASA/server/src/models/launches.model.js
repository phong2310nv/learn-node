const { initialLaunches } = require("./initital");
const launches = require("./launches.mongo");
const planets = require("./planet.mongo");
const axios = require("axios");

const saveLaunch = async (launch) => {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
  return launch;
};

// initialLaunches.forEach((l) => {
//   saveLaunch(l);
// });

async function getLatestFlightNumber(params) {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  return latestLaunch?.flightNumber || 1;
}

const getAllLaunches = async (skip, limit) => {
  return await launches
    .find({}, { _id: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};
async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    console.log(launch);

    throw new Error("No Matching planet found !!");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customers: ["Nasa"],
    flightNumber: newFlightNumber,
  });
  return await saveLaunch(newLaunch);
}

async function isExistLaunchId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

const removeLaunch = async (id) => {
  const launch = await isExistLaunchId(+id);
  if (launch) {
    await launches.updateOne(
      { flightNumber: +id },
      { upcoming: false, success: false }
    );
    return launch;
  } else {
    return false;
  }
};

const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data");
  const response = await axios.post(SPACE_X_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        { path: "rocket", select: { name: 1 } },
        { path: "payloads", select: { customers: 1 } },
      ],
    },
  });
  console.log(response);
  if (response.status !== 200) {
    console.log("Problem when downloading launch data");
    throw new Error("Launch data download fail");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      success: launchDoc["success"],
      customers,
    };
    saveLaunch(launch);
    console.table(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Already loaded");
    return;
  }
  await populateLaunches();
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}
module.exports = {
  loadLaunchData,
  scheduleNewLaunch,
  getAllLaunches,
  removeLaunch,
};
