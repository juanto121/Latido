import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import './CountDown.css'

const CountDown = ({startSampling, onCountFinish}) => {

    const [count, setCount] = useState(20)
    const savedCallback = useRef()

    function callback() {
        setCount(count - 1)
    }

    useEffect(() => {
        savedCallback.current = callback
        if (count <= 0) onCountFinish()
    })

    useEffect(() => {
        let id = null

        function tick() {
            savedCallback.current()
        }

        if(startSampling) {
            id = setInterval(tick, 1000)
        }

        return () => clearInterval(id)
    }, [startSampling])


    if(!startSampling) return null

    return (
        <div className="countdown-container">
            {count}
        </div>
    )
}

CountDown.propTypes = {
    startSampling: PropTypes.bool,
    onCountFinish: PropTypes.func
}

export default CountDown