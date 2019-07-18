var app = require('../../app.js')
function pageNotFound(req, res, next){
	res.status(404).send({title: "Sorry, page not found"});
}
function internalServerError(req, res, next){
	res.status(500).send({title: "Please check internet connection"});
}
function requestTimeOut(req, res, next){
	res.setTimeout(1000, function(){
        res.status(408).send("Request time out..");
    });
}
module.exports = {
	pageNotFound	 	: pageNotFound,
	internalServerError : internalServerError,
	requestTimeOut      : requestTimeOut  
}