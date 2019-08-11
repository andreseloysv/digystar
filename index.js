const http = require("http");
fs = require("fs");

const server = http.createServer((request, response) => {
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
