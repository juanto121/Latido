var ServiceWorker = (function(){
	function ServiceWorker(){
		this.init();
	}

	var worker = ServiceWorker.prototype;

	worker.init  = function(){
		/*
		if('serviceWorker' in navigator){
			navigator.serviceWorker
					.register('/sw.js')
					.then(function(){
						console.log("Service Worker Registered");
					});
		}
		*/
	};

	return ServiceWorker;
})();

window.onload = function(){
	var main = new Main();
	main.update();
	var sworker = new ServiceWorker();
};