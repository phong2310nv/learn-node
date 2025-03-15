const AWS = require("aws-sdk");
const keys = require("../config/keys");
const { S3Client } = require("@aws-sdk/client-s3");
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { v1 } = require("uuid");
const { HttpRequest } = require("@smithy/protocol-http");
const { parseUrl } = require("@smithy/url-parser");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { Hash } = require("@smithy/hash-node");
const requireLogin = require("../middlewares/requireLogin");
const credentials = {
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
};
console.log(credentials, "credentials");

// const S3 = new AWS.S3({
//   accessKeyId: keys.accessKeyId,
//   secretAccessKey: keys.secretAccessKey,
//   region: "ap-southeast-2",
// });
// const s3client = new S3Client({
//   region: "ap-southeast-2",
//   credentials: {
//     accessKeyId: keys.accessKeyId,
//     secretAccessKey: keys.secretAccessKey,
//   },
// });
const bucket = "advance-concept-blog";
const region = "ap-southeast-2";
module.exports = (app) => {
  app.get("/api/upload", async (req, res) => {
    const key = `${"req.user.id"}/${v1()}.jpeg`;
    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
    console.log(url, "url");
    console.log(key, "key");

    const presigner = new S3RequestPresigner({
      credentials,
      region,
      sha256: Hash.bind(null, "sha256"),
    });
    const signedUrlObject = await presigner.presign(
      new HttpRequest({ ...url, method: "PUT" })
    );
    console.log(signedUrlObject, "signedUrlObject");
    res.send({ signedUrl: formatUrl(signedUrlObject), key });
  });
};
