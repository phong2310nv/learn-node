import { Buffer } from "safer-buffer";
import keys = require("../../config/keys");
import Keygrip = require("keygrip");

function generateSession(user: any) {
  const sessionObj = {
    passport: {
      user: user._id.toString(),
    },
  };
  const session = Buffer.from(JSON.stringify(sessionObj)).toString("base64");
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign("session=" + session);
  return { session, sig };
}
export default generateSession;
