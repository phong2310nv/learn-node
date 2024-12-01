const {
  getAllLaunches,
  removeLaunch,
  scheduleNewLaunch,
} = require("../../models/launches.model");

const httpGetAllLaunches = async (req, res) => {
  return res.status(200).json(await getAllLaunches());
};
const httpAddNewLaunch = async (req, res) => {
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
  const newLaunch = await scheduleNewLaunch(launch);
  return res.status(201).json(newLaunch);
};
async function httpAbortLaunch(req, res) {
  const launchId = req.params.id;
  const result = await removeLaunch(launchId);
  if (result) {
    return res.status(200).json({ success: true, ...result });
  } else {
    res.status(404).json({ success: false, message: "Launch not found" });
  }
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
