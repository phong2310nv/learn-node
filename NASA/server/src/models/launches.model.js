const { initialLaunches } = require("./initital");
const launches = require("./launches.mongo");
const planets = require("./planet.mongo");

let latestFlightNumber = 100;

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    console.log(launch);

    throw new Error("No Matching planet found !!");
  }
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
  return launch;
};

initialLaunches.forEach((l) => {
  saveLaunch(l);
});

async function getLatestFlightNumber(params) {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  return latestLaunch?.flightNumber || 1;
}

const getAllLaunches = async () => {
  return await launches.find({}, { _id: 0 });
};
async function scheduleNewLaunch(launch) {
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
  return await launches.findOne({ flightNumber: launchId });
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
module.exports = {
  scheduleNewLaunch,
  getAllLaunches,
  removeLaunch,
};
