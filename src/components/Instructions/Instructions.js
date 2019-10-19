import React from 'react';
import PropTypes from 'prop-types';
import './Instructions.css'

const Instructions = props => {

    return (
        <div className="instructions-container">
            <div className="instructions-text">
                <h1 className="title">Allow camera use</h1>
                <h2 className="subtitle">all data will stay in your computer</h2>
                <div>
                    <span className="camera">📷</span>
                </div>
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
