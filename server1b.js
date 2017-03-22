// Minimal server: log request details and request body.
var HTTP = require('http');
start(8070);

// Provide a service to localhost only.
function start(port) {
  var service = HTTP.createServer(handle);
  service.listen(port, 'localhost');
  console.log("Visit localhost:" + port);
}

// Deal with a request.
function handle(request, response) {
  console.log("Method:", request.method);
  console.log("URL:", request.url);
  console.log("Headers:", request.headers);
  request.on('data', add);
  request.on('end', end);
  var body = "";
  function add(chunk) { body = body + chunk.toString(); }
  //function end() { console.log("Body:", body); reply(response); }
  //alternative end function parses pet and car into paramaters and logs them to console
  function end() {
    var QS = require("querystring");
    var params = QS.parse(body);
    console.log(params.pet, params.car);
    reply(response);
  }
}

//if we don't want functions in functions
/*function handle(request, response) {
    var body = { text: "" };
    request.on('data', add.bind(null, body));
    request.on('end', end.bind(null, body));
}
function add(body, chunk) {
    body.text = body.text + chunk.toString();
}
function end(body) {
    console.log("Body:", body.text);
    // respond here
}*/

// Send a reply.
function reply(response) {
  var hdrs = { 'Content-Type': 'text/plain' };
  response.writeHead(200, hdrs);
  response.write("done");
  response.end();
}
