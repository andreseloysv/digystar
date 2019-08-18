const http = require("http");
const fs = require("fs");
const parser = require("ua-parser-js");
const util = require("util");
const { parse } = require("querystring");
const requestCountry = require("request-country");
const databaseConnection = require("./globals/db.js");

async function querySaveUserEmail(client, email) {
  const query = `INSERT into "user".user 
  ("email") VALUES ('${email}');`;
  console.log("query insert user email", query);
  return await client.query(query);
}

async function saveUserEmail(email = "") {
  let client = databaseConnection.getDBClient();
  client.connect();
  await querySaveUserEmail(client, email);
  client.end();
}

async function querySaveRequestInfo(
  client,
  ip,
  country,
  host,
  userAgen,
  browserName,
  browserVersion,
  osName,
  osVersion,
  deviceVendor,
  deviceModel,
  deviceType,
  acceptLanguage
) {
  const query = `INSERT into "user".request 
  ("ip", "country", "host", "useragen",
  "browsername", "browserversion",
  "osname","osversion","devicevendor",
  "devicemodel","devicetype",
  "acceptlanguage") VALUES ('${ip}','${country}',
  '${host}','${userAgen}','${browserName}','${browserVersion}','${osName}',
  '${osVersion}','${deviceVendor}','${deviceModel}','${deviceType}','${acceptLanguage}');`;
  console.log("query insert request", query);
  return await client.query(query);
}

async function saveRequestInfo(
  ip = "",
  country = "",
  host = "",
  userAgen = "",
  browserName = "",
  browserVersion = "",
  osName = "",
  osVersion = "",
  deviceVendor = "",
  deviceModel = "",
  deviceType = "",
  acceptLanguage = ""
) {
  let client = databaseConnection.getDBClient();
  client.connect();
  await querySaveRequestInfo(
    client,
    ip,
    country,
    host,
    userAgen,
    browserName,
    browserVersion,
    osName,
    osVersion,
    deviceVendor,
    deviceModel,
    deviceType,
    acceptLanguage
  );
  client.end();
}

const server = http.createServer((request, response) => {
  let userInformation = {};
  userInformation.ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  userInformation.country = requestCountry(request);
  userInformation.host = request.headers.host;
  const ua = parser(request.headers["user-agent"]);
  userInformation.userAgen = ua.ua;
  userInformation.browserName = ua.browser.name;
  userInformation.browserVersion = ua.browser.version;
  userInformation.os = {};
  userInformation.os.name = ua.engine.name;
  userInformation.os.version = ua.engine.version;
  userInformation.device = {};
  userInformation.device.vendor = ua.device.vendor;
  userInformation.device.model = ua.device.model;
  userInformation.device.type = ua.device.type;
  userInformation.acceptLanguage = request.headers["accept-language"];

  const indexFileName = `index${getLanguageByCountry(userInformation.country)}`;

  const url = request.url;
  if (url === "/" && request.method === "POST") {
    collectRequestData(request, result => {
      saveUserEmail(result["user-email"]);
    });
    const thankyouFileName = `thankyou${getLanguageByCountry(
      userInformation.country
    )}`;
    fs.readFile(`src/${thankyouFileName}.html`, function(error, thankyou) {
      if (error) {
        response.writeHead(404);
        response.write("Contents you are looking are Not Found");
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(thankyou);
      }
      response.end();
    });
  } else if (url === "/favicon.ico" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("ok");
    response.end();
    return; // not save the request
  } else if (url === "/stadistics" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("ok");
    response.end();
    return; // not save the request
  } else {
    fs.readFile(`src/${indexFileName}.html`, function(error, index) {
      if (error) {
        response.writeHead(404);
        response.write("Contents you are looking are Not Found");
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(index);
      }
      response.end();
    });
  }

  saveRequestInfo(
    userInformation.ip,
    userInformation.country,
    userInformation.host,
    userInformation.userAgen,
    userInformation.browserName,
    userInformation.browserVersion,
    userInformation.os.name,
    userInformation.os.version,
    userInformation.device.vendor,
    userInformation.device.model,
    userInformation.device.type,
    userInformation.acceptLanguage
  );
});

function getLanguageByCountry(country) {
  if (country === "DE" || country === "AT") {
    return (indexFileName = "German");
  } else if (
    country === "MX" ||
    country === "ES" ||
    country === "CO" ||
    country === "VE" ||
    country === "CL" ||
    country === "AR" ||
    country === "PE" ||
    country === "EC" ||
    country === "BO" ||
    country === "PY" ||
    country === "GT" ||
    country === "PR" ||
    country === "DO" ||
    country === "SV" ||
    country === "HN" ||
    country === "PA" ||
    country === "UY" ||
    country === "CR" ||
    country === "NI"
  ) {
    return (indexFileName = "Spanish");
  } else {
    return (indexFileName = "");
  }
}

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", chunk => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
