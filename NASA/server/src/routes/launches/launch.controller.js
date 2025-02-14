const {
  getAllLaunches,
  removeLaunch,
  scheduleNewLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");
const { redisClient } = require("../../services/redis");

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);

  let version = await redisClient.get("launches:version");
  if (!version) {
    version = 1;
    await redisClient.set("launches:version", version);
  }
  const key = `launches:v${version}:ship-${skip}:limit-${limit}`;
  let launches = await redisClient.get(key);
  if (launches) {
    return res.status(200).json(JSON.parse(launches));
  }
  launches = await getAllLaunches(skip, limit);
  redisClient.setEx(key, 60, JSON.stringify(launches));
  return res.status(200).json(launches);
};
const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;
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
  await redisClient.incr("launches:version");
  const newLaunch = await scheduleNewLaunch(launch);
  return res.status(201).json(newLaunch);
};
async function httpAbortLaunch(req, res) {
  const launchId = req.params.id;
  const result = await removeLaunch(launchId);
  if (result) {
    await edisClient.incr("launches:version");

    return res.status(200).json({ success: true, ...result });
  } else {
    res.status(404).json({ success: false, message: "Launch not found" });
  }
}

const invalidateCache = async () => {
  redisClient.incr("launches:version");
};
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
