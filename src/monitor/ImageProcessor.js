class ImageProcessor {
    static getSampleFromFrame(frame) {
        const len = frame.data.length

        let greenAvg = 0
        let redAvg = 0
        let blueAvg = 0

        for (let i = 0; i < len; i += 4) {
            redAvg += frame.data[i]
            blueAvg += frame.data[i+2]
            greenAvg += frame.data[i+1]
        }

        greenAvg /= (len/4)
        redAvg /= (len/4)
        blueAvg /= (len/4)

        return {time: Date.now(), value: greenAvg, red: redAvg, green: greenAvg, blue: blueAvg}
    }
}

export default ImageProcessor
