const initialLaunches = [
  {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date(Date.now() + 15000000000),
    target: "Kepler-442 b",
    customers: ["Nasa"],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 101,
    mission: "Kepler Exploration Y",
    rocket: "Explorer IS3",
    launchDate: new Date(Date.now() + 20000000000),
    target: "Kepler-1649 b",
    customers: ["Nasa"],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 102,
    mission: "Kepler Exploration Z",
    rocket: "Explorer IS2",
    launchDate: new Date(Date.now() + 25000000000),
    target: "Kepler-296 A f",
    customers: ["Nasa"],
    upcoming: false,
    success: false,
  },
];

module.exports = {
  initialLaunches,
};
