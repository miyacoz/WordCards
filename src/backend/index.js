var http = require('http');
var url = require('url');
var SERVER_PORT = 8888;
var routes = function (q, r) {
    var query = url.parse(q.url, true);
    console.log(query);
    r.writeHead(200, { 'Content-Type': 'application/json' });
    r.end('it good');
};
var server = http.createServer(routes);
server.listen(SERVER_PORT);
console.log('i\'m running now');
