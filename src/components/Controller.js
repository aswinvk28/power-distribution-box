import React, { useState, useCallback, useEffect } from 'react';
import { Container } from './Container';
import { CustomDragLayer } from './CustomDragLayer';
import FrontSide from './FrontSide';
import RearSide from './RearSide';
import Singleton from './Singleton';
import $ from 'jquery';
import Constants from './Constants';

export default class Controller extends React.Component {
    
    constructor(props) {
        super(props)
        Singleton.__singletonRef = new Singleton();
        Singleton.__singletonRef.controller = this;
        this.state = {
            svg_monitoring: false,
            svg_power: false,
            snapToGridAfterDrop: true,
            snapToGridWhileDragging: true,
            viewBox: ''
        };
        this.changeToMonitoring = this.changeToMonitoring.bind(this);
        this.changeToPower = this.changeToPower.bind(this);
        this.changeToDefault = this.changeToDefault.bind(this);
    }

    changeToMonitoring() {
        this.setState({svg_monitoring: true, svg_power: false, viewBox: '0 0 ' + ($('.cartesian').width() * Constants.SCALE.FRONT_SIDE).toString() + " " + 
        ($('.cartesian').height() * Constants.SCALE.FRONT_SIDE).toString()})
    }

    changeToPower() {
        this.setState({svg_monitoring: false, svg_power: true, viewBox: '0 0 ' + ($('.templated_inputs_row1').width() * Constants.SCALE.FRONT_SIDE).toString() + " " + 
            ($('.templated_inputs_row1').height() * Constants.SCALE.FRONT_SIDE).toString()})
    }

    changeToDefault() {
        this.setState({svg_monitoring: false, svg_power: false})
    }

    render() {
        let elem = null;
        let designer = null, 
        buttons = <div className="buttons">
            <button onClick={this.changeToMonitoring}>Monitoring</button>
            <button onClick={this.changeToPower}>Power</button>
        </div>;
        if(this.state['svg_monitoring'] == true) {
            elem = <FrontSide viewBox={this.state['viewBox']} />;
        } else if(this.state['svg_power'] == true) {
            elem = <RearSide viewBox={this.state['viewBox']} />;
        } else {
            designer = <div className="bodyContainer">
            <CustomDragLayer snapToGrid={this.state['snapToGridWhileDragging']}/>
            <div className="AppInnerContainerHolder">
                <Container snapToGrid={this.state['snapToGridAfterDrop']}/>
            </div></div>;
        }
        return (<div className="container">

            { buttons }
            
            { designer }

            { elem }

        </div>);
    }
}