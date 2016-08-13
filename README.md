# Latido
Measuring heartbeat based on video feed using browser javascript.

Libraries used:

- Jquery facedetection plugin [face Detection](https://github.com/jaysalvat/jquery.facedetection)
- Fast Fourier Transform [dsp.js](https://github.com/corbanbrook/dsp.js/)
- Numeric for linear interpolation: [numeric.js](http://www.numericjs.com/)
- Javascript time series graph [rickshaw.js](https://github.com/shutterstock/rickshaw)

Similar projects:

- Python base webcam pulse detector [github](https://github.com/thearn/webcam-pulse-detector)
- Web based video capturing and server based image processing 
 by camillieane [Pulse](https://github.com/camilleanne/pulse)
  
## Demo
Test it for yourself [demo page](https://latido.herokuapp.com)

Make sure to: Don't move and have good lighting.
Current setup uses a buffer of 1024 samples so it takes about 17 seconds to estimate the heart beat on a desktop/laptop taking video at 60 FPS

## Installation
> git clone https://github.com/juanto121/latido.git
> npm install
> node app.js

## TODO
Hartbeat graphics.
Improve accuracy.
