const launches = new Map();
let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date(Date.now() + 15000000000),
  target: "Kepler-442 B",
  customers: ["Nasa"],
  upcoming: true,
  success: true,
};
launches.set(launch.flightNumber, launch);
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
module.exports = {
  getAllLaunches,
  addLaunch,
};
