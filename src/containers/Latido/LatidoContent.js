import React, {useState, useRef} from 'react'
import HeartRateMonitor from '../../components/HeartRateMonitor/HeartRateMonitor'
import Instructions from '../../components/Instructions/Instructions'
import VideoCapture from '../../components/VideoCapture/VideoCapture.js'
import './LatidoContent.css'
import HeartMonitor from "../../monitor/HeartMonitor";
import ImageProcessor from "../../monitor/ImageProcessor";
import CountDown from "../../components/CountDown/CountDown";

const LatidoContent = (props) => {

    const [showInstructions, setShowInstructions] = useState(false)
    const [showCameraInstructions, setShowCameraInstructions] = useState(true)
    const [startSampling, setStartSampling] = useState(false)
    const bpm = useRef(0)

    const monitor = useRef(new HeartMonitor())

    const onContinueInstructions = () => {
        setShowInstructions(false)
    }

    const onNewFrameHandler = (frame) => {
        monitor.current.addSample(ImageProcessor.getSampleFromFrame(frame))
        const updatedBpm = monitor.current.getBpm()
        bpm.current = updatedBpm.bpm
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
                        <VideoCapture startSampling={startSampling} onNewFrame={onNewFrameHandler}/>
                        <CountDown startSampling={startSampling} onCountFinish={() => setShowCameraInstructions(false)}/>
                    </div>
                    <div className="guideLine left"></div>
                    <div className="guideLine right"></div>
                    <div className="guideLine guideLineHorizontal top"></div>
                    <div className="guideLine guideLineHorizontal bottom"></div>
                </div>
                <div className="camera-setup-instructions">
                    <h1>Make sure your forehead is centered</h1>

                    <div className="start-button" onClick={() => {
                        setStartSampling(true)
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
                <VideoCapture show={false} startSampling={startSampling} onNewFrame={onNewFrameHandler}/>
                <HeartRateMonitor bpmRef={bpm}/>
            </div>
        </div>
    )
}

export default LatidoContent
