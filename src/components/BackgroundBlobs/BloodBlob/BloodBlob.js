import React, {useState} from 'react'
import PropTypes from 'prop-types'
import './BloodBlob.css'
import useInterval from "../../Utils/UseInterval";

const BloodBlob = ({size, bpmDelay}) => {
    const [y, setY] = useState(window.innerHeight*Math.random()+window.innerHeight/4)
    const [x, setX] = useState(-size+200)
    const pageBound = window.innerWidth+2000
    useInterval(() => {
        if(x > pageBound){
            setX(-size-100)
        } else {
            setX((x+200+400*Math.random()))
        }
    }, bpmDelay)

    const blobStyle = {
        "display": x > pageBound ? "none":"block",
        "backgroundColor":" #d4429e",
        "width":`${size}px`,
        "height":`${size}px`,
        "borderRadius":" 50%",
        "filter":" blur(80px)",
        "transform": `translate(${x}px, ${y}px)`,
        "willChange":" transform",
        "transition": `transform ${3000}ms ease`
    }

    return (
        <div className="BloodBlob" style={blobStyle}/>
    )
}

BloodBlob.propTypes = {
    size: PropTypes.number,
    bpmDelay: PropTypes.number
}

export default BloodBlob
