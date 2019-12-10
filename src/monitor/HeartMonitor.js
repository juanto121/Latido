import SignalBuffer from './SignalBuffer'

class HeartMonitor {
    constructor() {
        this.bufferSize = 1024
        this.gBuffer = new SignalBuffer(this.bufferSize)
        this.rBuffer = new SignalBuffer(this.bufferSize)
        this.bBuffer = new SignalBuffer(this.bufferSize)
        this.sampleCount = 0
        this.minBpm = 50
        this.maxBpm = 200
        this.icaWorker = new Worker(process.env.PUBLIC_URL + "/ICA.js")
        this.icaWorker.addEventListener('message', this.onICASignal.bind(this))
        this.bpmBuffer = new SignalBuffer(500)
        this.icaResults = []
        this.nearest = [0,0,0]
    }

    getFps() {
        const len = this.gBuffer.getTotalLength()
        const last = this.gBuffer.getLast().time
        const first = this.gBuffer.getFirst().time
        const totalTime = (last - first) / 1000
        const realFps = len / totalTime
        return parseInt(realFps)
    }

    onICASignal(event) {
        this.icaResults.push(event.data)
        //console.log("Got signals:", event.data)
        const baseLine = this.bpmBuffer.getAverage()
        let min = Math.abs(event.data[0]-baseLine)
        let minIndex = 0
        for(let i = 1; i < event.data.length; i++) {
            const diff = Math.abs(event.data[i]-baseLine)
            if(diff < min){
                minIndex = i
            }
        }
        this.nearest[minIndex]++
    }

    addSample(sample) {
        this.gBuffer.addSample(sample.time, sample.green)
        this.rBuffer.addSample(sample.time, sample.red)
        this.bBuffer.addSample(sample.time, sample.blue)
        if (this.sampleCount < this.bufferSize) ++this.sampleCount
    }

    binToBpm(bin) {
        return (60 * bin * this.getFps()) / this.bufferSize
    }

    bpmToBin(bpm) {
        return (bpm * this.bufferSize) / (60 * this.getFps())
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
        if (this.sampleCount >= this.bufferSize) {

            this.runICA({rBuffer:this.rBuffer, gBuffer:this.gBuffer, bBuffer:this.bBuffer})

            const fft = this.getFFT()

            const minbinpossible = parseInt(this.bpmToBin(this.minBpm))
            const maxbinpossible = parseInt(this.bpmToBin(this.maxBpm))

            let maxbpm = 0
            let maxbpmindex = 0

            for (let i = minbinpossible; i < maxbinpossible; i++) {
                if (fft[i] > maxbpm) {
                    maxbpmindex = i
                    maxbpm = fft[i]
                }
            }


            const bpm = this.binToBpm(maxbpmindex)

            this.bpmBuffer.addSample(Date.now(), bpm)

            return {bpm: this.bpmBuffer.getAverage(), freq: fft}
        } else {
            return {bpm: 0}
        }
    }

    getFFT() {
        if (this.sampleCount === this.bufferSize) {
            const len = this.bufferSize
            const startTime = this.gBuffer.getFirst().time
            const endTime = this.gBuffer.getLast().time
            const linearSpace = window.numeric.linspace(startTime, endTime, len)
            const interpolation = window.everpolate.linear(linearSpace, this.gBuffer.dataTimes, this.gBuffer.dataValues)
            const bfsize = linearSpace.length
            const fft = new window.FFT(bfsize, this.getFps())
            fft.forward(interpolation)
            return fft.spectrum
        } else {
            return [0]
        }
    }


    runICA(signals) {
        try {
            this.icaWorker.postMessage(signals)
        } catch (err) {
            console.log("Error ICA:", err)
        }
    }
}

export default HeartMonitor
