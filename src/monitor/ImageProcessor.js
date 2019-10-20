class ImageProcessor {
    static getSampleFromFrame(frame) {
        const len = frame.data.length
        let count = 0
        let greenAvg = 0
        for (let i = 1; i < len; i += 4) {
            greenAvg += frame.data[i]
            count++
        }
        return {time: Date.now(), value: greenAvg}
    }
}

export default ImageProcessor