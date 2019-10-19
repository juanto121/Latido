import React, {useRef, useEffect} from 'react'
import useCamera from './UseCamera'
import './VideoCapture.css'

const VideoCapture = () => {
    const videoElement = useRef()
    const canvasElement = useRef()
    const cameraStream = useCamera()
    const anim = useRef()

    if (cameraStream) {
        videoElement.current.srcObject = cameraStream
        videoElement.current.play()
    }

    const renderCanvas = frame => {
        anim.current = requestAnimationFrame(renderCanvas)
        canvasElement.current.getContext('2d').drawImage(videoElement.current, 290, 140, 70, 35, 0, 0, 70, 38)
    }

    useEffect(() => {
        anim.current = requestAnimationFrame(renderCanvas)
        return () => cancelAnimationFrame(anim.current)
    }, [])

    return (
        <div className="videoCaptureContainer">
            <canvas ref={canvasElement} width="70" height="35"></canvas>
            <video className="VideoCapture" ref={videoElement}></video>
        </div>
    )

}

export default VideoCapture
