const http = require("http");
fs = require("fs");

const server = http.createServer((request, response) => {
  fs.readFile("src/index.html", function(error, index) {
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

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
