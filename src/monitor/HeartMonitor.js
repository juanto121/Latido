class HeartMonitor {
    constructor() {
        this.bufferSize = 1024
        this.buffer = new Array(this.bufferSize)
        this.dataTimes = new Array(this.bufferSize)
        this.dataValues = new Array(this.bufferSize)
        this.sampleCount = 0
        this.fps = 60
    }

    bufferFull() {
        return this.buffer.length >= this.bufferSize
    }

    getFps() {
        const len = this.buffer.length
        const last = this.buffer[this.sampleCount].time
        const first = this.buffer[0].time
        const totalTime = (last-first)/1000
        const realFps = len/totalTime
        return parseInt(realFps)
    }

    addSample(sample) {
        if(this.bufferFull()){
            this.buffer.shift()
            this.dataTimes.shift()
        } else {
            ++this.sampleCount
        }
        this.buffer[this.sampleCount] = sample
        this.dataTimes[this.sampleCount] = sample.time
        this.dataValues[this.sampleCount] = sample.value

    }

    getFFT() {
        if(this.sampleCount > 10) {
            const len = this.bufferSize;
            const startTime = this.dataTimes[0];
            const endTime = this.dataTimes[this.sampleCount];
            const linearSpace = window.numeric.linspace(startTime, endTime, len);
            const interpolation = window.everpolate.linear(linearSpace, this.dataTimes, this.dataValues);
            const bfsize = linearSpace.length;
            const fft = new window.FFT(bfsize, this.getFps());
            console.log("FFT:",fft.sampleRate)
        }

    }
}

export default HeartMonitor