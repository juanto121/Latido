import React from 'react'
import './HearRateMonitor.css'

const HeartRateMonitor = (props) => {
    return(
        <div className="measure-active">
            <div className="measure-circle-bpm">
                0<span className={"bpm-highlight"}>86</span>
            </div>
            <div className="measure-circle-subtitle">
                bpm
            </div>
        </div>
    )
}

export default HeartRateMonitor
