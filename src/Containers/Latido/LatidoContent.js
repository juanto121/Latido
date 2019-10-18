import React, {useState} from 'react'
import './LatidoContent.css'
import HeartRateMonitor from '../../components/HeartRateMonitor/HeartRateMonitor'
import Instructions from '../../components/Instructions/Instructions'
import VideoCapture from '../../components/VideoCapture/VideoCapture.js'


const LatidoContent = (props) => {

    const [showInstructions, setShowInstructions] = useState(true)
    const [cameraReady, setCameraReady] = useState(false)

    const onContinueInstructions = () => {
        setShowInstructions(false)
    }

    if (showInstructions) {
        return (
            <div className={"LatidoContent"}>
                <Instructions continueHandler={onContinueInstructions}/>
            </div>
        )
    }

    if (!cameraReady) {
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
                    <div onClick={() => {
                        setCameraReady(true)
                    }}>
                        ok
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
