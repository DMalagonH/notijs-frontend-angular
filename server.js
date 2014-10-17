/**
* Module dependencies
*/
var express = require('express');

var app = express();

// Static files server
app.use(express["static"](__dirname + '/public'));

// Iniciar servidor
app.listen(2200, function(){
	console.log("Notijs listening in port", 2200);
});