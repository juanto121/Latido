var ServiceWorker = (function(){
	function ServiceWorker(){
		this.init();
	}

	var worker = ServiceWorker.prototype;

	worker.init  = function(){ };

	return ServiceWorker;
})();

window.onload = function(){
	var main = new Main();
	main.update();
	var sworker = new ServiceWorker();
};
