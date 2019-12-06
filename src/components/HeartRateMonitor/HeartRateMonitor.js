import React, {useState} from 'react'
import './HearRateMonitor.css'
import useInterval from '../Utils/UseInterval'
import BackgroundBlobs from "../BackgroundBlobs/BackgroundBlobs";

const HeartRateMonitor = ({bpmRef}) => {

    const [bpm, setBpm] = useState(parseInt(bpmRef.current))

    useInterval(() => {
        setBpm(parseInt(bpmRef.current))
    }, 500)

    return(
        <div className="measure-active">
            <div className="measure-circle-bpm">
                <span className={"bpm-highlight bpm-value"}>{bpm}</span>
                <span>bpm</span>
            </div>
            <div className="measure-circle-subtitle">
                something
            </div>
        </div>
    )
}

export default HeartRateMonitor
