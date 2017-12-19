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

var responseResults = {'results': []};

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
  
  // The outgoing status.
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  
  // var req = new stubs.request('/classes/messages', 'POST', stubMsg);
  // var res = new stubs.response();
  
  console.log(request.url);
  
  if (request.url.indexOf('/classes/messages') === -1) {
    statusCode = 404;
    var requestResponse = 'Hello World';
    console.log('404 error');
  } else {  

    // See the note below about CORS headers.

    // Tell the client we are sending them plain text.
    //
    var requestResponse = 'Hello World';
    
    if (request.method === 'GET') {
      requestResponse = JSON.stringify(responseResults);
      statusCode = 200;
    } else if (request.method === 'POST') {
      let body = [];
      var obj = {};
      var chunkIsString = false;
      
      request.on('data', (chunk) => {
        if (typeof chunk === 'string') {
          chunkIsString = true;
          body = JSON.parse(chunk);
          responseResults.results.push(body);
        }
      });
      
      if (!chunkIsString) {
        request.on('data', (chunk) => {
          
          console.log('chunk: ', chunk, 'type is: ', typeof(chunk));
          
          body.push(chunk);
        }).on('end', () => {
          body = Buffer.concat(body).toString();
          
          if (body[0] !== '{' && body[body.length - 1] !== '}') {
            body = body.split('&');
            body.forEach((prop) => {
              var tuple = prop.split('=');
              if (tuple.length === 2) {
                obj[tuple[0]] = tuple[1];
              }
            });
          } else {
            console.log('in else if');
            obj = body;
            obj = JSON.parse(obj);
          }  
        });  
        responseResults.results.push(obj);
        console.log('about to push', obj, 'type is: ', typeof(obj));
      // at this point, `body` has the entire request body stored in it as a string
      //after stringify {"username":"Jono","message":"Do my bidding!"}
      }
      statusCode = 201;
    }
    // statusCode = 201;
    headers['Content-Type'] = 'application/JSON';
  }
  
  
  // console.log('current database:', responseResults);
  // console.log('statusCode: ', statusCode);
  
  
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(requestResponse);
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

exports.requestHandler = requestHandler;
    // responseResults.results.push();
    // request.on('data', function(chunk) {
    //   // console.log('Received body data:');
    //   var messageString = chunk.toString();
    //   // username=aaron&text=hi&roomname=room
    //   var obj = {};
    //   messageString = messageString.split('&');
    //   messageString.forEach((prop) => {
    //     var tuple = prop.split('=');
    //     obj[tuple[0]] = tuple[1];
    //   });
    //   responseResults.results.push(obj);
    //   console.log(responseResults);
    // });
