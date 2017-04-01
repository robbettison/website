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
//library to generate random keys 'generate key'
var rand = require('generate-key');

var OK = 200, NotFound = 404, BadType = 415;
start(4555);


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

const sessions = {

};

// Provide a service to localhost only.
function start(port) {
  var service = HTTP.createServer(handle);
  service.listen(port, 'localhost');
  console.log("Visit localhost:" + port);
}

// Deal with a request.
function handle(request, response) {
  //var db = new sql.Database("site.db
  console.log(request.headers);

  var Url = request.url;
  console.log(Url);
  const parsedUrl = url.parse(request.url);
  let pathname = `${parsedUrl.pathname}`;
  var ext = path.parse(pathname).ext;
  pathname = "./public" + pathname;


  //here should we put all vote pages within a folder?
  if(pathname.includes("vote")) {
    if(!parseCookies(request)) {
      response.setHeader('Content-Type', 'text/html');
      response.end("Please log in to access this page!");
      return;
    }
  }

if(!(request.method==='POST')) {
  request.on('data', more);
  request.on('end', over);
  var body = "";
  function more(chunk) { body = body + chunk.toString(); }
  function over() { console.log("Body: " + body) };
}

  if (pathname.endsWith("/"))  {
    pathname = pathname + "index.html";
    ext = '.html';
  }
  if (request.method==='GET') {
    FS.readFile(pathname, ready);
    function ready(err, data) {reply(response, ext, err, data)};
  }
  if(request.method==='POST') {
    request.on('data', add);
    var body = "";
    function add(chunk) { body = body + chunk.toString(); }

    if(request.url==='/existinguser') {
      request.on('end', signin);
      function signin() {
        var params = QS.parse(body);
        db.each("SELECT * FROM users WHERE user='"+params.user+"'", process);
        function process(err, row) {
          if (err) throw err;
          response.setHeader('Content-Type', 'text/html');
          if (params.password1==row.password) {
            createCookie(response, params.user);
            //response.end("<p>Logged in!</p>");
          }
          //add cookie session, and some way of telling user is logged in here.
          else response.end("<p>Username or password incorrect!</p>");
        }
      }
    }
    else if(request.url==='/newuser') {
      request.on('end', end);
      function end() {
        var params = QS.parse(body);
        response.setHeader('Content-Type', 'text/html');
        if(params.password1==params.password2) {
          //how can we catch error where user already exists without server crashing?
          var ps = db.prepare("insert into users values (?,?,?)");
          ps.run(params.name, params.user, params.password1, function(err) {
            response.end("<p>Username already taken!</p>");
          });
          ps.finalize();
        }
        else response.end("<p>Passwords don't match!</p>")
      }
    }
  }
  //else if(url.contains('..')) return fail(response, BadType, "Not allowed!");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function createCookie(response, user) {
  //cookie will just be refreshed for different user.
  //ensure cookies are removed from map when logging in to different account - however problem here as we don't want users on different browsers to be logged out when others log in
  //i think the solution is remove key from map
  var x = rand.generateKey(8); //generates 8 digit random key
  sessions[x]=[user];
  console.log(sessions);
  console.log("x ="+ x);
	response.writeHead(200, {
    'Set-Cookie' : 'session='+x,
    'Content-Type' : 'text/plain'
  });
  response.end("Logged in!\n");
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

// Send a failure message
function fail(response, code, message) {
  var hdrs = { 'Content-Type': 'text/plain' };
  response.writeHead(code, hdrs);
  response.write(message);
  response.end();
}

function parseCookies(request) {
  var Cookies = request.headers['cookie'];
  console.log(Cookies);
  var parsedCookie = Cookies.split("=");
  console.log(parsedCookie);
  if(parsedCookie[1] in sessions) return true;
  else return false;
}
