import React, {useState} from 'react'
import './LatidoContent.css'
import HeartRateMonitor from '../../components/HeartRateMonitor/HeartRateMonitor'
import Instructions from '../../components/Instructions/Instructions'
import VideoCapture from '../../components/VideoCapture/VideoCapture.js'

const LatidoContent = (props) => {

    const [showInstructions, setShowInstructions] = useState(true)
    const [showCameraInstructions, setShowCameraInstructions] = useState(true)
    const [startSampling, setStartSampling] = useState(false)

    const onContinueInstructions = () => {
        setShowInstructions(false)
    }

    if (startSampling) {

    }

    if (showInstructions) {
        return (
            <div className={"LatidoContent"}>
                <Instructions continueHandler={onContinueInstructions}/>
            </div>
        )
    }

    if (showCameraInstructions) {
        return (
            <div className={"LatidoContent"}>
                <div className="latido-container">
                    <div className={"measure-circle"}>
                        <VideoCapture/>
                    </div>
                    <div className="guideLine left"></div>
                    <div className="guideLine right"></div>
                    <div className="guideLine guideLineHorizontal top"></div>
                    <div className="guideLine guideLineHorizontal bottom"></div>
                </div>
                <div className="camera-setup-instructions">
                    <h1>Make sure your forehead is centered</h1>

                    <div className="start-button" onClick={() => {
                        setShowCameraInstructions(false)
                    }}>
                        I'll stay still!
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={"LatidoContent"}>
            <div className={"measure-circle"}>
                <HeartRateMonitor/>
            </div>
        </div>
    )
}

export default LatidoContent
