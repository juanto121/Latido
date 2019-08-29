import React, {useState} from 'react'
import './LatidoContent.css'

const LatidoContent = (props) => {

  const [pageBeat, setPageBeat] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <div className={"LatidoContent"}>
      <div className={"measure-circle"}>
        <div className="measure-instructions"></div>

        <div className="measure-video"></div>

        <div className="measure-active">
          <div className="measure-circle-bpm">
            0<span className={"bpm-highlight"}>86</span>
          </div>
          <div className="measure-circle-subtitle">
            bpm
          </div>
        </div>

      </div>
    </div>
  )
}

export default LatidoContent
