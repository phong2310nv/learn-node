const { getAllLaunches, addLaunch } = require("../../models/launches.model");
const httpGetAllLaunches = (req, res) => {
  return res.status(200).json(getAllLaunches());
};
const httpAddNewLaunch = (req, res) => {
  const launch = req.body;
  console.log(launch);
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing Data",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  const newLaunch = addLaunch(launch);
  return res.status(201).json(newLaunch);
};
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
