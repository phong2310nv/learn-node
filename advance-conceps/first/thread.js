// process.env.UV_THREADPOOL_SIZE = 12
const crypto = require("crypto");
const start = Date.now();

for (let i = 1; i <= 5; i++) {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log(`${i}: ${Date.now() - start}`);
  });
}
