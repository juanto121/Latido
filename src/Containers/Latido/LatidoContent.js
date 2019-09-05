import React, {useState} from 'react'
import './LatidoContent.css'
import HeartRateMonitor from '../../components/HeartRateMonitor/HeartRateMonitor'
import Instructions from '../../components/Instructions/Instructions'
import UseCamera from './UseCamera'

const LatidoContent = (props) => {

  const [pageBeat, setPageBeat] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(false)

  const onContinueInstructions = () => {
    setShowInstructions(false)
  }

  if(showInstructions) {
    return (
        <div className={"LatidoContent"}>
          <Instructions continueHandler={onContinueInstructions}/>
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
