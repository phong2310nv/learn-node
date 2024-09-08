const { initialLaunches } = require("./initital");

const launches = new Map();
let latestFlightNumber = 100;

initialLaunches.forEach((l) => {
  launches.set(l.flightNumber, l);
});
const getAllLaunches = () => {
  return Array.from(launches.values());
};
const addLaunch = (payload) => {
  latestFlightNumber++;
  const newLaunch = {
    flightNumber: latestFlightNumber,
    upcoming: true,
    success: true,
    customers: ["Nasa"],
    ...payload,
  };
  launches.set(latestFlightNumber, newLaunch);
  return newLaunch;
};
const removeLaunch = (id) => {
  const launch = launches.get(+id);
  if (launch) {
    launch.upcoming = false;
    launch.success = false;
    return launch;
  } else {
    return false;
  }
};
module.exports = {
  getAllLaunches,
  addLaunch,
  removeLaunch,
};
