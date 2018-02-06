const weather = require("./weather");

const zips = process.argv.slice(2);

zips.forEach(weather.get);