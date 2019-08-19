const http = require("http");
const fs = require("fs");
const parser = require("ua-parser-js");
const util = require("util");
const { parse } = require("querystring");
const requestCountry = require("request-country");
const RequestModul = require("./modul/request.js");
const LanguageCode = require("./LanguageCode/languageCode.js");
const auth = require("http-auth");
var basic = auth.basic(
  {
    realm: "Digystar PrivateArea."
  },
  (username, password, callback) => {
    callback(
      username === "weandresjesusluisare" && password === "therealdigystar"
    );
  }
);

const server = http.createServer(async (request, response) => {
  const userInformation = getUserInformation(request);
  const indexFileName = `index${LanguageCode.getLanguageByCountry(
    userInformation.country
  )}`;
  const url = request.url;

  if (url === "/" && request.method === "POST") {
    collectRequestData(request, result => {
      RequestModul.saveUserEmail(result["user-email"]);
    });
    const thankyouFileName = `thankyou${LanguageCode.getLanguageByCountry(
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
    auth.connect(basic)(request, response, function() {
      fs.readFile(`src/stadistics.html`, function(error, index) {
        if (error) {
          response.writeHead(404);
          response.write("Contents you are looking are Not Found");
        } else {
          response.writeHead(200, { "Content-Type": "text/html" });
          response.write(index);
        }
        response.end();
      });
    });
    return; // not save the request
  } else if (url === "/stadistics" && request.method === "POST") {
    response.writeHead(200, { "Content-Type": "application/json" });
    const info = await RequestModul.getRequestInfo();
    response.write(info);
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

  RequestModul.saveRequestInfo(
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

function getUserInformation(request) {
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
  return userInformation;
}

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
