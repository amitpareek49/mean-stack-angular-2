const crypto = require("crypto").randomBytes(256).toString("hex");

module.exports = {
  uri:
    "mongodb+srv://amitnitt:Amit@533185@cluster0.yvqmd.mongodb.net/mymondodb?retryWrites=true&w=majority",
  secret: crypto,
  db: "mymondodb",
};
