const http = require('http')
const url = require('url')

const SERVER_PORT = 8888

const routes = (q, r): void => {
  const query = url.parse(q.url, true)
  console.log(query)

  r.writeHead(200, {'Content-Type': 'application/json'})
  r.end('it good')
}

const server = http.createServer(routes)
server.listen(SERVER_PORT)
console.log('i\'m running now')
