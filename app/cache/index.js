const redis = require('redis')
const appConfig = require("../config/app.config.js");

const client = redis.createClient({
    host: appConfig.REDIS_HOST,
    port: appConfig.REDIS_PORT
});

client.on("error", function (err) {
    console.log("Error " + err);
})

module.exports = client