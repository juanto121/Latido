class SignalBuffer {
    constructor(bufferSize = 1024) {
        this.bufferSize = bufferSize
        this.buffer = new Array(bufferSize)
        this.dataTimes = new Array(bufferSize)
        this.dataValues = new Array(bufferSize)
        this.sampleCount = 0
        this.sum = 0
    }

    addSample(time, value) {
        if(value)
            this.sum = this.sum + value

        if (this.bufferFull()) {
            this.sum = this.sum - this.getFirst().value
            this.buffer.shift()
            this.dataTimes.shift()
            this.dataValues.shift()
        } else {
            ++this.sampleCount
        }

        this.buffer[this.sampleCount] = {time, value}
        this.dataTimes[this.sampleCount] = time
        this.dataValues[this.sampleCount] = value
    }

    bufferFull() {
        return this.buffer.length >= this.bufferSize
    }

    getTotalLength() {
        return this.buffer.length
    }

    getLast() {
        if(!this.buffer[this.sampleCount]) return {time: 1, value: 0}
        return this.buffer[this.sampleCount]
    }

    getFirst() {
        if(!this.buffer[this.sampleCount]) return {time: 1, value: 0}
        return this.buffer[0]
    }

    getAverage() {
        if(this.bufferFull()) {
            return this.sum/this.bufferSize
        } else {
            return this.getLast().value
        }
    }
}

export default SignalBuffer
