import React from 'react';
import PropTypes from 'prop-types';
import './Instructions.css'

const Instructions = props => {

    return (
        <div className="instructions-container">
            <div className="instructions-text">
                - enable camera
                - wait till face detects
                - stay still
            </div>
            <div className="start-button" onClick={props.continueHandler}>
                Got it!
            </div>
        </div>
    );
};

Instructions.propTypes = {
    continueHandler: PropTypes.func
};

export default Instructions;
