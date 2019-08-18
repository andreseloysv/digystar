const http = require("http");
const fs = require("fs");
const parser = require('ua-parser-js');
const util = require('util');
const requestCountry = require('request-country');

const server = http.createServer((request, response) => {
  // console.log(util.inspect(request))
  // console.log(JSON.stringify(request.connection.remoteAddress));

  let userInformation = {};
  userInformation.country = requestCountry(request);
  userInformation.ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  userInformation.host = request.headers.host;
  const ua = parser(request.headers['user-agent']);
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
  userInformation.acceptLanguage = request.headers['accept-language'];

  console.log('userInformation',userInformation);

  const indexFileName = getIndexByCountry(userInformation.country);
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
});

function getIndexByCountry(country){
  if (country === 'DE' || country === 'AT') {
    return indexFileName = "indexGerman";
  }else if (country === 'MX' || country === 'ES' || country === 'CO' || country === 'VE' || country === 'CL' || country === 'AR' || country === 'PE'|| country === 'EC'|| country === 'BO' || country === 'PY' || country === 'GT' || country === 'PR'|| country === 'DO' || country === 'SV' || country === 'HN' || country === 'PA' || country === 'UY' || country === 'CR' || country === 'NI')
  {
    return indexFileName = "indexSpanish";
  }else 
  {
    return indexFileName = "index";
  }
}

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
