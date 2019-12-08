import React, {useRef, useEffect} from 'react'
import useCamera from './UseCamera'
import './VideoCapture.css'

const VideoCapture = ({show = true, startSampling, onNewFrame, test=false}) => {
    const videoElement = useRef(null)
    const canvasElement = useRef(null)
    let cameraStream = useCamera()
    const anim = useRef()

    const canvasWidth = 70
    const canvasHeight = 38

    console.log(cameraStream, test)

    if (cameraStream) {

        if(!test) {
            videoElement.current.srcObject = cameraStream
        } else {
            videoElement.current.src = process.env.PUBLIC_URL + "/testvids/75.webm"
            videoElement.current.loop = true
        }
        videoElement.current.play()
    }

    const renderCanvas = () => {
        const context = canvasElement.current.getContext('2d')
        context.drawImage(videoElement.current, 290, 140, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
        onNewFrame(context.getImageData(0, 0, canvasWidth, canvasHeight))
        anim.current = requestAnimationFrame(renderCanvas)
    }

    useEffect(() => {
        console.log(startSampling)
        if(startSampling)
            anim.current = requestAnimationFrame(renderCanvas)
        return () => cancelAnimationFrame(anim.current)
    }, [startSampling])

    return (
        <div className='videoCaptureContainer' style={{display: show?'block':'none'}}>
            <canvas ref={canvasElement} width={canvasWidth} height={canvasHeight}></canvas>
            <video className='VideoCapture' ref={videoElement}></video>
        </div>
    )

}

export default VideoCapture
