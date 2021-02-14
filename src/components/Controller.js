import React, { useState, useCallback, useEffect } from 'react';
import Container from './Container';
import '../style/fontawesome.min.css';
import '../bootstrap-grid.min.css';
import { CustomDragLayer } from './CustomDragLayer';
import FrontSide from './FrontSide';
import RearSide from './RearSide';
import Singleton from './Singleton';
import $ from 'jquery';
import Constants from './Constants';

export default class Controller extends React.Component {
    
    colors = [
        {size: '24U', color: 'rgb(50, 55, 165)'},
        {size: '20U', color: 'rgb(150, 55, 105)'},
        {size: '16U', color: 'rgb(20, 155, 105)'},
        {size: '12U', color: 'rgb(50, 155, 165)'},
        {size: '8U', color: 'rgb(150, 55, 165)'},
    ];

    state = {
        svg_monitoring: false,
        svg_power: false,
        snapToGridAfterDrop: true,
        snapToGridWhileDragging: true,
        viewBox: '',
        value: 10,
        change: false,
        monitoring_show: 1,
        power_show: 1
    }
    
    constructor(props) {
        super(props)
        Singleton.__singletonRef = new Singleton();
        Singleton.__singletonRef.controller = this;
        this.changeToMonitoring = this.changeToMonitoring.bind(this);
        this.changeToPower = this.changeToPower.bind(this);
        this.changeToDefault = this.changeToDefault.bind(this);
        this.cartesianWidth = null; this.cartesianHeight = null; this.templateWidth = null; this.templateHeight = null;
        this.changeGridSizes = this.changeGridSizes.bind(this);
        this.showPanel = this.showPanel.bind(this);
        this.toggleSliging = this.toggleSliging.bind(this);
        this.changeUnitSize = this.changeUnitSize.bind(this);
        this.home = this.home.bind(this);
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
        if(localStorage.getItem("cartesian: size")) {
            $(document.getElementById("cartesian")).attr('data-size', localStorage.getItem("cartesian: size"));
            $(document.getElementById("templated")).attr('data-size', localStorage.getItem("templated: size"));
        }
    }

    // #cartesian_distribution_container.height()
    // #templated_distribution_container.height()

    changeGridSizes(event) {
        let value = (event.target.value - 50) + 100;
        $("#cartesian_distribution_container").css('backgroundSize', value + '%');
        $("#templated_distribution_container").css('backgroundSize', value + '%');
        $("#distros_designer").css('backgroundSize', (value * 0.45) + '%');
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
        $(event.target).toggleClass("fa-anchor").toggleClass("fa-bars");
        $('#distros_designer').toggleClass("col-lg-9 col-sm-9 col-md-9").toggleClass("col-lg-12 col-sm-12 col-md-12");
        event.preventDefault();
        return false;
    }

    toggleSliging() {
        this.sliding = !this.sliding;
        localStorage.setItem("designer: slider", this.sliding.toString());
        $('#boxes_container_draggable').css('width', '100%');       
    }

    changeUnitSize(event) {
        let select = event.target;
        $(document.getElementById("cartesian")).attr('data-size', $(select).val());
        $(document.getElementById("templated")).attr('data-size', $(select).val());
        localStorage.setItem("cartesian: size", $(select).val());
        localStorage.setItem("templated: size", $(select).val());
        let heights = new Map([
            ['24U', 1183],
            ['20U', 983],
            ['16U', 783],
            ['12U', 583],
            ['8U', 403],
        ]);
        heights = Object.fromEntries(heights);
        $("#templated, #cartesian").css('height', ($(document).width() * 0.40 / 681 * 1455).toString() + "px");
        $("#templated" + "_distribution_container").css('height', 
        (heights[$(select).val()] * $(document.getElementById("templated")).outerWidth() / 681).toString() + "px");
        $("#cartesian_distribution_container").css('height', 
        (heights[$(select).val()] * $(document.getElementById("cartesian")).outerWidth() / 681).toString() + "px"); // outerWidth
    }

    monitoringShow(event) {
        if(event.target.checked == false) {
            $('#cartesian').hide();
            document.getElementById("power_show").checked = true;
        } else {
            $('#cartesian').show();
        }
    }

    powerShow(event) {
        if(event.target.checked == false) {
            document.getElementById("monitoring_show").checked = true;
            $('#templated').hide();
        } else {
            $('#templated').show();
        }
    }

    home() {
        this.setState({
            svg_monitoring: false,
            svg_power: false
        })
    }

    render() {
        let elem = null;
        let designer = null, 
        buttons = <div className="buttons">
            <div className="header-logo row">
                <div className="col col-lg-4 col-md-4 col-sm-4">
                    <h2 className="header-tagline" style={{color: '#b00110'}}>Customize your Distro</h2>
                </div>
                <div className="col col-lg-4 col-md-4 col-sm-4" id="header_controls">
                    <select defaultValue={localStorage.getItem("cartesian: size")} name="unit_size" id="unit_size" style={{fontSize: '48px', color: 'rgb(50, 55, 165)'}} onChange={this.changeUnitSize}>
                        {this.colors.map(({ size, color }, index) => (
                            <option key={size} style={{fontSize: '48px', color: color}} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col col-lg-4 col-md-4 col-sm-4">
                    <div className="header-logo-image-container">
                        <img src="images/logo/power_distros_logo-01.png" width="180px" alt="Power Distros Logo" title="Power Distros Logo" />
                    </div>
                </div>
            </div>
            <div className="header-tag-full" style={{padding: '3px 20px', width: '100%', backgroundColor: '#4a0d12', color: 'white', fontSize: '24px', textAlign: 'left'}}>
                <nav className="menu-navigation col-lg-12 col-md-12 col-sm-12" style={{clear: 'both'}}>
                    <i className="fas fa-anchor" style={{color: 'red', cursor: 'alias'}} onClick={this.showPanel}></i>
                    <ul className="menu_navigation" id="menu_navigation">
                        <li className="menu-item" onClick={this.home}>HOME</li>
                        <li className="menu-item">NEW</li>
                        <li className="menu-item">OPEN</li>
                        <li className="menu-item">SAVE</li>
                        <li className="menu-item">PRINT</li>
                    </ul>
                    <div className="field-controls" style={{marginRight: '30px', float: 'right', display: 'inline-block'}}>
                        <input type="range" name="zoom" id="zoom" min="0" max="100" step="1" value={this.state['value']} onChange={this.changeGridSizes} />
                    </div>
                    <div className="clearfix" style={{clear: 'both'}}></div>
                </nav>
                <div className="row" id="header-separation">
                    <div className="col-lg-3 col-md-3 col-sm-3">
                        <label for="monitoring_show">
                            <input type="checkbox" name="monitoring_show" id="monitoring_show" value="1" onChange={this.monitoringShow} />
                            <span>Monitoring</span>
                        </label>
                        <label for="power_show">
                            <input type="checkbox" name="power_show" id="power_show" value="1" onChange={this.powerShow} />
                            <span>Power</span>
                        </label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9">
                        <h5 className="monitoring-header" onClick={this.changeToMonitoring} style={{margin: '10px 0px', cursor: 'pointer'}}>MONITORING</h5>
                        <h5 className="power-header" onClick={this.changeToPower} style={{margin: '10px 0px', cursor: 'pointer'}}>POWER</h5>
                    </div>
                </div>
            </div>
        </div>
        if(this.state['svg_monitoring'] == true) {
            elem = <FrontSide viewBox={this.state['viewBox']} />;
        } else if(this.state['svg_power'] == true) {
            elem = <RearSide viewBox={this.state['viewBox']} />;
        } else {
            designer = <div className="bodyContainer">
            <div className="AppInnerContainerHolder">
                <Container controller={this} ref={(ref) => {this.containerRef = ref}} snapToGrid={this.state['snapToGridAfterDrop']}/>
            </div></div>;
        }
        return (<div className="container-fluid">

            { buttons }
            
            { designer }

            { elem }

        </div>);
    }
}