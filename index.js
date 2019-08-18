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
  userInformation.userAgent = parser(request.headers['user-agent']);
  userInformation.acceptLanguage = request.headers['accept-language'];

  console.log('userInformation',userInformation);

  const indexFileName = getIndexByCountry();
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

function getIndexByCountry(){
      // request.coutry
  const country = true;
  if (country) {
    return indexFileName = "indexGerman";
  }else if (country)
  {
    return indexFileName = "indexSpanish";
  }else if (country)
  {
    return indexFileName = "index";
  }
}

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
