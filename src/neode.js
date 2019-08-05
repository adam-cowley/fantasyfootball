const neode = require("neode");

module.exports = neode.fromEnv()
    .withDirectory(__dirname + "/models");

