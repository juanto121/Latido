import React from 'react'
import PropTypes from 'prop-types'
import './BackgroundBlobs.css'
import BloodBlob from "./BloodBlob/BloodBlob";

const BackgroundBlobs = ({bpm}) => {

    if(!bpm)
        bpm = 40

    // 50bpm -> 50/60 bps -> x1000 in 1s
    const bpmToDelay = 1000*(bpm/60)

    return (
        <div className="BackgroundBlobs">
            <BloodBlob bpmDelay={bpmToDelay} size={100+100*Math.random()}/>

        </div>
    )
}

///<BloodBlob bpmDelay={bpmToDelay+1000*Math.random()} size={100+100*Math.random()}/>

BackgroundBlobs.propTypes = {
    bpm: PropTypes.number
}

export default BackgroundBlobs