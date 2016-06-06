/*! latido - v1.0.0 - 2016-06-06
* Copyright (c) 2016 ; Licensed  */
var Hrmonitor = (function(){
	function Hrmonitor(){
		this.initHrmonitor();
	}

	var hrmonitor = Hrmonitor.prototype;

	hrmonitor.initHrmonitor = function(){
		this.minBpm = 50;
		this.maxBpm = 200;
		this.fps = 60;
		this.windowDuration = 10;

		/*
			1024/60 = 17s -> 60/1024 = 0.05 resolution
			256/60 = 4.2s
		*/

		this.bufferSize = 512;
		this.buffer = [];
		this.dataTimes = [];
		this.dataValues = [];
	};


	hrmonitor.getFps = function(){
		var len = this.buffer.length;
		var last = this.buffer[len-1].time;
		var first = this.buffer[0].time;
		var totalTime = (last-first)/1000;
		var realFps = len / totalTime;

		return parseInt(realFps);
	};

	hrmonitor.bufferFull = function(){
		return this.buffer.length >= this.bufferSize;
	};

	hrmonitor.isReady = function(){
		return this.buffer.length >= 2;
	};

	hrmonitor.addSample = function(sample){
		if(this.bufferFull()){
			this.buffer.shift(); 
			this.dataTimes.shift();
			this.dataValues.shift();
		}

		this.buffer.push(sample);
		this.dataTimes.push(sample.time);
		this.dataValues.push(sample.value);

	};

	hrmonitor.getFFT = function(){
		var len = this.bufferSize;	

		var startTime = this.dataTimes[0];
		var endTime = this.dataTimes[this.dataTimes.length-1];

		var linearSpace = numeric.linspace(startTime, endTime, len);
		var interpolation = everpolate.linear(linearSpace, this.dataTimes, this.dataValues);

		var bfsize = linearSpace.length;

		var fft = new FFT(bfsize, this.getFps());
		fft.forward(interpolation);
		return fft.spectrum;
	};


	hrmonitor.binToBpm = function(bin){
		
		/*
			60s * bin.index  *    fps / 2    
			                   -------------
			                    fft.size / 2 
		*/

		return (60*bin*this.getFps())/this.bufferSize;
	};

	hrmonitor.bpmToBin = function(bpm){
		return (bpm*this.bufferSize)/(60*this.getFps());
	};

	hrmonitor.getBpm = function(){

		/*
			256 samples are passed to FFT
			Sample rate: each sample takes 1/fps seconds. 
				eg. 60 fps means each frame takes 0.016 s or 16ms
			Thus 256 samples take 256/fps seconds. eg. 256/60 = 4.26s
			Max frequency I can get is fps/2. 60Hz/2 = 30 Hz 
				which is > than normal freq of heartrate = [0.83hz,3Hz] = [50bpm,180bpm]
			Resolution of fft: The output of the fft gives 128 different frequencies
			for a max freq of 30Hz, the min resolution of each bin is 30/128 = 0.23
			
			This is not right, but why?
			zeroth bin : 	[0.0,  0.23]
			first bin : 	[0.24, 0.46]
							[0.46, 0.70]
							[0.71, 0.93]
							[0.94, 1.11] <- 0.94Hz = 0.94 * 60 = 56.4 bpm								
		*/
		
		var fft = this.getFFT();
		
		var binindex = 0;
		var len = fft.length;

		var bpms = fft;

		var minbinpossible = parseInt(this.bpmToBin(this.minBpm));
		var maxbinpossible = parseInt(this.bpmToBin(this.maxBpm));

		var maxbpm = 0;
		var maxbpmindex = 0;

		for(var i = minbinpossible; i < maxbinpossible; i++){
			if(fft[i] > maxbpm ){
				maxbpmindex = i;
				maxbpm = fft[i];
			}
		}

		return { bpm:this.binToBpm(maxbpmindex), freqs:fft};
	};

	return Hrmonitor;
})();

var Camera = (function(){
	function Camera(){
		this.initCamera();
	}

	var camera = Camera.prototype;

	camera.initCamera = function(){
		this.cameraReady = false;
		this.videoElement = document.querySelector('video');
		navigator.getMedia = 	(navigator.getUserMedia || 
								navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia ||
								navigator.msGetUserMedia );

		navigator.getMedia({video:true, audio:false}, this.onMediaStream.bind(this), this.errMediaStream.bind(this));
	};


	camera.onMediaStream = function(mediaStream){
		this.mediaStream = mediaStream;
		var currentCam = this;
		var video = this.videoElement;
		this.videoElement.src = window.URL.createObjectURL(mediaStream);
		this.videoElement.onloadedmetadata = function(e){
			//process video
			currentCam.cameraReady = true;
			video.play();
		};
	};

	camera.isReady = function(){
		return this.cameraReady;
	}

	camera.errMediaStream = function(err){
		console.log("Media stream error");
	};

	return Camera;
})();

var FaceDetector = (function(){
	function FaceDetector(){
		this.initFaceDetector();
	}

	var facedetector = FaceDetector.prototype;

	facedetector.initFaceDetector = function(){};

	facedetector.getFaces = function(videoElement){
		var detector = this;
		$(videoElement).faceDetection({
			complete:detector.faceDetected.bind(this)
		});
	};

	facedetector.faceDetected = function(faces){
		if(faces[0] !== undefined){
			this.listener(faces);
		}
	};

	facedetector.setListener = function(listener){
		this.listener = listener;
	};

	return FaceDetector;
})();

var FaceTracker = (function(){
	function FaceTracker(){
		this.initFaceTrack();
	}

	var facetrack = FaceTracker.prototype;

	facetrack.initFaceTrack = function(){
		this.fhx = 0.5;
		this.fhy = 0.13;
		this.fhw = 0.25;
		this.fhh = 0.15;
	};

	facetrack.update = function(face){
		this.face = face;
	};

	facetrack.getForehead = function(){
		var face = this.face[0];

		var x = face.x,
			y = face.y,
			w = face.width,
			h = face.height;

		x += w * this.fhx;
		y += h * this.fhy;
		w *= this.fhw;
		h *= this.fhh;

		x -= (w / 2.0);
		y -= (h / 2.0);

		var forehead = {x:x,y:y,w:w,h:h};

		return forehead;
	};

	return FaceTracker;
})();

var ImageProcessor = (function(){
	function ImageProcessor(){
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
	}

	var processor = ImageProcessor.prototype;

	processor.sampleFrame = function(frame, fh){
		// frame: video element with image
		// fh: forehead position 

		//returns average value on green channel in a frame.
		//void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

		var sx = fh.x,
			sy = fh.y,
			sw = fh.w,
			sh = fh.h,
			dx = 0,
			dy = 0,
			dw = fh.w,
			dh = fh.h;

		this.ctx.drawImage(frame, sx, sy, sw, sh, dx, dy, dw, dh);
		var img = this.ctx.getImageData(0,0,sw,sh);
		var len = img.data.length;
		
		var i = 1;
		var count = 0;
		var gAvg = 0;

		for(var i = 1; i < len; i += 4){
			gAvg += img.data[i];
			count ++;
		}
		

		gAvg = gAvg / count;

		return {time:Date.now(), value: gAvg};
	};

	return ImageProcessor;

})();


var Graph = (function(){
	function Graph(){
		this.init();
	}
	var graph = Graph.prototype;

	graph.init = function(){
		this.chart = new Rickshaw.Graph({
				element: document.getElementById("chart"),
				height: 500,
				renderer: 'line',
				series: new Rickshaw.Series.FixedDuration([{ name: 'one', color:'green' },{name:'two', color:'red'}], undefined, {
							timeInterval: 250,
							maxDataPoints: 100,
							timeBase: new Date().getTime() / 1000
						})
		});

		this.chart.render();
	};

	graph.updateRawSample = function(data){
		var avgGreen = {one:data};
		this.chart.series.addData(avgGreen);
	};

	graph.updateBpm = function(bpm){
		var bpmSeries = {two:bpm};
		this.chart.series.addData(bpmSeries);
	};

	graph.render = function(){
		this.chart.render();
	};

	return Graph;

})();

var Main = (function(){
	function Main(){
		this.init();
	}

	var main = Main.prototype;

	main.init = function(){
		this.current = Date.now();
		this.last = Date.now();

		this.seconds = document.getElementById('seconds');
		this.bpmElement = document.getElementById('bpm');
		this.videoElement = document.querySelector('video');

		this.camera = new Camera();
		this.hrmonitor = new Hrmonitor();
		this.faceDetector = new FaceDetector();
		this.faceTracker = new FaceTracker();
		this.imageproc = new ImageProcessor();

		this.faceDetector.setListener(this.faceDetected.bind(this));

		this.chart = new Graph();
	};

	main.updateUI = function(){
		this.seconds.textContent = (Date.now()-this.startTime)/1000;
		if(this.hrmonitor.buffer.length >= this.hrmonitor.bufferSize - 5){
			console.log(this.bpm.bpm);
			this.bpmElement.textContent = parseInt(this.bpm.bpm);
			//this.chart.updateBpm(this.bpm.bpm);
		}
		//this.chart.render();
	};

	main.update = function(){

		this.last = Date.now();
		var interval = this.last - this.current;
		
		if(this.camera.isReady()){
			if(this.hrmonitor.isReady() ){
				this.bpm = this.hrmonitor.getBpm();
				this.sampleFrame();
				this.updateUI();				
			}else{
				this.faceDetector.getFaces(this.camera.videoElement);
				this.current = this.last;
				this.startTime = Date.now();
			}
		}

		requestAnimationFrame(this.update.bind(this));
	};

	main.faceDetected = function(faces){
		this.faceTracker.update(faces);
		this.sampleFrame();
	};

	main.sampleFrame = function(){
		var sample = this.imageproc.sampleFrame(this.videoElement, this.faceTracker.getForehead());
		this.hrmonitor.addSample(sample);
		//this.chart.updateRawSample(sample.value);
		return sample;
	};

	return Main;
})();

/*
window.onload = function(){
	var main = new Main();
	main.update();
};
*/

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