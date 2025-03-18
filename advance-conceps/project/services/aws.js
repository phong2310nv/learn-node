const {
  S3RequestPresigner,
  getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");
const { HttpRequest } = require("@smithy/protocol-http");
const { parseUrl } = require("@smithy/url-parser");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { Hash } = require("@smithy/hash-node");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const keys = require("../config/keys");

const credentials = {
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
};
console.log(credentials, "credentials");

const bucket = "advance-concept-blog";
const region = "ap-southeast-2";

async function getPresignedUrl(key, method, contentType) {
  const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
  const presigner = new S3RequestPresigner({
    credentials,
    region,
    sha256: Hash.bind(null, "sha256"),
  });
  const signedUrlObject = await presigner.presign(
    new HttpRequest({
      ...url,
      method: method,
      headers: { "Content-Type": contentType },
    })
  );
  return formatUrl(signedUrlObject);
}

async function getPresignedUrl2(key, method, contentType) {
  const client = new S3Client({ region, credentials });
  const command = new (method === "PUT" ? PutObjectCommand : GetObjectCommand)({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

module.exports = {
  getPresignedUrl: getPresignedUrl2,
};
