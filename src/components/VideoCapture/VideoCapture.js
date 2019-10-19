import React, {useRef} from 'react'
import useCamera from './UseCamera'
import './VideoCapture.css'

const VideoCapture = () => {
    const videoElement = useRef()
    const cameraStream = useCamera()

    if (cameraStream) {
        videoElement.current.srcObject = cameraStream
        videoElement.current.play()
    }

    return (
        <div className="videoCaptureContainer">
            <video className="VideoCapture" ref={videoElement}></video>
        </div>
    )

}

export default VideoCapture
