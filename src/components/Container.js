import React, { useState, useCallback, useLayoutEffect } from 'react';
import { Distribution } from './Distribution';
import { Box } from './Box';
import { ItemTypes } from './ItemTypes';
import update from 'immutability-helper';
import Uniqid from './Uniqid';
import Constants from './Constants';
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import { DraggableBox } from './DraggableBox';
import { useDrop } from 'react-dnd';
import TableDist from './TableDist';
import $ from 'jquery';
import Singleton from './Singleton';
const useLocalStorage = Constants.useLocalStorage;

const buckets = {
    "cartesian": null, 
    "templated": null,
};

const plugsAndSockets = [ItemTypes.PLUGS_1, ItemTypes.PLUGS_2, ItemTypes.PLUGS_3, ItemTypes.PLUGS_4, ItemTypes.PLUGS_5, 
    ItemTypes.SOCKETS_1, ItemTypes.SOCKETS_2, ItemTypes.SOCKETS_3, ItemTypes.LIVE_PINS_INPUT, ItemTypes.LIVE_PINS_OUTPUT, 
    ItemTypes.PINS_INPUT_1, ItemTypes.PINS_INPUT_2];
    
    const allTypes = [ItemTypes.PLUGS_1, ItemTypes.PLUGS_2, ItemTypes.PLUGS_3, ItemTypes.PLUGS_4, ItemTypes.PLUGS_5, 
        ItemTypes.SOCKETS_1, ItemTypes.SOCKETS_2, ItemTypes.SOCKETS_3, ItemTypes.PILOT_LIGHTS, 
        ItemTypes.MULTIMETER, ItemTypes.LIVE_PINS_INPUT, ItemTypes.LIVE_PINS_OUTPUT, 
    ItemTypes.PINS_INPUT_1, ItemTypes.PINS_INPUT_2];

const style = {
    width: '100%',
    // marginRight: '0.5rem',
    marginBottom: '0.5rem',
    color: '#ababab',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
    height: '100%'
};

class Container extends React.Component {

    state = {
        distributions: [],
        boxes: [],
        droppedBoxNames: [],
        distributionSize: "24U",
        drawing_scale: Constants.drawingScale,
        breakers: []
    }

    slide = {
        inputs: true,
        outputs: false,
        through_outputs: false,
        addons: false,
        boxes: true
    }

    slide_keys = new Map([
        [Constants.ElementType.INPUTS, 'inputs'],
        [Constants.ElementType.OUTPUTS, 'outputs'],
        [Constants.ElementType.THROUGH_OUTPUTS, 'through_outputs'],
        [Constants.ElementType.ADDONS, 'addons'],
        [Constants.ElementType.BOXES, 'boxes'],
    ])
    
    constructor(props) {
        super(props)
        this.controller = this.props.controller;
        this.drag_drop = false;
        this.releaseElementState = true;
        Singleton.__singletonRef.controller.container = this;
        let cartesianDroppedItems = null, templatedDroppedItems = null;
        if(useLocalStorage) {
            cartesianDroppedItems = localStorage.getItem("cartesian" + ": items");
            templatedDroppedItems = localStorage.getItem("templated" + ": items");
            if(!cartesianDroppedItems) {
                cartesianDroppedItems = [];
            } else {
                cartesianDroppedItems = JSON.parse(cartesianDroppedItems);
            }
            if(!templatedDroppedItems) {
                templatedDroppedItems = [];
            } else {
                templatedDroppedItems = JSON.parse(templatedDroppedItems);
            }
        }
        this.handleDrop = this.handleDrop.bind(this);
        const breakers = [
            { name: 'RCD-Plugs--1', type: ItemTypes.BREAKERS, uniqid: null, distribution: 1, left: 0, top: 0, order: 0, 
            image: 'images/dist_box/breaker-output-plug-1.png', element_type: Constants.ElementType.INPUTS, breaker_type: Constants.ElementType.RCD,
            size: { width: '42px', height: '45px' }, distribution_name: "cartesian", description: '', breaker: {  }, bbox: [0,0,0,0] },
            { name: 'MCB-Plugs--1', type: ItemTypes.BREAKERS, uniqid: null, distribution: 1, left: 0, top: 0, order: 1, 
            image: 'images/dist_box/breaker-output-plug-1-mcb.png', element_type: Constants.ElementType.INPUTS, breaker_type: Constants.ElementType.MCB,
            size: { width: '42px', height: '45px' }, distribution_name: "cartesian", description: '', breaker: {  }, bbox: [0,0,0,0] },
            { name: 'RCD-Sockets--1', type: ItemTypes.BREAKERS, uniqid: null, distribution: 1, left: 0, top: 0, order: 2, 
            image: 'images/dist_box/breaker-output-socket-1.png', element_type: Constants.ElementType.INPUTS, breaker_type: Constants.ElementType.RCD,
            size: { width: '42px', height: '45px' }, distribution_name: "cartesian", description: '', breaker: {  }, bbox: [0,0,0,0] },
            { name: 'MCB-Sockets--1', type: ItemTypes.BREAKERS, uniqid: null, distribution: 1, left: 0, top: 0, order: 3, 
            image: 'images/dist_box/breaker-output-socket-1-mcb.png', element_type: Constants.ElementType.INPUTS, breaker_type: Constants.ElementType.MCB,
            size: { width: '42px', height: '45px' }, distribution_name: "cartesian", description: '', breaker: {  }, bbox: [0,0,0,0] },
            { name: 'RCD-Sockets--2', type: ItemTypes.BREAKERS, uniqid: null, distribution: 1, left: 0, top: 0, order: 4, 
            image: 'images/dist_box/breaker-output-socket-2.png', element_type: Constants.ElementType.INPUTS, breaker_type: Constants.ElementType.RCD,
            size: { width: '42px', height: '45px' }, distribution_name: "cartesian", description: '', breaker: {  }, bbox: [0,0,0,0] },
            { name: 'MCB-Sockets--2', type: ItemTypes.BREAKERS, uniqid: null, distribution: 1, left: 0, top: 0, order: 5, 
            image: 'images/dist_box/breaker-output-socket-2-mcb.png', element_type: Constants.ElementType.INPUTS, breaker_type: Constants.ElementType.MCB,
            size: { width: '42px', height: '45px' }, distribution_name: "cartesian", description: '', breaker: {  }, bbox: [0,0,0,0] },
        ];
        const boxes = [
            { name: 'Plugs--1', type: ItemTypes.PLUGS_1, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 0, image: 'images/dist_box/Output-Plug-1.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '50px', height: '45px'}, distribution_name: "templated", description: '63A CEE 400V 5P', 
            breaker: { default: { index: 0, image: 'images/dist_box/breaker-output-plug-1.png' }, mcb: {index: 1, image: 'images/dist_box/breaker-output-plug-1-mcb.png'} },
            bbox: [0,0,0,0] },
            { name: 'Plugs--2', type: ItemTypes.PLUGS_2, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 0, image: 'images/dist_box/Output-Plug-2.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '29px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Plugs--3', type: ItemTypes.PLUGS_3, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 0, image: 'images/dist_box/Output-Plug-3.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '29px', height: '45px'}, distribution_name: "templated", description: '63A 400V CEE 5P', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Plugs--4', type: ItemTypes.PLUGS_4, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 0, image: 'images/dist_box/Output-Plug-4.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '29px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Plugs--5', type: ItemTypes.PLUGS_5, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 0, image: 'images/dist_box/Output-Plug-5.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '29px', height: '45px'}, distribution_name: "templated", description: '63A 400V CEE 5P', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Sockets--1', type: ItemTypes.SOCKETS_1, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 1, image: 'images/dist_box/Output-Socket-1.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '50px', height: '45px'}, distribution_name: "templated", description: '125A CEE 400V 5P', 
            breaker: { default: { index: 1, image: 'images/dist_box/breaker-output-socket-1.png' }, mcb: {index: 1, image: 'images/dist_box/breaker-output-socket-1-mcb.png'} },
            bbox: [0,0,0,0] },
            { name: 'Sockets--2', type: ItemTypes.SOCKETS_2, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 1, image: 'images/dist_box/Output-Socket-2.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '24px', height: '45px'}, distribution_name: "templated", description: '19pin Connector Socket', 
            breaker: { default: { index: 2, image: 'images/dist_box/breaker-output-socket-2.png' }, mcb: {index: 1, image: 'images/dist_box/breaker-output-socket-2-mcb.png'} },
            bbox: [0,0,0,0] },
            { name: 'Sockets--3', type: ItemTypes.SOCKETS_3, uniqid: null, 
            distribution: null, left: '0px', top: '0px',   index: 1, image: 'images/dist_box/Output-Socket-3.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '28px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Pilot-Lights', type: ItemTypes.PILOT_LIGHTS, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 2, image: 'images/dist_box/pilot-lights.gif', element_type: Constants.ElementType.ADDONS, 
            size: {width: '20px', height: '45px'}, distribution_name: "cartesian", description: 'PILOT LIGHTS', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Multimeter', type: ItemTypes.MULTIMETER, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 3, image: 'images/dist_box/multimeter.png', element_type: Constants.ElementType.THROUGH_OUTPUTS, 
            size: {width: '42px', height: '45px'}, distribution_name: "cartesian", description: 'MULTIMETER', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Live-Pins-Input', type: ItemTypes.LIVE_PINS_INPUT, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 4, image: 'images/dist_box/Live-Pins-Inputs.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: Constants.SIZES[ItemTypes.LIVE_PINS_INPUT][0] + 'px', height: '47px'}, distribution_name: "templated", description: <b>400A Power Lock Set <br/> (with 250A Protection)</b>, breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Loop-Through', type: ItemTypes.LIVE_PINS_OUTPUT, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 5, image: 'images/dist_box/Live-Pins-Outputs.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: Constants.SIZES[ItemTypes.LIVE_PINS_OUTPUT][0] + 'px', height: '47px'}, distribution_name: "templated", description: '400A Power Lock Set', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Pins-Input--2', type: ItemTypes.PINS_INPUT_2, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 5, image: 'images/dist_box/Inputs-Pin-2.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: '42px', height: '45px'}, distribution_name: "templated", description: '63A CEE 400V 5P', breaker: {  },
            bbox: [0,0,0,0] },
            { name: 'Pins-Input--1', type: ItemTypes.PINS_INPUT_1, uniqid: null, 
            distribution: null, left: '0px', top: '0px',  index: 4, image: 'images/dist_box/Inputs-Pin-1.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: '50px', height: '45px'}, distribution_name: "templated", description: '125A CEE 400V 5P', breaker: {  },
            bbox: [0,0,0,0] },
        ];
        const distributions = [
            { accepts: plugsAndSockets, lastDroppedItem: null, 
                totalDroppedItems: templatedDroppedItems, e_name: "templated" },
            { accepts: [ItemTypes.PILOT_LIGHTS, ItemTypes.MULTIMETER], lastDroppedItem: null, 
                totalDroppedItems: cartesianDroppedItems, e_name: "cartesian" },
        ];
        this.setDistributionSize = this.setDistributionSize.bind(this);
        this.setDistributions = this.setDistributions.bind(this);
        this.setDroppedBoxNames = this.setDroppedBoxNames.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.state['boxes'] = boxes;
        this.state['distributions'] = distributions;
        this.state['breakers'] = breakers;
        this.setTotalDroppedItems = this.setTotalDroppedItems.bind(this);
        this.getTotalDroppedItems = this.getTotalDroppedItems.bind(this);
        this.saveTotalDroppedItems = this.saveTotalDroppedItems.bind(this);
        this.slideDown = this.slideDown.bind(this);
    }

    setDragDrop(value) {
        this.drag_drop = value;
    }

    setDistributions(distributions) {
        this.setState({distributions: distributions});
    }

    setDroppedBoxNames(droppedBoxNames) {
        this.setState({droppedBoxNames: droppedBoxNames});
    }

    getTotalDroppedItems(index) {
        return this.state['distributions'][index].totalDroppedItems;
    }

    setTotalDroppedItems(items, index, e_name) {
        let dist = update(this.state['distributions'], {
            [index]: {
                totalDroppedItems: {
                    $set: items
                }
            },
        });
        this.saveTotalDroppedItems(items, e_name, index);
        return dist;
    }

    saveTotalDroppedItems(items, e_name, index) {
        if(items) {
            localStorage.setItem(e_name + ": items", JSON.stringify(this.state['distributions'][index].totalDroppedItems));
        }
    }

    handleDrop(index, item) {
        const { name } = item;
        item.uniqid = Uniqid(item.name);
        item.distribution = index;
        if('default' in item.breaker) {
            // cartesian
            let breaker_item = Object.assign({}, this.state['breakers'][item.breaker.default.index]);
            breaker_item.uniqid = Uniqid(breaker_item.name);
            breaker_item.left = item.left;
            breaker_item.top = item.top;
            breaker_item.width = breaker_item.size.width;
            breaker_item.height = breaker_item.size.height;

            this.setDistributions(update(this.state['distributions'], {
                [1]: {
                    lastDroppedItem: {
                        $set: breaker_item,
                    },
                    totalDroppedItems: {
                        $push: [breaker_item]
                    }
                },
            }));
            item.breaker_item = breaker_item;
            // save to totalDroppedItems
            this.saveTotalDroppedItems(
                this.state['distributions'][1].totalDroppedItems, 
                breaker_item.distribution_name,
                breaker_item.distribution
            );
        } else {
            item.breaker_item = null;
        }
        this.setDroppedBoxNames(update(this.state['droppedBoxNames'], name ? { $push: [name] } : { $push: [] }));
        this.setDistributions(update(this.state['distributions'], {
            [index]: {
                lastDroppedItem: {
                    $set: item,
                },
                totalDroppedItems: {
                    $push: [item]
                }
            },
        }));
        // save to totalDroppedItems
        this.saveTotalDroppedItems(
            this.state['distributions'][item.distribution].totalDroppedItems, 
            item.distribution_name,
            item.distribution
        );
    }

    setDistributionSize(distributionSize) {
        this.setState({distributionSize: distributionSize});
    }
    
    componentWillMount() {
        const size = localStorage.getItem("cartesian: size");
        if (size) {
            this.setDistributionSize(size);
            $("#cartesian").attr('data-size',this.state['distributionSize']);
            $("#templated").attr('data-size', this.state['distributionSize']);
            $('#unit_size').val(this.state['distributionSize']);
        }
    }

    slideDown(event) {
        let id = $(event.target).attr('data-element');
        let slide_keys = Object.fromEntries(this.slide_keys);
        let text = $(event.target).text();
        if(this.slide[text.toLowerCase()]) {
            $('#'+id).slideUp(300);
            this.slide[text.toLowerCase()] = false;
        } else {
            $('#'+id).slideDown(300);
            this.slide[text.toLowerCase()] = true;
        }
    }

    render() {

        // load from localStorage the distributions

        const instance = this;
        
        function isDropped(boxName) {
            return instance.state['droppedBoxNames'].indexOf(boxName) > -1;
        }

        // render the draggable box
        function renderBox(item, index, style, className) {
            return (<div className={"draggable-box-container" + className} key={index} style={style}>
                <DraggableBox key={index} id={index}
                name={item.name} type={item.type} 
                uniqid={item.uniqid}
                distribution={item.distribution}
                image={item.image}
                width={item.size.width}
                height={item.size.height}
                isDropped={isDropped(item.name)}
                description={item.description}
                distribution_name={item.distribution_name}
                box_item={item}
                {...item} />
            </div>)
        }

        let element_outputs = [], element_through_outputs = [], element_addons = [], element_live_inputs = [], element_pins_inputs = [];
        this.state['boxes'].map((item, index) => {
            switch(item.element_type) {
                case Constants.ElementType.INPUTS:
                    if(item.type == ItemTypes.LIVE_PINS_OUTPUT || item.type == ItemTypes.LIVE_PINS_INPUT) {
                        element_live_inputs.push([item, index]);
                    } else if(item.type == ItemTypes.PINS_INPUT_1 || item.type == ItemTypes.PINS_INPUT_2) {
                        element_pins_inputs.push([item, index]);
                    }
                    break;
                case Constants.ElementType.OUTPUTS:
                    element_outputs.push([item, index]);
                    break;
                case Constants.ElementType.THROUGH_OUTPUTS:
                    element_through_outputs.push([item, index]);
                    break;
                case Constants.ElementType.ADDONS:
                    element_addons.push([item, index]);
                    break;
                default:
                    break;
            }
        })

        let colors = [
            {size: '24U', color: 'rgb(50, 55, 165)'},
            {size: '20U', color: 'rgb(150, 55, 105)'},
            {size: '16U', color: 'rgb(20, 155, 105)'},
            {size: '12U', color: 'rgb(50, 155, 165)'},
            {size: '8U', color: 'rgb(150, 55, 165)'},
        ];

        let display_accordion_hide = {display: 'none'};
        let display_accordion_show = {display: 'block'};

        return (<div className="AppInnerContainer">

    <div className="row">
        <div className="col col-lg-3 col-md-3 col-sm-3" id="boxes_container_draggable_holder" key="col-left">

            <div className="boxes-container-draggable" id="boxes_container_draggable" key="1111" sliding-panel={this.controller.sliding ? 'on' : 'off'}>

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: '0px', position: 'relative'}} className="boxes-container" key="boxes-set">
                    <em key="em-boxes-set" className="accordion-title" onClick={this.slideDown} data-element="boxes-set">{Constants.ElementType.BOXES}</em>
                    <div className="clearfix" id="boxes-set" style={display_accordion_show}>
                        <select ref={(ref) => {this.selectRef = ref}} defaultValue={localStorage.getItem("cartesian: size")} name="unit_size" id="unit_size" style={{fontSize: '48px', color: 'rgb(50, 55, 165)'}} onChange={this.controller.changeUnitSize}>
                            {this.controller.colors.map(({ size, color }, index) => (
                                <option key={size} style={{fontSize: '48px', color: color}} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "0px",
                position: 'relative' }} className="boxes-container" key="inputs-set">
                    <em key="em-inputs-set" className="accordion-title" onClick={this.slideDown} data-element="inputs-set">{element_live_inputs.length > 0 ? element_live_inputs[0][0].element_type : ''}</em>
                    <div key="div-inputs-set" id="inputs-set" className="clearfix" style={display_accordion_show}>
                        <div key="elements-live-inputs" className="draggable-box-inputs">
                        {
                            element_live_inputs.map((element, index) => (
                                renderBox(element[0], element[1], {}, "")
                            ))
                        }
                        </div>
                        <div key="elements-pins-inputs" className="draggable-box-inputs" style={{display: 'flex'}}>
                        {
                            element_pins_inputs.map((element, index) => (
                                renderBox(element[0], element[1], {flex: 'wrap'}, "")
                            ))
                        }
                        </div>
                    </div>
                </div>

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "0px",
                position: 'relative' }} className="boxes-container" key="outputs-set">
                    <em key="em-outputs-set" className="accordion-title" onClick={this.slideDown} data-element="outputs-set">{element_outputs.length > 0 ? element_outputs[0][0].element_type : ''}</em>
                    <div key="div-outputs-set" className="draggable-box-inputs row" id="outputs-set" style={display_accordion_hide}>
                    {
                        element_outputs.map((element, index) => (
                            renderBox(element[0], element[1], {}, "col-lg-6 col-md-6 col-sm-6")
                        ))
                    }
                    </div>
                </div>

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "0px",
                position: 'relative' }} className="boxes-container" key="through-outputs-set">
                    <em key="em-through-outputs-set" className="accordion-title" onClick={this.slideDown} data-element="through-outputs-set">{element_through_outputs.length > 0 ? element_through_outputs[0][0].element_type : ''}</em>
                    <div key="div-through-outputs-set" className="draggable-box-inputs" id="through-outputs-set" style={display_accordion_hide}>
                    {
                        element_through_outputs.map((element, index) => (
                            renderBox(element[0], element[1], {}, "")
                        ))
                    }
                    </div>
                </div>

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "0px",
                position: 'relative' }} className="boxes-container" key="addons-set">
                    <em key="em-addons-set" className="accordion-title" onClick={this.slideDown} data-element="addons-set">{element_addons.length > 0 ? element_addons[0][0].element_type : ''}</em>
                    <div key="div-addons-set" className="draggable-box-inputs" id="addons-set" style={display_accordion_hide}>
                    {
                        element_addons.map((element, index) => (
                            renderBox(element[0], element[1], {}, "")
                        ))
                    }
                    </div>
                </div>
                
            </div>

        </div>

        <div key="col-right" className="col col-lg-9 col-md-9 col-sm-9" id="distros_designer" sliding-panel={this.controller.sliding ? 'on' : 'off'} style={{backgroundSize: (Singleton.__singletonRef.controller.state['value']-50+100)*0.35 + '%'}}>

            <div style={{ overflow: 'hidden', clear: 'both', height: '100%' }} key="0000">
                <div style={style} className="templated-distributions-container row">
                    {this.state['distributions'].map(({ accepts, lastDroppedItem, totalDroppedItems, e_name }, index) => (
                        <TableDist container={this} accept={accepts} 
                        lastDroppedItem={lastDroppedItem} totalDroppedItems={totalDroppedItems} e_name={e_name}
                        onDrop={(item) => this.handleDrop(index, item)} key={"TableDist-" + index}></TableDist>
                    ))}
                </div>
            </div>

        </div>
    </div>

        </div>);
    }
};


export default Container;