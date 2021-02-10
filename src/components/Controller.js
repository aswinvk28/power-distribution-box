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
        this.cartesianWidth = null; this.cartesianHeight = null; this.templateWidth = null; this.templateHeight = null;
        this.changeGridSizes = this.changeGridSizes.bind(this);
        this.state = {
            value: 10
        };
        this.showPanel = this.showPanel.bind(this);
        this.hidePanel = this.hidePanel.bind(this);
    }

    changeToMonitoring() {
        this.setState({svg_monitoring: true, svg_power: false, viewBox: '0 0 ' + (this.cartesianWidth * Constants.SCALE.FRONT_SIDE).toString() + " " + 
        (this.cartesianHeight * Constants.SCALE.FRONT_SIDE).toString()})
        $(document.body).css('overflow', 'hidden');
        $(document.documentElement).css('overflow', 'hidden');
    }

    changeToPower() {
        this.setState({svg_monitoring: false, svg_power: true, viewBox: '0 0 ' + (this.templateWidth * Constants.SCALE.REAR_SIDE).toString() + " " + 
            (this.cartesianHeight * Constants.SCALE.REAR_SIDE).toString()})
        $(document.body).css('overflow', 'hidden');
        $(document.documentElement).css('overflow', 'hidden');
    }

    changeToDefault() {
        this.setState({svg_monitoring: false, svg_power: false, viewBox: ''})
        $(document.body).css('overflow', 'visible');
        $(document.documentElement).css('overflow', 'visible');
    }

    componentDidMount() {
        if(!this.cartesianWidth) {
            this.cartesianWidth = $('.cartesian').width()
        }
        if(!this.cartesianHeight) {
            this.cartesianHeight = $('.cartesian').height()
        }
        if(!this.templateWidth) {
            this.templateWidth = $('.templated').width()
        }
        if(!this.templateHeight) {
            this.templateHeight = $('.templated').height()
        }
    }

    // #cartesian_distribution_container.height()
    // #templated_distribution_container.height()

    changeGridSizes(event) {
        let value = (event.target.value - 50) + 100;
        $(document.getElementById("cartesian_distribution_container")).css('backgroundSize', value + '%');
        $(document.getElementById("templated_distribution_container")).css('backgroundSize', value + '%');
        localStorage.setItem("cartesian: grid", JSON.stringify({'size': value}));
        localStorage.setItem("templated: grid", JSON.stringify({'size': value}));
        this.setState({'value': event.target.value});
    }

    componentWillMount() {
        let cartesian_value = JSON.parse(localStorage.getItem("cartesian: grid"));
        if(cartesian_value && ('size' in cartesian_value)) {
            this.setState({value: cartesian_value['size'] - 100 + 50});
        }
    }

    showPanel() {
        $(document.getElementById("boxes_container_draggable"))
        .slideDown(200);
    }

    hidePanel() {
        $(document.getElementById("boxes_container_draggable"))
        .slideUp(200);
    }

    render() {
        let elem = null;
        let designer = null, 
        buttons = <div className="buttons">
            <div class="header-logo">
                <div className="header-title">
                    <h2 style={{color: '#b00110'}}>Customize your Distro</h2>
                </div>
                <div className="header-logo-image">
                    <div className="header-logo-image-container">
                        <img src="images/logo/power_distros_logo-01.png" width="40%" alt="Power Distros Logo" title="Power Distros Logo" />
                    </div>
                </div>
            </div>
            <button onClick={this.changeToMonitoring}>Monitoring</button>
            <button onClick={this.changeToPower}>Power</button><br/>
            <input type="range" name="zoom" id="zoom" min="0" max="100" step="1" value={this.state['value']} onChange={this.changeGridSizes} /><br/>
            <div className="header-tag-full" style={{padding: '10px 20px', width: '100%', backgroundColor: 'rgb(50, 55, 165)', color: 'white', fontSize: '24px'}} 
            onMouseOver={this.showPanel}
            onMouseOut={this.hidePanel}></div>
        </div>;
        if(this.state['svg_monitoring'] == true) {
            elem = <FrontSide viewBox={this.state['viewBox']} />;
        } else if(this.state['svg_power'] == true) {
            elem = <RearSide viewBox={this.state['viewBox']} />;
        } else {
            designer = <div className="bodyContainer">
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