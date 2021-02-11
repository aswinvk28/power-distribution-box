import React, { useState, useCallback, useEffect } from 'react';
import { Container } from './Container';
import '../style/fontawesome.min.css';
import '../bootstrap-grid.min.css';
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
        this.sliding = false;
        this.toggleSliging = this.toggleSliging.bind(this);
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

    showPanel(event) {
        this.toggleSliging();
        $('#boxes_container_draggable, #distros_designer').attr('sliding-panel', (this.sliding ? 'on' : 'off'));
        setTimeout(function() {

        }, 3000);
        $(event.target).toggleClass("fa-anchor").toggleClass("fa-bars");
        $('#distros_designer').toggleClass("col-lg-8 col-sm-8 col-md-8").toggleClass("col-lg-12 col-sm-12 col-md-12");
        event.preventDefault();
        return false;
    }

    toggleSliging() {
        this.sliding = !this.sliding;
    }

    render() {
        let elem = null;
        let designer = null, 
        buttons = <div className="buttons">
            <div class="header-logo">
                <div className="header-title">
                    <h2 className="header-tagline" style={{color: '#b00110'}}>Customize your Distro</h2>
                </div>
                <div className="header-logo-image">
                    <div className="header-logo-image-container">
                        <img src="images/logo/power_distros_logo-01.png" width="60%" alt="Power Distros Logo" title="Power Distros Logo" />
                    </div>
                </div>
            </div>
            <button onClick={this.changeToMonitoring}>Monitoring</button>
            <button onClick={this.changeToPower}>Power</button><br/>
            <input type="range" name="zoom" id="zoom" min="0" max="100" step="1" value={this.state['value']} onChange={this.changeGridSizes} /><br/>
            <div className="header-tag-full" style={{padding: '3px 20px', width: '100%', backgroundColor: '#4a0d12', color: 'white', fontSize: '24px', textAlign: 'left'}}>
                <i class="fas fa-anchor" style={{color: 'red', cursor: 'alias'}} onClick={this.showPanel}></i>
                <nav className="menu-navigation">
                    <ul className="menu_navigation" id="menu_navigation">
                        <li class="menu-item">NEW</li>
                        <li class="menu-item">OPEN</li>
                        <li class="menu-item">SAVE</li>
                        <li class="menu-item">PRINT</li>
                    </ul>
                </nav>
            </div>
        </div>;
        if(this.state['svg_monitoring'] == true) {
            elem = <FrontSide viewBox={this.state['viewBox']} />;
        } else if(this.state['svg_power'] == true) {
            elem = <RearSide viewBox={this.state['viewBox']} />;
        } else {
            designer = <div className="bodyContainer">
            <div className="AppInnerContainerHolder">
                <Container ref={ref => this.container = ref} snapToGrid={this.state['snapToGridAfterDrop']}/>
            </div></div>;
        }
        return (<div className="container-fluid">

            { buttons }
            
            { designer }

            { elem }

        </div>);
    }
}