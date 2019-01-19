const http = require('http');
const { parse } = require('querystring');

/*************************************************************
 
 You should implement your request handler function in this file.
 
 requestHandler is already getting passed to http.createServer()
 in basic-server.js, but it won't work as is.
 
You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log('request is: ', request);
  //const url = 'http://parse.atx.hackreactor.com/chatterbox/classes/messages'
  
  const options = {
    host: 'localhost',
    port: 3000,
    path: request.url
  };
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.

  
  var statusCode = 200; // maybe response.statusCode; //This is good now
  
  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;   LOOK HERERERERERER
  
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';   LOOK HERERERERERER
  
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  const { headers, method, url } = request;
  let body = [];
  const results = [];
  // if (request.url === '/') {
  //   response.end('Hello, World!');
  // } else {
  if (options.path !== '/classes/messages') {
    statusCode = 404;
  }
  if (request.method === 'GET') {
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = JSON.stringify(Buffer.concat(body));
      response.on('error', (err) => {
        console.error(err);
      });
      // response.statusCode = 200;
      // response.setHeader('Content-Type', 'application/json');
      response.writeHead(statusCode, {'Content-Type': 'application/json'});

      const responseBody = { headers, method, url, body, results};
      response.write(JSON.stringify(responseBody));
      response.end();
    });
  } else if (request.method === 'POST') {
    request.on('data', chunk => {
      body += chunk;
    });
    request.on('end', () => {
      console.log(parse(body));
      response.end(body);
    })
  }
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;