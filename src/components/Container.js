import React, { useState, useCallback, useLayoutEffect } from 'react';
import { Distribution } from './Distribution';
import { DustBin } from './DustBin';
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
};

class Container extends React.Component {

    state = {
        distributions: [],
        boxes: [],
        droppedBoxNames: [],
        dustbins: [],
        distributionSize: [],
    }
    
    constructor(props) {
        super(props)
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
        this.handleDustBinDrop = this.handleDustBinDrop.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        const boxes = [
            { name: 'Plugs@1', type: ItemTypes.PLUGS_1, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 0, image: 'images/dist_box/Output-Plug-1.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '63A 400V CEE 5P' },
            { name: 'Plugs@2', type: ItemTypes.PLUGS_2, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 0, image: 'images/dist_box/Output-Plug-2.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P' },
            { name: 'Plugs@3', type: ItemTypes.PLUGS_3, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 0, image: 'images/dist_box/Output-Plug-3.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '63A 400V CEE 5P' },
            { name: 'Plugs@4', type: ItemTypes.PLUGS_4, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 0, image: 'images/dist_box/Output-Plug-4.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P' },
            { name: 'Plugs@5', type: ItemTypes.PLUGS_5, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 0, image: 'images/dist_box/Output-Plug-5.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '63A 400V CEE 5P' },
            { name: 'Sockets@1', type: ItemTypes.SOCKETS_1, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 1, image: 'images/dist_box/Output-Socket-1.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P' },
            { name: 'Sockets@2', type: ItemTypes.SOCKETS_2, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 1, image: 'images/dist_box/Output-Socket-2.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '63A 400V CEE 5P' },
            { name: 'Sockets@3', type: ItemTypes.SOCKETS_3, uniqid: null, 
            distribution: null, left: 0, top: 0,   index: 1, image: 'images/dist_box/Output-Socket-3.png', element_type: Constants.ElementType.OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P' },
            { name: 'Pilot-Lights', type: ItemTypes.PILOT_LIGHTS, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 2, image: 'images/dist_box/pilot-lights.gif', element_type: Constants.ElementType.ADDONS, 
            size: {width: '45px', height: '45px'}, distribution_name: "cartesian", description: 'PILOT LIGHTS' },
            { name: 'Multimeter', type: ItemTypes.MULTIMETER, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 3, image: 'images/dist_box/multimeter.png', element_type: Constants.ElementType.THROUGH_OUTPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "cartesian", description: 'MULTIMETER' },
            { name: 'Live-Pins-Input', type: ItemTypes.LIVE_PINS_INPUT, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 4, image: 'images/dist_box/Live-Pins-Inputs.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: Constants.SVG_ELEMENTS.FULL_WIDTH, height: '47px'}, distribution_name: "templated", description: <b>400A Power Lock Set <br/> (with 250A Protection)</b> },
            { name: 'Loop-Through', type: ItemTypes.LIVE_PINS_OUTPUT, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 5, image: 'images/dist_box/Live-Pins-Outputs.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: Constants.SVG_ELEMENTS.FULL_WIDTH, height: '47px'}, distribution_name: "templated", description: '400A Power Lock Set' },
            { name: 'Pins-Input@1', type: ItemTypes.PINS_INPUT_1, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 4, image: 'images/dist_box/Inputs-Pin-1.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '63A 400V CEE 5P' },
            { name: 'Pins-Input@2', type: ItemTypes.PINS_INPUT_2, uniqid: null, 
            distribution: null, left: 0, top: 0,  index: 5, image: 'images/dist_box/Inputs-Pin-2.png', element_type: Constants.ElementType.INPUTS, 
            size: {width: '45px', height: '45px'}, distribution_name: "templated", description: '125A 400V CEE 5P' },
        ];
        const dustbins = [
            { accepts: allTypes },
        ];
        const distributions = [
            { accepts: [ItemTypes.PILOT_LIGHTS, ItemTypes.MULTIMETER], lastDroppedItem: null, 
                totalDroppedItems: cartesianDroppedItems, e_name: "cartesian" },
            { accepts: plugsAndSockets, lastDroppedItem: null, 
                totalDroppedItems: templatedDroppedItems, e_name: "templated" },
        ];
        this.setDistributionSize = this.setDistributionSize.bind(this);
        this.setDistributions = this.setDistributions.bind(this);
        this.setDroppedBoxNames = this.setDroppedBoxNames.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDustBinDrop = this.handleDustBinDrop.bind(this);
        this.state['boxes'] = boxes;
        this.state['distributions'] = distributions;
        this.state['dustbins'] = dustbins;
        this.setTotalDroppedItems = this.setTotalDroppedItems.bind(this);
        this.getTotalDroppedItems = this.getTotalDroppedItems.bind(this);
        this.saveTotalDroppedItems = this.saveTotalDroppedItems.bind(this);
    }

    handleDustBinDrop(num, item) {
        const distribution = item.distribution;
        let droppedItems = this.state['distributions'][distribution].totalDroppedItems;
        
        // search by uniqid
        let newDroppedItems = [];
        for(var i = 0; i < droppedItems.length; i++) {
            if(item.uniqid === droppedItems[i].uniqid) {
                //found = i;
            } else {
                newDroppedItems.push(droppedItems[i]);
            }
        }

        this.setDistributions(update(this.state['distributions'], {
            [distribution]: {
                totalDroppedItems: {
                    $set: newDroppedItems
                }
            },
        }))
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
        update(this.state['distributions'], {
            [index]: {
                totalDroppedItems: {
                    $set: items
                }
            },
        });
        this.saveTotalDroppedItems(items, e_name, index);
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

    render() {

        // load from localStorage the distributions

        const instance = this;
        
        function isDropped(boxName) {
            return instance.state['droppedBoxNames'].indexOf(boxName) > -1;
        }

        // render the draggable box
        function renderBox(item, index) {
            return (<div className="draggable-box-container" key={index}>
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
                {...item} />
            </div>)
        }

        let element_outputs = [], element_through_outputs = [], element_addons = [], element_inputs = [];
        this.state['boxes'].map((item, index) => {
            switch(item.element_type) {
                case Constants.ElementType.INPUTS:
                    element_inputs.push([item, index]);
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

        return (<div className="AppInnerContainer">

    <div className="row">
        <div className="col col-lg-4 col-md-4 col-sm-4" id="boxes_container_draggable_holder">

            <div className="boxes-container-draggable" id="boxes_container_draggable" key="1111" sliding-panel="off">

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "15px",
                position: 'relative' }} className="boxes-container" key="3">
                    <em key="0">{element_inputs.length > 0 ? element_inputs[0][0].element_type : ''}</em>
                    <div key="1" className="draggable-box-inputs">
                    {
                        element_inputs.map((element, index) => (
                            renderBox(element[0], element[1])
                        ))
                    }
                    </div>
                </div>

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "15px",
                position: 'relative' }} className="boxes-container" key="1">
                    <em key="0">{element_outputs.length > 0 ? element_outputs[0][0].element_type : ''}</em>
                    <div key="1" className="draggable-box-inputs">
                    {
                        element_outputs.map((element, index) => (
                            renderBox(element[0], element[1])
                        ))
                    }
                    </div>
                </div>

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "15px",
                position: 'relative' }} className="boxes-container">
                    <em key="0">{element_through_outputs.length > 0 ? element_through_outputs[0][0].element_type : ''}</em>
                    <div key="1" className="draggable-box-inputs">
                    {
                        element_through_outputs.map((element, index) => (
                            renderBox(element[0], element[1])
                        ))
                    }
                    </div>
                </div>

                <div style={{ overflow: 'hidden', clear: 'both', marginTop: "15px",
                position: 'relative' }} className="boxes-container" key="2">
                    <em key="0">{element_addons.length > 0 ? element_addons[0][0].element_type : ''}</em>
                    <div key="1" className="draggable-box-inputs">
                    {
                        element_addons.map((element, index) => (
                            renderBox(element[0], element[1])
                        ))
                    }
                    </div>
                </div>
                
            </div>

        </div>

        <div className="col col-lg-8 col-md-8 col-sm-8" id="distros_designer" sliding-panel="off" style={{backgroundSize: (Singleton.__singletonRef.controller.state['value']-50+100)*0.45 + '%'}}>

            <div style={{ overflow: 'hidden', clear: 'both' }} key="0000">
                <div style={style} className="templated-distributions-container" key="1">
                    {this.state['distributions'].map(({ accepts, lastDroppedItem, totalDroppedItems, e_name }, index) => (
                        <TableDist container={this} accept={accepts} 
                        lastDroppedItem={lastDroppedItem} 
                        totalDroppedItems={totalDroppedItems} 
                        e_name={e_name}
                        onDrop={(item) => this.handleDrop(index, item)} key={index}></TableDist>
                    ))}
                </div>
            </div>

        </div>
    </div>

        {this.state['dustbins'].map(({accepts}, num) => (
            <DustBin key={num} accept={accepts} onDrop={(item) => this.handleDustBinDrop(num, item)}></DustBin>
        ))}
            
        </div>);
    }
};


export default Container;