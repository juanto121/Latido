import React, {useRef} from 'react'
import useCamera from './UseCamera'
import './VideoCapture.css'

const VideoCapture = () => {
    const videoElement = useRef()
    const cameraStream = useCamera()

    const videoStyle = {
        width: '300px',
        height: '300px'
    }

    if (cameraStream) {
        videoElement.current.srcObject = cameraStream
        videoElement.current.play()
    }

    return (
        <div style={videoStyle}>
            <svg width="300" height="300">
                <clipPath id="clip">
                    <circle cx="150" cy="150" r="150"/>
                </clipPath>
            </svg>
            <video className="VideoCapture" ref={videoElement} style={{...videoStyle, filter:"blur(3px)"}}></video>
        </div>
    )

}

export default VideoCapture
