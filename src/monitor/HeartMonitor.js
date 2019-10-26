class HeartMonitor {
    constructor() {
        this.bufferSize = 1024
        this.buffer = new Array(this.bufferSize)
        this.dataTimes = new Array(this.bufferSize)
        this.dataValues = new Array(this.bufferSize)
        this.sampleCount = 0
        this.minBpm = 50
        this.maxBpm = 200
    }

    bufferFull() {
        return this.buffer.length >= this.bufferSize
    }

    getFps() {
        const len = this.buffer.length
        const last = this.buffer[this.sampleCount].time
        const first = this.buffer[0].time
        const totalTime = (last - first) / 1000
        const realFps = len / totalTime
        return parseInt(realFps)
    }

    addSample(sample) {
        if (this.bufferFull()) {
            this.buffer.shift()
            this.dataTimes.shift()
            this.dataValues.shift()
        } else {
            ++this.sampleCount
        }
        this.buffer[this.sampleCount] = sample
        this.dataTimes[this.sampleCount] = sample.time
        this.dataValues[this.sampleCount] = sample.value
    }

    binToBpm(bin) {
        return (60 * bin * this.getFps()) / this.bufferSize;
    }

    bpmToBin(bpm) {
        return (bpm * this.bufferSize) / (60 * this.getFps());
    }

    getBpm() {
        /*
            256 samples are passed to FFT
            Sample rate: each sample takes 1/fps seconds.
                eg. 60 fps means each frame takes 0.016 s or 16ms
            Thus 256 samples take 256/fps seconds. eg. 256/60 = 4.26s
            Max frequency I can get is fps/2. 60Hz/2 = 30 Hz
                which is > than normal freq of heartrate = [0.83hz,3Hz] = [50bpm,180bpm]
            Resolution of fft: The output of the fft gives 128 different frequencies
            for a max freq of 30Hz, the min resolution of each bin is 30/128 = 0.23
            This is wrong:
            zeroth bin : 	[0.0,  0.23]
            first bin : 	[0.24, 0.46]
                            [0.46, 0.70]
                            [0.71, 0.93]
                            [0.94, 1.11]
        */
        const fft = this.getFFT();

        const minbinpossible = parseInt(this.bpmToBin(this.minBpm));
        const maxbinpossible = parseInt(this.bpmToBin(this.maxBpm));

        let maxbpm = 0;
        let maxbpmindex = 0;

        for (let i = minbinpossible; i < maxbinpossible; i++) {
            if (fft[i] > maxbpm) {
                maxbpmindex = i;
                maxbpm = fft[i];
            }
        }


        return {bpm: this.binToBpm(maxbpmindex), freq: fft};
    }

    getFFT() {
        if (this.sampleCount > 10) {
            const len = this.bufferSize;
            const startTime = this.dataTimes[0];
            const endTime = this.dataTimes[this.sampleCount];
            const linearSpace = window.numeric.linspace(startTime, endTime, len);
            const interpolation = window.everpolate.linear(linearSpace, this.dataTimes, this.dataValues);
            const bfsize = linearSpace.length;
            const fft = new window.FFT(bfsize, this.getFps());
            fft.forward(interpolation);
            return fft.spectrum;
        }

    }
}

export default HeartMonitor