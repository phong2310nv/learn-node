const { v1 } = require("uuid");
const requireLogin = require("../middlewares/requireLogin");
const { getPresignedUrl } = require("../services/aws");

module.exports = (app) => {
  app.get("/api/upload", requireLogin, async (req, res) => {
    console.log(req.body, "req.body");
    const { fileName, contentType } = req.query;
    const key = `${req.user.id}/${v1()}_${fileName}`;
    const url = await getPresignedUrl(key, "PUT", contentType);
    res.send({ url, key });
  });
};
