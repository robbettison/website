// Server which delivers only static HTML pages (no content negotiation).
// Response codes: see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// When the global data has been initialised, start the server.
var HTTP = require('http');
var FS = require('fs');
var url = require('url');
var path = require('path');
var QS = require('querystring');
var sql = require('sqlite3');
var db = new sql.Database("site.db");


var OK = 200, NotFound = 404, BadType = 415;
start(4513);

const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
};

// Provide a service to localhost only.
function start(port) {
  var service = HTTP.createServer(handle);
  service.listen(port, 'localhost');
  console.log("Visit localhost:" + port);
}

// Deal with a request.
function handle(request, response) {
  //var db = new sql.Database("site.db");
  var Url = request.url;
  const parsedUrl = url.parse(request.url);
  let pathname = `${parsedUrl.pathname}`;
  var ext = path.parse(pathname).ext;
  pathname = "./public" + pathname;

  if (pathname.endsWith("/"))  {
    pathname = pathname + "index.html";
    ext = '.html';
  }

  FS.readFile(pathname, ready);
  function ready(err, data) {reply(response, ext, err, data)};

  if(request.method=='POST') {
    request.on('data', add);
    request.on('end', end);
    var body = "";
    function add(chunk) { body = body + chunk.toString(); }
    function end() {
    console.log("Body: ", body );
    var params = QS.parse(body);
    console.log(params);
    //console.log(params.name, params.user, params.password1, params.password2);
    if(params.password1==params.password2) {
      //how can we catch error where user already exists without server crashing?
      var ps = db.prepare("insert into users values (?,?,?)");
      ps.run(params.name, params.user, params.password1, function(err) {
        response.setHeader('Content-Type', 'text/plain');
        response.write("User-name already taken");
        response.end();
      });
      ps.finalize();
    }

  }
}





  //else if(url.contains('..')) return fail(response, BadType, "Not allowed!");
}

function reply(response, ext, err, data) {
  console.log(ext);
    if(err){
      response.statusCode = 500;
      response.end(`Error getting the file: ${err}.`);
    } else {
    // if the file is found, set Content-type and send data
    response.setHeader('Content-type', map[ext] || 'text/plain' );
    response.end(data);
  }
}

function signupReply(response) {
  var hdrs = { 'Content-Type': 'text/plain' };
  response.writeHead(200, hdrs);
  response.write("done");
  response.end();
}

// Send a failure message
function fail(response, code, message) {
  var hdrs = { 'Content-Type': 'text/plain' };
  response.writeHead(code, hdrs);
  response.write(message);
  response.end();
}
