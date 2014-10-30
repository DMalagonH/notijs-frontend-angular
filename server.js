/**
* Module dependencies
*/
var express = require('express');

var app = express();
var port = Number(process.env.PORT || 2200);

// Static files server
app.use(express["static"](__dirname + '/public'));

// Iniciar servidor
app.listen(port, function(){
	console.log("Notijs listening in port", port);
});