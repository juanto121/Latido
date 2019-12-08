importScripts(
    "./vendor/js/bci.min.js",
    "./vendor/js/dsp.js",
    "./vendor/js/everpolate.js"
)

const bufferSize = 1024

const getFps = () => {
    return 60
}

const binToBpm = (bin) => {
    return (60 * bin * getFps()) / bufferSize
}

const bpmToBin = (bpm) => {
    return (bpm * bufferSize) / (60 * getFps())
}

const findMaxValue = (fft) => {
    const minbinpossible = parseInt(bpmToBin(50))
    const maxbinpossible = parseInt(bpmToBin(200))

    let maxbpm = 0
    let maxbpmindex = 0

    for (let i = minbinpossible; i < maxbinpossible; i++) {
        if (fft[i] > maxbpm) {
            maxbpmindex = i
            maxbpm = fft[i]
        }
    }

    const bpm = binToBpm(maxbpmindex)
    return bpm
}

self.addEventListener('message', (buffers) => {
    const red = buffers.data.rBuffer
    const green = buffers.data.gBuffer
    const blue = buffers.data.bBuffer

    console.log(red.dataValues)

    const redVal = [...red.dataValues]
    const greenVal = [...green.dataValues]
    const blueVal = [...blue.dataValues]

    const times = [...red.dataTimes]

    const signals = bci.fastICA([redVal, greenVal, blueVal], {maxIterations: 1000})

    const startTime = times[0]
    const endTime = times[times.length-1]
    const len = times.length

    const linearSpace = numeric.linspace(startTime, endTime, len)

    const aInterpolation = everpolate.linear(linearSpace, times, signals.source[0])
    const bInterpolation = everpolate.linear(linearSpace, times, signals.source[1])
    const cInterpolation = everpolate.linear(linearSpace, times, signals.source[2])

    const afft = new FFT(len, 60)
    afft.forward(aInterpolation)

    const bfft = new FFT(len, 60)
    bfft.forward(bInterpolation)

    const cfft = new FFT(len, 60)
    cfft.forward(cInterpolation)

    const abpm = findMaxValue(afft.spectrum)
    const bbpm = findMaxValue(bfft.spectrum)
    const cbpm = findMaxValue(cfft.spectrum)

    self.postMessage([abpm, bbpm, cbpm])
})

