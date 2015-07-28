
//CONSTANTS
var PLAIN_CONTENT_TYPE = {"Content-Type": "text/plain"};

//Server Variables
var http = require("http"),
	port = 8000,
	path = require("path"),
	url = require("url");
	fs = filesystem = require("fs");

var respondWithError = function(response, message, statusCode) {
	response.writeHeader(statusCode, PLAIN_CONTENT_TYPE)
	response.write(message + "\n");
	response.end();
};

http.createServer(function(request, response) {
	var my_path = url.parse(request.url).pathname,
		full_path = path.join(process.cwd(), my_path);


	console.log("I got kicked");

	fs.exists(full_path, function(exists) {
		if(!exists) {
			//if the url can't be found, respond with a 404.
			/*response.writeHeader(404, PLAIN_CONTENT_TYPE)
			response.write("404 Not Found\n");
			response.end();*/
			respondWithError(response, "404 Not Found", 404);
		} else {
			console.log(full_path);
			//attempt to parse the file.
			fs.readFile(full_path, "binary", function(err, file) {
				if(err) {
					/*response.writeHeader(500, PLAIN_CONTENT_TYPE)
					response.write(err + "\n");
					response.end();*/
					respondWithError(response, err, 500);
				} else {
					response.writeHeader(200);
					response.write(file, "binary");
					response.end();
				}
			})
		}
	});
}).listen(port);

console.log("Server running on " + port);