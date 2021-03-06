const http = require('http');
const fs = require('fs');
const parser = require('ua-parser-js');
const util = require('util');
const { parse } = require('querystring');
const requestCountry = require('request-country');
const RequestModul = require('./modul/request.js');
const { MIMETYPE } = require('./globals/constanst.js');
const LanguageCode = require('./LanguageCode/languageCode.js');
const auth = require('http-auth');
const path = require('path');

var basic = auth.basic(
  {
    realm: 'Digystar PrivateArea.'
  },
  (username, password, callback) => {
    callback(
      username === 'weandresjesusluisare' && password === 'therealdigystar'
    );
  }
);

function urlNotFoundError(file, response, contentType, error) {
  if (error.code == 'ENOENT') {
    file.readFile('src/404.html', function(error, content) {
      response.writeHead(404, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    });
  } else {
    response.writeHead(500);
    response.end(
      'Sorry, check with the site admin for error: ' + error.code + ' ..\n'
    );
  }
}

const server = http.createServer(async (request, response) => {
  
  if(!request.headers.host.includes('localhost') && request.headers['x-forwarded-proto'] && request.headers['x-forwarded-proto']!='https'){
    response.writeHead(301,{Location: `https://${request.headers.host}${request.url}`});
    response.end();
    return;
  }

  const userInformation = getUserInformation(request);
  const url = request.url;

  const filePath = 'src/' + request.url;
  if (filePath == 'src/') {
    filePath = 'src/index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIMETYPE[extname] || 'application/octet-stream';

  const indexFileName = `index${LanguageCode.getLanguageByCountry(
    userInformation.country
  )}`;

  if (url === '/' && request.method === 'POST') {
    collectRequestData(request, result => {
      if (validateEmail(result['user-email'])) {
        RequestModul.saveUserEmail(result['user-email']);
      }
    });
    const thankyouFileName = `thankyou${LanguageCode.getLanguageByCountry(
      userInformation.country
    )}`;
    fs.readFile(`src/${thankyouFileName}.html`, function(error, thankyou) {
      if (error) {
        urlNotFoundError(fs, response, contentType, error);
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(thankyou);
      }
      response.end();
    });
    return; // not save the request
  } else if (url === '/favicon.ico' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': contentType });
    fs.readFile(`src/img/favicon.ico`, function(error, favicon) {
      if (error) {
        urlNotFoundError(fs, response, contentType, error);
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.write(favicon);
      }
      response.end();
    });
    return; // not save the request
  } else if (url === '/stadistics' && request.method === 'GET') {
    auth.connect(basic)(request, response, function() {
      fs.readFile(`src/stadistics.html`, function(error, index) {
        if (error) {
          urlNotFoundError(fs, response, contentType, error);
        } else {
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.write(index);
        }
        response.end();
      });
    });
    return; // not save the request
  } else if (url === '/stadistics' && request.method === 'POST') {
    auth.connect(basic)(request, response, async function() {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      const infoRequest = await RequestModul.getRequestInfo();
      const infoRegisteredUsers = await RequestModul.getRegisteredUsers();
      response.write(JSON.stringify({ request: infoRequest, registeredUsers: infoRegisteredUsers }));
      response.end();
    });
    return; // not save the request
    // Save the info
  } else if (url === '/' && request.method === 'GET') {
    fs.readFile(`src/${indexFileName}.html`, function(error, index) {
      if (error) {
        urlNotFoundError(fs, response, contentType, error);
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(index);
      }
      response.end();
    });
  } else if (url.includes(`/video/`) && request.method === 'GET') {
      const path = filePath
      const stat = fs.statSync(path)
      const fileSize = stat.size
      const range = request.headers.range
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }
        response.writeHead(206, head);
        file.pipe(response);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        response.writeHead(200, head)
        fs.createReadStream(path).pipe(response)
      }
    } else {
    fs.readFile(filePath, function(error, content) {
      console.log('filePath', filePath);
      if (error) {
        urlNotFoundError(fs, response, contentType, error);
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
    return; // not save the request
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

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function collectRequestData(request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (request.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}

function getUserInformation(request) {
  let userInformation = {};
  userInformation.ip =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  userInformation.country = requestCountry(request);
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
  return userInformation;
}

const port = process.env.PORT || 1337;
server.listen(port);

console.log('Server running at http://localhost:%d', port);
