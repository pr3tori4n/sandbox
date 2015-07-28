domready(function() {
	console.log('hello world');
});
var sayHello = function(){ console.log('hello');};
domready(sayHello);
domready(function() {
	var main = Sizzle("#mainContent");
	console.log(main[0] === document.getElementById("mainContent"));
});